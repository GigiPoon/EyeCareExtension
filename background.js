chrome.alarms.onAlarm.addListener(() => {
    chrome.notifications.create(
        {
            type: 'basic',
            iconUrl: 'images/icon128.png',
            title: 'Rest your eyes',
            message: 'Stare at something that is 200 meters away, Take a 20 second break, alarm will repeat after 20 seconds',
            silent: false,
        },
        () => { }
    );
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let myTime = request.time;
    console.log(myTime, "mytime")
        if (myTime) {
            chrome.alarms.clear('rest_eyes')
            createAlarm(Number(myTime));
            
            let durationInSeconds = myTime * 60;
            console.log(durationInSeconds, 'duration in seconds')

            // Set the timer start time
            let startTime = new Date().getTime();

            // console.log(startTime, 'startTime')
            // Update the countdown timer every second
            let intervalId = setInterval(function () {
                
                // Calculate the time remaining in seconds
                let currentTime = new Date().getTime();
                let timeRemainingInSeconds = durationInSeconds - Math.floor((currentTime - startTime) / 1000);
                console.log(timeRemainingInSeconds, 'timeRemainingInSeconds')

                // If the timer has expired, clear the interval
                if (timeRemainingInSeconds <= 0) {
                    clearInterval(intervalId);
                    chrome.storage.local.remove(["startTime", "intervalId"]);
                } else {
                    // Save the start time and interval ID in Chrome storage
                    // console.log(startTime,'starttime')
                    // console.log(intervalId, 'intervalId')
                    // console.log(durationInSeconds, 'durationInSecondsstoring')
                    chrome.storage.local.set({ startTime, intervalId, durationInSeconds })
                }
            }, 1000);
            //myTime = user selected number 1,5,10,15,20,25,30
            
        }
        // else if (request.when) {
        //     sendResponse({ time: myTime });
        // }
            //delay second alarm by 20 secounds before running next
    sendResponse({ status: true });
    }

    
);

// chrome.storage.local.set({ timer: 600 });

// function updateTimer() {
//     chrome.storage.local.get('timer', function (data) {
//         let timer = data.timer;
//         console.log(timer, 'timer111')
//         if (timer > 0) {
//             timer--;
//             chrome.storage.local.set({ timer: timer });
//             // chrome.runtime.sendMessage({ time: timer }, function (response) { });
//             // do something with the updated timer value (e.g. update UI)
//         }
//     });
// }

// setInterval(updateTimer, 1000);


function createAlarm(myTime) {
    chrome.alarms.create('rest_eyes', {
        delayInMinutes: myTime,
        periodInMinutes: myTime,
    });
}

// let timerID;
// let timerTime;


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.cmd === 'START_TIMER') {
//         timerTime = request.when;
//         console.log(timerTime, 'request when')
//         // if (timerTime <= 0) {
//         //     setInterval(() => {
//         //         timerTime--;
//         //         console.log(timerTime, 'DISPLAYING')
//         //     }, 1000)
//         //     }
        
//     } else if (request.cmd === 'GET_TIME') {
//         console.log(request.cmd === 'GET_TIME', 'getting timer')
//         sendResponse({ time: timerTime });
//     }
// });

// function dataRemain(data) {
//     chrome.storage.local.get(['time']), ()=> {
//         const alarmtimer = document.getElementById('alarmtimer');
//         alarmtimer.textContent = data.time
//     }
// }

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

// Set the timer duration in seconds
