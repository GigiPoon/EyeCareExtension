// Function to update the timer display in the popup
function updatePopupTimerDisplay(timeInSeconds, timerTitle, timerColor) {
    const timerDisplay = document.getElementById('timer');
    const timerTitleDisplay = document.getElementById('timer-title');

    if (timerDisplay && timerTitleDisplay) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerTitleDisplay.textContent = timerTitle;
        
        if (timerColor) {
            timerDisplay.style.color = timerColor; // Set the timer color
        } else {
            timerDisplay.style.removeProperty('color'); // Reset the timer color
        }
    } else {
        console.error("Timer display elements not found");
    }
}


// Function to start the timers with the selected time from the dropdown menu
function startTimers() {
    const durationSelect = document.getElementById('duration-select');
    const breakDurationSelect = 20 //document.getElementById('break-duration-select');

    const duration = parseInt(durationSelect.value);
    // const breakDuration = parseInt(breakDurationSelect.value);

    // Clear the existing local storage
    chrome.storage.local.clear();

    // Send a message to the background script to start the timers
    chrome.runtime.sendMessage({
        action: 'startTimers',
        duration: duration,
        breakDuration: breakDurationSelect, //breakDuration
    });
}

// Initialize the dropdowns, timer display, and timer title
function initializePopup() {
    const durationSelect = document.getElementById('duration-select');
    // const breakDurationSelect = document.getElementById('break-duration-select');
    const timerTitleDisplay = document.getElementById('timer-title');

    // Add event listener to the start button (OK BUTTON)
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', startTimers);

    // Set the selected option to 20 minutes
    durationSelect.value = 20;

    const twenty = durationSelect.value

    // Update the timer display with the initial value from Chrome storage
    chrome.storage.local.get(['timerValue', 'timerTitle', 'isPaused'], function (result) {
        const timerValue = result.timerValue || twenty * 60;
        const timerTitle = result.timerTitle || '';
        updatePopupTimerDisplay(timerValue, timerTitle);

        // Enable or disable the resume button based on the pause state
        if (result.isPaused) {
            const isPaused = result.isPaused;
            resumeButton.disabled = !isPaused;
        }
    });

    // Update the dropdown menus with the initial selected time and break duration from Chrome storage
    chrome.storage.local.get('selectedTime', function (result) {
        const selectedTime = result.selectedTime;
        if (selectedTime) {
            durationSelect.value = selectedTime.toString();
        }
    });

    // chrome.storage.local.get('breakDuration', function (result) {
    //     const breakDuration = result.breakDuration;
    //     if (breakDuration) {
    //         breakDurationSelect.value = breakDuration.toString();
    //     }
    // });

    // Update the timer title display from Chrome storage
    chrome.storage.local.get('timerTitle', function (result) {
        const timerTitle = result.timerTitle || '';
        timerTitleDisplay.textContent = timerTitle;
        
    });
}

// Call the initializePopup function when the popup is opened
document.addEventListener('DOMContentLoaded', initializePopup);

// Listen for changes in Chrome storage and update the timer display accordingly
chrome.storage.onChanged.addListener(function (changes) {
    if (changes.timerValue || changes.timerTitle || changes.timerColor || changes.isPaused) {
        chrome.storage.local.get(['timerValue', 'timerTitle', 'timerColor'], function (result) {
            const timerValue = result.timerValue || 0;
            const timerTitle = result.timerTitle || '';
            const timerColor = result.timerColor;
            updatePopupTimerDisplay(timerValue, timerTitle, timerColor);
            // Enable or disable the resume button based on the pause state
            if (changes.isPaused) {
                const isPaused = changes.isPaused.newValue;
                resumeButton.disabled = !isPaused;
            }
        });
    }
});

//closing the user interface with an X button on the top right
const closePopUp = document.getElementById('closeMenu')
closePopUp.addEventListener('click', () => {
    window.close();
})

const settingsButton = document.querySelectorAll('.settingsButton')
const frontpage = document.getElementById('frontpage')
const backpage = document.getElementById('backpage')
//flips page
settingsButton.forEach(item => {
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

const openNewTab = document.getElementById("openNewTab");
openNewTab.addEventListener("click", () => {
    chrome.tabs.create({ 'url': 'exercise.html' }, function (tab) {
        // Tab opened.
    });
});

// Add event listener for the "Go" button
const goButton = document.getElementById('go-button');
goButton.addEventListener('click', startTimers);

function pauseTimers() {
    console.log('Pause button clicked');
    // Send a message to the background script to pause the timers
    chrome.runtime.sendMessage({ action: 'pauseTimers' });
}

function resumeTimers() {
    console.log('Resume button clicked');
            chrome.runtime.sendMessage({ action: 'resumeTimers' });
    //     }
    // });
}

// Add event listener to the pause button
const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', pauseTimers);

// Add event listener to the resume button
const resumeButton = document.getElementById('resumeButton');
resumeButton.addEventListener('click', resumeTimers);
