const url = '/reload'
const es = new EventSource(url)
es.onopen = () => {
  console.log('reload connected')
  es.onopen = () => location.reload()
}
es.onmessage = (e) => {
  if (e.data === 'reload') {
    location.reload()
  }
}
