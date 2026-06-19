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
const attendeeListEl = document.getElementById("attendeeList");
const greetingEl = document.getElementById("greeting");
const restartBtn = document.getElementById("restartBtn");

// track attendance
let count = 0;
const maxCount = 50;
let attendees = [];

// persist keys
var STORAGE_KEYS = {
  count: "checkin_count",
  water: "team_water",
  zero: "team_zero",
  power: "team_power",
  attendees: "attendee_list",
};

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEYS.count, String(count));
    localStorage.setItem(
      STORAGE_KEYS.water,
      String(waterCountEl.textContent || "0"),
    );
    localStorage.setItem(
      STORAGE_KEYS.zero,
      String(zeroCountEl.textContent || "0"),
    );
    localStorage.setItem(
      STORAGE_KEYS.power,
      String(powerCountEl.textContent || "0"),
    );
    localStorage.setItem(STORAGE_KEYS.attendees, JSON.stringify(attendees));
  } catch (e) {
    console.warn("Could not save state to localStorage", e);
  }
}

function showGreeting(message, celebration) {
  greetingEl.textContent = message;
  greetingEl.style.display = "block";
  greetingEl.classList.remove("success-message", "celebration");
  if (celebration) {
    greetingEl.classList.add("success-message", "celebration");
  }
}

function checkForWinner() {
  if (count < maxCount) {
    document.querySelectorAll(".team-card").forEach(function (el) {
      el.classList.remove("winner");
    });
    greetingEl.classList.remove("success-message", "celebration");
    return;
  }

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

  document.querySelectorAll(".team-card").forEach(function (el) {
    el.classList.remove("winner");
  });
  if (winnerCard) {
    winnerCard.classList.add("winner");
  }

  greetingEl.textContent = `Goal reached! 🎉 Winning team: ${winnerName}`;
  greetingEl.style.display = "block";
  greetingEl.classList.add("success-message", "celebration");
  console.log(greetingEl.textContent);
}

function renderAttendeeList() {
  attendeeListEl.innerHTML = "";
  if (attendees.length === 0) {
    attendeeListEl.innerHTML =
      '<p class="empty-list">No attendees have checked in yet.</p>';
    return;
  }

  attendees.forEach(function (attendee) {
    var card = document.createElement("div");
    card.className = "attendee-card";
    card.innerHTML =
      '<span class="attendee-name">' +
      attendee.name +
      '</span><span class="attendee-team">' +
      attendee.teamName +
      "</span>";
    attendeeListEl.appendChild(card);
  });
}

function loadState() {
  try {
    var stored = parseInt(localStorage.getItem(STORAGE_KEYS.count) || "0", 10);
    count = isNaN(stored) ? 0 : stored;
    attendeeCountEl.textContent = count;
    waterCountEl.textContent = localStorage.getItem(STORAGE_KEYS.water) || "0";
    zeroCountEl.textContent = localStorage.getItem(STORAGE_KEYS.zero) || "0";
    powerCountEl.textContent = localStorage.getItem(STORAGE_KEYS.power) || "0";
    var storedAttendees = localStorage.getItem(STORAGE_KEYS.attendees);
    attendees = storedAttendees ? JSON.parse(storedAttendees) : [];
    renderAttendeeList();
    var percent = Math.round((count / maxCount) * 100) + "%";
    progressBar.style.width = percent;
    checkForWinner();
  } catch (e) {
    console.warn("Could not load state from localStorage", e);
  }
}

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

  attendees.push({
    name: name,
    teamName: teamName,
    team: team,
  });
  renderAttendeeList();

  // persist updated counts
  saveState();

  // personalized greeting for each attendee
  var message = `Welcome, ${name} from ${teamName}!`;
  showGreeting(message, false);
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

function resetCheckIn() {
  count = 0;
  attendees = [];
  attendeeCountEl.textContent = "0";
  waterCountEl.textContent = "0";
  zeroCountEl.textContent = "0";
  powerCountEl.textContent = "0";
  progressBar.style.width = "0%";
  greetingEl.textContent = "";
  greetingEl.style.display = "none";
  greetingEl.classList.remove("success-message", "celebration");
  document.querySelectorAll(".team-card").forEach(function (el) {
    el.classList.remove("winner");
  });
  renderAttendeeList();
  try {
    localStorage.removeItem(STORAGE_KEYS.count);
    localStorage.removeItem(STORAGE_KEYS.water);
    localStorage.removeItem(STORAGE_KEYS.zero);
    localStorage.removeItem(STORAGE_KEYS.power);
    localStorage.removeItem(STORAGE_KEYS.attendees);
  } catch (e) {
    console.warn("Could not clear localStorage", e);
  }
}

restartBtn.addEventListener("click", function () {
  resetCheckIn();
});

// initialize from storage on load
loadState();
