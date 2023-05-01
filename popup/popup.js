const setAlarmButton = document.getElementById('btn-alarm');
const selectTimeButton = document.getElementById('select-time');
let selectedTime = '';
let delayedTime = 20;

const settingsButton = document.querySelectorAll('.settingsButton')
const frontpage = document.getElementById('frontpage')
const backpage = document.getElementById('backpage')
const checkbox = document.getElementById('checkbox')
const closePopUp = document.getElementById('closeMenu')



closePopUp.addEventListener('click', ()=> {
    window.close();
})

document.querySelectorAll('.settingsButton').forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        if (frontpage) {
            if (checkbox.checked) {
                checkbox.checked = false;
                console.log(checkBox.checked)
            }
            else {
                checkbox.checked = true;
            }
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
            clearInterval(countDown) //repeat/not repeat

            timeSecond = selectedTime * 60
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

