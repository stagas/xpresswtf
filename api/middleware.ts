import * as media from 'jsr:@std/media-types'
import * as path from 'jsr:@std/path'
import { DEBUG } from './constants.ts'
import type { Context } from './types.ts'

export const files = (root: string) => async (ctx: Context) => {
  const { pathname } = ctx.url
  let file
  let filepath
  let error
  out:
  try {
    filepath = path.join(pathname, 'index.html')
    file = await Deno.open(`${root}${filepath}`, { read: true })
  }
  catch {
    try {
      filepath = pathname
      file = await Deno.open(`${root}${filepath}`, { read: true })
      break out
    }
    catch (e) {
      error = e
      if (e instanceof Deno.errors.NotFound) {
        try {
          filepath = '/index.html'
          file = await Deno.open(`${root}${filepath}`, { read: true })
          break out
        }
        catch (e) {
          error = e
        }
      }
      console.log('Error serving:', filepath, error)
    }
    return new Response(null, { status: 500 })
  }

  DEBUG && console.log('Serve:', filepath)

  return new Response(file.readable, {
    headers: {
      'content-type': media.typeByExtension(path.extname(filepath)) ?? 'text/plain'
    }
  })
}
