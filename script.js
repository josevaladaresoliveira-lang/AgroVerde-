/* =============================================
   AGRO VERDE — script.js
   ============================================= */

"use strict";

// ── Quiz data ─────────────────────────────────
const questions = [
  {
    topic: "Solo & Nutrição",
    text: "O que é o sistema de plantio direto e qual o seu principal benefício para o solo?",
    options: [
      "Revolvimento profundo do solo para facilitar irrigação",
      "Cultivo sem revolvimento do solo, preservando sua estrutura e matéria orgânica",
      "Remoção de toda a cobertura vegetal antes do plantio",
      "Uso de máquinas pesadas para nivelar o terreno"
    ],
    correct: 1
  },
  {
    topic: "Uso da Água",
    text: "Qual prática agrícola é considerada a mais eficiente no uso da água de irrigação?",
    options: [
      "Irrigação por aspersão convencional",
      "Irrigação por inundação total",
      "Irrigação por gotejamento",
      "Irrigação por sulcos abertos"
    ],
    correct: 2
  },
  {
    topic: "Biodiversidade",
    text: "O que é agrofloresta e por que ela é importante para a sustentabilidade?",
    options: [
      "Sistema que elimina árvores nativas para priorizar monoculturas",
      "Uso exclusivo de pesticidas para proteger florestas adjacentes",
      "Sistema que integra cultivos agrícolas, árvores e criação animal, promovendo biodiversidade",
      "Técnica de desmatamento controlado para ampliar áreas produtivas"
    ],
    correct: 2
  },
  {
    topic: "Controle de Pragas",
    text: "O que é o Manejo Integrado de Pragas (MIP)?",
    options: [
      "Aplicação intensiva de agrotóxicos para eliminar todas as pragas",
      "Estratégia que combina métodos biológicos, culturais e químicos para controlar pragas com mínimo impacto ambiental",
      "Uso exclusivo de fungicidas sintéticos",
      "Abandono da área de cultivo quando há infestação de pragas"
    ],
    correct: 1
  },
  {
    topic: "Resíduos & Ciclo",
    text: "Como a compostagem contribui para a agricultura sustentável?",
    options: [
      "Substitui completamente a necessidade de irrigação",
      "Aumenta o uso de fertilizantes sintéticos nas lavouras",
      "Transforma resíduos orgânicos em adubo natural, reduzindo lixo e melhorando o solo",
      "Elimina a necessidade de rotação de culturas"
    ],
    correct: 2
  }
];

// ── State ──────────────────────────────────────
let currentQ   = 0;
let score      = 0;
let answered   = false;

// ── DOM refs ───────────────────────────────────
const screens = {
  home:   document.getElementById("home"),
  quiz:   document.getElementById("quiz"),
  result: document.getElementById("result")
};

const btnStart   = document.getElementById("btnStart");
const btnBack    = document.getElementById("btnBack");
const btnNext    = document.getElementById("btnNext");
const btnRestart = document.getElementById("btnRestart");

const qCurrent     = document.getElementById("qCurrent");
const qTotal       = document.getElementById("qTotal");
const progressFill = document.getElementById("progressFill");
const questionTopic = document.getElementById("questionTopic");
const questionText = document.getElementById("questionText");
const optionsGrid  = document.getElementById("optionsGrid");

const resultIcon  = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultSub   = document.getElementById("resultSub");
const resultMsg   = document.getElementById("resultMsg");
const scoreNum    = document.getElementById("scoreNum");
const ringFg      = document.getElementById("ringFg");

// ── Helpers ────────────────────────────────────
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo(0, 0);
}

function updateProgress() {
  const pct = (currentQ / questions.length) * 100;
  progressFill.style.width = pct + "%";
  qCurrent.textContent = currentQ + 1;
  qTotal.textContent   = questions.length;
}

function renderQuestion() {
  answered = false;
  btnNext.disabled = true;

  const q = questions[currentQ];
  questionTopic.textContent = q.topic;
  questionText.textContent  = q.text;

  // Clear previous options
  optionsGrid.innerHTML = "";

  const letters = ["A", "B", "C", "D"];

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${opt}</span>`;
    btn.addEventListener("click", () => selectOption(btn, i));
    optionsGrid.appendChild(btn);
  });

  updateProgress();
}

function selectOption(selectedBtn, index) {
  if (answered) return;
  answered = true;

  const q = questions[currentQ];
  const allBtns = optionsGrid.querySelectorAll(".option-btn");

  allBtns.forEach(b => b.disabled = true);

  if (index === q.correct) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("wrong");
    allBtns[q.correct].classList.add("correct");
  }

  btnNext.disabled = false;

  // Last question: update button label
  if (currentQ === questions.length - 1) {
    btnNext.innerHTML = `Ver resultado
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>`;
  }
}

function nextQuestion() {
  currentQ++;

  if (currentQ < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  showScreen("result");
  renderResult();
}

function renderResult() {
  const pct = score / questions.length;

  // Animate score ring (circumference = 2π × 50 ≈ 314.16)
  const circumference = 314.16;
  const offset = circumference - pct * circumference;
  setTimeout(() => {
    ringFg.style.strokeDashoffset = offset;
  }, 100);

  scoreNum.textContent = score;

  // Tier messages
  if (score === 5) {
    resultIcon.textContent  = "🌿";
    resultTitle.textContent = "Especialista Verde!";
    resultSub.textContent   = "Pontuação máxima";
    resultMsg.textContent   = "Parabéns! Você demonstrou um conhecimento excelente sobre agricultura sustentável. Continue espalhando essa consciência pelo mundo.";
  } else if (score >= 3) {
    resultIcon.textContent  = "🌱";
    resultTitle.textContent = "Bom trabalho!";
    resultSub.textContent   = "Quase lá";
    resultMsg.textContent   = "Você já tem uma boa base sobre sustentabilidade no campo. Revise os temas onde errou e continue aprendendo — o planeta agradece!";
  } else if (score >= 1) {
    resultIcon.textContent  = "🌾";
    resultTitle.textContent = "Continue aprendendo";
    resultSub.textContent   = "Ainda há espaço para crescer";
    resultMsg.textContent   = "Sustentabilidade é um tema vasto e sempre há algo novo para descobrir. Não desanime — tente novamente e explore mais sobre agricultura sustentável!";
  } else {
    resultIcon.textContent  = "🪴";
    resultTitle.textContent = "Todo começo é válido";
    resultSub.textContent   = "Hora de estudar!";
    resultMsg.textContent   = "Que tal explorar mais sobre agricultura sustentável? É um tema fascinante que impacta diretamente nossa vida e o futuro do planeta.";
  }
}

function restartQuiz() {
  currentQ = 0;
  score    = 0;
  answered = false;

  // Reset ring
  ringFg.style.strokeDashoffset = "314.16";

  // Reset next button label
  btnNext.innerHTML = `Próxima pergunta
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>`;

  renderQuestion();
  showScreen("quiz");
}

// ── Events ──────────────────────────────────────
btnStart.addEventListener("click", () => {
  currentQ = 0;
  score    = 0;
  renderQuestion();
  showScreen("quiz");
});

btnBack.addEventListener("click", () => showScreen("home"));

btnNext.addEventListener("click", () => {
  if (!answered) return;
  nextQuestion();
});

btnRestart.addEventListener("click", restartQuiz);
