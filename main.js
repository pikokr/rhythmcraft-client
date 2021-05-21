const { app, BrowserWindow, screen } = require('electron');
const data = require('./config.json')

function createWindow() {
    const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())

    let win = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
        icon: __dirname + '/icon.ico',
        x: display.bounds.x,
        y: display.bounds.y
    });
    win.loadURL(data.baseUrl);
    win.setMenuBarVisibility(false);
    win.setFullScreen(true);
    win.setFullScreenable(false);


    const connection_timeout = setTimeout(() => {
        win.loadFile('./page/connect_failed.html');
    }, 10000);

    win.webContents.once('dom-ready', () => {
        clearTimeout(connection_timeout);
    });

    win.webContents.on('devtools-opened', () => {
        if (!global.globalVars.admin) {
            win.webContents.closeDevTools()
        }
    })

    client.on('join', secret => {
        const params = secret.split('||');
        win.loadURL(`https://rhythmcraft.hyonsu.com/game?room=${params[0]}#pw=${params[1]}`);
    });
}

app.whenReady().then(createWindow);

const client = require('discord-rich-presence')('760848542935154718');

global.globalVars = {};

global.globalVars.RichPresence = {
    details: '로그인',
    state: '로그인 중입니다.',
    startTimestamp: Date.now(),
    largeImageKey: 'main',
    smallImageKey: 'main',
    instance: true
}

client.updatePresence(global.globalVars.RichPresence);

let before_rich;
setInterval(() => {
    if(before_rich === global.globalVars.RichPresence) return;
    client.updatePresence(global.globalVars.RichPresence);
    before_rich = global.globalVars.RichPresence;
}, 1);
setInterval(() => {
    client.updatePresence(global.globalVars.RichPresence);
}, 15000);