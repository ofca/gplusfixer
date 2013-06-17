var styles = {
    'slimNav': [
        ".FVPtwe { -webkit-transition: none !important; transition: none !important; }",
        ".cInFec { -webkit-transition: none !important; transition: none !important; }",
        ".wH3YRe { margin-left: 0 !important; overflow: visible !important; width: 50px !important; padding-left: 0 !important; }",

        /* labels */
        ".A9a.bOa { display: none !important; }",
        /* span */
        ".hAmwye { display: none !important; }",

        /* links */
        ".cS.xWa > a { height: 34px !important; padding-left: 15px !important; }",
        /* hover on link */
        ".cS.xWa > a:hover { background: none !important; }",
        ".cS.xWa:hover .A9a.bOa { display: inline !important; position: absolute !important; z-index: 9999 !important; border-radius: 5px !important; background: #fff !important; padding: 4px 10px !important; }",

        /* footer */
        ".lZkdDe.pFZ7Ne { display: none !important; }",

        "#contentPage { margin-left: 60px !important; }",

        /* header with page title */
        ".IvwRoc.Um8btf { left: 50px !important; }",

        /* Remove shadow */
        ".M8jNpf { box-shadow: none !important; }"
    ],
    'removeScrolls': [
        /* Notification window scroll */
        /* First expression is for normal post*/
        ".CLSMk { max-height: none !important; }",
        // This is for 3-column wide posts 
        ".qf.ii.wv4ec.r6Rtbe .CLSMk { max-height: 100px !important; }"
    ],
    'fullPostContent': [
        /* post content */
        ".WamaFb.DIcL3e { max-height: inherit !important; }",
        /* "read more" button in post */
        ".a-n.fE.syxni.JBNexc { display: none !important; }",
    ],
    'fullCommentContent': [
        /* comment content */
        ".Mi.Vp.WamaFb.Gw.Gm { max-height: none !important; }",

        /* comment "read more" */
        ".a-n.wj.syxni.unQkyd[role=button], .a-n.vj.unQkyd[role=button] { display: none !important; }",
    ],
    'commentBoxHeight': [
        ".yd.editable[role=textbox] { max-height: {height}px !important; }"
    ],
    'defaultFont': [
        "body { font-family: '{font}' !important; }"
    ],
    'fontSize': [
        "body, .vFgtwf { font-size: {size}px !important; }"
    ],
    'commentLinksColor': [
        ".WamaFb a { color: #{color} !important; }"
    ],
    'layoutDefaultColumn': [
        ".qyoDxe.v2DU7e { width: {layoutWidth}px !important; }",
        ".HTAwOd.RbrTP.PMortc { width: {contentWidth2}px !important; }",
        ".HTAwOd.RbrTP.cB8ykb { width: {contentWidth3}px !important; }",
        ".HTAwOd .Pw3i3b.ee3yFe { width: {boxWidth}px !important; }"
    ],
    'layoutSingleColumn': [
        // Remove left margin from posts in columns
        ".wIa.LP.ad .XkmQbb+.XkmQbb { margin-left: 0 !important; }",
        ".wIa.LP.ad .HTAwOd.RbrTP.PMortc { width: {width}px !important; }",
        ".wIa.LP.ad .oeIGR { width: {width}px !important; }",
        ".wIa.LP.ad .uBFlYd.EyKftc { width: {widthInput}px !important; max-width: none !important; }",
        ".HTAwOd .Pw3i3b.ee3yFe { width: {width}px !important; }",
        // Communities view
        ".VsujAd { width: 100% !important; }",
        ".HTAwOd.RbrTP.cB8ykb { width: {width}px !important; }",
        ".qyoDxe.v2DU7e { width: {widthMain}px !important }",
        // Fix for "big post"
        ".ChZ7Rc .cuuzrf { border-top: 6px solid #d6d6d6 !important; border-left: 6px solid #d6d6d6 !important; border-right: 6px solid #d6d6d6 !important; margin-right: 0px !important; min-height: auto !important; padding-right: 0px !important; }",
        ".ChZ7Rc .RJekRd { width: {bigPostWidth}px !important; min-height: auto !important; float: left !important; border-left: 6px solid #d6d6d6 !important; border-right: 6px solid #d6d6d6 !important; border-bottom: 6px solid #d6d6d6 !important; bottom: 0 !important; max-width: inherit !important; position: relative !important; right: 0 !important; top: 0 !important; }",
        ".ChZ7Rc .GFyXvc { bottom: none !important; left: none !important; right: none !important; opacity: 1 !important; position: relative !important; top: none !important; visibility: visible !important; }",
        ".ChZ7Rc .by0y2e { position: relative !important; }",
        ".ChZ7Rc .qf.ii.wv4ec.r6Rtbe .CLSMk { max-height: inherit !important; }",
        /* Fix for "new post notification" (this little blue button) */
        /*".Ri07Rc.c-b { height: 40px !important; min-height: inherit !important; min-width: inherit !important; width: 100px !important; }",
        ".Ri07Rc.c-b .F0INOe { width: 40px !important; float: left !important; margin: 10px 10px 0px 10px; }",
        ".Ri07Rc.c-b { margin: 12px 5px 5px 5px !important; }"*/
    ]
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == 'optionChanged') {
        _apply(request.option, request.value);
    }
});

// Load
var list = ['commentBoxHeight', 'removeScrolls', 'fullPostContent', 'fullCommentContent', 'defaultFont', 'fontSize', 
            'slimNav', 'commentLinksColor', 'layoutDefaultColumn', 'layoutSingleColumn'],
    len = list.length
    i = 0;
chrome.storage.sync.get(list, function(item) {
    for (; i < len; i++) {
        var option = list[i],
            value = item[option];

        if (value === [][0]) {
            continue;
        }

        _apply(option, value);
    }
});

applyStyles('common', '.q9a.fdb[role=region] { outline: none !important; }');

function _apply(option, value) {
    // Checkbox like options
    if (['slimNav', 'removeScrolls', 'fullPostContent', 'fullCommentContent']
        .indexOf(option) != -1) {
        if (value == false) {
            removeStyles(option);
        } else {
            applyStyles(option, styles[option].join("\n"));
        }
    } else if (option == 'commentBoxHeight') {
        applyStyles('commentBoxHeight', styles.commentBoxHeight.join("\n").replace('{height}', parseInt(value)));
    } else if (option == 'defaultFont') {
        applyStyles('defaultFont', styles.defaultFont.join("\n").replace('{font}', value));
    } else if (option == 'fontSize') {
        applyStyles('fontSize', styles.fontSize.join("\n").replace('{size}', parseInt(value)));
    } else if (option == 'commentLinksColor') {
        if (value == '') {
            removeStyles(option);          
        } else {
            applyStyles(option, styles[option].join("\n").replace('{color}', value));
        }
    } else if (option == 'layoutDefaultColumn') {
        if (value == '') {
            removeStyles(option);            
        } else {
            value = parseInt(value);
            applyStyles(option, 
                styles[option]
                .join("\n")
                .replace('{layoutWidth}', (value * 2 + 134))
                .replace('{contentWidth2}', (value * 2 + 20))
                .replace('{contentWidth3}', (value * 3 + 40))
                .replace('{boxWidth}', value)
            );
        }
    } else if (option == 'layoutSingleColumn') {
        if(value == '') {
            removeStyles(option);
        } else {
            value = parseInt(value);
            applyStyles(option, styles[option]
                .join("\n")
                .replace('{width}', value)
                .replace('{width}', value)
                .replace('{width}', value)
                .replace('{width}', value)
                .replace('{bigPostWidth}', value - 14)
                .replace('{widthMain}', value + 134)
                .replace('{widthInput}', value - 40)
            );
        }
    }
};

function applyStyles(id, styles) {
    if (document.getElementById('gplusfixer-'+id)) {
        removeStyles(id);
    }
    var e = document.createElement("style");
    e.setAttribute("id", "gplusfixer-" + id);
    e.setAttribute("type", "text/css");
    e.appendChild(document.createTextNode(styles));

    if (document.head) {
        document.head.appendChild(e);
    } else {
        document.documentElement.appendChild(e);
    }
};

function removeStyles(id) {
    var e = document.getElementById('gplusfixer-' + id);
    if (e) {
        e.parentNode.removeChild(e);
    }
};