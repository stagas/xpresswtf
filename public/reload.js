const url = '/reload'
const es = new EventSource(url)
es.onopen = () => es.onopen = () => (location.href = location.href)
es.onmessage = (e) => {
  if (e.data === 'reload') {
    location.href = location.href
  }
}
