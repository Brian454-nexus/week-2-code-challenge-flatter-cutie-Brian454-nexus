// Your code here
// Base URL for the API
const BASE_URL = "http://localhost:3000";
// Variable to keep track of the currently displayed character
let currentCharacter = null;
// Function to fetch and display all characters in the character bar
function loadCharacters() {
    // Select the character-bar div where names will be displayed
  const characterBar = document.querySelector("#character-bar");

  // Fetch character data from the server
  fetch(`${BASE_URL}/characters`)
    .then((response) => response.json()) // Convert response to JSON
    .then((characters) => {
        // Loop through each character in the array
      characters.forEach((character) => {
        // Create a span element for the character's name
        const span = document.createElement("span");
        span.innerText = character.name; // Set the character's name as text

        // Add click event to show details when the span is clicked
        span.addEventListener("click", () => showCharacterDetails(character));

        // Add the span to the character-bar div
        characterBar.appendChild(span);
      });
    })
    .catch((error) => console.error("Error fetching characters:", error)); // Log any errors
}

// Function to display a character's details in the detailed-info div
function showCharacterDetails(character) {
    // Update the currentCharacter so we know who is being displayed
  currentCharacter = character;

  // Select the detailed-info div where details will be shown
  const detailedInfo = document.querySelector("#detailed-info");

  // Update the div with the character's details
  detailedInfo.innerHTML = `
    <p>${character.name}</p>
    <img src="${character.image}" alt="${character.name}">
    <h4>Total Votes: ${character.votes}</h4>
  `;
}

// Function to handle adding votes when the form is submitted
function setupVoteForm() {
    // Select the votes form
  const voteForm = document.querySelector("#votes-form");

  // Add event listener for when the form is submitted
  voteForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Stop the form from refreshing the page

    // Get the number of votes from the input field
    const votesInput = document.querySelector("#votes");
    const additionalVotes = parseInt(votesInput.value); // Convert input to a number

    // Check if a character is selected and the input is valid
    if (currentCharacter && !isNaN(additionalVotes)) {
        // Add the new votes to the current character's total
      currentCharacter.votes += additionalVotes;

      // Update the displayed votes in the detailed-info div
      const votesDisplay = document.querySelector("#detailed-info h4");
      votesDisplay.innerText = `Total Votes: ${currentCharacter.votes}`;
    }

    // Clear the input field after submission
    voteForm.reset();
  });
}

// Run these functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // Load all characters into the character bar
  loadCharacters();

  // Set up the vote form functionality
  setupVoteForm();
});

// Function to reset votes when the reset button is clicked
function setupResetButton() {
    const resetButton = document.querySelector("#reset-btn");
    resetButton.addEventListener("click", () => {
      if (currentCharacter) {
        currentCharacter.votes = 0; // Reset votes to 0
        const votesDisplay = document.querySelector("#detailed-info h4");
        votesDisplay.innerText = `Total Votes: ${currentCharacter.votes}`; // Update display
      }
    });
  }

  // Function to handle adding a new character via the character form
function setupCharacterForm() {
    const characterForm = document.querySelector("#character-form");
    characterForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Stop form from refreshing

      // Get the name and image from the form inputs
    const name = document.querySelector("#name").value;
    const image = document.querySelector("#image-url").value;

    // Create a new character object
    const newCharacter = { name, image, votes: 0 };