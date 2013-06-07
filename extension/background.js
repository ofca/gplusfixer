chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.tabs.getSelected(null, function(tab) {
        var o = {};
        o.method = request.method;
        o.option = request.option;
        o.value = request.value;
        chrome.tabs.sendMessage(tab.id, o);
    });
});
