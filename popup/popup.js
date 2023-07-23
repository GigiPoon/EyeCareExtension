
function updateTime() {
    chrome.storage.local.get(["timer", "timeOption", "isRunning", "isBreakRunning", 'breakTimer', 'breakDurationSelect'], (res) => {
        const timerDisplay = document.getElementById("timer");
        const timerTitleDisplay = document.getElementById("timer-title");

        const timeOption = res.timeOption
        const breakDurationSelect = res.breakDurationSelect
        // console.log(res.breakTimer, 'res.breakTimer')
        // console.log(breakDurationSelect, 'breakDurationSelect')


        if (timerDisplay && timerTitleDisplay) {
            
            const minutes = `${timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");
            let seconds = "00";
            timerDisplay.textContent = `${minutes}:${seconds}`
            if (res.timer % 60 !== 0) {
                const minutes = `${timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");
                let seconds = "00";
                seconds = `${60 - (res.timer % 60)}`.padStart(2, "0");
                timerTitleDisplay.textContent = "Worktime"; // Set the timer title
                timerDisplay.textContent = `${minutes}:${seconds}`;
            }
            if (res.breakTimer % 60 !== 0) {
                let minutes = '00';
                let seconds = `${breakDurationSelect - res.breakTimer}`.padStart(2, "0");
                timerDisplay.textContent = `${minutes}:${seconds}`;
                timerTitleDisplay.textContent = "Break Time"; // Set the timer title
                timerDisplay.style.color = "black"; // Set the color to black
            } else {
                timerDisplay.style.removeProperty("color"); // Reset the color property
                // const minutes = `${timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");
                // let seconds = "00";
                // timerDisplay.textContent = `${minutes}:${seconds}`;
            }
        } else {
            console.error("Timer display elements not found");
        }
    });
}


const okButton = document.getElementById("ok-button");
okButton.addEventListener("click", () => {
    chrome.storage.local.clear();

    chrome.runtime.sendMessage({
        action: 'startTimers' //breakDuration
    });
        const timeOptionSelect = document.getElementById("duration-select");
        const breakDurationSelect = 21 //document.getElementById('break-duration-select');
        const selectedTimeOption = timeOptionSelect.value;

        // console.log(selectedTimeOption, 'selectedTimeOption'),
            chrome.storage.local.set(
                {
                    breakDurationSelect: breakDurationSelect,
                    timeOption: selectedTimeOption,
                    timer: 0,
                    breakTimer: 0,
                    isRunning: true, // Start the timer
                    isBreakRunning: false,
                    isStartButtonDisabled: true,
                    isPauseButtonDisabled: false,
                    
                },
                () => {
                    startBtn.disabled = true;
                    pauseBtn.disabled = false;
                }
            );
});


function initializePopup() {
    updateTime()
    setInterval(updateTime, 1000)
}

// Retrieve the selected time option from Chrome storage and set it in the dropdown menu
chrome.storage.local.get(["timeOption"], (res) => {
    const timeOptionSelect = document.getElementById("duration-select");
    timeOptionSelect.value = res.timeOption;
});

// Call the initializePopup function when the popup is opened
document.addEventListener('DOMContentLoaded', initializePopup);


const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");

startBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        action: 'startTimers' //start
    });
    chrome.storage.local.get(["isRunning", 'isBreakRunning', "timer", 'breakTimer'], (res) => {
        const timeOption = document.getElementById("duration-select").value;
        const breakDurationSelect = 21 

        if (res.timer % 60 !== 0) {
            chrome.storage.local.set(
                {
                    isRunning: true,
                    isBreakRunning: false,
                    isStartButtonDisabled: true,
                    isPauseButtonDisabled: false,
                },
                () => {
                    startBtn.disabled = true;
                    pauseBtn.disabled = false;
                })
        }
        else if (res.breakTimer % 60 !== 0) {
            chrome.runtime.sendMessage({
                action: 'breakTimers' //breakDuration
            });
            chrome.storage.local.set(
                {
                    isRunning: false,
                    isBreakRunning: false,
                    isStartButtonDisabled: true,
                    isPauseButtonDisabled: false,
                },
                    () => {
                startBtn.disabled = true;
                pauseBtn.disabled = false;
            })
        }
        else {
            chrome.storage.local.set(
                {
                    isRunning: true,
                    timeOption: timeOption,
                    isBreakRunning: false,
                    breakTimer: 0,
                    breakDurationSelect: breakDurationSelect,
                    isStartButtonDisabled: true,
                    isPauseButtonDisabled: false,

                },
                () => {
                    startBtn.disabled = true;
                    pauseBtn.disabled = false;
                }
            );
        }


    });
});

pauseBtn.addEventListener("click", () => {
    chrome.storage.local.set(
        {
            isRunning: false,
            isBreakRunning: true,
            isStartButtonDisabled: false,
            isPauseButtonDisabled: true,
        },
        () => {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    );
});

const resetTimerBtn = document.getElementById("reset-timer-btn");
resetTimerBtn.addEventListener("click", () => {
    chrome.storage.local.get(["isStartButtonDisabled", "isPauseButtonDisabled"], (res) => {

        const isStartButtonDisabled = res.isStartButtonDisabled;
        const isPauseButtonDisabled = res.isPauseButtonDisabled;
        console.log(isStartButtonDisabled, 'isStartButtonDisabled')
        console.log(isPauseButtonDisabled, 'isPauseButtonDisabled')

        // Updating the button states on the page
        // startBtn.disabled = isStartButtonDisabled;
        // pauseBtn.disabled = isPauseButtonDisabled;
        chrome.storage.local.set(
            {
                timer: 0,
                breakTimer: 0,
                isRunning: false,
                isBreakRunning: true,
                isStartButtonDisabled: false,
                isPauseButtonDisabled: true,
            },
            () => {
                startBtn.disabled = false;
                pauseBtn.disabled = true;
            }
        );
    });
});





const closePopUp = document.getElementById('closeMenu')
closePopUp.addEventListener('click', () => {
    window.close();
})

const settingsButton = document.querySelectorAll('.settingsButton')
const frontpage = document.getElementById('frontpage')
const backpage = document.getElementById('backpage')

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


// Retrieving the stored values
chrome.storage.local.get(["isStartButtonDisabled", "isPauseButtonDisabled"], (res) => {
    const isStartButtonDisabled = res.isStartButtonDisabled;
    const isPauseButtonDisabled = res.isPauseButtonDisabled;
    console.log(isStartButtonDisabled, 'isStartButtonDisabled')
    console.log(isPauseButtonDisabled, 'isPauseButtonDisabled')

    // Updating the button states on the page
    startBtn.disabled = isStartButtonDisabled;
    pauseBtn.disabled = isPauseButtonDisabled;
});