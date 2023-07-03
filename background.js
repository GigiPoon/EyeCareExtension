let timerIntervalId = null;
let isPaused = false;
let pausedTime = 0;
let startTime = 0;

function runTimersBackToBack(durationInMinutes, breakDurationInSeconds) {
    chrome.storage.local.set({ timerTitle: 'Time Until Break', timerColor: '#8399A8' });

    runTimer(durationInMinutes)
        .then(() => {
            chrome.storage.local.set({ timerTitle: 'Break Timer', timerColor: 'black' });
            return runTimer(breakDurationInSeconds);
        })
        .then(() => {
            chrome.storage.local.set({ timerTitle: 'Time Until Break', timerColor: null });

            chrome.storage.local.get('selectedTime', function (result) {
                const selectedTime = result.selectedTime;
                if (selectedTime) {
                    runTimersBackToBack(selectedTime, breakDurationInSeconds);
                }
            });
        });
}

function runTimer(durationInSeconds) {
    return new Promise(resolve => {
        const currentTime = performance.now();
        if (!isPaused) {
            startTime = currentTime; // Update the start time only when not paused
        }
        timerIntervalId = setInterval(() => {
            if (!isPaused) {
                const elapsedTimeInSeconds = (performance.now() - startTime) / 1000;
                const remainingTimeInSeconds = durationInSeconds - elapsedTimeInSeconds;

                if (remainingTimeInSeconds >= 0) {
                    chrome.storage.local.set({ timerValue: remainingTimeInSeconds });
                } else {
                    clearInterval(timerIntervalId);
                    resolve();
                }
            }
        }, 100);
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'pauseTimers') {
        if (!isPaused) {
            isPaused = true;
            pausedTime = performance.now();
        }
    } else if (message.action === 'resumeTimers') {
        if (isPaused) {
            isPaused = false;
            startTime += performance.now() - pausedTime;
        }
    } else if (message.action === 'startTimers') {
        if (timerIntervalId) {
            clearInterval(timerIntervalId);
        }

        const selectedTime = message.duration;
        const breakDuration = message.breakDuration;

        chrome.storage.local.set({ selectedTime: selectedTime });

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

