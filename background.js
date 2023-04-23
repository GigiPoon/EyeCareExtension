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
        createAlarm(Number(myTime));
    }
    sendResponse({ status: true });
});

function createAlarm(myTime) {
    chrome.alarms.create('rest_eyes', {
        delayInMinutes: myTime,
        periodInMinutes: myTime,
    });
}
