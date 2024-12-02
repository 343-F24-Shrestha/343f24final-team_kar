// Mock data for playlists (can be replaced with an API call)
const mockPlaylists = {
    'Taylor Swift': ['Love Story', 'You Belong with Me', 'Shake It Off'],
    'Drake': ['God\'s Plan', 'Hotline Bling', 'One Dance'],
    'Adele': ['Hello', 'Rolling in the Deep', 'Someone Like You']
};

// Event listener to track character count in the input box
document.addEventListener("input", (event) => {
    if (event.target.classList.contains("input-box")) {
        const charCountSpan = event.target.nextElementSibling; // Find the span for char count
        charCountSpan.textContent = `${event.target.value.length}/100`;
    }
});

// Event listener for the "Generate" button to create a new playlist
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("generate-btn")) {
        const inputBox = event.target.previousElementSibling; // Get the input box
        const userInput = inputBox.value.trim();

        if (userInput.length > 0) {
            // Create a new playlist item
            const playlistSection = document.querySelector(".suggested-topics");
            const newPlaylist = document.createElement("button");
            newPlaylist.classList.add("suggested-btn");
            newPlaylist.textContent = `Playlist: ${userInput}`;
            playlistSection.appendChild(newPlaylist);

            // Generate random songs for the entered artist
            if (mockPlaylists[userInput]) {
                const songs = mockPlaylists[userInput];
                displayPlaylist(songs, userInput);
            } else {
                alert(`No playlist found for ${userInput}. Try another artist.`);
            }

            // Clear the input box
            inputBox.value = "";
            const charCountSpan = event.target.nextElementSibling;
            charCountSpan.textContent = "0/100";
        } else {
            alert("Please type something to create a playlist.");
        }
    }
});

// Helper function to get random songs from an array
function getRandomSongs(songs, count) {
    const shuffled = songs.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Function to display a playlist in the results section
function displayPlaylist(songs, artist) {
    const playlistList = document.getElementById('playlist-list');
    playlistList.innerHTML = ''; // Clear existing playlist

    const playlistResults = document.getElementById('playlist-results');
    playlistResults.style.display = 'block';

    // Display each song with a play button
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${song}
            <button class="play-btn" data-song="${artist} - ${song}">Play</button>
        `;
        playlistList.appendChild(li);
    });
}

// Event listener for play buttons in the playlist
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("play-btn")) {
        const songTitle = event.target.dataset.song;
        alert(`Now playing: ${songTitle}`); // Simulate playing the song

        // Placeholder for actual audio playback
        // Here you could integrate an audio element or an API call to play music
    }
});
