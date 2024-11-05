import os from 'https://deno.land/x/os_paths@v7.4.0/src/mod.deno.ts'
import { parseArgs } from 'jsr:@std/cli/parse-args'
import * as path from 'jsr:@std/path'
import { IS_DEV } from './constants.ts'
import { files } from './middleware.ts'
import type { Context } from './types.ts'
import * as esbuild from "https://deno.land/x/esbuild@v0.24.0/mod.js"


const home = os.home() ?? '~'

const args = parseArgs(Deno.args, {
  string: ['port'],
})

const options: Record<string, string> = IS_DEV
  ? {
    cert: Deno.readTextFileSync(path.join(home, '.ssl-certs', 'devito.test.pem')),
    key: Deno.readTextFileSync(path.join(home, '.ssl-certs', 'devito.test-key.pem')),
  }
  : {}

options.port = args.port ?? '8000'

const buildCache = new Map<string, Uint8Array>()

Deno.serve(options, async req => {
  const ctx: Context = {
    url: new URL(req.url),
  }

  const { url } = ctx

  if (url.pathname.match(/\.(ts|tsx)$/)) {
    const filePath = path.join('public', url.pathname)

    const cached = buildCache.get(filePath)
    if (cached) {
      return new Response(cached, {
        headers: {
          'content-type': 'application/javascript',
          'cache-control': IS_DEV ? 'no-cache' : 'public, max-age=31536000',
        },
      })
    }

    const result = await esbuild.build({
      entryPoints: [filePath],
      bundle: true,
      write: false,
      format: 'esm',
      target: 'es2020',
      sourcemap: IS_DEV ? 'inline' : false,
    })

    buildCache.set(filePath, result.outputFiles[0].contents)

    return new Response(result.outputFiles[0].contents, {
      headers: {
        'content-type': 'application/javascript',
        'cache-control': IS_DEV ? 'no-cache' : 'public, max-age=31536000',
      },
    })
  }

  switch (url.pathname) {
    case '/reload': {
      const body = new ReadableStream({
        start(controller) {
          const watcher = Deno.watchFs(['public/', 'api/']);

          (async () => {
            for await (const event of watcher) {
              if (event.kind === 'modify') {
                try {
                  controller.enqueue(new TextEncoder().encode('data: reload\n\n'))
                }
                catch {
                  //
                }
              }
            }
          })()
        },
        cancel() {
          // Stream was cancelled by the client
        }
      })

      return new Response(body, {
        headers: {
          'content-type': 'text/event-stream',
          'cache-control': 'no-cache',
          'connection': 'keep-alive',
        },
      })
    }

    case '/':
      ctx.url.pathname = 'index.html'
    /* fallthrough */
    default:
      return files('public/')(ctx)
  }
})
