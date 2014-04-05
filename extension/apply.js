(function() {
  var addStyles, apply, ctx, features, getLastPostButton, getStyles, gifWaterMark, init, onDocumentClick, onNodeInserted, options, processPost, stopGif, styles;

  ctx = this;

  init = function() {
    var div, i, navItem, navItemTmpl, navLast, posts;
    navLast = document.querySelectorAll('.jCd.Ise>div');
    navLast = navLast[navLast.length - 1];
    navItemTmpl = '<div class="jga uVd" isallowskinny="false"> <a tabindex="-1" href="{href}" aria-label="{text}" class="ob oCd BIa" target="_blank"> <div class="wVd"> <div class="nCd vVd gJb aOdVec" style="background: url({icon}) no-repeat"></div> </div> <div class="lCd Hyc">{text}</div> </a> </div>';
    if (navLast) {
      navItem = navItemTmpl.replace(/\{text\}/g, 'GPlusFixer Settings').replace('{icon}', chrome.extension.getURL('ofca-hat-19.png')).replace('{href}', chrome.extension.getURL('options.html'));
      div = document.createElement('div');
      div.innerHTML = navItem;
      div = div.children[0];
      navLast.parentNode.insertBefore(div, navLast.nextSibling);
    }
    document.addEventListener('DOMNodeInserted', onNodeInserted, false);
    document.addEventListener('click', onDocumentClick, false);
    posts = document.querySelectorAll('.Yp.yt.Xa');
    i = posts.length;
    if (i !== 0) {
      while (i--) {
        processPost(posts[i]);
      }
    }
    return null;
  };

  onDocumentClick = function(evt) {
    var aLink, author, bookmark, btn, cnt, commentsNum, content, div, i, url;
    if (evt.target.className.indexOf('gplusfixer-subscribe') !== -1) {
      btn = evt.target.parentNode.parentNode;
      cnt = btn.parentNode.parentNode;
      aLink = cnt.getElementsByClassName('o-U-s');
      i = aLink.length;
      while (i--) {
        if (aLink[i].className === 'o-U-s FI Rg') {
          url = aLink[i].getAttribute('href');
          commentsNum = cnt.getElementsByClassName('Ik').length;
          author = cnt.querySelector('[rel="author"]').innerText;
          content = cnt.querySelector('.Ct');
          if (content) {
            div = document.createElement('div');
            div.innerHTML = content.innerHTML;
            content = div.textContent || div.innerText || '';
            content = content.slice(0, 100) + '...';
          } else {
            content = '';
          }
          bookmark = {};
          bookmark["@" + url] = {
            commentsNum: commentsNum,
            author: author,
            content: content
          };
          chrome.storage.sync.set(bookmark);
          break;
        }
      }
    }
    return null;
  };

  getLastPostButton = function(cnt) {
    var btn;
    btn = cnt.querySelector('.Dg.Ut');
    if (!btn) {
      btn = cnt.querySelector('.esw.eswd.qk.Gc');
    }
    return btn;
  };


  /*
  Freeze GIF images.
  This function create canvas element with first frame image and hide original
  image element.
  
  NOTE: This function requires some styles added to document to show image again
  when mouse is over canvas/image container.
  
  @param {HTMLElement} img Image element from post.
  @return {Null}
   */

  stopGif = function(img) {
    var attr, c, gifImg, h, w, _i, _len, _ref;
    if (!img.complete || typeof img.naturalWidth === 'undefined' || img.naturalWidth === 0) {
      img.onload = function() {
        return stopGif(this);
      };
      return null;
    }
    c = document.createElement('canvas');
    w = c.width = img.naturalWidth;
    h = c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    gifImg = new Image;
    gifImg.src = gifWaterMark;
    c.getContext('2d').drawImage(gifImg, w / 2 - 68, h / 2 - 68);
    _ref = img.attributes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      attr = _ref[_i];
      c.setAttribute(attr.name, attr.value);
    }
    img.parentNode.appendChild(c);
    return null;
  };


  /*
  Process post element and add some cool features (GIF freezing, read later ect.)
  
  @param {HTMLElement} cnt Main post element.
  @return {Null}
   */

  processPost = function(cnt) {
    var btn, btnTmpl, img, lastButton;
    console.log(features.gifStop);
    if (features.gifStop) {
      img = cnt.getElementsByClassName('ar')[0];
      if (img && img.src.indexOf('.gif') === img.src.length - 4) {
        stopGif(img);
      }
    }
    cnt.setAttribute('gplusfixered', 'yes');
    if (features.bookmarks) {
      btnTmpl = '<div class="Dg Ut" role="button" tabindex="0" aria-label="Subscribe this post" data-tooltip="Subscribe this post"><span class="tf"><span class="gplusfixer-subscribe">Sub</span><span class="MM jI"></span></span></div>';
      lastButton = getLastPostButton(cnt);
      if (lastButton) {
        btn = document.createElement('div');
        btn.innerHTML = btnTmpl;
        lastButton.parentNode.insertBefore(btn.children[0], lastButton);
      }
    }
    return null;
  };


  /*
  DOMNodeInserted event hanlder. Checks if inserted node is post (which 
  wasn't yet processed) and process it.
  
  @param {Event} evt Event object.
  @return {Null}
   */

  onNodeInserted = function(evt) {
    if (evt.target && evt.target.className === 'Yp yt Xa' && evt.target.getAttribute('gplusfixered') !== 'yes') {
      processPost(evt.target);
    }
    return null;
  };


  /*
  Return compiled styles for specified option.
  
  @param {String} option Option name.
  @param {Object} repl
  @return {String} Compiled styles
   */

  getStyles = function(option, repl) {
    var needle, string, value;
    if (styles[option] === void 0) {
      console.log('GPlusFixer: Styles for specified option does not exists.');
      return '';
    }
    string = styles[option].join("\n");
    if (repl !== void 0) {
      for (needle in repl) {
        value = repl[needle];
        string = string.replace("{" + needle + "}", value);
      }
    }
    return string;
  };


  /*
  Add styles to document.
  
  @param {String} id Style tag id.
  @param {String} styles CSS rules.
  @return {Null}
   */

  addStyles = function(id, styles) {
    var e;
    e = document.createElement('style');
    e.setAttribute('id', "gplusfixer-" + id);
    e.appendChild(document.createTextNode(styles));
    if (document.head) {
      document.head.appendChild(e);
    } else {
      document.documentElement.appendChild(e);
    }
    return null;
  };


  /*
  Apply GPlusFixer features to website.
  
  @param {String} opt Option name.
  @param {Mixed} value Option value.
  @return {Null}
   */

  apply = function(opt, value) {
    var booleanOpts;
    if (value === '--- Default ---') {
      return null;
    }
    booleanOpts = ['slimNav', 'removeScrolls', 'fullPostContent', 'fullCommentContent', 'stripedComments'];
    if (booleanOpts.indexOf(opt) !== -1) {
      if (value) {
        addStyles(opt, getStyles(opt));
      }
    } else if (opt === 'fontName') {
      addStyles(opt, getStyles(opt, {
        font: value
      }));
    } else if (opt === 'fontSize' && /^[0-9]{2}px$/.test(value)) {
      addStyles(opt, getStyles(opt, {
        size: value
      }));
    } else if (opt === 'linksColor' && /^[0-9]{6}$/.test(value)) {
      addStyles(opt, getStyles(opt, {
        color: value
      }));
    } else if (opt === 'background') {
      if (value[0] === '#') {
        value = value.slice(1, value.length);
      }
      if (/^[0-9]{6}|[0-9]{3}$/.test(value)) {
        value = "\#" + value;
      } else {
        value = "url(" + value + ")";
      }
      addStyles(opt, getStyles(opt, {
        bg: value
      }));
    } else if (opt === 'gifStop') {
      features.gifStop = value;
      if (value) {
        addStyles('gifStop', getStyles('gifStop'));
      }
    }
    return null;
  };

  gifWaterMark = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIkAAACJCAYAAAAYJBvJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEEyQzZENEVCQ0JCMTFFMzk0NDdCNUI2MjBBNUVBMDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEEyQzZENEZCQ0JCMTFFMzk0NDdCNUI2MjBBNUVBMDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QTJDNkQ0Q0JDQkIxMUUzOTQ0N0I1QjYyMEE1RUEwOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QTJDNkQ0REJDQkIxMUUzOTQ0N0I1QjYyMEE1RUEwOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkXpKsMAAA0VSURBVHja7J05c1zH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';

  styles = {
    'slimNav': [".Msd.Fge.Ide { margin-left: 0px !important; width: 45px !important; padding-left: 0px !important;  position: fixed !important; left: 0px !important; top: 120px !important; padding-top: 10px !important; overflow: visible !important; opacity: 1 !important; }", ".Msd.Fge.Ide .ob { padding: 0 !important; height: auto !important; width: 100% !important; text-align: center !important; }", ".Msd.Fge.Ide .lCd { display: none !important; position: absolute !important; top: 2px !important; background: #fff !important; left: 30px !important; padding: 5px 10px !important; }", ".Msd.Fge.Ide .wVd { padding: 6px 0; }", ".Msd.Fge.Ide .ob:hover .lCd { display: block !important; }", ".Msd.Fge.Ide .xVd { display: none; }", ".Dge.fOa.vld, .Msd.Fge.Ide .Hge.Lde { display: none !important; }", ".jga.uVd:last-child { padding-bottom: 10px !important; }"],
    'removeScrolls': [".Ypa .lC { max-height: none !important; }", ".EB { max-height: inherit !important; }", ".tO { overflow-y: visible !important; }"],
    'fullPostContent': [".Bt.Pm { max-height: inherit !important; }", ".d-s.Yv.on.gj, .d-s.Xv.zt.HH.gj[role='button'] { display: none !important; }"],
    'fullCommentContent': ['.Aq.DK.Bt.UR.gA { max-height: inherit !important; }', '.d-s.nq.on.dp, .d-s.mq.dp[role="button"] { display: none; }'],
    'fontName': ["body, .Ct { font-family: '{font}' !important; }"],
    'fontSize': ["body, .Ct { font-size: {size} !important; }"],
    'linksColor': [".ot-anchor, .d-s.PM.uh, .w1 .proflink, .va .proflink, .va .d-s.FM.hm { color: \#{color} !important; }"],
    'background': [".Ypa.jw.Ic.am, .Oza.t3, #content, .fZa.vcard, .Bha { background: none !important; }", ".CF.he { background: {bg} !important; background-size: 100% !important; background-attachment: fixed !important; }", '.fa-Neb.aIb { background: none !important; }'],
    'stripedComments': ['.JK > .Ik.Wv > div { padding-top: 10px !important; padding-bottom: 10px !important; }', '.JK > .Ik.Wv:nth-child(2n) > div { background: rgba(255, 255, 255, .9) !important; }'],
    'gifStop': ['.sp.ej img[src$=".gif"] { display: none !important; }', '.sp.ej:hover img { display: block !important; }', '.sp.ej:hover canvas { display: none !important; }']
  };

  options = ['slimNav', 'fullPostContent', 'fullCommentContent', 'removeScrolls', 'fontName', 'fontSize', 'linksColor', 'background', 'stripedComments', 'gifStop'];

  features = {
    gifStop: false,
    bookmarks: false
  };

  chrome.storage.local.get(options, function(options) {
    var option, value;
    for (option in options) {
      value = options[option];
      apply(option, value);
    }
    init();
    return null;
  });

}).call(this);
