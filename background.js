// Variable to store the interval ID of the active timer
let timerIntervalId = null;

// Function to run the timers back-to-back
function runTimersBackToBack(durationInMinutes, breakDurationInSeconds) {
    // Update the timer title to "Time Until Break" and the timer color to #8399A8
    chrome.storage.local.set({ timerTitle: 'Time Until Break', timerColor: '#8399A8' });

    runTimer(durationInMinutes) // Convert duration to seconds
        .then(() => {
            // Update the timer title to "Break Timer" and the timer color to black
            chrome.storage.local.set({ timerTitle: 'Break Timer', timerColor: 'black' });
            return runTimer(breakDurationInSeconds);
        })
        .then(() => {
            // Update the timer title to "Time Until Break" and reset the timer color
            chrome.storage.local.set({ timerTitle: 'Time Until Break', timerColor: null });

            // Start the timers again with the updated selected time
            chrome.storage.local.get('selectedTime', function (result) {
                const selectedTime = result.selectedTime;
                if (selectedTime) {
                    runTimersBackToBack(selectedTime, breakDurationInSeconds);
                }
            });
        });
}

// Function to run a single countdown timer
function runTimer(durationInSeconds) {
    return new Promise(resolve => {
        const startTime = performance.now();
        timerIntervalId = setInterval(() => {
            const currentTime = performance.now();
            const elapsedTimeInSeconds = (currentTime - startTime) / 1000;
            const remainingTimeInSeconds = durationInSeconds - elapsedTimeInSeconds;

            if (remainingTimeInSeconds >= 0) {
                // Update the timer value in Chrome storage
                chrome.storage.local.set({ timerValue: remainingTimeInSeconds });
            } else {
                clearInterval(timerIntervalId);
                resolve(); // Resolve the promise when the timer finishes
            }
        }, 100);
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'startTimers') {
        // Clear the existing timer interval if it exists
        if (timerIntervalId) {
            clearInterval(timerIntervalId);
        }

        // Retrieve the selected time and break duration from the message
        const selectedTime = message.duration;
        const breakDuration = message.breakDuration;

        // Store the selected time in Chrome storage
        chrome.storage.local.set({ selectedTime: selectedTime });

        // Start the timers
        runTimersBackToBack(selectedTime, breakDuration);
    }
});
