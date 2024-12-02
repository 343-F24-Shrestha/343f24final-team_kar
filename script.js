// Spotify credentials (replace these with your client ID and client secret from Spotify Dashboard)
const clientId = '3470fb8f1ba44ed8bddf1e07a8724e78';
const clientSecret = 'fc0d57177a364d95a9f7b53870252d7f';

// Wait for DOM to load before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Select all forms with the class "input-section"
    const moodForms = document.querySelectorAll(".input-section");

    moodForms.forEach((form) => {
        // Adding event listener for each form submission
        form.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent form from submitting and refreshing the page

            // Get the input box inside this form
            const inputBox = form.querySelector(".input-box");
            if (inputBox) {
                const userInput = inputBox.value.trim();

                if (userInput.length > 0) {
                    try {
                        const playlists = await searchMood(userInput);
                        if (playlists.length > 0) {
                            // Display the first playlist as an example
                            const selectedPlaylist = playlists[0];
                            await displayPlaylistDetails(selectedPlaylist.id);
                        } else {
                            displayNoPlaylistFound(userInput);
                        }
                    } catch (error) {
                        console.error('Error fetching playlists:', error);
                        alert('Error fetching playlists. Please try again later.');
                    }

                    // Clear the input box
                    inputBox.value = "";
                    const charCountSpan = form.querySelector(".char-count");
                    if (charCountSpan) {
                        charCountSpan.textContent = "0/100";
                    }
                } else {
                    alert("Please type something to create a playlist.");
                }
            }
        });

        // Adding character count event listener to each input box
        const moodInput = form.querySelector(".input-box");
        if (moodInput) {
            moodInput.addEventListener("input", () => {
                const charCountSpan = form.querySelector(".char-count");
                if (charCountSpan) {
                    charCountSpan.textContent = `${moodInput.value.length}/100`;
                }
            });
        }
    });

    // Add event listeners for each genre button to provide genre-based recommendations
    const genreButtons = document.querySelectorAll(".genre-btn");
    genreButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const genre = button.getAttribute("data-genre");
            if (genre) {
                try {
                    const playlists = await searchMood(genre);
                    if (playlists.length > 0) {
                        // Display the first playlist as an example
                        const selectedPlaylist = playlists[0];
                        await displayPlaylistDetails(selectedPlaylist.id);
                    } else {
                        displayNoPlaylistFound(genre);
                    }
                } catch (error) {
                    console.error('Error fetching playlists:', error);
                    alert('Error fetching playlists. Please try again later.');
                }
            }
        });
    });
});

// Function to get access token from Spotify API
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
}

// Function to search for mood-based playlists from Spotify API
async function searchMood(mood) {
    const accessToken = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(mood)}&type=playlist`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data.playlists.items;
}

// Function to display detailed information about a playlist
async function displayPlaylistDetails(playlistId) {
    const accessToken = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const playlistData = await response.json();

    const playlistList = document.getElementById('playlist-list');
    if (playlistList) {
        playlistList.innerHTML = ''; // Clear existing content

        const playlistResults = document.getElementById('playlist-results');
        if (playlistResults) {
            playlistResults.style.display = 'block';

            // Create an element to display playlist image
            const img = document.createElement('img');
            img.src = playlistData.images[0]?.url || '';
            img.alt = playlistData.name;
            img.classList.add('playlist-image');
            playlistList.appendChild(img);

            // Create an element to display playlist name and description
            const playlistInfo = document.createElement('div');
            playlistInfo.classList.add('playlist-info');
            playlistInfo.innerHTML = `
                <h3>${playlistData.name}</h3>
                <p>${playlistData.description || "No description available"}</p>
            `;
            playlistList.appendChild(playlistInfo);

            // Display list of tracks in the playlist
            const trackList = document.createElement('ul');
            trackList.classList.add('track-list');
            playlistData.tracks.items.forEach((item) => {
                const track = item.track;
                const trackItem = document.createElement('li');
                trackItem.innerHTML = `
                    ${track.name} by ${track.artists.map(artist => artist.name).join(', ')}
                `;
                trackList.appendChild(trackItem);
            });
            playlistList.appendChild(trackList);
        }
    }
}

// Function to display a message when no playlist is found
function displayNoPlaylistFound(mood) {
    const playlistList = document.getElementById('playlist-list');
    if (playlistList) {
        playlistList.innerHTML = ''; // Clear existing playlist

        const li = document.createElement('li');
        li.classList.add("playlist-item");
        li.textContent = `No playlist found for mood "${mood}". Try another mood.`;
        playlistList.appendChild(li);

        const playlistResults = document.getElementById('playlist-results');
        if (playlistResults) {
            playlistResults.style.display = 'block';
        }
    }
}
