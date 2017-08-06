const menubar = require('menubar');

const menubarOpts = {
  height: 600
};

if (process.env.NODE_ENV !== 'production') {
  require('electron-debug');

  menubarOpts.alwaysOnTop = true;
}

const mb = menubar(menubarOpts);

mb.on('ready', function ready () {
  console.log('app is ready')
})
