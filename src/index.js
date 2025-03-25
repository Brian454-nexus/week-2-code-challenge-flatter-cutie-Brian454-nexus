// Base URL for the API
const BASE_URL = "http://localhost:3000";
// Variable to keep track of the currently displayed character
let currentCharacter = null;

// Function to fetch and display all characters in the character bar
function loadCharacters() {
  const characterBar = document.querySelector("#character-bar");

  fetch(`${BASE_URL}/characters`)
    .then((response) => {
      if (!response.ok) {
        // If the API is unavailable, fallback to local data
        console.warn("API unavailable. Loading local data...");
        return Promise.resolve({ fallback: true });
      }
      return response.json();
    })
    .then((data) => {
      const characters = data.fallback ? getLocalCharacters() : data;
      characters.forEach((character) => {
        const span = document.createElement("span");
        span.innerText = character.name;
        span.addEventListener("click", () => showCharacterDetails(character));
        characterBar.appendChild(span);
      });
    })
    .catch((error) => {
      console.error("Error fetching characters:", error);
      alert("Failed to load characters. Please try again later.");
    });
}

// Fallback function to get local characters
function getLocalCharacters() {
  return [
    {
      id: 1,
      name: "Mr. Cute",
      image:
        "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2MybXBjZnhzYW16Nmo5b2hkcm50bmRvZ2V5ZWtobDRxOTNsa2hsOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hqgD6bocRHhEjamBPA/giphy.gif",
      votes: 0,
    },
    {
      id: 2,
      name: "Mx. Monkey",
      image:
        "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXptYm5yNjF6Njd1NDBsaDY5a3J0cWZyaTh1d3BkNWkwaHV6cGw4aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kZ47z1xYuiAjaxWrGf/giphy.gif",
      votes: 0,
    },
    {
      id: 3,
      name: "Ms. Zebra",
      image: "https://media2.giphy.com/media/20G9uNqE3K4dRjCppA/source.gif",
      votes: 0,
    },
    {
      id: 4,
      name: "Dr. Lion",
      image:
        "http://bestanimations.com/Animals/Mammals/Cats/Lions/animated-lion-gif-11.gif",
      votes: 0,
    },
    {
      id: 5,
      name: "Mme. Panda",
      image: "https://media.giphy.com/media/ALalVMOVR8Qw/giphy.gif",
      votes: 0,
    },
  ];
}

// Function to display a character's details in the detailed-info div
function showCharacterDetails(character) {
  // Update the currentCharacter so we know who is being displayed
  currentCharacter = character;

  // Update the character's name
  const nameElement = document.querySelector("#name");
  nameElement.innerText = character.name;

  // Update the character's image
  const imageElement = document.querySelector("#image");
  imageElement.src = character.image;
  imageElement.alt = character.name;

  // Update the character's votes
  const voteCountElement = document.querySelector("#vote-count");
  voteCountElement.innerText = character.votes;
}

// Function to handle adding votes when the form is submitted
function setupVoteForm() {
  const voteForm = document.querySelector("#votes-form");

  voteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const votesInput = document.querySelector("#votes");
    const additionalVotes = parseInt(votesInput.value);

    if (currentCharacter && !isNaN(additionalVotes)) {
      currentCharacter.votes += additionalVotes;

      const votesDisplay = document.querySelector("#detailed-info h4");
      votesDisplay.innerText = `Total Votes: ${currentCharacter.votes}`;
    }

    voteForm.reset();
  });
}

// Function to reset votes when the reset button is clicked
function setupResetButton() {
  const resetButton = document.querySelector("#reset-btn");
  resetButton.addEventListener("click", () => {
    if (currentCharacter) {
      currentCharacter.votes = 0;

      fetch(`${BASE_URL}/characters/${currentCharacter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: 0 }),
      })
        .then(() => {
          const votesDisplay = document.querySelector("#detailed-info h4");
          votesDisplay.innerText = `Total Votes: ${currentCharacter.votes}`;
        })
        .catch((error) => {
          console.error("Error resetting votes:", error);
          alert("Failed to reset votes. Please try again later.");
        });
    }
  });
}

// Function to handle adding a new character via the character form
function setupCharacterFormWithPersistence() {
  const characterForm = document.querySelector("#character-form");
  characterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const image = document.querySelector("#image-url").value.trim();

    if (!name || !image) {
      alert("Please provide both a name and an image URL.");
      return;
    }

    const newCharacter = { name, image, votes: 0 };

    fetch(`${BASE_URL}/characters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCharacter),
    })
      .then((response) => response.json())
      .then((savedCharacter) => {
        const characterBar = document.querySelector("#character-bar");
        const span = document.createElement("span");
        span.innerText = savedCharacter.name;
        span.addEventListener("click", () =>
          showCharacterDetails(savedCharacter)
        );
        characterBar.appendChild(span);

        showCharacterDetails(savedCharacter);
      })
      .catch((error) => {
        console.error("Error adding character:", error);
        alert("Failed to add character. Please try again later.");
      });

    characterForm.reset();
  });
}

// Modified vote form handler to update votes on the server
function setupVoteFormWithPersistence() {
  const voteForm = document.querySelector("#votes-form");
  voteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const additionalVotes = parseInt(document.querySelector("#votes").value);

    if (currentCharacter && !isNaN(additionalVotes)) {
      currentCharacter.votes += additionalVotes;

      fetch(`${BASE_URL}/characters/${currentCharacter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: currentCharacter.votes }),
      })
        .then(() => {
          const votesDisplay = document.querySelector("#detailed-info h4");
          votesDisplay.innerText = `Total Votes: ${currentCharacter.votes}`;
        })
        .catch((error) => {
          console.error("Error updating votes:", error);
          alert("Failed to update votes. Please try again later.");
        });
    }

    voteForm.reset();
  });
}

// Run these functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadCharacters();
  setupResetButton();
  setupCharacterFormWithPersistence();
  setupVoteFormWithPersistence();
});
