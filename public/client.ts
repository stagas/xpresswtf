import { lorem, loremRandomWord } from './lorem.ts'

const user = {
  nick: 'stagas'
}

export function colorizeNick(nick: string = '') {
  const hash = [...nick].reduce((acc, char) => char.charCodeAt(0) + acc, 0)
  const hue = hash % 360
  return `hsl(${hue}, 60%, 55%)`
}

const nicks = ['stagas', 'ntoyp', 'Mystic', 'Yo Sta']
const msgs = Array.from({ length: 128 }, () =>
  ({ time: '22:03', nick: loremRandomWord(), text: lorem(2 + Math.random() * 20 | 0) })
)

document.body.innerHTML = /*html*/`

<div class="logo">xpress.wtf</div>

<div class="msgs">
  ${msgs.map(msg => /*html*/`
    <div class="msg">
      <div class="time">[${msg.time}]</div>
      <div class="nick" style="color:${colorizeNick(msg.nick)}">${msg.nick}</div>
      <div class="text">${msg.text}</div>
    </div>
  `).join('')}
</div>

<div class="input">
  <div class="nick" style="color:${colorizeNick(user.nick)}">${user.nick}</div>
  <input type="text" autocomplete="off" spellcheck="false" autocapitalize="off">
</div>

<div class="nav">
  <a href="#" style="color:#8d5">hang<span class="nots">395</span></a>
  <a href="#" class="active" style="color:#f8f">show<span class="nots">25</span></a>
  <a href="#" style="color:#0ff">tell<span class="nots zero">&nbsp;</span></a>
  <a href="#" style="color:#ec5">rant<span class="nots">5</span></a>
  <a href="#" style="color:#f50">wtf<span class="nots">15</span></a>
</div>
`
