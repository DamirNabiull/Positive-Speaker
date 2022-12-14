const { ipcRenderer } = require('electron');
const nodemailer = require('nodemailer');
const emailInfo = require('./email.json');
const config = require('./config.json');
const { text } = require('express');

// Email
const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
        user: emailInfo.login,
        pass: emailInfo.pass
    }
});

console.log(emailInfo.login, emailInfo.pass)

// pages
startPage = document.getElementById("startPage");
scanPage = document.getElementById("scanPage");
namePage = document.getElementById("namePage");
badPage = document.getElementById("badPage");
sendedPage = document.getElementById("sendedPage");
resultPage = document.getElementById("resultPage");

// name page elements
nameText = document.getElementById("nameText");

// result elements
resultTitle = document.getElementById("resultTitle");
resultDescription = document.getElementById("resultDescription");
speedometrVideo = document.getElementById("speedometrVideo");
speedometrSrc = document.getElementById("speedometrSrc");
resultVideo = document.getElementById("resultVideo");
video = document.getElementById("video");
videoSrc = document.getElementById("videoSrc");
smallSendButton = document.getElementById("smallSendButton");
smallRepeatlButton = document.getElementById("smallRepeatlButton");
smallCancelButtonY = document.getElementById("smallCancelButtonY");

// Levels

titles = {
    "1": "Поздравляем!<br>Вы — буддист, познавший дзен",
    "2": "Поздравляем!<br>Вы — повелитель информационных волн",
    "3": "Поздравляем!<br>Вы — король информационных джунглей"
}

descriptions = {
    "1": "Про вас можно сказать: «Редко, но метко».<br>В этом году вы почувствовали PR-вайб.<br>Продолжайте в том же духе",
    "2": "В этом году вы на волне. Даже самые<br>высокие из них были вам по плечу",
    "3": "Вы как настоящий король — любите славу.<br>Попали в топовые СМИ, а главные события<br>в мире ИБ не обошлись без вас"
}

// Variables

var scanned = true;
var updated = true;
var level = "1";
var personName = "Иванов Иван";
var email = "email@email.com";
var personVideo = personName.replaceAll(' ', '_');
var videoLink = "link";
var videoEnded = true;
var scanTimer;

const emailText = `<p>Дорогой спикер!
                    <br><br>
                    На мероприятии для спикеров ты прошел тест с использованием СМИмиметра.
                    <br><br>
                    Скачать ролик о том, кто ты по шкале позитивного анализатора твоего присутствия в средствах массовой информации (СМИ) и в эфирах отраслевых мероприятий в 2022 году, можно по 
                    <a href="LINK">ССЫЛКЕ</a>.
                    <br><br>
                    Да, мы знаем, что нельзя ходить по неизвестным ссылкам, но эта проверена, по этой можно 😊
                    <br><br>
                    Твоя Позитивная пресс-служба.
                 </p>`


ipcRenderer.on('update-person', (event, arg) => {
    personName = arg.name;
    personVideo = personName.replaceAll(' ', '_');
    level = arg.level;
    email = arg.email;
    videoLink = config[personName]

    console.log(personName);
    console.log(personVideo);
    console.log(level);
    console.log(email);
    console.log(videoLink);

    if (updated == false) {
        // if has scanned faces
        // if (scanned) {
            clearTimeout(scanTimer);

            nameText.innerHTML = personName;
            speedometrSrc.src = `../Assets/Animations/${level}.webm`;
            speedometrVideo.load();

            videoSrc.src = `../Assets/Videos/${personVideo}.mp4`;
            video.load();

            namePage.style.display = "block";
            scanPage.style.display = "none";

            // ipcRenderer.send('set-camera', {"value": false});
        // }
        // else {
        //     badPage.style.display = "block";
        //     scanPage.style.display = "none";
        //     // Show another page
        // }
    }
    updated = true;
});

speedometrVideo.addEventListener('ended', (event) => {
    ShowResult();
    console.log('Video ended');
});

video.addEventListener('ended', (event) => {
    videoEnded = true;
});

function ShowResult() {
    resultTitle.style.display = "block";
    resultDescription.style.display = "block";
    resultVideo.style.display = "block";
    smallSendButton.style.display = "block";
    smallRepeatlButton.style.display = "block";
    smallCancelButtonY.style.display = "block";

    videoEnded = false;
    video.play();
}

function HideResult() {
    resultTitle.style.display = "none";
    resultDescription.style.display = "none";
    resultVideo.style.display = "none";
    smallSendButton.style.display = "none";
    smallRepeatlButton.style.display = "none";
    smallCancelButtonY.style.display = "none";
}

function StartClick() {
    scanPage.style.display = "block";
    resultPage.style.display = "none";
    namePage.style.display = "none";
    badPage.style.display = "none";
    startPage.style.display = "none";
    HideResult();
}

function RepeatClick() {
    if (videoEnded) {
        video.play();
    }
}

function GoMenuClick() {
    startPage.style.display = "block";
    scanPage.style.display = "none";
    namePage.style.display = "none";
    badPage.style.display = "none";
    resultPage.style.display = "none";
    sendedPage.style.display = "none";
    HideResult();

    updated = true;
}

function ScanClick() {
    if (updated == true) {
        updated = false;
        ipcRenderer.send('set-camera', {"value": true});
    }

    scanTimer = setTimeout(function () {
        badPage.style.display = "block";
        scanPage.style.display = "none";
        updated = true;
        ipcRenderer.send('set-camera', {"value": false});
    }, 5000);
}

function GoToResult() {
    // Add result functionality

    resultTitle.innerHTML = titles[level];
    resultDescription.innerHTML = descriptions[level];

    resultPage.style.display = "block";
    namePage.style.display = "none";

    speedometrVideo.play();
}

function SendClick() {
    var text = emailText.replaceAll('LINK', videoLink);

    var mailOptions = {
        from: emailInfo.login,
        to: email,
        subject: 'Positive Speaker',
        html: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    // Add send functionality

    sendedPage.style.display = "block";
    resultPage.style.display = "none";
    HideResult();
}