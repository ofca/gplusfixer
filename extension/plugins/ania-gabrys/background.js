var keys = ['removeScrolls', 'fullPostContent', 'fullCommentContent', 'commentBoxHeight', 'defaultFont', 'fontSize'];

// Load settings
chrome.storage.sync.get(keys, function(item) {
    if (item.removeScrolls) {
        /* notification window scroll */
        STYLES += ".O7.mP.CLSMk { max-height: inherit !important; }\n";
    }

    if (item.fullPostContent) {
        /* post content */
        STYLES += ".WamaFb.DIcL3e { max-height: inherit !important; }\n"; 

        /* "read more" button in post */
        STYLES += ".a-n.fE.syxni.JBNexc { display: none !important; }\n";
    }

    if (item.fullCommentContent) {
        /* comment content */
        STYLES += ".Mi.Vp.WamaFb.Gw.Gm { max-height: inherit !important; }\n";

        /* comment "read more" */
        STYLES += ".a-n.wj.syxni.unQkyd[role=button], .a-n.vj.unQkyd[role=button] { display: none !important; }";
    }

    if (item.commentBoxHeight) {
        /* comment textarea */
        STYLES += ".yd.editable[role=textbox] { max-height: "+item.commentBoxHeight+"px !important; }\n";
    }

    if (item.defaultFont) {
        STYLES += "body { font-family: '"+item.defaultFont+"' !important; }\n";
    }

    if (item.fontSize) {
        STYLES += "body, .vFgtwf { font-size: "+item.fontSize+"px !important; }\n";
    }
});






