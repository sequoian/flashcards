import React from 'react'

const LabeledInput = ({name, type, label, value, onChange, error}) => (
  <div className="labeled-input">
    <label htmlFor={name}>
      {label}
    </label>
    <span className="errors">
      {error}
    </span>
    <input 
      type={type}
      name={name}
      id={name} 
      value={value}
      onChange={onChange} 
    />
  </div>
)

export default LabeledInput
