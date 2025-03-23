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
