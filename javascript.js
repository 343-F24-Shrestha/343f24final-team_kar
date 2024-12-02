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

            // Clear the input box
            inputBox.value = "";
            const charCountSpan = event.target.nextElementSibling;
            charCountSpan.textContent = "0/100";

            alert(`Playlist "${userInput}" created!`);
        } else {
            alert("Please type something to create a playlist.");
        }
    }
});
