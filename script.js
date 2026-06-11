// =========================
// ENTE BUS - SCRIPT.JS
// =========================

let currentLanguage = "en";

const chemmadTimes = [
"07:00","07:40","08:02","08:22","08:45","09:10","09:32","09:52",
"10:18","10:50","11:27","11:45",
"12:07","12:25","12:52",
"13:12","13:52",
"14:20","14:42","14:55",
"15:22","15:22","15:53",
"16:15","16:37",
"17:07","17:33","17:50",
"18:03"
];

const kunnumpuramTimes = [
"07:42","08:00","08:30","09:00","09:25","09:45",
"10:20","10:37","10:55","11:10","11:55",
"12:25","12:37",
"13:00","13:35","13:55",
"14:20","14:55",
"15:15","15:20","15:45",
"16:00","16:20","16:53",
"17:20","17:33","17:40",
"18:00","18:25","18:55",
"19:40"
];

// =========================
// LANGUAGE
// =========================

function selectLanguage(lang){

    currentLanguage = lang;

    document
        .getElementById("languageScreen")
        .classList.remove("active");

    document
        .getElementById("homeScreen")
        .classList.add("active");

    if(lang === "ml"){

        document.getElementById("welcomeTitle").innerText =
        "എന്റെ ബസിലേക്ക് സ്വാഗതം";

        document.getElementById("welcomeSub").innerText =
        "നിങ്ങളുടെ അടുത്ത ബസ് ഉടൻ കണ്ടെത്തൂ";
    }

    setTimeout(function(){

        showScreen("findScreen");

    }, 1000);

}

// =========================
// SCREEN SWITCHING
// =========================

function showScreen(screenId){

    document.querySelectorAll(".screen")
        .forEach(screen => screen.classList.remove("active"));

    document.getElementById(screenId)
        .classList.add("active");

    if(screenId === "timetableScreen"){

        document.querySelectorAll(".tab")
            .forEach(tab => tab.classList.remove("active"));

        document.querySelector(".tab")
            .classList.add("active");

        loadTimetable("chemmad");
    }
}

// =========================
// TAB SWITCHING
// =========================

function switchTab(route, button){

    document.querySelectorAll(".tab")
        .forEach(tab => tab.classList.remove("active"));

    button.classList.add("active");

    loadTimetable(route);
}

// =========================
// CLOCK
// =========================

function updateClock(){

    const now = new Date();

    const timeString =
now.toLocaleTimeString([], {
    hour:'2-digit',
    minute:'2-digit',
    hour12:true
});
    const el = document.getElementById("currentTime");

    if(el){
        el.innerText = timeString;
    }
}

setInterval(updateClock,1000);

// =========================
// FIND NEXT BUS
// =========================

function findNextBus(){

    const destination =
        document.getElementById("destination").value;

    const timetable =
        destination === "chemmad"
        ? chemmadTimes
        : kunnumpuramTimes;

    document.getElementById("routeText").innerText =
        destination === "chemmad"
        ? "Pukayoor → Chemmad"
        : "Pukayoor → Kunnumpuram";

    const now = new Date();

    const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

    let nextBus = null;

    for(const time of timetable){

        const [h,m] = time.split(":");

        const busMinutes =
            parseInt(h) * 60 +
            parseInt(m);

        if(busMinutes > currentMinutes){

            nextBus = time;
            break;
        }
    }

    if(nextBus){

        showResult(nextBus);

    }else{

        document.getElementById("busTime").innerText =
            "No More Buses";

        document.getElementById("countdown").innerText =
            "Service Closed";
    }
}

// =========================
// RESULT
// =========================

function showResult(time){

    const [h,m] = time.split(":");

    const busMinutes =
        parseInt(h) * 60 +
        parseInt(m);

    const now = new Date();

    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();

    const remaining =
        busMinutes - currentMinutes;

    document.getElementById("busTime").innerText =
        formatTime(time);

    document.getElementById("countdown").innerText =
        "Arriving in " + remaining + " minutes";
}

// =========================
// MISSED BUS
// =========================

function missedBus(){

    const destination =
        document.getElementById("destination").value;

    const timetable =
        destination === "chemmad"
        ? chemmadTimes
        : kunnumpuramTimes;

    const shownTime =
        document.getElementById("busTime").innerText;

    let currentIndex = -1;

    timetable.forEach((time,index)=>{

        if(formatTime(time) === shownTime){

            currentIndex = index;
        }
    });

    if(
        currentIndex !== -1 &&
        currentIndex < timetable.length - 1
    ){

        showResult(timetable[currentIndex + 1]);

    }else{

        alert("No more buses today");
    }
}

// =========================
// FORMAT TIME
// =========================

function formatTime(time24){

    let [hours, minutes] = time24.split(":");

    hours = parseInt(hours);

    const ampm =
        hours >= 12 ? "PM" : "AM";

    let displayHours =
        hours % 12;

    if(displayHours === 0){
        displayHours = 12;
    }

    return (
        String(displayHours).padStart(2,"0") +
        ":" +
        minutes +
        " " +
        ampm
    );
}
// =========================
// TIMETABLE
// =========================

function loadTimetable(route){

    const list =
        document.getElementById("timetableList");

    list.innerHTML = "";

    const timetable =
        route === "chemmad"
        ? chemmadTimes
        : kunnumpuramTimes;

    timetable.forEach(time => {

        const card =
            document.createElement("div");

        card.className = "glass-card";

        card.innerHTML =
            "<h3>" +
            formatTime(time) +
            "</h3>";

        list.appendChild(card);
    });
}

// =========================
// STARTUP
// =========================

window.onload = function(){

    updateClock();
};
function switchTab(route, button){

    document.querySelectorAll(".tab")
    .forEach(tab => {
        tab.classList.remove("active");
    });

    button.classList.add("active");

    loadTimetable(route);
}

function downloadTimetable(){

    const link =
    document.createElement("a");

    link.href =
    "assets/timetable.jpg";

    link.download =
    "ENTE-BUS-Timetable.jpg";

    link.click();
}