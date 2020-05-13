
// Anup Aglawe ©2020

let textEditor = document.querySelector('.text-container');
let preview = document.querySelector('.preview');
var converter = new showdown.Converter();
converter.setOption('tables', 'true');
converter.setOption('tablesHeaderId', 'true');
converter.setOption('strikethrough', 'true');


function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


textEditor.addEventListener("keyup", (evt) => {
    let { value } = evt.target;
    html = converter.makeHtml(value);

    preview.innerHTML = html;
});