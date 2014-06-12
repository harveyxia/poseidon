function debug() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
    } else {
        console.log('Successfully synced.');
    }
}

function createAlarm(freq) {
    chrome.alarms.create('schedule', { delayInMinutes: 1, periodInMinutes: freq});
}

function initAlarm(task) {
    chrome.alarms.onAlarm.addListener(function (alarm) {
        console.log('Alarm fired.');
        task();
    });
}

function collectData() {
    chrome.windows.getAll( {populate: true}, function(windows) {
        var timestamp = (new Date()).toISOString();
        var data = {};
        data[timestamp] = [];
        windows.forEach(function(window) {
            window.tabs.forEach(function(tab) {
                data[timestamp].push({
                        url: tab.url,           // sanitize URL for hostname
                        active: tab.active
                    });
            });
        });
        chrome.storage.sync.set(data, debug);
    });
}

function init() {
    createAlarm(1);
    initAlarm(collectData);
    chrome.browserAction.onClicked.addListener(function(tab) {
      chrome.tabs.create({'url': chrome.extension.getURL('vis.html')}, function(tab) {
        // Tab opened.
      });
    });
}

init();