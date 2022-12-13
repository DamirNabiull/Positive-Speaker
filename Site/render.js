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

titles = {
    50: "Поздравляем!<br>Вы — буддист, познавший дзен",
    70: "Поздравляем!<br>Вы — повелитель информационных волн",
    100: "Поздравляем!<br>Вы — король информационных джунглей"
}

descriptions = {
    50: "Про вас можно сказать: «Редко, но метко».<br>В этом году вы почувствовали PR-вайб.<br>Продолжайте в том же духе",
    70: "В этом году вы на волне. Даже самые<br>высокие из них были вам по плечу",
    100: "Вы как настоящий король — любите славу.<br>Попали в топовые СМИ, а главные события<br>в мире ИБ не обошлись без вас"
}

var scanned = true;
var level = 100;
var personName = "Иванов Иван";


function StartClick() {
    scanPage.style.display = "block";
    resultPage.style.display = "none";
    namePage.style.display = "none";
    badPage.style.display = "none";
    startPage.style.display = "none";
}

function GoMenuClick() {
    startPage.style.display = "block";
    scanPage.style.display = "none";
    namePage.style.display = "none";
    badPage.style.display = "none";
    resultPage.style.display = "none";
    sendedPage.style.display = "none";
}

function ScanClick() {
    // Do something

    // Add scan functionality

    // if has scanned faces
    if (scanned) {
        nameText.innerHTML = personName;

        namePage.style.display = "block";
        scanPage.style.display = "none";
    }
    else {
        badPage.style.display = "block";
        scanPage.style.display = "none";
        // Show another page
    }
}

function GoToResult() {
    // Add result functionality

    resultTitle.innerHTML = titles[level];
    resultDescription.innerHTML = descriptions[level];

    resultPage.style.display = "block";
    namePage.style.display = "none";
}

function SendClick() {
    // Add send functionality

    sendedPage.style.display = "block";
    resultPage.style.display = "none";
}