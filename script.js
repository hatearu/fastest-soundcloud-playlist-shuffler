// ==UserScript==
// @name         simple soundcloud shuffler
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Shuffle a SoundCloud playlist and queue tracks randomly when the shuffle button is pressed
// @author       Aru
// @match        https://soundcloud.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Utility function for delay (in milliseconds)
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to check if the user is on a SoundCloud playlist
    function isPlaylistPage() {
        const url = window.location.href;
        const isPlaylist = /https:\/\/soundcloud\.com\/[\w-]+\/sets\/[\w-]+/.test(url);
        return isPlaylist;
    }

    // Function to get all tracks from the playlist
    function getTracks() {
        let trackElements = document.querySelectorAll('.sound__coverArt');
        let trackUrls = [];

        // Loop over all the tracks and collect their URLs
        trackElements.forEach(track => {
            let linkElement = track.closest('a');
            if (linkElement && linkElement.href) {
                trackUrls.push(linkElement.href);
            }
        });

        return trackUrls;
    }

    // Function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Main function to shuffle the playlist and queue tracks
    async function shufflePlaylist() {
        if (!isPlaylistPage()) {
            console.log('Not a playlist page.');
            return;
        }

        console.log('Shuffling the playlist...');

        // Get the tracks
        const tracks = getTracks();
        if (tracks.length === 0) {
            console.log('No tracks found in the playlist.');
            return;
        }

        // Shuffle the tracks
        const shuffledTracks = shuffleArray(tracks);

        // Queue the shuffled tracks with delays to avoid errors
        for (let i = 0; i < shuffledTracks.length; i++) {
            console.log(`Queueing track ${i + 1}: ${shuffledTracks[i]}`);

            // Simulate clicking on the track to queue it
            window.location.href = shuffledTracks[i];
            await delay(2000);
        }

        console.log('All tracks have been shuffled.');
    }

    // Function to monitor clicks on the shuffle button
    function monitorShuffleButton() {
        const shuffleButton = document.querySelector('.shuffleControl');

        if (shuffleButton) {
            shuffleButton.addEventListener('click', function() {
                console.log('Shuffling...');
                shufflePlaylist();
            });
        } else {
            console.log('Shuffle button not found.');
        }
    }

    // Run the monitor function when the page loads
    window.addEventListener('load', function() {
        setTimeout(monitorShuffleButton, 3000);
    });

})();
