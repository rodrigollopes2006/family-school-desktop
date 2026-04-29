const { app, BrowserWindow, session } = require('electron');
const path = require('path');

const SITE_URL = 'https://rodrigoejulianelopes.com';

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
        icon: path.join(__dirname, '../assets/logo.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: false,
            // Bloqueia abertura de novas janelas
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
        // Bloqueia qualquer URL externa
        return { action: 'deny' };
    });

    // Bloqueia redirecionamentos externos
    mainWindow.webContents.on('will-redirect', (event, url) => {
        if (!url.startsWith(SITE_URL) && !url.startsWith('https://rodrigoejulianelopes.com')) {
            event.preventDefault();
        }
    });

    mainWindow.loadURL(SITE_URL);

    mainWindow.once('ready-to-show', () => {
        // Fecha splash e abre janela principal
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

    // Remove menu padrão
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
