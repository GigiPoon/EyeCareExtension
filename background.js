let timerIntervalId = null;
let isPaused = false;
let pausedTime = 0;
let startTime = 0;

function runTimersBackToBack() {
    chrome.storage.local.get(['selectedTime', 'breakDuration'], function (result) {
        const selectedTime = result.selectedTime
        const breakDuration = result.breakDuration
        chrome.storage.local.set({ timerTitle: 'Work Timer', timerColor: '#3393EC' });

        runTimer(selectedTime)
            .then(() => {
                chrome.storage.local.set({ timerTitle: 'Break Timer', timerColor: 'black' });
                return runTimer(breakDuration);
            })
            .then(() => {
                chrome.storage.local.set({ timerTitle: 'Work Timer', timerColor: null });
                runTimersBackToBack(selectedTime, breakDuration);
            });
    })
}

function runTimer(durationInSeconds) {
    console.log(durationInSeconds)
    return new Promise(resolve => {
        const currentTime = Date.now();
        if (!isPaused) {
            startTime = currentTime; // Update the start time only when not paused
        }
        timerIntervalId = setInterval(() => {
            if (!isPaused) {
                const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;
                const remainingTimeInSeconds = durationInSeconds - elapsedTimeInSeconds;
                console.log(remainingTimeInSeconds)

                if (remainingTimeInSeconds >= 0) {
                    chrome.storage.local.set({ timerValue: remainingTimeInSeconds });
                } else {
                    clearInterval(timerIntervalId);
                    resolve();
                }
            }
        }, 1000);
    });
}

let one = null

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'pauseTimers') {
        if (!isPaused) {
                let z = 0
                console.log('pausedTime')
                one = setInterval(() => {
                    z++
                    console.log(z)
                }, 1000)
            isPaused = true;
            pausedTime = Date.now();
        }
    } else if (message.action === 'resumeTimers') {
        if (isPaused) {
            if (one) {
                clearInterval(one)
            }
            isPaused = false;
            startTime += Date.now() - pausedTime;
        }
    } else if (message.action === 'startTimers') {
        if (timerIntervalId) {
            clearInterval(timerIntervalId);
        }

        const selectedTime = message.duration;
        const breakDuration = message.breakDuration;

        chrome.storage.local.set({ 
            selectedTime: selectedTime,
            breakDuration: breakDuration,        
        });

        runTimersBackToBack(selectedTime, breakDuration);
    }
});
// function showAlarmNotification() {
//     const notificationOptions = {
//         type: 'basic',
//         iconUrl: 'images/alarm.jpg',
//         title: 'Alarm',
//         message: 'Timer has finished!',
//     };

//     chrome.notifications.create('', notificationOptions, () => { });
// }

// function clearAlarm() {
//     const alarmName = 'rest_eyes';
//     chrome.alarms.clear(alarmName);
// }