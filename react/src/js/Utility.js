function formatDate(date) {
  const options = {month: 'long', day: 'numeric', year: 'numeric'}
  date = new Date(date)
  return date.toLocaleString('en-US', options)
}

export {formatDate}
