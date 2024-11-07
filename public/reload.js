const url = '/reload'
const es = new EventSource(url)
es.onopen = () => {
  console.log('reload connected')
  es.onopen = () => (location.href = location.href)
}
es.onmessage = (e) => {
  if (e.data === 'reload') {
    location.href = location.href
  }
}
