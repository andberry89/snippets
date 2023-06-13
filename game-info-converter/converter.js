'use strict';

(function() {

    function popEmptyLines() {

        if (splitText.slice(-1)[0] === '') { splitText.pop(); }
    }
    
    function copy(e) {
        navigator.clipboard.writeText(htmlBox.value);
        copyBtn.value = 'Copied';
        copyBtn.disabled = true;
    }

    function findTarget (evt, targetNode, container) {
        let currentNode = evt.target;
        while (currentNode && currentNode !== container) {  
          if (currentNode.nodeName.toLowerCase() === targetNode.toLowerCase()) { return currentNode; }
          else { currentNode = currentNode.parentNode; }
        }
        return false;
    }

    function checkBtns(e) {

        const btn = findTarget(e, 'input', this);

        if (!btn) { return; }
        else {
            const crosslink = document.getElementById('crosslink');
            if (btn.id === 'gameBtn') {
                crosslink.style.opacity = 1;
            } else {
                crosslink.style.opacity = 0;
            }
        }

    }

    function convertText() {

        popEmptyLines();

        // adding <p> and <br> tags to array contents
        const len = splitText.length;
        for (let i = 0; i < len; i++) {
            const current = splitText[i];
            const next = splitText[i + 1];
            const prev = splitText[i - 1];

            // Special cases for the first and last element of the array
            if (i === 0) {
                splitText[i] = '<p>' + splitText[i];
            }
            if (i +1 === len) {
                if (prev !== '') {
                    splitText[i] = splitText[i] + '</p>';
                } else if (prev === '') {
                    splitText[i] = '<p>' + splitText[i] + '</p>';
                }
            }

            // Enclose the text in opening and closing tags if the lines before and after are new lines
            if (prev === '' && current !== '' && next === '') {
                splitText[i] = '<p>' + splitText[i] + '</p>';
            }
            // If the line is the first line in a paragraph, but there's another line underneath, add a line break instead of closing paragraph
            if (prev === '' && current !== '' && next !== '' && i + 1 !== len) {
                splitText[i] = '<p>' + splitText[i] + '<br />';
            }
            // If the line before is not empty, but the next one is, it's the end of a paragraph
            if (current !== '' && prev !== '' && next === '') {
                splitText[i] = splitText[i] + '</p>';
            }
            // If the previous AND next lines have text, then the current one just needs a line break
            if (prev !== '' && current !== '' && next !== '' && i + 1 !== len) {
                splitText[i] = splitText[i] + '<br />';
            }

        }

        return splitText.join('\n');
    }

    function insertUrl(lastIdx, url) {

        // use the .includes() method possibly?

        let str = '';

        const idxCopyOf = lastIdx.indexOf('copy of ');
        const idxReq = lastIdx.indexOf(' is required');
        const idxCombined = lastIdx.indexOf('combined with ');
        const idxFor = lastIdx.lastIndexOf(' for');

        if (idxCopyOf > -1) {

            const copyLen = idxCopyOf + 'copy of '.length;

            str = lastIdx.substring(0, copyLen);
            str = str + '<a href="' + url + '" target="_blank">';
            str = str + lastIdx.substring(copyLen, idxReq);
            str = str + '</a>';
            str = str + lastIdx.substring(idxReq);

        } else if (idxCombined > -1) {

            const combinedLen = idxCombined + 'combined with '.length;

            str = lastIdx.substring(0, combinedLen);
            str = str + '<a href="' + url + '" target="_blank">';
            str = str + lastIdx.substring(combinedLen, idxFor);
            str = str + '</a>';
            str = str + lastIdx.substring(idxFor);
        }

        if (str !== '') {
            return str;
        } else {
            return lastIdx;
        }

    }

    function convertGameInfo() {

        const ages = reAge.exec(text)[0].trim();
        const players = rePlayers.exec(text)[0].trim();
        const length = reLength.exec(text)[0].trim();
        let lastIdx = splitText.slice(-1).toString().trim();
        const url = document.getElementById('urlBox').value;

        // checks to see what the last item of the array is
        // if it's not the Game Length, we want to get rid of it from the array
        // if a URL was passed for cross-linking, we want to set that up here too
        if (lastIdx !== length) { 

            if (lastIdx !== '' && url !== '') {
                lastIdx = insertUrl(lastIdx, url);
            }

            splitText.pop(); 
        }

        let str = '\n\n' + '<ul>';
        str = str + '\n' + '<li>' + ages + '</li>';
        str = str + '\n' + '<li>' + players + '</li>';
        str = str + '\n' + '<li>' + length + '</li>';
        str = str + '\n' + '</ul>';

        //trim tailling new lines and game info caught in regex variables
        let i = -1;
        while (i < 0) {
            const line = splitText.slice(i).toString().trim();
            if (line === '' || line === ages || line === players || line === length || line === '\n') {
                splitText.pop();
            } else {
                i = 0;
            }
        }

        // addthe PS
        if (lastIdx !== null && lastIdx !== '') {
            str = str + '\n\n' + '<p>' + lastIdx + '</p>';
        }

        return str;

    }

    function convertContents() {

        const contentsIdx = splitText.indexOf(reContents.exec(splitText)[0].trim());
        const len = splitText.length;
        let contents = [];

        for (let i = contentsIdx + 1; i <= len; i++){
            if (splitText[i] !== '') { contents.push(splitText[i]); }
        }

        // Remove all the "game contents" from the array
        contents = splitText.splice(contentsIdx, contents.length + 1);

        // format the contents into an unordered list
        if (contents !== null) {
            const len = contents.length;
            for (let i = 0; i < len; i++) {
                if (i === 0) {
                    contents[i] = '<p><strong>' + contents[i] + '</strong></p>';
                } else {
                    contents[i] = '<li>' + contents[i] + '</li>';
                }
            }
            contents.splice(1, 0, '<ul>');
            contents.push('</ul>');
            contents.push('\n<hr />');
        }

        return contents.join('\n');

    }

    function convertGame() {

        let gameInfo = '';
        let contents = '';

        if (reAge.test(text)) {
            gameInfo = convertGameInfo();
        }

        if (reContents.test(text)) {
            contents = convertContents();
        }

        return '\n\n' + contents + gameInfo;

    }

    function convertToHtml(e) {

        e.preventDefault();
        copyBtn.value = 'Copy to Clipboard';
        copyBtn.disabled = false;

        const radioBtn = document.querySelector('input[name="productType"]:checked').value;
        text = textBox.value.trim();
        splitText = textBox.value.split('\n');
        let str = '';

        if (radioBtn === 'Board Game') {
            const game = convertGame(); // convertGame() has to be called first as it makes changes to the global variable splitText
            str = convertText() + game;
        } else {
            str = convertText();
        }

        htmlBox.value = str;

    }

    const textBox = document.getElementById('textBox');
    const htmlBox = document.getElementById('convertedText');
    const submitBtn = document.getElementById('submitBtn');
    const copyBtn = document.getElementById('copyBtn');
    const radioBtns = document.getElementById('radio-buttons');
    let text = '';
    let splitText = [];

    /* Regular Expressions */

    const reAge = /Ages:*\s.+\n/;
    const rePlayers = /Players:*\s.+\n/;
    const reLength = /Game\sLength:*\s.+\n*/;
    const reContents = /Contents:*\n*/;

    /* Event Listeners */

    radioBtns.addEventListener('click', checkBtns, false);
    submitBtn.addEventListener('click', convertToHtml, false);
    copyBtn.addEventListener('click', copy, false);

})();
