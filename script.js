// get all needed DOM elemets
const form = document.getElementedById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

//track attendene
let count = 0;
const maxCount = 50;

// handle submisson dorm
form.addEventListener("submit", function (event){

event.preventDefault();

const name = nameInput.value;
const team = teamSelect.value;
const teamName = teamSelect.selectedOptions[0].text;

console.log(name, teamName);

//increment
count++
console.log("total check-ins", count);

// update prog bar

const percent = Math.round((count/maxCount) * 100) +"%";
console.log('progress:' ${percent});

// update team counter
const teamCounter = document.getElementById(team, + "count")
teamCounter.textContent = parseInt( teamCounter.textContent) + 1;

//welcome message
const message =' welcome, ${name} from ${teamName}';
console.log(message);
form.reset();
}); 