(function(window) {
    window.addEventListener('DOMContentLoaded', function(event) {

        
    });

/*
    xmlHttpRequst = new XMLHttpRequest();

    // Open Http Request connection
    xmlHttpRequst.open('POST', 'https://plus.google.com/_/communities/gethome?hl=en_GB&ozv=es_oz_20130516.11_p2&avw=str%3A1&fsid=306639255&_reqid=94075329&rt=j', true);
    // Set request header (optional if GET method is used)
    xmlHttpRequst.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // Callback when ReadyState is changed.
    xmlHttpRequst.onreadystatechange = function()
    {
        if (xmlHttpRequst.readyState == 4)
        {
            var json = xmlHttpRequst.responseText.slice(5),
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

            console.log(JSON.parse(output+']'));
        }
    }
    xmlHttpRequst.send('f.req=%5Bfalse%2Cfalse%5D&at=AObGSAjYWIpvgRt7ZBDsnktQJHXsJ4iVuw%3A1368989727252&');
*/
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
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
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
            'commentBoxHeight', 
            'removeScrolls', 
            'fullPostContent', 
            'fullCommentContent', 
            'defaultFont', 
            'fontSize', 
            'slimNav', 
            'commentLinksColor',
            'layoutDefaultColumn',
            'layoutSingleColumn'
        ],
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
                        last.parentNode.insertBefore(div, last.nextSibling);

                        _bind(div, 'click', me.onSettingTabClick);
                    }

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

                                req.option = option;
                                req.value = this.checked;

                                me.sendMessage(req);
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

            _bind('#gpf-layoutDefaultColumnRadio', 'click', function() {                
                var el = _$('#gpf-layoutDefaultColumn');
                var ea = _$('#gpf-layoutSingleColumn');

                if (this.selected) {
                    el.removeAttribute('disabled');
                    el.value = '400';
                    ea.setAttribute('disabled');
                    ea.value = '';
                } else {
                    el.setAttribute('disabled');
                    el.value = '';
                    ea.removeAttribute('disabled');
                    ea.value = '';
                }

                obj = {};
                obj['layoutDefaultColumn'] = el.value;

                chrome.storage.sync.set(obj);

                req.option = 'layoutDefaultColumn';
                req.value = el.value;

                me.sendMessage(req);
            });

            _bind('#gpf-layoutSingleColumnRadio', 'click', function() {                
                var el = _$('#gpf-layoutSingleColumn');
                var ea = _$('#gpf-layoutDefaultColumn');

                if (this.selected) {
                    el.removeAttribute('disabled');
                    el.value = '700';
                    ea.setAttribute('disabled');
                    ea.value = '';
                } else {
                    el.setAttribute('disabled');
                    el.value = '';
                    ea.removeAttribute('disabled');
                    ea.value = '';
                }

                obj = {};
                obj['layoutSingleColumn'] = el.value;

                chrome.storage.sync.set(obj);

                req.option = 'layoutSingleColumn';
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
                                if (list[i] == 'layoutSingleColumn' || list[i] == 'layoutDefaultColumn') {
                                    _$('#gpf-' + list[i] + 'Radio').selected = true;
                                    el.removeAttribute('disabled');
                                }
                                el.value = item[list[i]];
                                break;
                            case 'checkbox':
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
        }
    };

    window.addEventListener('DOMContentLoaded', function(e) {
        gpf.init();
        gpf.appendPanel();
    });

    
})(window);
