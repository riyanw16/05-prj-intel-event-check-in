// get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// UI elements
const attendeeCountEl = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCountEl = document.getElementById("waterCount");
const zeroCountEl = document.getElementById("zeroCount");
const powerCountEl = document.getElementById("powerCount");
const greetingEl = document.getElementById("greeting");

// track attendance
let count = 0;
const maxCount = 50;

// handle submission form
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (!name || !team) {
    return;
  }

  // debug logs
  console.log(name, teamName);

  // increment
  count = count + 1;

  console.log("total check-ins", count);

  // update progress
  const percent = Math.round((count / maxCount) * 100) + "%";
  attendeeCountEl.textContent = count;
  progressBar.style.width = percent;

  console.log(`progress: ${percent}`);

  // update team counter
  var teamCounter = null;
  if (team === "water") {
    teamCounter = waterCountEl;
  } else if (team === "zero") {
    teamCounter = zeroCountEl;
  } else if (team === "power") {
    teamCounter = powerCountEl;
  }

  if (teamCounter) {
    teamCounter.textContent = parseInt(teamCounter.textContent || "0", 10) + 1;
    console.log(`Updated ${team} count to ${teamCounter.textContent}`);
  }

  // welcome message
  var message = `Welcome, ${name} from ${teamName}!`;
  greetingEl.textContent = message;
  console.log(message);

  form.reset();
});
