// Spotify credentials
const clientId = '3470fb8f1ba44ed8bddf1e07a8724e78';
const clientSecret = 'fc0d57177a364d95a9f7b53870252d7f';

// Giphy API Key
const giphyApiKey = '2YccsPT9LvZooHKXpFeJF4MvKq1PEmQI';

// Wait for DOM to load before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Load Giphy background if on the landing page
    if (document.querySelector('.landing-container')) {
        loadGiphyBackground();
    }

    // Selectors for mood-mix.html functionality
    const form = document.getElementById("mood-form");
    const moodInput = document.getElementById("mood-input");
    const charCount = document.getElementById("char-count");
    const playlistList = document.getElementById("playlist-list");
    const spotifyPlayerContainer = document.getElementById("spotify-player-container");
    
    // Add navigation link handlers here
    const navLinks = document.querySelectorAll('.nav-link');
    const clearButton = document.getElementById("clear-btn");
    
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Only clear if we're actually navigating (not if the click was prevented)
            setTimeout(() => {
                if (clearButton) {
                    clearButton.click();
                }
            }, 0);
        });
    });

    if (form) {
        // Load playlist from localStorage if available
        const storedPlaylist = localStorage.getItem("playlist");
        if (storedPlaylist) {
            playlistList.innerHTML = storedPlaylist;
        }

        // Form submission for generating playlist
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const userInput = moodInput.value.trim();
            if (userInput.length > 0) {
                try {
                    const playlists = await searchMood(userInput);
                    if (playlists.length > 0) {
                        // Select a random playlist from the list of playlists
                        const randomIndex = Math.floor(Math.random() * playlists.length);
                        const selectedPlaylist = playlists[randomIndex];
                        
                        // Display the selected playlist details and embed the player
                        await displayPlaylistDetails(selectedPlaylist.id);
                        embedSpotifyPlayer(selectedPlaylist.id);
                        updateLocalStorage();
                    } else {
                        displayNoPlaylistFound(userInput);
                    }
                } catch (error) {
                    console.error('Error fetching playlists:', error);
                    alert('Error fetching playlists. Please try again later.');
                }
                moodInput.value = "";
                charCount.textContent = "0/100";
            } else {
                alert("Please type something to create a playlist.");
            }
        });

        // Character count update
        moodInput.addEventListener("input", () => {
            charCount.textContent = `${moodInput.value.length}/100`;
        });

        // Export playlist as JSON
        document.getElementById("export-btn").addEventListener("click", () => {
            const data = JSON.stringify({ playlist: playlistList.innerHTML });
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'playlist.json';
            link.click();
            URL.revokeObjectURL(url);
        });

        // Clear localStorage, playlist data, and embedded Spotify player
        document.getElementById("clear-btn").addEventListener("click", () => {
            // Clear playlist data from localStorage
            localStorage.removeItem("playlist");

            // Clear the playlist list from the DOM
            playlistList.innerHTML = '';

            // Clear the embedded Spotify player
            if (spotifyPlayerContainer) {
                spotifyPlayerContainer.innerHTML = '';
            }
        });
    }
});

// Function to load a Giphy GIF as background with a music theme
async function loadGiphyBackground() {
    const musicTags = ["music", "concert", "dj", "musician", "guitar", "piano", "rock music", "pop music"];
    const randomTag = musicTags[Math.floor(Math.random() * musicTags.length)];

    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${giphyApiKey}&tag=${randomTag}&rating=g`);
        const data = await response.json();
        if (data.data && data.data.images) {
            const gifUrl = data.data.images.original.url;

            // Set the GIF as the background image of the body
            document.body.style.backgroundImage = `url('${gifUrl}')`;
            document.body.style.backgroundSize = 'cover'; // Ensure the background covers the entire body
            document.body.style.backgroundRepeat = 'no-repeat'; // No repeat for better display
        }
    } catch (error) {
        console.error('Error fetching Giphy image:', error);
    }
}

// Get access token from Spotify API
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

// Search playlists by mood
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

// Display detailed playlist information
async function displayPlaylistDetails(playlistId) {
    const accessToken = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const playlistData = await response.json();
    const playlistList = document.getElementById('playlist-list');
    
    // Display the playlist details
    playlistList.innerHTML = `
        <li class="playlist-item">
            <img src="${playlistData.images[0]?.url || ''}" alt="${playlistData.name}" class="playlist-image">
            <h3>${playlistData.name}</h3>
            <p>${playlistData.description || "No description available"}</p>
            <ul class="track-list">
                ${playlistData.tracks.items.map(item => `
                    <li>${item.track.name} by ${item.track.artists.map(artist => artist.name).join(', ')}</li>
                `).join('')}
            </ul>
        </li>
    `;
}

// Embed Spotify player for the generated playlist
function embedSpotifyPlayer(playlistId) {
    console.log("Embedding Spotify player with playlist ID:", playlistId);

    const spotifyPlayerContainer = document.getElementById("spotify-player-container");

    // Add detailed logging to understand the issue
    if (!spotifyPlayerContainer) {
        console.error("Spotify player container not found in the DOM.");
        console.log("Check if #spotify-player-container exists in the HTML document.");
    } else {
        spotifyPlayerContainer.innerHTML = `
            <iframe src="https://open.spotify.com/embed/playlist/${playlistId}" 
                    width="100%" 
                    height="380" 
                    frameborder="0" 
                    allow="encrypted-media; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
            </iframe>
        `;
    }
}

// Update localStorage after changes
function updateLocalStorage() {
    const playlistHTML = document.getElementById("playlist-list").innerHTML;
    localStorage.setItem("playlist", playlistHTML);
}

// Display message when no playlist found
function displayNoPlaylistFound(mood) {
    const playlistList = document.getElementById('playlist-list');
    playlistList.innerHTML = `<li>No playlist found for mood "${mood}". Try another mood.</li>`;
}


