import React from 'react';
import {withRouter, Link} from 'react-router-dom';

/**
 * Note: these are experimental and not yet used in the app
 */

/**
 * Composed component wrapping react router's Link component.
 * Takes current path, stores it inside the state of location, and passes that data to
 * the next routed component.
 * Allows the next route to know the previous route.
 */
const HistoryLink = withRouter(({to, children, location, className}) => {
  const link = {
    pathname: to,
    state: {from: location.pathname}
  }
  return <Link className={className} to={link}>{children}</Link>
})

/**
 * Composed component wrapping react router's Link component.
 * If linked to with the HistoryLink component, it will know the previous route, and can
 * link back to it.  If the previous location was not accessed through the history link (e.g. outside
 * the app), it will link back to a fallback Route.
 */
const BackLink = withRouter(({fallback, value, location}) => {
  let path = null
  if (location.state && location.state.hasOwnProperty('from')) {
    path = location.state.from
  }
  else if (fallback) {
    path = fallback
  }
  else {
    path = '/'
  }

  const text = value ? value : 'Back'

  return <Link to={path}>{text}</Link>
})

/**
 * Like BackLink, but moves browser history back instead of pushing on a new history state
 * Requires "to" param
 */
const BackLinkHistory = withRouter(({to, value, location, history, className}) => {
  const text = value ? value : 'Back'
  if (location.state && location.state.hasOwnProperty('from')) {
    return (
    <Link 
      to={to}
      onClick={event => {
        event.preventDefault()
        history.goBack()
      }}
      className={className}
    >
      {text}
    </Link>
    )
  }
  else {
    return <Link to={to} className={className}>{text}</Link>
  }
})

export default HistoryLink

export {BackLink, BackLinkHistory}