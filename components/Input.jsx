import React from 'react';
import TextField from 'material-ui/TextField';

const Input = ({
  id, label, errorText, onChange, value,
  fullWidth
}) => (
  <TextField
    id={id}
    floatingLabelText={label}
    fullWidth={fullWidth}
    errorText={errorText}
    onChange={onChange}
    value={value}
  />
);

export default Input;
