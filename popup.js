const setAlarmButton = document.getElementById('btn-alarm');
const selectTimeButton = document.getElementById('select-time');
let selectedTime = '';

selectTimeButton.addEventListener('click', () => {
    const selectedTimeOption = document.getElementById('time-options');
    selectedTime = selectedTimeOption.value;

    let timeSecond = selectedTime * 60;
    console.log(timeSecond, 'timeSecond')

    const countDown = setInterval(() => {

        // timeH.innerHTML = `00:${timeSecond}`;
        timeSecond--;
        displayTime(timeSecond);
        if (timeSecond <= 0 || timeSecond < 1) {

            timeSecond = selectedTime * 60
            // clearInterval(countDown)

        }
    }, 1000)

    function displayTime(second) {
        const timeH = document.querySelector('h2');
        const min = Math.floor(second / 60);
        const sec = Math.floor(second % 60);
        timeH.innerHTML = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`
    }

    function endTime() {
        timeH.innerHTML = 'Times up'
    }

    if (!selectedTime) {
        console.log('Please select a time!');
        return;
    }
    chrome.runtime.sendMessage({ time: selectedTime }, function (response) { });
});


