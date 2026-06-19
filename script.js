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
  greetingEl.style.display = "block";
  greetingEl.classList.remove("success-message", "celebration");
  console.log(message);

  // if goal reached, show celebration and highlight winning team
  if (count >= maxCount) {
    // read current team counts
    var water = parseInt(waterCountEl.textContent || "0", 10);
    var zero = parseInt(zeroCountEl.textContent || "0", 10);
    var power = parseInt(powerCountEl.textContent || "0", 10);

    var maxTeamCount = Math.max(water, zero, power);
    var winnerName = "";
    var winnerCard = null;

    if (maxTeamCount === water) {
      winnerName = "Team Water Wise";
      winnerCard = document.querySelector(".team-card.water");
    }
    if (maxTeamCount === zero && zero >= water) {
      winnerName = "Team Net Zero";
      winnerCard = document.querySelector(".team-card.zero");
    }
    if (maxTeamCount === power && power >= zero && power >= water) {
      winnerName = "Team Renewables";
      winnerCard = document.querySelector(".team-card.power");
    }

    // remove previous winners and add to current
    document.querySelectorAll(".team-card").forEach(function (el) {
      el.classList.remove("winner");
    });
    if (winnerCard) {
      winnerCard.classList.add("winner");
    }

    // show celebration message
    greetingEl.textContent = `Goal reached! 🎉 Winning team: ${winnerName}`;
    greetingEl.classList.add("success-message", "celebration");
    console.log(greetingEl.textContent);
  }

  form.reset();
});
