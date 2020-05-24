

// Convert contenteditable div's innerHTML to textcontent
var convert = (function () {
    var convertElement = function (element) {
        switch (element.tagName) {
            case "BR":
                return "\n";
            case "P":
                return "\n";
            case "DIV":
                return (element.previousSibling ? "\n" : "") + [].map.call(element.childNodes, convertElement).join("");
            default:
                return element.textContent;
        }
    };

    return function (element) {
        return [].map.call(element.childNodes, convertElement).join("");
    };
})();

// Fix the contenteditable issue

$('div[contenteditable="true"]').keypress(function (event) {
    if (event.which != 13)
        return true;
    var docFragment = document.createDocumentFragment();

    var newEle = document.createTextNode('\n');
    docFragment.appendChild(newEle);

    newEle = document.createElement('br');
    docFragment.appendChild(newEle);


    newEle = document.createElement('br');
    docFragment.appendChild(newEle);


    var range = window.getSelection().getRangeAt(0);
    range.deleteContents();
    range.insertNode(docFragment);

    range = document.createRange();
    range.setStartAfter(newEle);
    range.collapse(true);

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    return false;
});



// On Save/clear Popups 

function onSave() {
    storage.setItem('data', textEditor.innerHTML);
    showpopup("Saved Locally 🌲🌲");
}


function onClear() {
    storage.clear();
    showpopup("Cleared 🪓🪓");
    setTimeout(function () {
        location.reload();
    }, 2000);
}


function showpopup(text) {

    popup.classList.add('show');
    popup.classList.remove('hide');
    popup.innerHTML = "<p>" + text + "</p>";
    setTimeout(hidepopup, 1000);
}

function hidepopup() {
    popup.classList.remove('show');
    popup.classList.add('hide');
}


// Insert at Caret Position


function saveCaret() {
    var sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}

function insertAtCaret(range, text) {
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
}


// StripBR

function stripBR(html) {
    output = ""
    let line_list = html.split("\n");
    line_list.forEach(line => {
        if (line.endsWith("<br>")) {
            output += "\n"
            output += line.slice(0, - 4);

        } else {
            output += "\n"
            output += line
        }
    });
    return output
}

// Text Linting

function lint_text(re, content) {
    const curr_html = textEditor.innerHTML;
    console.log(curr_html)
    alert(curr_html.match(re));
    final_html = curr_html.replace(re, '$1<span class="heading">$2</span><br>');
    textEditor.innerHTML = stripBR(final_html);
}

function getLastLine(text) {
    let lastLine = "";
    let line_list = text.split("\n").reverse();
    for (var i = 0; i < line_list.length; i++) {
        if (line_list[i].length > 2) {
            return line_list[i]
        }
    }
    return lastLine
}


function lint_line(line) {
    console.log(line)
    head_regex = /^([#]+)(\s.*)/gm;
    const html_body = convert(textEditor);

    if (head_regex.test(line)) {
        console.log(head_regex)
        textEditor.innerHTML = html_body.replace(head_regex, '$1<span class="heading">$2</span><br>');
    }
}