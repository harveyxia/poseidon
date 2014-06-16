var windowId;
var changed = false;

chrome.windows.onFocusChanged.addListener(function(windowId) {
    changed = true;
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs){
        console.log(tabs[0].url);
    });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    if (changed) {
        changed = false;
    } else {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs){
            console.log(tabs[0].url);
        });
    }
});