import moment from 'moment'

function formatDate(date) {
  return moment(date).format('MMMM DD, YYYY')
}

function formatDateRelative(date) {
  return moment(date).fromNow()
}

/**
 * Safari in Private Browsing Mode will break site if local storge is needed
 * This will check if local storage is available, and if not, will alert the user and
 * prevent future calls to local storage from breaking the site.
 */
function checkLocalStorage() {
  if (typeof localStorage === 'object') {
    try {
      localStorage.setItem('localStorage', 1)
      localStorage.removeItem('localStorage')
    }
    catch (e) {
      Storage.prototype._setItem = Storage.prototype.setItem
      Storage.prototype.setItem = function() {}
      alert(`Warning: Your browser does not allow the use of local storage, which will make parts of this 
      app unusable, such as logging in.  If you are using Safari, exiting Private Browsing Mode will 
      likely fix this issue.`)
    }
  }
}

export {formatDate, formatDateRelative, checkLocalStorage}
