if (process.env.NODE_ENV !== 'production') {
  const electronHot = require('electron-hot-loader');

  electronHot.install();
  electronHot.watchJsx(['components/*.jsx']);
  electronHot.watchCss(['css/*.css']);
}

require('./renderer-react');