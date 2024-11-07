import { colorize } from './util.ts'

type Sections = Record<string, {
  msgs: { time: string, nick: string, text: string }[],
  color: string,
  nots: number
}>

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight)
}

function Nav({ sections, setSection }: { sections: Sections, setSection: (section: string) => void }) {
  return <div class="nav">
    {Object.entries(sections).map(([section, item]) =>
      <a href={"#" + section} onpointerdown={() => {
        setSection(section)
      }} style={`color:${item.color}`}>{section}<span class={'nots' + ' ' + (!item.nots ? 'zero' : '')}>{!item.nots ? ' ' : item.nots}</span></a>
    )}
  </div> as HTMLDivElement
}

export function App({ user, sections }: {
  user: { nick: string }
  sections: Sections
}) {
  let section = 'hang'

  const sectionMsgsEl = <div class="msgs" /> as HTMLDivElement

  function setSection(section: string) {
    document.body.querySelector('.nav a.active')?.classList.remove('active')
    document.body.querySelector(`.nav a[href="#${section}"]`)?.classList.add('active')
    sectionMsgsEl.replaceChildren(
      ...sections[section].msgs.map(msg =>
        <div class="msg">
          <div class="time">[{msg.time}]</div>
          <div class="nick" style={`color:${colorize(msg.nick)}`}>{msg.nick}</div>
          <div class="text">{msg.text}</div>
        </div> as HTMLDivElement
      )
    )
    scrollToBottom()
  }

  requestAnimationFrame(() => {
    setSection(section)
  })

  return <div>
    <div class="logo">xpress.wtf</div>

    {sectionMsgsEl}

    <div class="input">
      <div class="nick" style={`color:${colorize(user.nick)}`}>{user.nick}</div>
      <input type="text" autocomplete="off" spellcheck="false" autocapitalize="off" />
    </div>

    <Nav sections={sections} setSection={setSection} />
  </div> as HTMLDivElement
}
