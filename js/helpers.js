

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



//Save selection and cursor

function saveRangePosition() {
    var range = window.getSelection().getRangeAt(0);
    var sC = range.startContainer, eC = range.endContainer;

    A = []; while (sC !== bE) { A.push(getNodeIndex(sC)); sC = sC.parentNode }
    B = []; while (eC !== bE) { B.push(getNodeIndex(eC)); eC = eC.parentNode }

    return { "sC": A, "sO": range.startOffset, "eC": B, "eO": range.endOffset };
}

function restoreRangePosition(rp) {
    bE.focus();
    var sel = window.getSelection(), range = sel.getRangeAt(0);
    var x, C, sC = bE, eC = bE;

    C = rp.sC; x = C.length; while (x--) sC = sC.childNodes[C[x]];
    C = rp.eC; x = C.length; while (x--) eC = eC.childNodes[C[x]];

    range.setStart(sC, rp.sO);
    range.setEnd(eC, rp.eO);
    sel.removeAllRanges();
    sel.addRange(range)
}

function getNodeIndex(n) { var i = 0; while (n = n.previousSibling) i++; return i }


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
        console.log(sel);
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}

function insertAtCaret(range, text) {
    range.insertNode(document.createTextNode(text));
}