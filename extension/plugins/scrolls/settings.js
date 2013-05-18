(function() {
    var el = nano.$('?#scrolls input[type=checkbox]')[0];

    // Save changes on checkbox click
    nano.bind(el, 'click', function(e) {
        chrome.storage.sync.set({'scrollsRemove': e.target.checked}, showInfo);
    });

    // Load settings
    chrome.storage.sync.get('scrollsRemove', function(item) {
        if (item.scrollsRemove) {
            el.setAttribute('checked');
        }
    });
})();

