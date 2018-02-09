const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let win = null;

const createWindow = () => {
  win = new BrowserWindow({ width: 900, height: 700 });

  win.loadURL(process.env.NODE_ENV === 'production' ? url.format({
    pathname: path.join(__dirname, '../renderers/editor/index.html'),
    protocol: 'file:',
    slashes: true,
  }) : `http://localhost:3000/editor/index.html}`);

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
