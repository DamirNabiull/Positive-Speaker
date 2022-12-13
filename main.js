const { app, BrowserWindow, ipcMain } = require('electron');
const electron = require('electron')

app.whenReady().then(() => {
	// MAIN WIN
	mainWin = new BrowserWindow({
		width: 2160,
		height: 3860,
		transparent: false,
		hasShadow: false,
		frame: false,
		resizable: false,
		alwaysOnTop: true,
		minimizable: false,
		maximizable: true,
		kiosk: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
	})

	mainWin.setVisibleOnAllWorkspaces(true, {
		visibleOnFullScreen: true,
		skipTransformProcessType: true,
	});

	mainWin.loadFile('Site/index.html');

	// FUNCTIONS

	mainWin.setMenuBarVisibility(false)

	setTimeout(() => {
		mainWin.maximize();
	}, 2000);

	setTimeout(() => {
		mainWin.setFullScreen(true);
	}, 3000);
})