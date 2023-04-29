chrome.alarms.onAlarm.addListener(() => {
    chrome.notifications.create(
        {
            type: 'basic',
            iconUrl: 'images/alarm.jpg',
            title: 'Rest your eyes buddy',
            message: 'Stare at something that is 200 meters away',
            silent: false,
        },
        () => { }
    );
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const myTime = request.time;
    if (myTime) {
        chrome.alarms.clear('rest_eyes')
        createAlarm(Number(myTime));
    }
    // if () {
    //     chrome.alarms.clear('rest_eyes')
    // }
    sendResponse({ status: true });
});

function createAlarm(myTime) {
    chrome.alarms.create('rest_eyes', {
        delayInMinutes: myTime,
        periodInMinutes: myTime,
    });
}

// function clearAlarm() {
//     chrome.alarms.clear('rest_eyes', {

//     });
// }
