import React from 'react'

const ValidationErrors = ({errors}) => (
  <div className='errors'>
    <div>Errors</div>
    <ul>
      {errors.map((msg, idx) => (
        <li key={idx}>{msg}</li>
      ))}
    </ul>
  </div>
)

export default ValidationErrors
