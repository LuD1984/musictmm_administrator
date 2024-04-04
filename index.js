const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        kiosk: false,
        frame: true,
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

    ipcMain.on('minimize', (event, arg) => {
        app.hide();
    });
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