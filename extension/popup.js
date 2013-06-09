var body = document.getElementsByTagName('body')[0];

nano.bind('#saveBtn', 'click', nano.showInfo);

nano.autosave('commentBoxHeight', 'removeScrolls', 'fullPostContent', 'fullCommentContent', 'defaultFont', 'fontSize', 'slimNav');