const setAlarmButton = document.getElementById('btn-alarm');
const selectTimeButton = document.getElementById('select-time');
let selectedTime = '';

const settingsButton = document.querySelectorAll('.settingsButton')
const frontpage = document.getElementById('frontpage')
const backpage = document.getElementById('backpage')
const checkbox = document.getElementById('checkbox')
const closePopUp = document.getElementById('closeMenu')
const alarmtimer = document.getElementById('alarmtimer')




closePopUp.addEventListener('click', ()=> {
    window.close();
})

document.querySelectorAll('.settingsButton').forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        if (frontpage) {
            if (frontpage.style.display == 'none') {
                frontpage.style.display = 'block';
                backpage.style.display = 'none';
            }
            else {
                frontpage.style.display = 'none';
                backpage.style.display = 'block';
            }
        }
    })
})

// statement1();
// setTimeout(function () {
//     statement2();
// }, 20000);

// function getTimer() {
//     chrome.storage.local.get(["timeSecond"]).then((data) => {
//         console.log("timeSecond" + data.timeSecond);
//         displayTime(data.timeSecond)
//     });
// }


const breaktimer = document.getElementById('break');

function displayText() {
    breaktimer.innerHTML = "TIME UNTIL BREAK"
}
let delayedTime = 10;

const selectedTimeOption = document.getElementById('time-options');

let timeSecond = selectedTime * 60;

// const start = () => {
//     let timeSecond = selectedTime //* 60;
//     timer = setInterval(() => {
//         // timeH.innerHTML = `00:${timeSecond}`;
//         timeSecond--;
//         displayTime(timeSecond);
//         chrome.storage.local.set({ timeSecond: timeSecond }).then(() => {
//             console.log("timeSecond" + timeSecond);
//         });
//         if (timeSecond <= 0) {
//             breaktimer.innerHTML = "BREAK TIME"
//             delayedTime--
//             displayTime(delayedTime)
//         }
//         if (delayedTime <= 0) {
//             breaktimer.innerHTML = "TIME UNTIL BREAK"
//             //clearInterval(countDown) //repeat/not repeat
//         }
//     }, 1000)
// }


// const start = () => {
//     chrome.storage.local.get('timer', function (data) {
//         let timer = data.timer;
//         console.log(timer, 'gettimer')

//         // do something with the timer value (e.g. update UI)
//         if(timer) {
//             let countdownInterval = setInterval(function () {
//                 displayTime(timer)
//                 const timeleft =
//                     console.log(timer, 'hello world')
//                 timer--;
//                 if (timer <= 0) {
//                     clearInterval(countdownInterval)
//                 }
//                 // Calculate time remaining and update UI
//             }, 1000);
//         } 
//     });
// }

let delay = selectedTime * 60000


selectTimeButton.addEventListener('click', () => {
    const selectedTimeOption = document.getElementById('time-options');
    selectedTime = selectedTimeOption.value;


    let timeSecond = selectedTime * 60;
    console.log(timeSecond, 'timeSecond')

    // chrome.storage.local.get(["key"]).then((result) => {
    //     console.log("timedisplay" + result.key);
    // });
    // displayText()
    // start()
    

    // const delayedCountdown = setInterval(() => {

    //     // timeH.innerHTML = `00:${timeSecond}`;
    //     delayedTime--;
    //     displayTime(delayedTime);

    //     if (delayedTime <= 0 || delayedTime < 1) {
    //         //clearInterval(countDown) //repeat/not repeat

    //         delayedTime = delayedTime * 60
    //     }
    // }, 1000)


    // let timerId
    // let timerId2
    // let stopTimer = false


    // const start = () => {
    //     if (!stopTimer) {
    //         countDown = setTimeout(() => {
    //             console.log('alarm1')
    //             delayedCountdown = setTimeout(() => {
    //                 console.log('alarm2')
    //                 start()
    //             }, 20000) //appears after alarm 1 end - delay 20 seconds
    //         }, selectedTime * 60000) //20 seconds appear after alarm two end
    //     }
    // }


    // const stop = () => {
    //     stopTimer = true
    //     clearTimeout(timerId)
    //     clearTimeout(timerId2)
    // }


    // const setDelay = setTimeout(()=> {
    //     doSomething();
    // }, 20000); // 2 seconds delay in countdown
    // function endTime() {
    //     timeH.innerHTML = 'Times up'
    // }

    // chrome.storage.local.set({ timer: timeSecond });
    // console.log(timeSecond, 'stored selected time')

    if (!selectedTime) {
        console.log('Please select a time!');
        return;
    }
    chrome.runtime.sendMessage({ time: selectedTime }, function (response) { });
});


function displayTime(second) {
    const timeH = document.getElementById('alarmtimer');
    const min = Math.floor(second / 60);
    const sec = Math.floor(second % 60);
    timeH.innerHTML = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`
}

const openNewTab = document.getElementById("openNewTab");
openNewTab.addEventListener("click", () => {
    chrome.tabs.create({ 'url': 'exercise.html' }, function (tab) {
        // Tab opened.
    });
});


// Call this when the pop-up is shown
// function runStart() {
    
//     console.log('response.time')
//     chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
//         console.log(response.time, 'response.time')
//         // response.time = 100
//         if (response.time) {
//             const time = response.time;
//             startTimer(time)
//         }
//     });
// }

// runStart()

// function startTimer(time) {
//     if (time > 0) {
//     setInterval(() => {
//       // display the remaining time
//     }, 1000)

//     }
// }

// function startTime(time) {
//     console.log(time, 'timetimetime')
//     chrome.runtime.sendMessage({ cmd: 'START_TIMER', when: time });
//     startTimer(time);
// }


// Get the stored start time and interval ID from Chrome storage
chrome.storage.local.get(["startTime", "intervalId", "durationInSeconds"], function (result) {
    let startTime = result.startTime;
    let intervalId = result.intervalId;
    let durationInSeconds = result.durationInSeconds;
    // console.log(result.startTime, 'startTime')
    // console.log(result.intervalId, 'intervalId')
    // console.log(result.durationInSeconds, 'result.durationInSeconds')
    


    if (startTime && intervalId) {
        
        
        // Calculate the time remaining in seconds
        // let durationInSeconds = selectedTime * 60;
        // console.log(durationInSeconds, 'durationInSeconds')
        let currentTime = new Date().getTime();
        console.log(currentTime, 'currentTime')
        let timeRemainingInSeconds = durationInSeconds - Math.floor((currentTime - startTime) / 1000);
        // console.log(currentTime, "cirrentTime")
        // console.log(startTime, "startTime")
        // console.log(currentTime - startTime, "currentTime - startTime")
        // console.log((currentTime - startTime) / 1000, "(currentTime - startTime) / 1000")
        // console.log(durationInSeconds - Math.floor(currentTime - startTime) / 1000, 'duration in seconds math')
        console.log(timeRemainingInSeconds, "timeRemainingInSeconds@@@@")
        // console.log(timeRemainingInSeconds1, "timeRemainingInSeconds1")

        const timeUntilBreak = document.getElementById('break')

        timeUntilBreak.innerHTML = 'Time Until Break'
        
        console.log(timeRemainingInSeconds, 'timeRemainingInSeconds')
        // Display the time remaining in the popup
        displayTime(timeRemainingInSeconds)
        // document.getElementById("alarmtimer").innerHTML = `00:${timeRemainingInSeconds}`;

        // Start a new interval to update the countdown timer
        let newIntervalId = setInterval(function () {
            // Calculate the time remaining in seconds
            // console.log(newIntervalId, 'newIntervalId')
            let currentTime = new Date().getTime();
            let timeRemainingInSeconds = durationInSeconds - Math.floor((currentTime - startTime) / 1000);

            // Display the time remaining in the popup
            displayTime(timeRemainingInSeconds)
            // document.getElementById("alarmtimer").innerHTML = `00:${timeRemainingInSeconds}`;

            // If the timer has expired, clear the interval
            if (timeRemainingInSeconds <= 0) {
                clearInterval(newIntervalId);
            }
        }, 1000);
    }
});