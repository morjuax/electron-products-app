const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const url = require('url');
const path = require('path');
if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
}

let mainWindow = null;
let newProductWindow = null;
const isMac = process.platform === 'darwin';

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        title: 'Products App',
        width:720,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));
    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
        mainWindow = null;
    })
});

const createNewProductWindow = () => {
    newProductWindow = new BrowserWindow({
        width: 400,
        height: 330,
        title: 'Add A New Product',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    // newProductWindow.setMenu(null);

    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.on('closed', () => {
        newProductWindow = null;
    });
}

ipcMain.on('product:new', (e, newProduct) => {
    mainWindow.webContents.send('product:new', newProduct)
})

const templateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Product',
                accelerator: 'Ctrl+N',
                click() {
                    createNewProductWindow();
                }
            },
            {
                label: 'Remove All Products',
                click() {}
            },
            {
                label: 'Exit',
                accelerator: isMac ? 'command+q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
];

if (isMac) {
    templateMenu.unshift({
        label: app.getName()
    })
}

if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'DevTools',
        submenu: [
            {
                label: 'Show/Hide Dev Tools',
                accelerator: 'Ctr+D',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
