const button = document.getElementsByName('addcount')[0];
const auto = document.getElementsByName('auto')[0];
const counterElement = document.getElementById('counter');

let currentCount = 0;

let autoLevel = 0;        
let autoSpeedMs = 1000;     
let intervalId = null;

function animateButton() { 
    button.classList.add('animate');
    setTimeout(() => { 
        button.classList.remove('animate'); 
    }, 300); 
}

button.addEventListener("click", () => {
  animateButton();
});

function updateCounter() {
  counterElement.innerText = currentCount;
  auto.disabled = currentCount < 100;
}

function startOrRestartAutoClick() {
  if (intervalId !== null) clearInterval(intervalId);

  intervalId = setInterval(() => {
    currentCount++;
    updateCounter();
  }, autoSpeedMs);
}

button.addEventListener("click", () => {
  currentCount++;
  updateCounter();
});

auto.addEventListener("click", () => {
  if (currentCount >= 100) {
    currentCount -= 100;
    autoLevel++;
    autoSpeedMs = Math.max(100, Math.floor(autoSpeedMs * 0.65));

    startOrRestartAutoClick();
    updateCounter();
  }
});

updateCounter();
