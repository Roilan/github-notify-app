import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const Button = ({
  label, disabled, fullWidth, style,
  primary, secondary, onClick
}) => (
  <RaisedButton
    label={label}
    disabled={disabled}
    fullWidth={fullWidth}
    primary={primary}
    secondary={secondary}
    style={style}
    onTouchTap={onClick}
  />
);

export default Button;
