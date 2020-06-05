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


$('code[contenteditable="true"]').keypress(function (event) {

    if (event.which != 13)
        return true;

    // event.preventDefault();


    var docFragment = document.createDocumentFragment();

    var newEle = document.createTextNode('\n');
    docFragment.appendChild(newEle);

    newEle = document.createElement('br');
    docFragment.appendChild(newEle);


    // newEle = document.createElement('br');
    // docFragment.appendChild(newEle);


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


function saveCaretPosition(context) {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    range.setStart(context, 0);
    var len = range.toString().length;

    return function restore() {
        var pos = getTextNodeAtPosition(context, len);
        selection.removeAllRanges();
        var range = new Range();
        range.setStart(pos.node, pos.position);
        selection.addRange(range);

    }
}

function getTextNodeAtPosition(root, index) {
    var lastNode = null;

    var treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, function next(elem) {
        if (index > elem.textContent.length) {
            index -= elem.textContent.length;
            lastNode = elem;
            return NodeFilter.FILTER_REJECT
        }
        return NodeFilter.FILTER_ACCEPT;
    });
    var c = treeWalker.nextNode();
    return {
        node: c ? c : root,
        position: index
    };
}

function saveRangePosition() {
    var range = window.getSelection().getRangeAt(0);
    var sC = range.startContainer, eC = range.endContainer;

    A = [];
    while (sC !== bE) {
        clg(getNodeIndex(sC))
        A.push(getNodeIndex(sC));
        sC = sC.parentNode
    }
    B = [];
    while (eC !== bE) {
        B.push(getNodeIndex(eC));
        eC = eC.parentNode
    }

    window.rp = { "sC": A, "sO": range.startOffset, "eC": B, "eO": range.endOffset };
}

function restoreRangePosition() {
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

// // Insert at Caret Position


function saveCaret() {
    var sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            rangeElement = sel.getRangeAt(0);
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}

function insertAtCaret(rangeElement, text) {
    rangeElement.deleteContents();
    rangeElement.insertNode(document.createTextNode(text));
}


//  night mode
function darkenCode() {
    for (var i = 0; i < pre.length; i++) {
        if (pre[i].classList.length === 0) {
            pre[i].classList.add("dark-code");
        }
    }
}

