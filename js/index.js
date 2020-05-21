
// Anup Aglawe ©2020

let textEditor = document.querySelector('.text-container');
let preview = document.querySelector('.preview');
let popup = document.querySelector('.popup');

const button = document.querySelector('#emoji-button');
const picker = new EmojiButton();
const nightMode = document.querySelector('#checkbox');
const topBar = document.querySelector(".top-bar");
const pre = document.getElementsByTagName("pre");

var converter = new showdown.Converter();
const storage = window.localStorage;


// showdown config
converter.setOption('tables', 'true');
converter.setOption('tablesHeaderId', 'true');
converter.setOption('strikethrough', 'true');
converter.setOption('simplifiedAutoLink', 'true');
converter.setOption('tasklists', 'true');
converter.setOption('smoothLivePreview', 'true');


const storedMarkdown = storage.getItem('data');
const table_content = "<br>|Col 1 |  Col 2|<br>|--|--|<br>| row 1, 1 |row 1, 2|<br>| row 2, 1 |row 2, 2|<br>"
const strike_content = "~~Strikethrough Text~~";
const head_content = "<br>## Heading 1";
const code_content = "<br>```<br>// python 3.6 🐍<br>msg = 'Hello world !'<br>print(msg)<br>```"


document.execCommand('defaultParagraphSeparator', false, '\n');

if (storedMarkdown) {
    textEditor.value = storedMarkdown;
}


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

renderPreview();

function renderPreview() {
    value = convert(textEditor)
    console.log(value)

    html = converter.makeHtml(value);
    console.log(html)
    preview.innerHTML = html;
}

textEditor.addEventListener("keyup", (evt) => {
    renderPreview();
});


// Night Mode

nightMode.addEventListener("click", (evt) => {
    if (nightMode.checked) {
        textEditor.classList.add("dark");
        topBar.classList.add("dark");
        preview.classList.add("dark-preview");

        for (var i = 0; i < pre.length; i++) {
            if (pre[i].classList.length === 0) {
                pre[i].classList.add("dark-code");
            }
        }

        popup.classList.add("dark-popup");

    } else {
        textEditor.classList.remove("dark");
        topBar.classList.remove("dark");
        preview.classList.remove("dark-preview");

        for (var i = 0; i < pre.length; i++) {
            if (pre[i].classList.length != 0) {
                pre[i].classList.remove("dark-code");
            }
        }

        popup.classList.remove("dark-popup");
    }
});

// Emoji Picker

window.addEventListener('DOMContentLoaded', () => {
    picker.on('emoji', emoji => {
        // textEditor.value += emoji;
        insertAtCursor(textEditor, emoji);
        renderPreview();
    });

    button.addEventListener('click', () => {
        picker.togglePicker(button);
    });
});

function addStyle(ele) {
    const current_id = ele.id;
    const curr_value = textEditor.innerHTML;

    if (current_id == 'bold') {
        textEditor.innerHTML = curr_value + "**Bold Text**";
    }
    else if (current_id == 'italic') {
        textEditor.innerHTML = curr_value + "*Italic Text*";
    }

    else if (current_id == 'heading') {
        textEditor.innerHTML = curr_value + head_content;
    }

    else if (current_id == 'strike') {
        textEditor.innerHTML = curr_value + strike_content;
    }

    else if (current_id == 'list') {
        textEditor.innerHTML = curr_value + "<br> - List Item";
    }
    else if (current_id == 'hor-line') {
        textEditor.innerHTML = curr_value + "<br> ---";
    }
    else if (current_id == 'table') {
        textEditor.innerHTML = curr_value + table_content;
    }
    else if (current_id == 'code') {
        textEditor.innerHTML = curr_value + code_content;
    }

    renderPreview();

    // TODO:Add More functions
}

function onSave() {
    storage.setItem('data', textEditor.value);
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


function insertAtCursor(myField, myValue) {
    console.log(myField.selectionStart)
    console.log(myField.selectionStart)

    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others

    else if (myField.selectionStart || myField.selectionStart == '0') {
        console.log(myField.selectionStart)
        console.log(myField.selectionStart)
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

// TODO:Fetch Selected Text

// function getSelectionText() {
//     var text = "";
//     if (window.getSelection) {
//         text = window.getSelection().toString();
//     } else if (document.selection && document.selection.type != "Control") {
//         text = document.selection.createRange().text;
//     }
//     return text;
// }


// Text Linting

head_regex = /(^[#]+\s.*)/gm
// test_string = textEditor.value.toString();
// heading_match = get_match(head_regex, test_string);


function lint_text(re) {
    console.log(textEditor.innerHTML);
    const html_body = textEditor.innerHTML;
    textEditor.innerHTML = html_body.replace(re, '<span class="heading">$1</span>');
}

// lint_text(head_regex);

// function get_match(re, str) {
//     index_str = []
//     while ((match = re.exec(str)) != null) {
//         index_str.add(match.index)
//     }
//     return index_str
// } 