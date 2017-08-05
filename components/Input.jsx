import React from 'react';
import TextField from 'material-ui/TextField';

const Input = ({ id, label, errorText, onChange, value }) => (
  <TextField
    id={id}
    floatingLabelText={label}
    errorText={errorText}
    onChange={onChange}
    value={value}
  />
);

export default Input;
