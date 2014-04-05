(function() {
  var btn, btnTmpl, check, createList, e, getUrls, hideBookmarksList, onBtnClick, ringBtn, styles, urls;

  urls = [];

  getUrls = function() {
    urls = [];
    chrome.storage.sync.get(null, function(items) {
      var bookmark, key, url;
      console.log(items);
      for (key in items) {
        bookmark = items[key];
        if (key[0] !== '@') {
          continue;
        }
        url = key.slice(1);
        urls.push({
          url: url,
          commentsNum: bookmark.commentsNum,
          author: bookmark.author,
          content: bookmark.content
        });
      }
      createList();
      check(0);
      return null;
    });
    return null;
  };

  createList = function() {
    var bookmark, cnt, list, _i, _len;
    cnt = document.getElementById('gplusfixerSubsList');
    list = '';
    for (_i = 0, _len = urls.length; _i < _len; _i++) {
      bookmark = urls[_i];
      list += "<li data-url='" + bookmark.url + "'> <span class='gpf-remove'>x</span> <a class='gpfb-link' href='" + bookmark.url + "' target='_blank'> <span class='gpf-author'>" + bookmark.author + "</span> <span class='gpf-content'>" + bookmark.content + "</span> </a> </li>";
    }
    cnt.innerHTML = list;
    return null;
  };

  check = function(index) {
    var url, xhr;
    if (urls[index] === void 0) {
      setTimeout(getUrls, 5000);
      return null;
    }
    url = urls[index].url;
    xhr = new XMLHttpRequest;
    xhr.onreadystatechange = function(e) {
      var li, num;
      if (xhr.readyState === 4 && xhr.status === 200) {
        num = xhr.responseText.match(/class\="Ik Wv"/g).length;
        if (urls[index].commentsNum !== num) {
          li = document.getElementById('gplusfixerSubsList').querySelector("[data-url='" + urls[index].url + "']");
          if (li) {
            li.className = 'gpf-new';
            document.getElementById('gplusfixerSubsBtn').style.color = 'red';
          }
        }
        check(index + 1);
      }
      return null;
    };
    xhr.open('GET', "https://plus.google.com/" + url);
    return xhr.send();
  };

  styles = '#gplusfixerSubsBtn { font-weight: bold; padding: 5px 10px; margin-left: 12px; border: 1px solid #e6e6e6; top: 3px; position: relative; position: relative; } #gplusfixerSubsListContainer { background: #fff; padding: 20px; max-height: 300px; overflow-y: scroll; overflow-x: hidden; position: absolute; z-index: 9999; width: 400px; left: -200px; top: 25px; } #gplusfixerSubsList { list-style: none; padding: 0; margin: 0; width: 400px; } #gplusfixerSubsList li { padding: 5px 0; border-bottom: 1px solid #e6e6e6; } #gplusfixerSubsList li a:hover, #gplusfixerSubsList li a:hover span { text-decoration: none; } .gpf-author { font-weight: bold; padding-right: 10px; } .gpf-content { font-weight: normal; color: gray; white-space: normal; } .gpf-new .gpf-author { color: #D30000; } .gpf-remove { padding: 5px; margin-right: 10px; }';

  e = document.createElement('style');

  e.setAttribute('id', "gplusfixer-bookmarks-list");

  e.appendChild(document.createTextNode(styles));

  if (document.head) {
    document.head.appendChild(e);
  } else {
    document.documentElement.appendChild(e);
  }

  ringBtn = document.querySelector('.gb_La.gb_Va.gb_k');

  if (ringBtn) {
    btnTmpl = '<a id="gplusfixerSubsBtn">Subs <div id="gplusfixerSubsListContainer" style="display: none"> <ul id="gplusfixerSubsList"></ul> </div> </a>';
    btn = document.createElement('div');
    btn.innerHTML = btnTmpl;
    btn = btn.children[0];
    ringBtn.parentNode.insertBefore(btn, ringBtn);
    onBtnClick = function(e) {
      var cnt;
      if (e.srcElement.id !== 'gplusfixerSubsBtn') {
        return null;
      }
      cnt = document.getElementById('gplusfixerSubsListContainer');
      if (cnt.style.display === 'none') {
        return cnt.style.display = '';
      } else {
        return cnt.style.display = 'none';
      }
    };
    btn.addEventListener('click', onBtnClick, false);
    hideBookmarksList = function(e) {
      var arr, bookmark, li, url, _i, _len;
      if (e.target.className === 'gpf-remove') {
        e.preventDefault();
        e.stopImmediatePropagation();
        li = e.target.parentNode;
        url = li.getAttribute('data-url');
        li.parentNode.removeChild(li);
        document.getElementById('gplusfixerSubsBtn').style.color = '#000';
        chrome.storage.sync.remove("@" + url);
        arr = [];
        for (_i = 0, _len = urls.length; _i < _len; _i++) {
          bookmark = urls[_i];
          if (bookmark.url !== url) {
            arr.push(bookmark);
          }
        }
        urls = arr;
        return false;
      }
      if (e.target.className === 'gpfb-link') {
        document.getElementById('gplusfixerSubsBtn').style.color = '#000';
      }
      return null;
    };
    document.addEventListener('click', hideBookmarksList, false);
  }

  getUrls();

}).call(this);
