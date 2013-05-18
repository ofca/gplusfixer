var body = document.getElementsByTagName('body')[0];

microAjax(
    chrome.extension.getURL('plugins.json'), 
    function(response) {
        GPF_PLUGINS = JSON.parse(response);

        // load all plugins
        _load(0);
    }
);



/**
 * Simple plugins loader (only for developing purpose).
 */
function _load(i) {
    if (GPF_PLUGINS[i] != [][0]) {
        var item = GPF_PLUGINS[i], time = new Date().getTime();

        microAjax(
            chrome.extension.getURL('plugins/'+item+'/settings.html?nocache=' + time), 
            function(response) {
                document.getElementById('gpf-options').innerHTML += response;

                var script= document.createElement('script');
                script.type= 'text/javascript';
                script.src= chrome.extension.getURL('plugins/'+item+'/settings.js?nocache=' + time);
                body.appendChild(script);

                if (GPF_PLUGINS[i+1] != [][0]) {
                    _load(i+1);
                }
            }
        );
    }
};