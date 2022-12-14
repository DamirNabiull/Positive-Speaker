const { app, BrowserWindow, ipcMain } = require('electron');
const electron = require('electron')
const express = require('express');
const fetch = require('node-fetch')

var mainWin;
var args = null;
var server = express();
server.use(express.json());

var response = await fetch(`http://127.0.0.1/auth/login/`, {
    method: "POST",
    headers: {
		'Content-Type': 'application/json',
      	'Authorization': `Basic ${Buffer.from('admin:admin').toString(
			"base64"
		)}`,
    },
    body: JSON.stringify({ uuid: "u" })
});

var data = await response.json();
console.log(data);
const token = data.token;
console.log(token);


app.whenReady().then(() => {
	// MAIN WIN
	mainWin = new BrowserWindow({
		width: 2160,
		height: 3860,
		transparent: false,
		hasShadow: false,
		frame: false,
		resizable: false,
		// alwaysOnTop: true,
		minimizable: false,
		// maximizable: true,
		// kiosk: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
	})

	// mainWin.setVisibleOnAllWorkspaces(true, {
	// 	visibleOnFullScreen: true,
	// 	skipTransformProcessType: true,
	// });

	mainWin.loadFile('Site/index.html');

	// FUNCTIONS

	mainWin.setMenuBarVisibility(false)

	// setTimeout(() => {
	// 	mainWin.maximize();
	// }, 2000);

	// setTimeout(() => {
	// 	mainWin.setFullScreen(true);
	// }, 3000);
})

server.post('/', function(request, response){
    console.log(request.body);



    args = request.body;
    mainWin.webContents.send('update-person', args);
    response.send(request.body);
});

server.listen(3000);