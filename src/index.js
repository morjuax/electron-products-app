const {app, BrowserWindow, Menu} = require('electron')
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
        title: 'Products App'
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
    });
    newProductWindow.setMenu(null);

    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.on('closed', () => {
        newProductWindow = null;
    });
}

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
                click() {

                }
            },
            {
                label: 'Exit',
                accelerator: isMac ? 'command+q' : 'Ctrl+q',
                click() {
                    app.quit();
                }
            }
        ]
    },
]
