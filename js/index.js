
// Anup Aglawe ©2020

let textEditor = document.querySelector('.text-container');
let preview = document.querySelector('.preview');
let popup = document.querySelector('.popup');

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
        textEditor.value = curr_value + "## Heading 1";
    }

    else if (current_id == 'strike') {
        textEditor.value = curr_value + "~~Strikethrough Text~~";
    }

    else if (current_id == 'list') {
        textEditor.value = curr_value + "\n - List Item";
    }

    renderPreview(textEditor.value);

    // TODO:Add More functions
}

function onSave() {
    storage.setItem('data', textEditor.value);
    showpopup("Saved 🌲🌲");
}

function onClear() {
    storage.clear();
    showpopup("Cleared 🪓🪓")
}


function showpopup(text) {

    popup.classList.add('show');
    popup.classList.remove('hide');

    popup.innerHTML = "<p>" + text + "</p>";
    // popup.style.visibility = 'visible';
    // popup.style.display = 'block';

    setTimeout(hidepopup, 1000);
}

function hidepopup() {
    popup.classList.remove('show');
    popup.classList.add('hide');
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



