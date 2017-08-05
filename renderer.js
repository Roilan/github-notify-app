if (process.env.NODE_ENV !== 'production') {
  const electronHot = require('electron-hot-loader');

  electronHot.install();
  electronHot.watchJsx(['components/*.jsx']);
}

require('./renderer-react');