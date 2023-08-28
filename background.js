let intervalId;
let intervalIdOne;

function runTimer(timerType) {
    chrome.storage.local.get(
        ["timer", "isRunning", "timeOption", "isBreakRunning", "breakTimer", "breakDurationSelect"],
        (res) => {
            // chrome.storage.local.set({
            //     showbreaktimer: 0,
            //     showmaintimer: 0
            // })
            let TrueORFalse, timeinSecondsPasted, selectedTimefromDropDownMenu;
            if (timerType === 'main') {
                TrueORFalse = res.isRunning;
                timeinSecondsPasted = res.timer;
                selectedTimefromDropDownMenu = res.timeOption;
                console.log('main')
            } else if (timerType === 'break') {
                TrueORFalse = res.isBreakRunning;
                timeinSecondsPasted = res.breakTimer;
                selectedTimefromDropDownMenu = res.breakDurationSelect;
                console.log('break')
            } else {
                return; // Invalid timer type, exit the function
            }

            if (TrueORFalse) {
                let timer = timeinSecondsPasted + 1;
                let isRunning = true;
                console.log(timer, 'timer')
                if (timerType === 'main' && timer >= 60 * selectedTimefromDropDownMenu) {
                    // Show a notification when the main timer ends
                    chrome.notifications.create({
                        type: 'basic',
                        title: 'Timer Ended',
                        message: `Your ${res.timeOption} minute(s) worktime has ended!`,
                        iconUrl: '../images/icon48.png',
                    });
                    startBreakTimer();
                    timer = 0;
                    isRunning = false;
                    chrome.storage.local.set({
                        showmaintimer: 0
                    })
                } else if (timerType === 'break' && timer >= selectedTimefromDropDownMenu) {
                    // Show a notification when the main timer ends
                    chrome.notifications.create({
                        type: 'basic',
                        title: 'Timer Ended',
                        message: 'Your break timer has ended!',
                        iconUrl: '../images/icon48.png', 
                    });
                    startNextMainTimer();
                    timer = 0;
                    isRunning = false;
                    chrome.storage.local.set({
                        showbreaktimer: 0,
                    })
                }

                chrome.storage.local.set({
                    [timerType === 'main' ? 'timer' : 'breakTimer']: timer,
                    [timerType === 'main' ? 'isRunning' : 'isBreakRunning']: isRunning,
                });
            }
        }
    );
}

function startBreakTimer() {
    clearInterval(intervalId);
    intervalId = null;
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
        isBreakRunning: true,
        showbreaktimer: 2
    }, () => {
        intervalIdOne = setInterval(() => runTimer('break'), 1000);
    });
}

function startNextMainTimer() {
    clearInterval(intervalIdOne);
    intervalIdOne = null;
    chrome.storage.local.set({
        breakTimer: 0,
        isRunning: true,
        isBreakRunning: false,
        showmaintimer: 1
    }, () => {
        intervalId = setInterval(() => runTimer('main'), 1000);
    });
}

chrome.storage.local.get(
    ["timer", "isRunning", "timeOption", "isBreakRunning", "breakTimer"],
    (response) => {
        const { timer = 0, breakTimer = 0, timeOption = 20, isRunning = false, isBreakRunning = false } = response;

        chrome.storage.local.set({ timer, timeOption, isRunning, breakTimer, isBreakRunning });

        if (isRunning) {
            runTimer('main');
        } else if (isBreakRunning) {
            runTimer('break');
        }
    }
);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'startTimers') {
        // Clear the existing interval if it exists
        if (intervalId || intervalIdOne) {
            clearInterval(intervalId);
            clearInterval(intervalIdOne);
        }
        chrome.storage.local.set({
            showmaintimer: 1
        })
        // Set the interval for the main timer
        intervalId = setInterval(() => runTimer('main'), 1000);
    } else if (message.action === 'breakTimers') {
        // Clear the existing interval if it exists
        if (intervalId || intervalIdOne) {
            clearInterval(intervalId);
            clearInterval(intervalIdOne);
        }
        intervalIdOne = setInterval(() => runTimer('break'), 1000);
    }
});