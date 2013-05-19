(function(window) {
    window.addEventListener('DOMContentLoaded', function(event) {
        applyStyles(STYLES);

        function applyStyles(styles) {
            var styleElement = document.createElement("style");
            styleElement.setAttribute("id", "gplusfixer");
            styleElement.setAttribute("class", "gplusfixer");
            styleElement.setAttribute("type", "text/css");
            styleElement.appendChild(document.createTextNode(styles));
            if (document.head) {
                document.head.appendChild(styleElement);
            } else {
                document.documentElement.appendChild(styleElement);
            }
        }
    });
})(window);
