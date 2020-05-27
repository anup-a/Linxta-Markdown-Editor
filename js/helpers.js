

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

function style_text() {
    value = convert(textEditor)
    lint_text(head_regex, value);
}

$('code[contenteditable="true"]').keypress(function (event) {

    if (event.which != 13)
        return true;

    // event.preventDefault();


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
    // alert(curr_html.match(re));
    saveRangePosition();
    final_html = curr_html.replace(re, '$1<span class="heading">$2</span><br>');
    textEditor.innerHTML = final_html;
    restoreRangePosition();
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
        if (head_regex.test(html_body)) {
            textEditor.innerHTML = html_body.replace(head_regex, '$1<span class="heading">$2</span><br>');
        } else {
            textEditor.innerHTML = html_body
        }
    }
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
    console.log(sC, eC, getNodeIndex(sC), sC !== bE, sC.parentNode)
    console.log(sC !== bE);

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

    console.log(A, B)
    window.rp = { "sC": A, "sO": range.startOffset, "eC": B, "eO": range.endOffset };
}

function restoreRangePosition() {
    bE.focus();
    console.log(rp)
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
