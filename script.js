// Mock data for playlists (can be replaced with an API call)
const mockPlaylists = {
    'Taylor Swift': ['Love Story', 'You Belong with Me', 'Shake It Off'],
    'Drake': ['God\'s Plan', 'Hotline Bling', 'One Dance'],
    'Adele': ['Hello', 'Rolling in the Deep', 'Someone Like You']
};

// Event listener for the Generate button click
document.addEventListener("DOMContentLoaded", () => {
    // Add event listener to the Generate buttons in all forms
    document.querySelectorAll(".generate-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent form submission

            // Get the input box and the user input for each respective form
            const inputBox = button.previousElementSibling; 
            const userInput = inputBox.value.trim();

            if (userInput.length > 0) {
                // Generate random songs for the entered artist or mood
                if (mockPlaylists[userInput]) {
                    const songs = mockPlaylists[userInput];
                    displayPlaylist(songs, userInput);
                } else {
                    displayNoPlaylistFound(userInput);
                }

                // Clear the input box
                inputBox.value = "";
                const charCountSpan = button.nextElementSibling;
                if (charCountSpan) {
                    charCountSpan.textContent = "0/100";
                }
            } else {
                alert("Please type something to create a playlist.");
            }
        });
    });

    // Event listener to track character count in all input boxes
    document.querySelectorAll(".input-box").forEach(input => {
        input.addEventListener("input", () => {
            const charCountSpan = input.nextElementSibling; // Find the span for char count
            if (charCountSpan) {
                charCountSpan.textContent = `${input.value.length}/100`;
            }
        });
    });
});

// Function to display a playlist in the results section
function displayPlaylist(songs, artist) {
    const playlistList = document.getElementById('playlist-list');
    playlistList.innerHTML = ''; // Clear existing playlist

    const playlistResults = document.getElementById('playlist-results');
    playlistResults.style.display = 'block';

    // Display each song with a play button
    songs.forEach((song) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${song}
            <button class="play-btn" data-song="${artist} - ${song}">Play</button>
        `;
        playlistList.appendChild(li);
    });
}

// Function to display a message when no playlist is found for the artist
function displayNoPlaylistFound(artist) {
    const playlistList = document.getElementById('playlist-list');
    playlistList.innerHTML = ''; // Clear existing playlist

    const li = document.createElement('li');
    li.classList.add("playlist-item");
    li.textContent = `No playlist found for "${artist}". Try another artist.`;
    playlistList.appendChild(li);

    // Show the playlist results section
    const playlistResults = document.getElementById('playlist-results');
    playlistResults.style.display = 'block';
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
