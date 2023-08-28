function updateTime() {
    chrome.storage.local.get(["timer", "timeOption", "isRunning", "isBreakRunning", 'breakTimer', 'breakDurationSelect', 'showbreaktimer', 'showmaintimer'], (res) => {
        const timerDisplay = document.getElementById("timer");
        const timerTitleDisplay = document.getElementById("timer-title");

        const timeOption = res.timeOption
        const breakDurationSelect = res.breakDurationSelect
        
        const isRunning = res.isRunning
        const isBreakRunning = res.isBreakRunning

        if (timerDisplay && timerTitleDisplay) {
            if (!res.timer || !res.breakTimer) {
                // console.log('showing?')
                let minutes = `${timeOption}`.padStart(2, "0");
                let seconds = "00";
                timerDisplay.textContent = `${minutes}:${seconds}`;
                timerTitleDisplay.style.color = "black"; 
                timerDisplay.style.removeProperty("color");
            }
            if (res.showmaintimer === 1) {
                // console.log('main timer showering')
                let minutes = `${timeOption}`.padStart(2, "0");
                let seconds = "00";
                timerTitleDisplay.textContent = "Worktime"; // Set the timer title
                timerDisplay.textContent = `${minutes}:${seconds}`;
                timerTitleDisplay.style.color = "black";  
            }
            // if (res.timer) {
            //     const minutes = `${timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");
            //     let seconds = `${60 - (res.timer % 60)}`.padStart(2, "0"); // Corrected line
            //     timerTitleDisplay.textContent = "Worktime"; // Set the timer title
            //     timerDisplay.textContent = `${minutes}:${seconds}`;
            //     timerDisplay.style.removeProperty("color");          
            // }
            if (res.timer) {
                const minutes = `${timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");
                let seconds = (60 - (res.timer % 60)) % 60; // Corrected line
                timerTitleDisplay.textContent = "Worktime"; // Set the timer title
                timerTitleDisplay.style.color = "black"; 

                // Handle the case when seconds equal 60
                if (seconds === 60) {
                    seconds = 0;
                }

                // Pad the seconds with leading zeros
                const formattedSeconds = String(seconds).padStart(2, "0");

                timerDisplay.textContent = `${minutes}:${formattedSeconds}`;
                timerDisplay.style.removeProperty("color");
            }
            if (res.breakTimer || res.showbreaktimer === 2) {
                // let minutes = '00';
                // let seconds = `${breakDurationSelect - res.breakTimer}`.padStart(2, "0");
                timerDisplay.textContent = `${breakDurationSelect - res.breakTimer}`;
                timerTitleDisplay.textContent = "Break Time"; // Set the timer title
                timerTitleDisplay.style.color = "#3393EC";
                timerDisplay.style.color = "black"; // Set the color to black
            }
        // } else {
        //     console.error("Timer display elements not found");
        // }
        }
    });
    
}


const okButton = document.getElementById("ok-button");
okButton.addEventListener("click", () => {
    console.log('ok button is clicked')
    chrome.storage.local.clear();

    chrome.runtime.sendMessage({
        action: 'startTimers' //breakDuration
    });
    const timeOptionSelect = document.getElementById("duration-select");
    const breakDurationSelect = 20 //document.getElementById('break-duration-select');
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
            // isStartButtonDisabled: true,
            // isPauseButtonDisabled: false,

        },
        // () => {
        //     startBtn.disabled = true;
        //     pauseBtn.disabled = false;
        // }
    );
});

okButton.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        // Trigger the same behavior as the click event
        okButton.click();
    }
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
    console.log('Start button is clicked')
    chrome.runtime.sendMessage({
        action: 'startTimers' //start
    });

    
    chrome.storage.local.get(["isRunning", 'isBreakRunning', "timer", 'breakTimer', 'showbreaktimer'], (res) => {
        const timeOption = document.getElementById("duration-select").value;
        const breakDurationSelect = 20

        // if (res.timer % 60 !== 0) {
        //     chrome.storage.local.set(
        //         {
        //             isRunning: true,
        //             isBreakRunning: false,
        //             isStartButtonDisabled: true,
        //             isPauseButtonDisabled: false,
        //         },
        //         () => {
        //             startBtn.disabled = true;
        //             pauseBtn.disabled = false;
        //         })
        // }
        if (res.breakTimer % 60 !== 0 || res.showbreaktimer === 2) {
            // console.log('does this get fullfilled???')
            chrome.runtime.sendMessage({
                action: 'breakTimers' //breakDuration
            });
            chrome.storage.local.set(
                {
                    isRunning: false,
                    isBreakRunning: true,
                    isStartButtonDisabled: true,
                    isPauseButtonDisabled: false,
                },
                // () => {
                //     startBtn.disabled = true;
                //     pauseBtn.disabled = false;
                // }
                )
        }
        else {
            chrome.storage.local.set(
                {
                    isRunning: true,
                    timeOption: timeOption,
                    isBreakRunning: false,
                    breakDurationSelect: breakDurationSelect,
                    isStartButtonDisabled: true,
                    isPauseButtonDisabled: false,

                },
                // () => {
                //     startBtn.disabled = true;
                //     pauseBtn.disabled = false;
                // }
            );
        }


    });
});

pauseBtn.addEventListener("click", () => {
    console.log('Paused button is clicked')
    chrome.storage.local.set(
        {
            isRunning: false,
            isBreakRunning: false,
            // isStartButtonDisabled: false,
            // isPauseButtonDisabled: true,
        },
        // () => {
        //     startBtn.disabled = false;
        //     pauseBtn.disabled = true;
        // }
    );
});

const resetTimerBtn = document.getElementById("reset-btn");
resetTimerBtn.addEventListener("click", () => {
    console.log('Reset button is clicked')
    // chrome.storage.local.get(["isStartButtonDisabled", "isPauseButtonDisabled"], (res) => {
        const timerDisplay = document.getElementById("timer");
        const timerTitleDisplay = document.getElementById("timer-title");
        timerTitleDisplay.textContent = "Worktime";
        timerDisplay.style.removeProperty("color");
        // const isStartButtonDisabled = res.isStartButtonDisabled;
        // const isPauseButtonDisabled = res.isPauseButtonDisabled;
        // console.log(isStartButtonDisabled, 'isStartButtonDisabled')
        // console.log(isPauseButtonDisabled, 'isPauseButtonDisabled')

        // Updating the button states on the page
        // startBtn.disabled = isStartButtonDisabled;
        // pauseBtn.disabled = isPauseButtonDisabled;
        chrome.storage.local.set(
            {
                timer: 0,
                breakTimer: 0,
                isRunning: false,
                isBreakRunning: false,
                isStartButtonDisabled: false,
                isPauseButtonDisabled: true,
                showbreaktimer: 0,
                showmaintimer: 0,
            },
            // () => {
            //     startBtn.disabled = false;
            //     pauseBtn.disabled = true;
            // }
        );
    });
// });




const closePopUp = document.getElementById('closeMenu');

closePopUp.addEventListener('click', () => {
    window.close();
});

closePopUp.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        window.close();
    }
});


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

    item.addEventListener('keydown', event => {
        // handle Enter key press
        if (event.key === 'Enter') {
            // Trigger the same behavior as the click event
            item.click();
        }
    });
})

const openNewTab = document.getElementById("openNewTab");
openNewTab.addEventListener("click", () => {
    chrome.tabs.create({ 'url': 'exercise.html' }, function (tab) {
        // Tab opened.
    });
});

// // Retrieving the stored values
// chrome.storage.local.get(["isStartButtonDisabled", "isPauseButtonDisabled"], (res) => {
//     const isStartButtonDisabled = res.isStartButtonDisabled;
//     const isPauseButtonDisabled = res.isPauseButtonDisabled;
//     console.log(isStartButtonDisabled, 'isStartButtonDisabled')
//     console.log(isPauseButtonDisabled, 'isPauseButtonDisabled')

//     // Updating the button states on the page
//     startBtn.disabled = isStartButtonDisabled;
//     pauseBtn.disabled = isPauseButtonDisabled;
// });