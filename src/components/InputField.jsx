import React from 'react';

export default function InputField({ label, icon, rightElement, ...inputProps }) {
  return (
    <div className="form-group">
      <label htmlFor={inputProps.id || inputProps.name} className="form-label">
        {label}
      </label>
      <div className="input-wrapper">
        {icon && (
          <span className="input-icon-left">
            <img src={icon} alt="" aria-hidden="true" />
          </span>
        )}
        <input className="form-input" {...inputProps} />
        {rightElement}
      </div>
    </div>
  );
}
