const { app, BrowserWindow, ipcMain } = require('electron');
const electron = require('electron')
const express = require('express');
const fetch = require('node-fetch')

const FF_SERVER = "http://localhost:80";
const IP = "http://192.168.1.48:80"
const CAMERA_ID = 1;

var mainWin;
var args = null;
var server = express();
var token;
var updated = true;
server.use(express.json());

async function get_token() {
	var response = await fetch(`${FF_SERVER}/auth/login/`, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Basic ${Buffer.from('admin:admin').toString(
				"base64"
			)}`,
		},
		body: JSON.stringify({ uuid: "u" })
	});

	var data = await response.json()
	token = data.token;
}

get_token();


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

	

	ipcMain.on('set-camera', (event, arg) => {
		setCameraEnabled(token, arg.value);
	});
})

async function get_data(matched_card) {
	var response = await fetch(`${FF_SERVER}/cards/humans/${matched_card}`, {
		method: "GET",
		headers: {
			Authorization: `Token ${token}`
		}
	});

	console.log(response);

	// var data = await response.json()
	// return data;
}

const setCameraEnabled = async (token, active) => {
	console.log('setCameraEnabled', active);

	if (active) {
		updated = false;
	}

	let camera = await fetch(`${FF_SERVER}/cameras/${CAMERA_ID}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Token ${token}`,
		},
		body: JSON.stringify({
		active,
		}),
	}).then((res) => res.json());
};

setCameraEnabled(token, false);

server.post('/', function(request, response){
	if (updated == false) {
		setCameraEnabled(token, false);
		updated = true;
	}
	else{
		response.send(request.body);
		return;
	}
    // console.log(request.body);

	var name = 'None';
	var email = 'None';
	var level = 'None';

	for (var event of request.body){
		// console.log(event)
		if (event.matched == true && event.matched_card != undefined) {
			var data = get_data(event.matched_card);

			// console.log('EVENT');
			// console.log(event);
			// console.log('DATA');
			// console.log(data);

			name = data.name;
			email = data.email;
			level = data.level;

			break;
		}
	}

    // args = request.body;
	args = {
		"name": name,
		"email": email,
		"level": level
	}

    mainWin.webContents.send('update-person', args);
    response.send(request.body);
});

server.listen(3000);