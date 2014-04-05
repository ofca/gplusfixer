urls = []

getUrls = ->
    urls = []
    chrome.storage.sync.get null, (items) ->
        console.log items
        for key, bookmark of items
            continue if key[0] isnt '@'

            url = key.slice 1
            urls.push { url: url, commentsNum: bookmark.commentsNum, author: bookmark.author, content: bookmark.content }

        # Create list
        createList()

        # Start checking
        check 0

        null
    null

createList = ->
    cnt = document.getElementById 'gplusfixerSubsList'
    list = ''

    for bookmark in urls
        list += "<li data-url='#{bookmark.url}'>
            <span class='gpf-remove'>x</span>
            <a class='gpfb-link' href='#{bookmark.url}' target='_blank'>
                <span class='gpf-author'>#{bookmark.author}</span>
                <span class='gpf-content'>#{bookmark.content}</span>
            </a>
        </li>"

    cnt.innerHTML = list

    null

check = (index) ->
    # Everything checked? Start again after 5 seconds
    if urls[index] is undefined
        setTimeout getUrls, 5000
        return null

    url = urls[index].url
    xhr = new XMLHttpRequest
    xhr.onreadystatechange = (e) ->
        if xhr.readyState is 4 and xhr.status is 200
            num = xhr.responseText.match(/class\="Ik Wv"/g).length

            if urls[index].commentsNum isnt num
                li = document
                    .getElementById('gplusfixerSubsList')
                    .querySelector("[data-url='#{urls[index].url}']")

                if li
                    li.className = 'gpf-new'

                    document.getElementById('gplusfixerSubsBtn').style.color = 'red'

            check index+1
        null

    xhr.open 'GET', "https://plus.google.com/#{url}"
    xhr.send()

styles = '
    #gplusfixerSubsBtn { font-weight: bold; padding: 5px 10px; margin-left: 12px; border: 1px solid #e6e6e6; top: 3px; position: relative; position: relative; }
    #gplusfixerSubsListContainer { background: #fff; padding: 20px; max-height: 300px; overflow-y: scroll; overflow-x: hidden; position: absolute; z-index: 9999; width: 400px; left: -200px; top: 25px; }
    #gplusfixerSubsList { list-style: none; padding: 0; margin: 0; width: 400px; }
    #gplusfixerSubsList li { padding: 5px 0; border-bottom: 1px solid #e6e6e6; }
    #gplusfixerSubsList li a:hover, #gplusfixerSubsList li a:hover span { text-decoration: none; }
    .gpf-author { font-weight: bold; padding-right: 10px; }
    .gpf-content { font-weight: normal; color: gray; white-space: normal; }
    .gpf-new .gpf-author { color: #D30000; }
    .gpf-remove { padding: 5px; margin-right: 10px; }
'

e = document.createElement 'style'
e.setAttribute 'id', "gplusfixer-bookmarks-list"
e.appendChild document.createTextNode(styles)

if document.head
    document.head.appendChild e
else
    document.documentElement.appendChild e

# Insert bookmark button after Goole "ring" button
# -----------------------------------------------------------------------------
ringBtn = document.querySelector '.gb_La.gb_Va.gb_k'

if ringBtn
    btnTmpl = '<a id="gplusfixerSubsBtn">Subs
        <div id="gplusfixerSubsListContainer" style="display: none">
            <ul id="gplusfixerSubsList"></ul>
        </div>
    </a>'
    btn = document.createElement 'div'
    btn.innerHTML = btnTmpl
    btn = btn.children[0]

    ringBtn.parentNode.insertBefore btn, ringBtn

    onBtnClick = (e) ->

        if e.srcElement.id isnt 'gplusfixerSubsBtn'
            return null

        cnt = document.getElementById 'gplusfixerSubsListContainer'
        if cnt.style.display is 'none'
            cnt.style.display = ''
        else
            cnt.style.display = 'none'

    btn.addEventListener 'click', onBtnClick, false

    hideBookmarksList = (e) ->
        if e.target.className is 'gpf-remove'
            e.preventDefault()
            e.stopImmediatePropagation()

            li = e.target.parentNode
            url = li.getAttribute 'data-url'

            li.parentNode.removeChild li
            document.getElementById('gplusfixerSubsBtn').style.color = '#000'

            chrome.storage.sync.remove "@#{url}"

            arr = []
            for bookmark in urls
                if bookmark.url isnt url
                    arr.push bookmark

            urls = arr

            return false

        if e.target.className is 'gpfb-link'
            document.getElementById('gplusfixerSubsBtn').style.color = '#000'
            

        null

    document.addEventListener 'click', hideBookmarksList, false

getUrls()