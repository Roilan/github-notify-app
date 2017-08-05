import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';

const ScreenLoader = ({ loading }) => (
  loading ? (
    <LinearProgress mode='indeterminate' />
  ) : null
);

export default ScreenLoader;