const mineBtn = document.getElementsByName('addcount')[0];
const autoBtn = document.getElementsByName('auto')[0];

const counterElement = document.getElementById('counter');
const bigCounter = document.getElementById('bigCounter');
const autoLevelEl = document.getElementById('autoLevel');
const autoSpeedEl = document.getElementById('autoSpeed');
const autoPriceEl = document.getElementById('autoPrice');
const statusChip = document.getElementById('statusChip');
const logEl = document.getElementById('log');

const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');

let currentCount = 0;

let autoLevel = 0;
let autoSpeedMs = 1000;
let autoPrice = 100;
let intervalId = null;

function log(msg){
  logEl.textContent = msg;
}

function animateButton() {
  // reset pour rejouer même si tu cliques vite
  mineBtn.classList.remove('animate');
  void mineBtn.offsetWidth;
  mineBtn.classList.add('animate');
}

function updateUI(){
  counterElement.innerText = currentCount;
  bigCounter.innerText = currentCount;

  autoLevelEl.innerText = autoLevel;
  autoSpeedEl.innerText = autoSpeedMs;
  autoPriceEl.innerText = autoPrice;

  autoBtn.disabled = currentCount < autoPrice;

  statusChip.textContent = autoLevel > 0 ? `Auto: ON (lvl ${autoLevel})` : "Auto: OFF";
}

function startOrRestartAuto(){
  if (intervalId !== null) clearInterval(intervalId);

  intervalId = setInterval(() => {
    currentCount++;
    updateUI();
  }, autoSpeedMs);
}

mineBtn.addEventListener("click", () => {
  currentCount++;
  animateButton();
  updateUI();
});

autoBtn.addEventListener("click", () => {
  if (currentCount >= autoPrice) {
    currentCount -= autoPrice;

    autoLevel++;

    // accélère (intervalle plus court)
    autoSpeedMs = Math.max(100, Math.floor(autoSpeedMs * 0.85));

    // (option) prix qui augmente un peu à chaque achat
    autoPrice = Math.floor(autoPrice * 1.35);

    startOrRestartAuto();
    updateUI();
    log(`Auto clicker acheté ! Niveau ${autoLevel}, vitesse ${autoSpeedMs}ms.`);
  }
});

resetBtn.addEventListener("click", () => {
  currentCount = 0;
  autoLevel = 0;
  autoSpeedMs = 1000;
  autoPrice = 100;

  if (intervalId !== null) clearInterval(intervalId);
  intervalId = null;

  updateUI();
  log("Reset effectué.");
});

saveBtn.addEventListener("click", () => {
  const save = { currentCount, autoLevel, autoSpeedMs, autoPrice };
  localStorage.setItem("mineSave", JSON.stringify(save));
  log("Sauvegardé dans localStorage ✅");
});

(function load(){
  const raw = localStorage.getItem("mineSave");
  if (raw){
    try{
      const save = JSON.parse(raw);
      currentCount = Number(save.currentCount) || 0;
      autoLevel = Number(save.autoLevel) || 0;
      autoSpeedMs = Number(save.autoSpeedMs) || 1000;
      autoPrice = Number(save.autoPrice) || 100;

      if (autoLevel > 0) startOrRestartAuto();
      log("Sauvegarde chargée ✅");
    } catch {
      log("Sauvegarde invalide.");
    }
  } else {
    log("Bienvenue 👋 Clique sur la mine pour commencer.");
  }

  updateUI();
})();
