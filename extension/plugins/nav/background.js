chrome.storage.sync.get('slimNav', function(item) {
    if (item.slimNav) {
        STYLES += ""
            + ".FVPtwe { -webkit-transition: none !important; transition: none !important; }"
            + ".cInFec { -webkit-transition: none !important; transition: none !important; }"
            + ".wH3YRe { margin-left: 0 !important; overflow: visible !important; width: 50px !important; padding-left: 0 !important; }"

            /* labels */
            + ".A9a.bOa { display: none !important; }"
            /* span */
            + ".hAmwye { display: none !important; }"

            /* links */
            + ".cS.xWa > a { height: 34px !important; padding-left: 15px !important; }"
            /* hover on link */
            + ".cS.xWa > a:hover { background: none !important; }"
            + ".cS.xWa:hover .A9a.bOa { display: inline !important; position: absolute !important; z-index: 9999 !important; border-radius: 5px !important; background: #fff !important; padding: 4px 10px !important; }"

            /* footer */
            + ".lZkdDe.pFZ7Ne { display: none !important; }"

            + "#contentPage { margin-left: 60px !important; }"

            /* header with page title */
            + ".IvwRoc.Um8btf { left: 50px !important; }"
    }
});