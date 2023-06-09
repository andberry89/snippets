"use strict";

(function() {

    // this pulls a random name from the array based on its length and automatically displays its choice
    function getRandomName(arr) {
        const idx = Math.floor(Math.random() * arr.length);
        plate.innerText = arr[idx];
    }
    
    // this is the function that controls the gradual slowing down of names
    // credit to Robert Penner for the equation
    function easeInQuad(t, b, c, d) {
        return c * (t /= d) * t + b;
    }

    // decides which function fires based on the text content of the button
    function clicked() {
        if (btn.innerText === 'Start') { start(); }
        else if (btn.innerText === 'Stop') { stop(); }
    }

    // changes the button text and begins the randomizer
    function start() {

        btn.innerText = 'Stop';
        isRunning = true;

        // return the page to its default state
        plate.classList.remove('winner');
        winningName = '';
        
        const intr = setInterval(function() {
            getRandomName(names);
            if (!isRunning) { 
                clearInterval(intr); 
            }
        }, 200);
        // time between each name in milliseconds. 1000 = 1 second. Change this number if you want it to go faster or slower
    }

    function stop() {

        btn.style.display = 'none';
        isRunning = false;

        let time = 200; // should match the number in the start() function
        const diff = 20;
        const minTime = 200; // should match the number in the start() function
        const maxTime = 5000; // total duration after user has pressed stop

        for (let i = 0; i <= diff; i++) {

            setTimeout(() => {
                getRandomName(names);
            }, time);

            time = easeInQuad(i, minTime, maxTime, diff);
        }

        setTimeout(() => {
            showWinner(plate.innerText);
        }, minTime + maxTime);

    }

    function showWinner(name) {
        winningName = name; // changes global variable to the winning name
        plate.classList.add('winner'); // adds the 'winner' class to the element holding the winning name so it can be styled/animated

        // return the start button
        btn.innerText = 'Start';
        btn.style.display = 'inline';
    }

    // initialize our global variables. We have our array of names, the winning name, and whether or not the randomizer is running
    const names = ['Ally', 'Richard', 'Dominique', 'Rachaad', 'Ravi', 'Simone', 'Nancy', 'Peter', 'Xavier', 'Sierra', 'Mae', 'Caleb', 'Stevie', 'Ronald', 'Garrett', 'Jordan'];
    let winningName = '';
    let isRunning = false;

    // grab the two elements from the body we'll need to manipulate
    const plate = document.getElementById('plate');
    const btn = document.getElementById('btn');

    // a single event listener whose behavior will be based on the inner Text
    btn.addEventListener('click', clicked, false);

    // puts out a random name every time the page loads
    getRandomName(names);

})();
