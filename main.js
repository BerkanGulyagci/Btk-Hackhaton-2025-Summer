// Modern bilingual word match game

const wordPools = {
  "A1-A2": [
    { en: "cat", tr: "kedi" },
    { en: "dog", tr: "köpek" },
    { en: "house", tr: "ev" },
    { en: "book", tr: "kitap" },
    { en: "car", tr: "araba" },
    { en: "water", tr: "su" },
    { en: "apple", tr: "elma" },
    { en: "school", tr: "okul" },
    { en: "sun", tr: "güneş" },
    { en: "table", tr: "masa" },
    { en: "chair", tr: "sandalye" },
    { en: "pen", tr: "kalem" },
    { en: "window", tr: "pencere" },
    { en: "door", tr: "kapı" },
    { en: "milk", tr: "süt" },
    { en: "bread", tr: "ekmek" },
    { en: "tree", tr: "ağaç" },
    { en: "bird", tr: "kuş" },
    { en: "fish", tr: "balık" },
    { en: "flower", tr: "çiçek" }
  ],
  "B1-B2": [
    { en: "challenge", tr: "meydan okuma" },
    { en: "improve", tr: "geliştirmek" },
    { en: "solution", tr: "çözüm" },
    { en: "opinion", tr: "görüş" },
    { en: "environment", tr: "çevre" },
    { en: "opportunity", tr: "fırsat" },
    { en: "responsible", tr: "sorumlu" },
    { en: "experience", tr: "deneyim" },
    { en: "decision", tr: "karar" },
    { en: "support", tr: "destek" },
    { en: "community", tr: "topluluk" },
    { en: "increase", tr: "artırmak" },
    { en: "reduce", tr: "azaltmak" },
    { en: "require", tr: "gerektirmek" },
    { en: "suggestion", tr: "öneri" },
    { en: "achievement", tr: "başarı" },
    { en: "attend", tr: "katılmak" },
    { en: "compare", tr: "karşılaştırmak" },
    { en: "describe", tr: "tanımlamak" },
    { en: "prepare", tr: "hazırlamak" }
  ],
  "C1-C2": [
    { en: "comprehensive", tr: "kapsamlı" },
    { en: "notwithstanding", tr: "-e rağmen" },
    { en: "subsequently", tr: "sonradan" },
    { en: "predominantly", tr: "çoğunlukla" },
    { en: "contemplate", tr: "düşünüp taşınmak" },
    { en: "perceive", tr: "algılamak" },
    { en: "convey", tr: "iletmek" },
    { en: "detrimental", tr: "zararlı" },
    { en: "inadvertently", tr: "yanlışlıkla" },
    { en: "meticulous", tr: "titiz" },
    { en: "notion", tr: "kavram" },
    { en: "prevalent", tr: "yaygın" },
    { en: "scrutiny", tr: "inceleme" },
    { en: "substantiate", tr: "kanıtlamak" },
    { en: "ubiquitous", tr: "her yerde bulunan" },
    { en: "vindicate", tr: "aklamak" },
    { en: "alleviate", tr: "hafifletmek" },
    { en: "conspicuous", tr: "göze çarpan" },
    { en: "elaborate", tr: "ayrıntılı" },
    { en: "facetious", tr: "nükteli" }
  ]
};

let currentLevel = null;
let currentWords = [];
let score = 0;
let questionNum = 1;
let totalQuestions = 10;
let time = 0;
let timer = null;
let currentWord = null;
let choices = [];
let canAnswer = true;
let correctCount = 0;
let wrongCount = 0;
let userAnswers = [];

const levelSelect = document.getElementById("levelSelect");
const gameSection = document.getElementById("gameSection");
const wordDisplay = document.getElementById("wordDisplay");
const scoreSpan = document.getElementById("score");
const questionNumSpan = document.getElementById("questionNum");
const timeSpan = document.getElementById("time");
const message = document.getElementById("message");
const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const playAgain = document.getElementById("playAgain");
const infoButton = document.getElementById("infoButton");
const infoModal = document.getElementById("infoModal");
const closeInfo = document.getElementById("closeInfo");
const choicesDiv = document.getElementById("choices");

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function getTimeForLevel(level) {
  if (level === "A1-A2") return 7;
  if (level === "B1-B2") return 5;
  if (level === "C1-C2") return 4;
  return 5;
}

function startGame(level) {
  currentLevel = level;
  currentWords = shuffle([...wordPools[level]]).slice(0, totalQuestions);
  score = 0;
  questionNum = 1;
  correctCount = 0;
  wrongCount = 0;
  userAnswers = [];
  gameSection.style.display = "flex";
  levelSelect.style.display = "none";
  gameOver.style.display = "none";
  scoreSpan.textContent = score;
  questionNumSpan.textContent = questionNum;
  // Özet kutusunu temizle
  const wrongSummary = document.getElementById("wrongSummary");
  if (wrongSummary) wrongSummary.innerHTML = "";
  // Spinner'ı göster
  const spinner = document.getElementById("timerSpinner");
  if (spinner) spinner.style.display = "inline-block";
  nextQuestion();
}

function nextQuestion() {
  canAnswer = true;
  message.textContent = "";
  if (questionNum > totalQuestions) {
    endGame();
    return;
  }
  currentWord = currentWords[questionNum - 1];
  wordDisplay.textContent = currentWord.en;
  // 3 yanlış şık seç
  let wrongs = shuffle(wordPools[currentLevel].filter(w => w.tr !== currentWord.tr)).slice(0, 3);
  choices = shuffle([
    { text: currentWord.tr, correct: true },
    ...wrongs.map(w => ({ text: w.tr, correct: false }))
  ]);
  renderChoices();
  time = getTimeForLevel(currentLevel);
  timeSpan.textContent = time;
  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timeSpan.textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      if (canAnswer) {
        canAnswer = false;
        wrongCount++;
        showAnswer(null); // Süre bitti, cevap yok
      }
    }
  }, 1000);
  // Spinner'ı göster
  const spinner = document.getElementById("timerSpinner");
  if (spinner) spinner.style.display = "inline-block";
}

function renderChoices() {
  choicesDiv.innerHTML = "";
  choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.onclick = () => selectChoice(idx);
    btn.disabled = !canAnswer;
    choicesDiv.appendChild(btn);
  });
}

function selectChoice(idx) {
  if (!canAnswer) return;
  canAnswer = false;
  clearInterval(timer);
  const isCorrect = choices[idx].correct;
  userAnswers.push({
    word: currentWord.en,
    correct: currentWord.tr,
    selected: choices[idx].text,
    isCorrect: !!isCorrect
  });
  if (isCorrect) {
    score++;
    correctCount++;
    message.textContent = "Correct!";
  } else {
    wrongCount++;
    message.textContent = "Wrong!";
  }
  // Şıkları renklendir
  Array.from(choicesDiv.children).forEach((btn, i) => {
    btn.disabled = true;
    if (choices[i].correct) btn.classList.add("correct");
    if (i === idx && !choices[i].correct) btn.classList.add("wrong");
  });
  scoreSpan.textContent = score;
  setTimeout(() => {
    questionNum++;
    questionNumSpan.textContent = questionNum <= totalQuestions ? questionNum : totalQuestions;
    nextQuestion();
  }, 1000);
}

function showAnswer(idx) {
  if (canAnswer) {
    userAnswers.push({
      word: currentWord.en,
      correct: currentWord.tr,
      selected: null,
      isCorrect: false
    });
  }
  // Süre bittiğinde veya cevap verilmediğinde
  Array.from(choicesDiv.children).forEach((btn, i) => {
    btn.disabled = true;
    if (choices[i].correct) btn.classList.add("correct");
    if (i === idx && !choices[i].correct) btn.classList.add("wrong");
  });
  message.textContent = "Time's up!";
  setTimeout(() => {
    questionNum++;
    questionNumSpan.textContent = questionNum <= totalQuestions ? questionNum : totalQuestions;
    nextQuestion();
  }, 1000);
}

function endGame() {
  gameSection.style.display = "none";
  gameOver.style.display = "flex";
  finalScore.innerHTML = `Correct: <b>${correctCount}</b> / Wrong: <b>${wrongCount}</b> <br> Score: <b>${score}</b>`;
  // Başarılıysa öneri ekle
  let nextLevel = null;
  if (currentLevel === "A1-A2") nextLevel = "B1-B2";
  else if (currentLevel === "B1-B2") nextLevel = "C1-C2";
  if (correctCount >= 7 && nextLevel) {
    finalScore.innerHTML += `<br><span style='color:#388e3c;font-weight:600;'>Tebrikler! Bir üst seviyeye geçebilirsiniz.</span><br><button id='nextLevelBtn' class='levelBtn' style='margin-top:10px;'>${nextLevel} Seviyesine Geç</button>`;
  }
  clearInterval(timer);
  renderWrongSummary();
  // Spinner'ı gizle
  const spinner = document.getElementById("timerSpinner");
  if (spinner) spinner.style.display = "none";
  // Yeni seviye butonu için event
  setTimeout(() => {
    const nextBtn = document.getElementById('nextLevelBtn');
    if (nextBtn) {
      nextBtn.onclick = () => startGame(nextLevel);
    }
  }, 0);
}

function renderWrongSummary() {
  const wrongSummary = document.getElementById("wrongSummary");
  if (!wrongSummary) return;
  const wrongs = userAnswers.filter(ans => !ans.isCorrect);
  if (wrongs.length === 0) {
    wrongSummary.innerHTML = '<h3>Perfect! All answers correct 🎉</h3>';
    return;
  }
  let html = '<h3>Wrong Answers</h3><ul>';
  wrongs.forEach(ans => {
    html += `<li><span class="q">${ans.word}</span> → <span class="y">${ans.selected ? ans.selected : 'No answer'}</span> <br><span class="a">Correct: ${ans.correct}</span></li>`;
  });
  html += '</ul>';
  wrongSummary.innerHTML = html;
}

playAgain.addEventListener("click", () => {
  startGame(currentLevel);
});

// Eski seviye butonları için event kaldırıldı
// Yeni radio group ve Start butonu için event:
const startGameBtn = document.getElementById("startGame");
if (startGameBtn) {
  startGameBtn.addEventListener("click", function() {
    // Seçili radio inputu bul
    const selectedRadio = document.querySelector('.glass-radio-group-vertical input[name="level"]:checked');
    if (selectedRadio) {
      const level = selectedRadio.value;
      startGame(level);
    }
  });
}

// Info modal
infoButton.addEventListener("click", () => {
  infoModal.classList.add("active");
});
closeInfo.addEventListener("click", () => {
  infoModal.classList.remove("active");
});

window.onload = () => {
  levelSelect.style.display = "flex";
  gameSection.style.display = "none";
  gameOver.style.display = "none";
  // Spinner'ı gizle
  const spinner = document.getElementById("timerSpinner");
  if (spinner) spinner.style.display = "none";
};