function runTimer() {
    chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
        const TrueORFalse = res.isRunning;
        const timeinSecondsPasted = res.timer;
        const selectedTimefromDropDownMenu = res.timeOption;

        // console.log(selectedTimefromDropDownMenu * 60, 'selectedTimefromDropDownMenu')

        if (TrueORFalse) {
            let timer = timeinSecondsPasted + 1;
            let isRunning = true;
            console.log(timer, 'timer')
            // console.log(isRunning, 'isRunning')

            chrome.storage.local.set({
                timer,
            });

            if (timer === 60 * selectedTimefromDropDownMenu + 1) {
                timer = 0;
                isRunning = false;
                // console.log(isRunning, 'WORK TIMER')

                // Start the 20-second countdown timer
                if (intervalIdOne === null) {
                intervalIdOne = setInterval(countdownTimer, 1000);
                    console.log(intervalIdOne, 'intervalIdOne')
                // console.log('start')
                }
                else {
                    startNextTimers()
                    console.log('startnexttimers')
                }
            }
            chrome.storage.local.set({
                isRunning,
            });

        }
    });
}

intervalIdOne = null


//set interval for countdowntimer please

function countdownTimer() {
    chrome.storage.local.get(["isBreakRunning", 'breakTimer', 'breakDurationSelect'], (res) => {
        const TrueORFalse = res.isBreakRunning;
        const timeinSecondsPasted = res.breakTimer
        // console.log(TrueORFalse, 'break timer')
        const selectedTimefromDropDownMenu = res.breakDurationSelect
        if (TrueORFalse === false) {
            let breakTimer = timeinSecondsPasted + 1;
            let isBreakRunning = false;
            console.log(breakTimer, 'breakTimer')


            if (breakTimer === selectedTimefromDropDownMenu + 1) {
                breakTimer = 0;
                isBreakRunning = true;
                

                startNextTimer();
            }
            chrome.storage.local.set({
                breakTimer,
                isBreakRunning,
            });
        }
    })
}

function startNextTimer() {
    // Start the next timer here
    // You can reset the necessary variables and call the runTimer function again

    // For example:
    chrome.storage.local.set({
        timer: 0,
        isRunning: true,
    });
    runTimer();
}

function startNextTimers() {
    chrome.storage.local.set({
        breakTimer: 0,
        isBreakRunning: false,
    });
    countdownTimer();
}

chrome.storage.local.get(["timer", "isRunning", "timeOption", "isBreakRunning", 'breakTimer'], (response) => {
    let timer = 0;
    let breakTimer = 0;
    let timeOption = 20;
    let isRunning = false;
    let isBreakRunning = false;
    let breakDurationSelect = 21;

    if ("breakDurationSelect" in response) {
        breakDurationSelect = response.breakDurationSelect;
    }

    if ("isBreakRunning" in response) {
        isBreakRunning = response.isBreakRunning;
    }

    if ("breakTimer" in response) {
        breakTimer = response.breakTimer;
    }

    if ("timer" in response) {
        timer = response.timer;
    }

    if ("timeOption" in response) {
        timeOption = response.timeOption;
    }

    if ("isRunning" in response) {
        isRunning = response.isRunning;
    }

    chrome.storage.local.set({
        timer,
        timeOption,
        isRunning,
        breakTimer,
        isBreakRunning,
        breakDurationSelect
    });

    // if (isRunning) {
    //     // If a timer is already running, start the countdown timer
    //     countdownTimer();
    // }
});


// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'startTimers') {
        // Clear the existing interval if it exists
        if (intervalId || intervalIdOne) {
            clearInterval(intervalId); 
            clearInterval(intervalIdOne)       
        }

        // Set the interval
        intervalId = setInterval(runTimer, 1000);
    }
    if (message.action === 'breakTimers') {
        if (intervalIdOne) {
            clearInterval(intervalIdOne)

        }
        intervalIdOne = setInterval(countdownTimer, 1000);

    }
});


intervalId = null;
