import { App } from './app.tsx'
import { lorem, loremRandomWord } from './lorem.ts'

const user = {
  nick: 'stagas'
}

const msgs = () => Array.from({ length: 128 }, () =>
  ({ time: '22:03', nick: loremRandomWord(), text: lorem(2 + Math.random() * 20 | 0) })
)

const sections = {
  hang: { msgs: msgs(), color: '#8d5', nots: Math.random() * 100 | 0 },
  show: { msgs: msgs(), color: '#f8f', nots: Math.random() * 100 | 0 },
  tell: { msgs: msgs(), color: '#0ff', nots: 0 },
  rant: { msgs: msgs(), color: '#ec5', nots: Math.random() * 100 | 0 },
  wtf: { msgs: msgs(), color: '#f50', nots: Math.random() * 100 | 0 },
}

const container = document.querySelector<HTMLDivElement>('#container')!
const el = App({ user, sections })
container.append(el)
