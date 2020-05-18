
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
const table_content = "\n|Col 1 |  Col 2|\n|--|--|\n| row 1, 1 |row 1, 2|\n| row 2, 1 |row 2, 2|\n"
const stike_content = "~~Strikethrough Text~~";
const head_content = "\n## Heading 1";
const code_content = "\n```\n// python 3.6 🐍\nmsg = 'Hello world !'\nprint(msg)\n```"

if (storedMarkdown) {
    textEditor.value = storedMarkdown;
}

renderPreview(textEditor.value);

function renderPreview(value) {
    html = converter.makeHtml(value);
    preview.innerHTML = html;
}

textEditor.addEventListener("keyup", (evt) => {
    let { value } = evt.target;
    renderPreview(value);
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
        renderPreview(textEditor.value);
    });

    button.addEventListener('click', () => {
        picker.togglePicker(button);
    });
});

function addStyle(ele) {
    const current_id = ele.id;
    const curr_value = textEditor.value;

    if (current_id == 'bold') {
        textEditor.value = curr_value + "**Bold Text**";
    }
    else if (current_id == 'italic') {
        textEditor.value = curr_value + "*Italic Text*";
    }

    else if (current_id == 'heading') {
        textEditor.value = curr_value + head_content;
    }

    else if (current_id == 'strike') {
        textEditor.value = curr_value + strike_content;
    }

    else if (current_id == 'list') {
        textEditor.value = curr_value + "\n - List Item";
    }
    else if (current_id == 'hor-line') {
        textEditor.value = curr_value + "\n ---";
    }
    else if (current_id == 'table') {
        textEditor.value = curr_value + table_content;
    }
    else if (current_id == 'code') {
        textEditor.value = curr_value + code_content;
    }

    renderPreview(textEditor.value);

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
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
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
