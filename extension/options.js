(function() {
  var $on, color, colors, colorsList, ctx, el, fd, font, fonts, fontsList, getFieldValue, helpMeCnt, i, inputs, onHelpButtonClicked, onSelectBoxClicked, options, saveOption, status, xhr, _i, _j, _len, _len1, _ref;

  ctx = this;


  /*
  Add event listener
  
  @param {String} evt Event name.
  @param {HTMLElement} el HTML element.
  @param {Function} fn Function.
  @return {void}
   */

  $on = function(evt, el, fn) {
    return el.addEventListener(evt, fn, false);
  };

  getFieldValue = function(el) {
    var tag, type;
    tag = el.localName;
    type = el.type;
    if (tag !== 'input') {
      return null;
    }
    console.log(type);
    if (type === 'text' || type === 'hidden') {
      return el.value;
    }
    if (type === 'checkbox') {
      return el.checked;
    }
    return null;
  };

  saveOption = function(option, value) {
    var obj;
    obj = {};
    obj[option] = value;
    chrome.storage.local.set(obj);
    return null;
  };

  xhr = new XMLHttpRequest;

  xhr.onreadystatechange = function(e) {
    var manifest;
    if (xhr.readyState === 4 && xhr.status === 200) {
      manifest = JSON.parse(xhr.responseText);
      document.getElementById('version').innerHTML = manifest.version;
    }
    return null;
  };

  xhr.open('GET', chrome.extension.getURL('manifest.json'));

  xhr.send();

  fonts = {
    'Consolas': false,
    'Courier': false,
    'Courier New': false,
    'Lucida Console': false,
    'Arial': false,
    'Arial Black': false,
    'Calibri': false,
    'Cambria': false,
    'Candara': false,
    'Comic Sans MS': false,
    'Constantia': false,
    'Corbel': false,
    'Estrangelo Edessa': false,
    'Franklin Gothic Medium': false,
    'Gabriola': false,
    'Gautami': false,
    'Georgia': false,
    'Impact': false,
    'Latha': false,
    'Lucida Sans Unicode': false,
    'MS Sans Serif': false,
    'MS Serif': false,
    'MV Boli': false,
    'Myanmar Text': false,
    'Nyala': false,
    'Palatino Linotype': false,
    'Plantagenet Cherokee': false,
    'Segoe Print': false,
    'Segoe Script': false,
    'Segoe UI': false,
    'Small Fonts': false,
    'Sylfaen': false,
    'Tahoma': false,
    'Times New Roman': false,
    'Trebuchet MS': false,
    'Tunga': false,
    'Verdana': false
  };

  fd = new Detector;

  fontsList = '';

  for (font in fonts) {
    status = fonts[font];
    if (fd.detect(font)) {
      fonts[font] = true;
      fontsList += "<li style='font-family: " + font + "'>" + font + "</li>";
    }
  }

  document.getElementById('fonts-list').innerHTML += fontsList;

  onSelectBoxClicked = function(e) {
    var cnt, el, li, ul, value;
    el = e.target;
    if (el.nodeName === 'LI') {
      e.stopImmediatePropagation();
      li = el;
      ul = li.parentNode;
      cnt = ul.parentNode;
      value = li.innerHTML;
      cnt.getElementsByTagName('label')[0].innerHTML = value;
      saveOption(cnt.getAttribute('data-autosave'), value);
      cnt.getElementsByTagName('ul')[0].style.display = 'none';
    } else if (el.nodeName === 'LABEL') {
      cnt = el.parentNode;
      ul = cnt.getElementsByTagName('ul')[0];
      if (cnt.className.indexOf('expanded') !== -1) {
        ul.style.display = 'none';
      } else {
        ul.style.display = 'block';
      }
    }
    cnt.classList.toggle('expanded');
    return null;
  };

  _ref = document.getElementsByClassName('selectbox');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    el = _ref[_i];
    el.addEventListener('click', onSelectBoxClicked, false);
  }

  helpMeCnt = document.getElementById('help-me');

  onHelpButtonClicked = function(e) {
    var cnt, _j, _len1, _ref1;
    if (e.target.className !== 'help') {
      return false;
    }
    _ref1 = helpMeCnt.children;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      el = _ref1[_j];
      el.style.display = 'none';
    }
    cnt = document.getElementById("help-me-" + (e.target.getAttribute('data-id')));
    if (cnt !== null) {
      cnt.style.display = 'block';
    }
    return null;
  };

  document.addEventListener('click', onHelpButtonClicked, false);

  document.getElementById('help-me-latest-changes').style.display = 'block';

  colors = ['990033', 'ff3366', 'cc0033', 'ff0033', 'ff9999', 'cc3366', 'ffccff', 'cc6699', '993366', '660033', 'cc3399', 'ff99cc', 'ff66cc', 'ff99ff', 'ff6699', 'cc0066', 'ff0066', 'ff3399', 'ff0099', 'ff33cc', 'ff00cc', 'ff66ff', 'ff33ff', 'ff00ff', 'cc0099', '990066', 'cc66cc', 'cc33cc', 'cc99ff', 'cc66ff', 'cc33ff', '993399', 'cc00cc', 'cc00ff', '9900cc', '990099', 'cc99cc', '996699', '663366', '660099', '9933cc', '660066', '9900ff', '9933ff', '9966cc', '330033', '663399', '6633cc', '6600cc', '9966ff', '330066', '6600ff', '6633ff', 'ccccff', '9999ff', '9999cc', '6666cc', '6666ff', '666699', '333366', '333399', '330099', '3300cc', '3300ff', '3333ff', '3333cc', '0066ff', '0033ff', '3366ff', '3366cc', '000066', '000033', '0000ff', '000099', '0033cc', '0000cc', '336699', '0066cc', '99ccff', '6699ff', '003366', '6699cc', '006699', '3399cc', '0099cc', '66ccff', '3399ff', '003399', '0099ff', '33ccff', '00ccff', '99ffff', '66ffff', '33ffff', '00ffff', '00cccc', '009999', '669999', '99cccc', 'ccffff', '33cccc', '66cccc', '339999', '336666', '006666', '003333', '00ffcc', '33ffcc', '33cc99', '00cc99', '66ffcc', '99ffcc', '00ff99', '339966', '006633', '336633', '669966', '66cc66', '99ff99', '66ff66', '339933', '99cc99', '66ff99', '33ff99', '33cc66', '00cc66', '66cc99', '009966', '009933', '33ff66', '00ff66', 'ccffcc', 'ccff99', '99ff66', '99ff33', '00ff33', '33ff33', '00cc33', '33cc33', '66ff33', '00ff00', '66cc33', '006600', '003300', '009900', '33ff00', '66ff00', '99ff00', '66cc00', '00cc00', '33cc00', '339900', '99cc66', '669933', '99cc33', '336600', '669900', '99cc00', 'ccff66', 'ccff33', 'ccff00', '999900', 'cccc00', 'cccc33', '333300', '666600', '999933', 'cccc66', '666633', '999966', 'cccc99', 'ffffcc', 'ffff99', 'ffff66', 'ffff33', 'ffff00', 'ffcc00', 'ffcc66', 'ffcc33', 'cc9933', '996600', 'cc9900', 'ff9900', 'cc6600', '993300', 'cc6633', '663300', 'ff9966', 'ff6633', 'ff9933', 'ff6600', 'cc3300', '996633', '330000', '663333', '996666', 'cc9999', '993333', 'cc6666', 'ffcccc', 'ff3333', 'cc3333', 'ff6666', '660000', '990000', 'cc0000', 'ff0000', 'ff3300', 'cc9966', 'ffcc99', 'ffffff', 'cccccc', '999999', '666666', '333333', '000000'];

  colorsList = '';

  for (_j = 0, _len1 = colors.length; _j < _len1; _j++) {
    color = colors[_j];
    colorsList += "<li style='background: #" + color + "'>" + color + "</li>";
  }

  document.getElementById('colors-list').innerHTML += colorsList;

  inputs = document.querySelectorAll('[data-autosave]');

  i = inputs.length;

  while (i--) {
    $on('change', inputs[i], function(e) {
      return saveOption(e.target.getAttribute('data-autosave'), getFieldValue(e.target));
    });
  }

  options = ['slimNav', 'fullPostContent', 'fullCommentContent', 'removeScrolls', 'fontName', 'fontSize', 'linksColor', 'background', 'stripedComments', 'gifStop'];

  chrome.storage.local.get(options, function(options) {
    var field, option, type, value;
    for (option in options) {
      value = options[option];
      field = document.querySelector("[data-autosave='" + option + "']");
      if (field) {
        type = field.type;
        if (type === void 0 && field.className.indexOf('selectbox') !== -1) {
          field.getElementsByTagName('label')[0].innerHTML = value;
        } else if (type === 'checkbox') {
          field.checked = value;
        } else if (type === 'text') {
          field.value = value;
        }
      }
    }
    return null;
  });

}).call(this);
