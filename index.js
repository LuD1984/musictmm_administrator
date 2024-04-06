const { app, BrowserWindow, ipcMain, autoUpdater } = require('electron');
const os = require('os');


autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'LuD1984',
    repo: 'musictmm_administrator',
    private: false
  });
  
  // Проверка обновлений при запуске приложения
  app.on('ready', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

function createWindow() {
    const mainWindow = new BrowserWindow({
        fullscreen: true,
        kiosk: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });

    // Load your application's HTML file
    mainWindow.loadFile('src/index.html');
    // open dev tools
    mainWindow.webContents.openDevTools();

    //функция для приема сообщений
    ipcMain.on('close', (event, arg) => {
        app.quit();
    });

    ipcMain.on('minimize', (event, arg) => { os.platform() === 'win32' ? mainWindow.minimize() : app.hide() });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});