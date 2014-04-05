(function(window) {

    //console.log('Test: ', localStorage.getItem('gplusfixer'));
    console.log('!!!!!!!!!!!: ');
    chrome.storage.local.get(['gplusfixer2'], function() {
        console.log(arguments);
    })
    function _$(s, c) {
        var m = {
            '#': 'ById',
            '.': 'sByClassName',
            '@': 'sByName',
            '=': 'sByTagName'}[s[0]];
        return (c||document)[m?'getElement'+m:'querySelectorAll'](s.slice(1))
    };

    /**
     * Alias for document.querySelect.
     * @param  {String} s Expression.
     * @return {DOMElement}
     */
    _qs = function(s) {
        return document.querySelector(s);
    };

    function _ajax(o) {
        var xhr = new XMLHttpRequest();

        // Open Http Request connection
        xhr.open(o.method, o.url, true);
        // Set request header (optional if GET method is used)
        if (o.contentType) {
            xhr.setRequestHeader('Content-Type', o.contentType);
        }
        // Callback when ReadyState is changed.
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4)
            {
                o.complete(xhr.responseText);                
            }
        }
        xhr.send(o.data || null);
    };

    function _bind(el, eventName, callback) {
        if (typeof el == 'string') {
            el = _$(el);
        }

        if (Object.prototype.toString.call(el) == '[object Array]') {
            var i = 0,
                len = el.length;

            for (; i < len; i++) {
                el[i].addEventListener(eventName, callback, false);
            }
        } else {
            el.addEventListener(eventName, callback, false);
        }
    };

    var gpf = {
        rendered: false,
        dom: {
            body: null,
            head: null
        },
        visible: false,
        fieldsToAutosave: [
            'removeScrolls', 
            'fullPostContent', 
            'fullCommentContent', 
            'defaultFont', 
            'fontSize', 
            //'slimNav', 
            'commentLinksColor'
            //'slimNavCommunitiesWidget'
        ],
        communitiesWidgetTimeout: null,
        init: function() {
            gpf.dom.body = _$('=body')[0];
            gpf.dom.head = _$('=head')[0];

            return gpf;
        },
        appendPanel: function() {
            var me = gpf;

            if (me.rendered) {
                return true;
            }

            // First append styles
            var el = document.createElement('link');
            el.setAttribute('id', 'gplusfixer-ui');
            el.setAttribute('type', 'text/css');
            el.setAttribute('rel', 'stylesheet');
            el.setAttribute('href', chrome.extension.getURL('styles.css'));
            me.dom.head.appendChild(el);

            _ajax({
                method: 'GET',
                url: chrome.extension.getURL('ui.html'),
                complete: function(output) {
                    output = output.replace('{ofca-hat-48}', chrome.extension.getURL('ofca-hat-48.png'));

                    el = document.createElement('div');
                    el.id = 'gplusfixer-ui';
                    el.innerHTML = output;
                    me.dom.body.appendChild(el);
                    me.dom.wrapper = el;

                    // Add settings button to left nav
                    var last = document.querySelector('div[guidedhelpid="ribbon_settings"]');

                    if (last) {
                        var tmpl = _$('#tmplGPlusFixerNavLink')
                                        .innerHTML
                                        .replace(/\{text\}/g, 'GPlusFixer Settings')
                                        .replace('{icon}', chrome.extension.getURL('ofca-hat-19.png'));

                        var div = document.createElement('div');
                        div.innerHTML = tmpl;
                        div = div.children[0];
                        last.parentNode.insertBefore(div, last.nextSibling);

                        _bind(div, 'click', me.onSettingTabClick);
                    }

                    // Remove nav footer
                    var footer = document.querySelector('.xpd.Rce > .Tce.W9d');
                    if (footer) footer.parentNode.removeChild(footer);

                    me.rendered = true;

                    me.bindUI();
                    me.getValuesForUI();
                }
            });
        },
        bindUI: function() {
            var me = gpf,
                list = me.fieldsToAutosave,
                i = 0,
                len = list.length, el, obj, 
                req = { method: 'optionChanged' }, option;

            for (; i < len, item = list[i]; i++) {
                el = _qs('*[data-autosave='+item+']');

                if (el) {            

                    switch (el.type) {
                        case 'select-one':
                        case 'text':
                            _bind(el, 'change', function() {
                                option = this.getAttribute('data-autosave');
                                obj = {};               
                                obj[option] = this.value;

                                chrome.storage.sync.set(obj);

                                req.option = option;
                                req.value = this.value;

                                me.sendMessage(req);
                            });
                            break;
                        case 'checkbox':
                            _bind(el, 'click', function() {
                                option = this.getAttribute('data-autosave');
                                obj = {};
                                obj[option] = this.checked;

                                chrome.storage.sync.set(obj);

                                // Do not apply any styles
                                /*if (option == 'slimNavCommunitiesWidget') {
                                    if (this.checked) {
                                        me.getCommunities();
                                    } else {
                                        var _tmp = _qs('div[guidedhelpid="ribbon_communities"] div.A9a.bOa');
                                        _tmp.innerHTML = 'Communities';
                                        _tmp.className = 'A9a bOa';
                                        clearTimeout(me.communitiesWidgetTimeout);
                                        me.communitiesWidgetTimeout = null;
                                    }
                                    return;
                                }*/

                                req.option = option;
                                req.value = this.checked;

                                me.sendMessage(req);

                                // Communities widget checkbox enable/disable
                                if (option == 'slimNav') {
                                    if (this.checked) {
                                        _$('#gpf-slimNavCommunitiesWidget').removeAttribute('disabled');
                                    } else {
                                        var _tmp = _$('#gpf-slimNavCommunitiesWidget')
                                        _tmp.setAttribute('disabled', 'disabled');
                                        _tmp.checked = false;
                                        chrome.storage.sync.set({'slimNavCommunitiesWidget':false});
                                    }
                                }
                            });
                            break;
                    }
                }
            }

            _bind('#gpf-commentChangeLinksColor', 'click', function() {                
                var el = _$('#gpf-commentLinksColor');

                if (this.checked) {
                    el.removeAttribute('disabled');
                    el.value = '427fed';
                } else {
                    el.setAttribute('disabled');
                    el.value = '';
                }

                obj = {};
                obj['commentLinksColor'] = el.value;

                chrome.storage.sync.set(obj);

                req.option = 'commentLinksColor';
                req.value = el.value;

                me.sendMessage(req);
            });

            // Bind close button
            _bind('#gpf-close', 'click', me.onSettingTabClick);
        },
        getValuesForUI: function() {
            var me = gpf,
                list = me.fieldsToAutosave,
                len = list.length
                i = 0;
            chrome.storage.sync.get(list, function(item) {
                for (; i < len; i++) {
                    if (item[list[i]]) {
                        var el = _qs('*[data-autosave='+list[i]+']');

                        switch (el.type) {
                            case 'text':
                                // Check checkbox
                                if (list[i] == 'commentLinksColor') {
                                    _$('#gpf-commentChangeLinksColor').checked = true;
                                    el.removeAttribute('disabled');
                                }
                              
                                el.value = item[list[i]];
                                break;
                            case 'checkbox':
                                /*if (list[i] == 'slimNavCommunitiesWidget' && item[list[i]] == true) {
                                    var _tmp = _$('#gpf-slimNavCommunitiesWidget');
                                    _tmp.removeAttribute('disabled');
                                    _tmp.checked = true;
                                    me.getCommunities();
                                }*/
                                el.checked = true;
                                break;
                            case 'select-one':
                                var j = 0,
                                    els = _$('=option', el),
                                    _len = els.length;

                                for (; j < _len; j++) {
                                    if (els[j].value == item[list[i]]) {
                                        el.selectedIndex = j;
                                    }
                                }
                                break;
                        }
                    }
                }
            });
        },
        applyStyles: function(id, styles) {
            var styleElement = document.createElement("style");
            styleElement.setAttribute("id", "gplusfixer-" + id);
            styleElement.setAttribute("type", "text/css");
            styleElement.appendChild(document.createTextNode(styles));

            if (document.head) {
                document.head.appendChild(styleElement);
            } else {
                document.documentElement.appendChild(styleElement);
            }
        },
        onSettingTabClick: function(e) {
            var me = gpf;

            e.stopPropagation();
            e.preventDefault();

            if (me.visible) {
                me.dom.wrapper.style.bottom = '-440px';
                me.visible = false;
            } else {
                me.dom.wrapper.style.bottom = '0px';
                me.visible = true;
            }
        },
        sendMessage: function(o) {
            chrome.extension.sendMessage(o); 
        },
        getCommunities: function() {
            var me = gpf;
            var _tmp = _qs('div[guidedhelpid="ribbon_communities"] div.A9a.bOa');
            _tmp.innerHTML = 'Communities';
            _tmp.className = 'A9a bOa';
            // @todo Simplify below code.
            // https://plus.google.com/u/0/communities returning what we need -
            // some regex would be enough to get JSON object from page content.
            // Second ajax request is not required (but now it's easier for get
            // JSON object)
            _ajax({
                method: 'GET',
                url: 'https://plus.google.com/u/0/communities',
                complete: function(response) {
                    var at = null;

                    if (/csi\.gstatic\.com/.test(response)) {
                        at = response.match(/csi\.gstatic\.com\/csi","([^"]+)/)[1];
                    }

                    if (at) {
                        _ajax({
                            method: 'POST',
                            url: 'https://plus.google.com/_/communities/gethome',
                            data: 'f.req=%5Bfalse%2Cfalse%5D&at='+at+'&',
                            contentType: 'application/x-www-form-urlencoded',
                            complete: function(response) {
                                var json = response.slice(5),
                                    instring = false,
                                    inescape = false,
                                    lastChar = '',
                                    output = '',
                                    ch = '';

                                for (var i = 0; i < json.length-1; i++) {
                                    ch = json[i];

                                    if (!instring && /\s/.test(ch)) {
                                        continue;
                                    }

                                    if (instring) {
                                        if (inescape) {
                                            output += ch;
                                            inescape = false;
                                        } else if (ch == '\\') {
                                            output += ch;
                                            inescape = false;
                                        } else if (ch == '"') {
                                            output += ch;
                                            instring = false;
                                        } else {
                                            output += ch;
                                        }
                                        lastChar = ch;
                                        continue;
                                    }

                                    switch (ch) {
                                        case '"':
                                            output += ch;
                                            instring = true;
                                            break;
                                        case ',':
                                            if (lastChar == ',' || lastChar == '[' || lastChar == '{') {
                                                output += 'null';
                                            }
                                            output += ch;
                                            break;
                                        case ']':
                                        case '}':
                                            if (lastChar == ',') {
                                                output += 'null';                            
                                            }
                                            output += ch;
                                            break;
                                        default:
                                            output += ch;
                                            break;
                                    }
                                    lastChar = ch;
                                }
                                
                                var data = JSON.parse(output+']'),
                                    communities = data[0][5],
                                    item, community, newNum = 0, id, name, imageUrl,
                                    i = 0, len = communities.length,
                                    cnt = _qs('div[guidedhelpid="ribbon_communities"] div.A9a.bOa');

                                for (; i < len; i++) {
                                    item = communities[i][0];
                                    community = item[0];
                                    newNum = item[4][1];
                                    id = community[0];
                                    name = community[1][0];
                                    imageUrl = community[1][3];

                                    if (newNum > 0) {
                                        cnt.innerHTML += '<a href="communities/'+id+'"><img src="'+imageUrl+'" class="gpf-community-widget-img" /><span class="gpf-community-widget-name">'+name+'</span><span class="gpf-community-widget-num">'+newNum+'</span></a>';
                                    }
                                }

                                cnt.className += ' gpf-community-widget';
                                _qs('.FW9qdb.F9a.SX').setAttribute('alt', 'Communities');

                                setTimeout(function() { me.getCommunities(); }, 30000);
                            }
                        });
                    }
                }
            });
        }
    };

    window.addEventListener('DOMContentLoaded', function(e) {
        gpf.init();
        gpf.appendPanel();
    });

    
})(window);
