const { app, BrowserWindow, session } = require('electron');
const path = require('path');

const SITE_URL = 'https://rodrigoejulianelopes.com';
const LOGIN_URL = 'https://rodrigoejulianelopes.com/login-v1/';

let mainWindow;
let splashWindow;

function createSplash() {
    splashWindow = new BrowserWindow({
        width: 400,
        height: 500,
        frame: false,
        alwaysOnTop: true,
        transparent: false,
        resizable: false,
        center: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });
    splashWindow.loadFile(path.join(__dirname, '../src/splash.html'));
}

function createMain() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        show: false,
        title: 'Family School',
        icon: path.join(__dirname, '../assets/icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: false,
            nativeWindowOpen: false,
        }
    });

    // Bloqueia navegação para URLs externas
    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (!url.startsWith(SITE_URL)) {
            event.preventDefault();
        }
    });

    // Bloqueia abertura de novas janelas (clique no título do YouTube etc)
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        return { action: 'deny' };
    });

    // Bloqueia redirecionamentos externos
    mainWindow.webContents.on('will-redirect', (event, url) => {
        if (!url.startsWith(SITE_URL)) {
            event.preventDefault();
        }
    });

    mainWindow.loadURL(LOGIN_URL);

    mainWindow.once('ready-to-show', () => {
        setTimeout(() => {
            if (splashWindow) {
                splashWindow.close();
                splashWindow = null;
            }
            mainWindow.show();
            mainWindow.maximize();
        }, 2500);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
    createSplash();
    createMain();
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMain();
    }
});
