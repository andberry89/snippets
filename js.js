"use strict";

(function() {

    function openTab(evt) {

        const id = evt.target.id;
        // the following booleans mark which tab is currently open
        const isRed = evt.target.classList.contains('red') ? true : false;
        const isGreen = evt.target.classList.contains('green') ? true : false;
        const isBlue = evt.target.classList.contains('blue') ? true : false;
        
        // marks the tab that was clicked as active, and removes active from any other tab
        for (const tab of tabs) {
            if (tab.id === id) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        }

        // go through each file, we check the corresponding boolean and mark the file is open if the boolean is true
        // we also remove the 'open' class from the other files
        for (const file of files) {
            if (isRed && file.classList.contains('red')) {file.classList.add('open');}
            else if (isGreen && file.classList.contains('green')) {file.classList.add('open');}
            else if (isBlue && file.classList.contains('blue')) {file.classList.add('open');}
            else {file.classList.remove('open');} 
        }

    }

    const tabs = document.getElementsByClassName('tab');
    const files = document.getElementsByClassName('file');

    for (const tab of tabs) {
        tab.addEventListener('click', openTab, false);
    }

})();