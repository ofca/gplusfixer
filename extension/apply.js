var styles = {
    'slimNav': [
        ".b-K.b-K-Xb.yld { margin-left: 0px !important; width: 45px !important; padding-left: 0px !important;  position: fixed !important; left: 0px !important; top: 120px !important; height: 390px !important; border-radius: 0px 6px 6px 0px !important; padding-top: 10px !important; overflow: visible !important; }",
        // <a> element
        ".b-K.b-K-Xb.yld .ob { padding: 0 !important; height: auto !important; width: 100% !important; text-align: center !important; }",
        ".b-K.b-K-Xb.yld .lCd { display: none !important; position: absolute !important; top: 2px !important; background: #fff !important; left: 30px !important; padding: 5px 10px !important; }",
        ".b-K.b-K-Xb.yld .wVd { padding: 6px 0; }",
        ".b-K.b-K-Xb.yld .ob:hover .lCd { display: block !important; }",
        // Separator line
        ".b-K.b-K-Xb.yld .xVd { display: none; }",
        ".b-K.b-K-Xb.yld .HRd { display: inline-block !important; padding: 6px 10px !important; height: auto !important; }",
        ".Dge.fOa.vld, .Hge.Lde.Ald { display: none !important; }"
    ],
    'removeScrolls': [
        /* Notification window scroll */
        /* First expression is for normal post*/
        ".lC { max-height: none !important; }",
        // This is for 3-column wide posts 
        ".qf.ii.wv4ec.r6Rtbe .CLSMk { max-height: 100px !important; }",
        // comments scrollbar
        ".EB { max-height: inherit !important; }",
        ".tO { overflow-y: visible !important; }"
    ],
    'fullPostContent': [
        /* post content */
        ".Bt.Pm { max-height: inherit !important; }",
        /* "read more" button in post */
        ".d-s.Yv.on.gj, .d-s.Xv.zt.HH.gj[role='button'] { display: none !important; }",
    ],
    'fullCommentContent': [
        // comment content
        '.Aq.DK.Bt.UR.gA { max-height: inherit !important; }',
        '.d-s.nq.on.dp, .d-s.mq.dp[role="button"] { display: none; }'
    ],
    'defaultFont': [
        "body, .Ct { font-family: '{font}' !important; }"
    ],
    'fontSize': [
        "body, .Ct { font-size: {size}px !important; }"
    ],
    'commentLinksColor': [
        ".ot-anchor { color: #{color} !important; }"
    ]
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == 'optionChanged') {
        _apply(request.option, request.value);
    }
});

// Load
var list = ['removeScrolls', 'fullPostContent', 'fullCommentContent', 'defaultFont', 'fontSize', 
            /*'slimNav',*/ 'commentLinksColor'],
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

_apply('slimNav', true);
applyStyles('common', '.q9a.fdb[role=region] { outline: none !important; }');

/* -- FUNCTIONS DEFINITIONS -- */

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