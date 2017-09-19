import moment from 'moment'

function formatDate(date) {
  return moment(date).format('MMMM DD, YYYY')
}

function formatDateRelative(date) {
  return moment(date).fromNow()
}

export {formatDate, formatDateRelative}
