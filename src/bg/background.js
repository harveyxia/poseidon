// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


function getData() {
    function callback(tabs) {
        var timestamp = (new Date()).toISOString();
        var data = {};
        data[timestamp] = [];
        tabs.forEach(function(tab) {
            data[timestamp].push({
                    url: tab.url,
                    active: tab.active
                });
            chrome.storage.sync.set(data, debug);
        });
    }
    chrome.tabs.query({active: true}, callback);
}

function debug() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
    } else {
        console.log('Successfully synced.');
    }
}

chrome.alarms.create('schedule', { delayInMinutes: 1, periodInMinutes: 1});

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log('Alarm fired.');
    getData();
});