const menubar = require('menubar');

let menubarOpts = {};

if (process.env.NODE_ENV !== 'production') {
  require('electron-debug');

  menubarOpts.alwaysOnTop = true;
}

const mb = menubar(menubarOpts);

mb.on('ready', function ready () {
  console.log('app is ready')
})
