// microAjax
function microAjax(B,A){this.bindFunction=function(E,D){return function(){return E.apply(D,[D])}};this.stateChange=function(D){if(this.request.readyState==4){this.callbackFunction(this.request.responseText)}};this.getRequest=function(){if(window.ActiveXObject){return new ActiveXObject("Microsoft.XMLHTTP")}else{if(window.XMLHttpRequest){return new XMLHttpRequest()}}return false};this.postBody=(arguments[2]||"");this.callbackFunction=A;this.url=B;this.request=this.getRequest();if(this.request){var C=this.request;C.onreadystatechange=this.bindFunction(this.stateChange,this);if(this.postBody!==""){C.open("POST",B,true);C.setRequestHeader("X-Requested-With","XMLHttpRequest");C.setRequestHeader("Content-type","application/x-www-form-urlencoded");C.setRequestHeader("Connection","close")}else{C.open("GET",B,true)}C.send(this.postBody)}};

var nano = {},
    STYLES = "\n";

/*
 * Templating
 *
 * Usage:
 *  var hello = t("Hello, #{this.name || 'world'}!")
 *
 *  console.log( // => "Hello, Jed!"
 *    hello({name: "Jed"})
 *  )
 *
 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
 * More: https://gist.github.com/964762
 */

nano.t = function(
  a, // the string source from which the template is compiled
  b  // the default `with` context of the template (optional)
){
  return function(
    c, // the object called as `this` in the template
    d  // the `with` context of this template call (optional)
  ){
    return a.replace(
      /#{([^}]*)}/g, // a regexp that finds the interpolated code: "#{<code>}"
      function(
        a, // not used, only positional
        e  // the code matched by the interpolation
      ){
        return Function(
          "x",
          "with(x)return " + e // the result of the interpolated code
        ).call(
          c,    // pass the data object as `this`, with
          d     // the most
          || b  // specific
          || {} // context.
        )
      }
    )
  }
};

/*
 * LocalStorage
 *
 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
 * More: https://gist.github.com/966030
 *
 */

nano.s = function(
  a, // placeholder for storage object
  b  // placeholder for JSON
){
  return b
    ? {                 // if JSON is supported
      get: function(    // provide a getter function
        c               // that takes a key
      ){
        return a[c] &&  // and if the key exists
          b.parse(a[c]) // parses and returns it,
      },

      set: function(     // and a setter function
        c,               // that takes a key
        d                // and a value
      ){
        a[c] =           // and sets
          b.stringify(d) // its serialization.
      }
    }
    : {}                 // if JSON isn't supported, provide a shim.
}(
  this.localStorage // use native localStorage if available
  || {},            // or an object otherwise
  JSON              // use native JSON (required)
)

/*
 * Create DOM element
 *
 * Usage:
 *   var el = m('<h1>Hello</h1>');
 *   document.body.appendChild(el);
 *
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
 * More: https://gist.github.com/966233
 *
 */

nano.m = function(
  a, // an HTML string
  b, // placeholder
  c  // placeholder
){
  b = document;                   // get the document,
  c = b.createElement("p");       // create a container element,
  c.innerHTML = a;                // write the HTML to it, and
  a = b.createDocumentFragment(); // create a fragment.

  while (                         // while
    b = c.firstChild              // the container element has a first child
  ) a.appendChild(b);             // append the child to the fragment,

  return a                        // and then return the fragment.
};

// based on https://gist.github.com/Potfur/5576225 & https://github.com/james2doyle/saltjs
// more info: https://plus.google.com/109231487156400680487/posts/63eZzzrBSb6
nano.$ = function(s) {
    var c = {
        '#': 'ById',
        '.': 'sByClassName',
        '@': 'sByName',
        '=': 'sByTagName'}[s[0]];
    return document[c?'getElement'+c:'querySelectorAll'](s.slice(1))
};

nano.bind = function(el, eventName, callback) {
    (typeof el == 'string' ? nano.$(el)[0] : el).addEventListener(eventName, callback, false); 
};