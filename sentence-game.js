// Cümle Ustası - Sentence Master Game

document.addEventListener("DOMContentLoaded", function() {
  // DOM referansları
  const sentenceGameSection = document.getElementById("sentenceGameSection");
  const sentenceLevelSelect = document.getElementById("sentenceLevelSelect");
  const sentenceGamePlay = document.getElementById("sentenceGamePlay");
  const sentenceGameOver = document.getElementById("sentenceGameOver");
  const sentenceScoreSpan = document.getElementById("sentenceScore");
  const sentenceQuestionNumSpan = document.getElementById("sentenceQuestionNum");
  const sentenceTimeSpan = document.getElementById("sentenceTime");
  const sentenceQuestionDiv = document.getElementById("sentenceQuestion");
  const sentenceChoicesDiv = document.getElementById("sentenceChoices");
  const sentenceFeedbackDiv = document.getElementById("sentenceFeedback");
  const sentenceFinalScore = document.getElementById("sentenceFinalScore");
  const sentencePlayAgain = document.getElementById("sentencePlayAgain");
  const startSentenceGameBtn = document.getElementById("startSentenceGame");

  let sentenceGameState = {
    level: null,
    questions: [],
    current: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    timer: null,
    time: 0,
    userAnswers: [],
    canAnswer: true // Her soruda sıfırla
  };

  const sentenceQuestionsData = {
    "A1-A2": [
      { type: "fill", q: "I ___ a student.", a: "am", choices: ["is", "am", "are", "be"] },
      { type: "order", q: ["She", "to", "goes", "school", "every", "day"], a: ["She", "goes", "to", "school", "every", "day"] },
      { type: "verb", q: "He ___ (play) football.", a: "plays", choices: ["play", "plays", "playing", "played"] },
      { type: "error", q: "She don't like apples.", a: "don't", choices: ["don't", "like", "apples", "No error"] },
      { type: "fill", q: "They ___ happy.", a: "are", choices: ["is", "am", "are", "be"] },
      { type: "order", q: ["We", "in", "live", "Ankara"], a: ["We", "live", "in", "Ankara"] },
      { type: "verb", q: "I ___ (read) a book.", a: "am reading", choices: ["read", "am reading", "reading", "reads"] },
      { type: "error", q: "He go to work every day.", a: "go", choices: ["go", "to", "work", "No error"] },
      { type: "fill", q: "It ___ cold today.", a: "is", choices: ["is", "are", "am", "be"] },
      { type: "order", q: ["My", "name", "is", "Ali"], a: ["My", "name", "is", "Ali"] }
    ],
    "B1-B2": [
      { type: "fill", q: "She ___ to the gym on Mondays.", a: "goes", choices: ["go", "goes", "going", "gone"] },
      { type: "order", q: ["They", "have", "never", "visited", "Istanbul"], a: ["They", "have", "never", "visited", "Istanbul"] },
      { type: "verb", q: "We ___ (study) English for two years.", a: "have studied", choices: ["studied", "have studied", "studying", "study"] },
      { type: "error", q: "He didn't went to the party.", a: "went", choices: ["didn't", "went", "party", "No error"] },
      { type: "fill", q: "The children ___ playing in the park.", a: "are", choices: ["is", "are", "was", "were"] },
      { type: "order", q: ["I", "will", "call", "you", "later"], a: ["I", "will", "call", "you", "later"] },
      { type: "verb", q: "She ___ (not/like) coffee.", a: "doesn't like", choices: ["don't like", "doesn't like", "not like", "isn't like"] },
      { type: "error", q: "We was at home yesterday.", a: "was", choices: ["was", "at", "home", "No error"] },
      { type: "fill", q: "My father ___ a doctor.", a: "is", choices: ["is", "are", "am", "be"] },
      { type: "order", q: ["The", "movie", "was", "very", "interesting"], a: ["The", "movie", "was", "very", "interesting"] }
    ],
    "C1-C2": [
      { type: "fill", q: "If I ___ more time, I would travel.", a: "had", choices: ["have", "had", "has", "having"] },
      { type: "order", q: ["Despite", "the", "rain", "they", "went", "out"], a: ["Despite", "the", "rain", "they", "went", "out"] },
      { type: "verb", q: "She ___ (write) three books so far.", a: "has written", choices: ["wrote", "has written", "writes", "writing"] },
      { type: "error", q: "Neither of the answers are correct.", a: "are", choices: ["Neither", "are", "correct", "No error"] },
      { type: "fill", q: "He ___ to have finished the project.", a: "claims", choices: ["claim", "claims", "claimed", "claiming"] },
      { type: "order", q: ["The", "book", "I", "read", "was", "amazing"], a: ["The", "book", "I", "read", "was", "amazing"] },
      { type: "verb", q: "They ___ (not/see) the film yet.", a: "haven't seen", choices: ["didn't see", "haven't seen", "not see", "don't see"] },
      { type: "error", q: "He don't know the answer.", a: "don't", choices: ["don't", "know", "answer", "No error"] },
      { type: "fill", q: "The results ___ announced tomorrow.", a: "will be", choices: ["will", "will be", "are", "is"] },
      { type: "order", q: ["She", "has", "been", "working", "here", "since", "2015"], a: ["She", "has", "been", "working", "here", "since", "2015"] }
    ]
  };

  function shuffleArray(arr) {
    return arr.map(x => [Math.random(), x]).sort().map(x => x[1]);
  }

  function startSentenceGameFlow(level) {
    sentenceGameState.level = level;
    sentenceGameState.questions = [];
    sentenceGameState.current = 0;
    sentenceGameState.score = 0;
    sentenceGameState.correct = 0;
    sentenceGameState.wrong = 0;
    sentenceGameState.userAnswers = [];
    sentenceGameState.time = 0;
    clearInterval(sentenceGameState.timer);
    // AI Modu ise placeholder göster
    if (level === "AI") {
      sentenceLevelSelect.style.display = "none";
      sentenceGamePlay.style.display = "none";
      sentenceGameOver.style.display = "flex";
      sentenceFinalScore.innerHTML = "AI Modu çok yakında!";
      return;
    }
    // Soruları seç
    let pool = sentenceQuestionsData[level] || sentenceQuestionsData["A1-A2"];
    sentenceGameState.questions = shuffleArray(pool).slice(0, 10);
    sentenceLevelSelect.style.display = "none";
    sentenceGamePlay.style.display = "flex";
    sentenceGameOver.style.display = "none";
    nextSentenceQuestion();
    // Zamanlayıcı başlat
    sentenceGameState.time = 0;
    sentenceTimeSpan.textContent = sentenceGameState.time;
    sentenceGameState.timer = setInterval(() => {
      sentenceGameState.time++;
      sentenceTimeSpan.textContent = sentenceGameState.time;
    }, 1000);
  }

  function getTimeForLevel(level) {
  if (level === "A1-A2") return 10;
  if (level === "B1-B2") return 7;
  if (level === "C1-C2") return 5;
  return 7;
}

function nextSentenceQuestion() {
  // Her yeni soruda eski timer'ı kesinlikle temizle
  if (sentenceGameState.timer) {
    clearInterval(sentenceGameState.timer);
    sentenceGameState.timer = null;
  }

  if (sentenceGameState.current >= sentenceGameState.questions.length) {
    endSentenceGame();
    return;
  }
  const qObj = sentenceGameState.questions[sentenceGameState.current];
  sentenceQuestionNumSpan.textContent = sentenceGameState.current + 1;
  sentenceScoreSpan.textContent = sentenceGameState.score;
  sentenceFeedbackDiv.textContent = "";

  let time = 10;
  sentenceTimeSpan.textContent = time;
  sentenceGameState.canAnswer = true;
  sentenceGameState.timer = setInterval(() => {
    time--;
    if (time < 0) time = 0;
    sentenceTimeSpan.textContent = time;
    if (time === 0 && sentenceGameState.canAnswer) {
      sentenceGameState.canAnswer = false;
      clearInterval(sentenceGameState.timer);
      handleTimeout(qObj);
    }
  }, 1000);

  if (["fill", "verb", "error"].includes(qObj.type)) {
    sentenceQuestionDiv.innerHTML = qObj.q;
    sentenceChoicesDiv.innerHTML = "";
    qObj.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "sentence-choice-btn";
      btn.textContent = choice;
      btn.onclick = () => {
        if (!sentenceGameState.canAnswer) return;
        sentenceGameState.canAnswer = false;
        clearInterval(sentenceGameState.timer);
        selectSentenceChoice(choice);
      };
      sentenceChoicesDiv.appendChild(btn);
    });
  } else if (qObj.type === "order") {
    sentenceQuestionDiv.innerHTML = "Kelimeleri doğru sıraya dizin:";
    sentenceChoicesDiv.innerHTML = "";
    const dropRow = document.createElement("div");
    dropRow.className = "sentence-drop-row";
    dropRow.id = "dropRow";
    sentenceChoicesDiv.appendChild(dropRow);
    const placeholder = document.createElement("span");
    placeholder.className = "sentence-drop-placeholder";
    placeholder.textContent = "Kelimeleri buraya sürükleyin";
    dropRow.appendChild(placeholder);
    let mixed = shuffleArray(qObj.q);
    mixed.forEach(word => {
      const dragBtn = document.createElement("button");
      dragBtn.className = "sentence-draggable";
      dragBtn.textContent = word;
      dragBtn.setAttribute("draggable", "true");
      dragBtn.dataset.word = word;
      dragBtn.addEventListener("dragstart", dragStartHandler);
      dragBtn.addEventListener("dragend", dragEndHandler);
      sentenceChoicesDiv.appendChild(dragBtn);
    });
    dropRow.addEventListener("dragover", e => {
      e.preventDefault();
      dropRow.classList.add("dragover");
    });
    dropRow.addEventListener("dragleave", () => dropRow.classList.remove("dragover"));
    dropRow.addEventListener("drop", e => {
      e.preventDefault();
      dropRow.classList.remove("dragover");
      if (!sentenceGameState.canAnswer) return;
      const word = e.dataTransfer.getData("text/plain");
      if (!sentenceGameState.orderAnswer) sentenceGameState.orderAnswer = [];
      if (sentenceGameState.orderAnswer.includes(word)) return;
      if (dropRow.querySelector('.sentence-drop-placeholder')) dropRow.querySelector('.sentence-drop-placeholder').remove();
      sentenceGameState.orderAnswer.push(word);
      renderDropRow(dropRow, qObj);
      Array.from(sentenceChoicesDiv.children).forEach(btn => {
        if (btn.classList.contains('sentence-draggable') && btn.textContent === word) {
          btn.style.opacity = 0.5;
          btn.setAttribute('draggable', 'false');
        }
      });
      if (sentenceGameState.orderAnswer.length === qObj.a.length) {
        sentenceGameState.canAnswer = false;
        clearInterval(sentenceGameState.timer);
        checkOrderAnswer(qObj, dropRow);
      }
    });
    sentenceGameState.orderAnswer = [];
  }
}

function handleTimeout(qObj) {
  if (qObj.type === "order") {
    const answerSoFar = sentenceGameState.orderAnswer ? [...sentenceGameState.orderAnswer] : [];
    sentenceFeedbackDiv.textContent = `Süre bitti! Doğru sıra: ${qObj.a.join(" ")}`;
    sentenceFeedbackDiv.style.color = "#d32f2f";
    sentenceGameState.userAnswers.push({ q: qObj, user: answerSoFar, correct: false });
  } else {
    sentenceFeedbackDiv.textContent = `Süre bitti! Doğru cevap: ${qObj.a}`;
    sentenceFeedbackDiv.style.color = "#d32f2f";
    sentenceGameState.userAnswers.push({ q: qObj, user: null, correct: false });
  }
  sentenceGameState.score -= 2;
  sentenceGameState.wrong++;
  setTimeout(() => {
    sentenceGameState.current++;
    nextSentenceQuestion();
  }, 1000);
}


  function getInstructionText(type) {
    if (type === "fill") return "Aşağıdaki cümlede boşluğu doğru şekilde tamamlayın.";
    if (type === "order") return "Kelimeleri doğru sıraya dizin.";
    if (type === "verb") return "Cümledeki fiil için doğru formu seçin.";
    if (type === "error") return "Aşağıdaki cümlede nerede yanlışlık vardır?";
    return "";
  }

  function nextSentenceQuestion() {
    if (sentenceGameState.current >= sentenceGameState.questions.length) {
      endSentenceGame();
      return;
    }
    const qObj = sentenceGameState.questions[sentenceGameState.current];
    sentenceQuestionNumSpan.textContent = sentenceGameState.current + 1;
    sentenceScoreSpan.textContent = sentenceGameState.score;
    sentenceFeedbackDiv.textContent = "";

    // Açıklama
    const instructionDiv = document.getElementById("sentenceInstruction");
    instructionDiv.textContent = getInstructionText(qObj.type);

    // --- ZAMAN YOK ---
    clearInterval(sentenceGameState.timer);
    sentenceTimeSpan.textContent = "-";
    sentenceGameState.canAnswer = true;

    if (qObj.type === "fill" || qObj.type === "verb" || qObj.type === "error") {
      sentenceQuestionDiv.innerHTML = qObj.q;
      sentenceChoicesDiv.innerHTML = "";
      qObj.choices.forEach((choice, idx) => {
        const btn = document.createElement("button");
        btn.className = "sentence-choice-btn";
        btn.textContent = choice;
        btn.onclick = () => {
          if (!sentenceGameState.canAnswer) return;
          sentenceGameState.canAnswer = false;
          selectSentenceChoice(choice);
        };
        sentenceChoicesDiv.appendChild(btn);
      });
    } else if (qObj.type === "order") {
      // --- DRAG & DROP ORDER ---
      sentenceQuestionDiv.innerHTML = "Kelimeleri doğru sıraya dizin:";
      sentenceChoicesDiv.innerHTML = "";
      // Drop row (boş satır)
      const dropRow = document.createElement("div");
      dropRow.className = "sentence-drop-row";
      dropRow.id = "dropRow";
      sentenceChoicesDiv.appendChild(dropRow);
      // Placeholder
      const placeholder = document.createElement("span");
      placeholder.className = "sentence-drop-placeholder";
      placeholder.textContent = "Kelimeleri buraya sürükleyin";
      dropRow.appendChild(placeholder);
      // Kelimeler (karışık)
      let mixed = shuffleArray(qObj.q);
      // Drag kaynakları
      mixed.forEach((word, idx) => {
        const dragBtn = document.createElement("button");
        dragBtn.className = "sentence-draggable";
        dragBtn.textContent = word;
        dragBtn.setAttribute("draggable", "true");
        dragBtn.dataset.word = word;
        dragBtn.dataset.idx = idx;
        dragBtn.addEventListener("dragstart", dragStartHandler);
        dragBtn.addEventListener("dragend", dragEndHandler);
        sentenceChoicesDiv.appendChild(dragBtn);
      });
      // Drop events
      dropRow.addEventListener("dragover", function(e) {
        e.preventDefault();
        dropRow.classList.add("dragover");
      });
      dropRow.addEventListener("dragleave", function(e) {
        dropRow.classList.remove("dragover");
      });
      dropRow.addEventListener("drop", function(e) {
        e.preventDefault();
        dropRow.classList.remove("dragover");
        if (!sentenceGameState.canAnswer) return;
        const word = e.dataTransfer.getData("text/plain");
        if (!sentenceGameState.orderAnswer) sentenceGameState.orderAnswer = [];
        // Aynı kelime iki kez eklenmesin
        if (sentenceGameState.orderAnswer.includes(word)) return;
        // Placeholder'ı kaldır
        if (dropRow.querySelector('.sentence-drop-placeholder')) {
          dropRow.querySelector('.sentence-drop-placeholder').remove();
        }
        // Yeni kelimeyi ekle
        sentenceGameState.orderAnswer.push(word);
        renderDropRow(dropRow, qObj);
        // Kaynaktaki butonu pasifleştir
        Array.from(sentenceChoicesDiv.children).forEach(btn => {
          if (btn.classList.contains('sentence-draggable') && btn.textContent === word) {
            btn.style.opacity = 0.5;
            btn.setAttribute('draggable', 'false');
          }
        });
        // Cevap tamamlandıysa kontrol et
        if (sentenceGameState.orderAnswer.length === qObj.a.length) {
          sentenceGameState.canAnswer = false;
          checkOrderAnswer(qObj, dropRow);
        }
      });
      // Sürüklenen kelimeyi dropRow'da swap edebilmek için
      dropRow.addEventListener("dragstart", function(e) {
        if (e.target.classList.contains('drop-word')) {
          e.dataTransfer.setData("text/plain", e.target.dataset.word);
          e.dataTransfer.effectAllowed = "move";
          e.target.classList.add("swap");
        }
      });
      dropRow.addEventListener("dragend", function(e) {
        if (e.target.classList.contains('drop-word')) {
          e.target.classList.remove("swap");
        }
      });
      dropRow.addEventListener("drop", function(e) {
        // Swap işlemi
        if (!sentenceGameState.canAnswer) return;
        const fromWord = e.dataTransfer.getData("text/plain");
        if (e.target.classList.contains('drop-word')) {
          const toWord = e.target.dataset.word;
          const idxFrom = sentenceGameState.orderAnswer.indexOf(fromWord);
          const idxTo = sentenceGameState.orderAnswer.indexOf(toWord);
          if (idxFrom !== -1 && idxTo !== -1 && idxFrom !== idxTo) {
            // Swap
            [sentenceGameState.orderAnswer[idxFrom], sentenceGameState.orderAnswer[idxTo]] = [sentenceGameState.orderAnswer[idxTo], sentenceGameState.orderAnswer[idxFrom]];
            renderDropRow(dropRow, qObj);
          }
        }
      });
      // Sıfırla
      sentenceGameState.orderAnswer = [];
    }
  }

  function selectSentenceChoice(choice) {
    const qObj = sentenceGameState.questions[sentenceGameState.current];
    let correct = false;
    if (qObj.a === choice) {
      correct = true;
      sentenceGameState.score += 10;
      sentenceGameState.correct++;
      sentenceFeedbackDiv.textContent = "Doğru!";
      sentenceFeedbackDiv.style.color = "#388e3c";
    } else {
      sentenceGameState.score -= 2;
      sentenceGameState.wrong++;
      sentenceFeedbackDiv.textContent = `Yanlış! Doğru cevap: ${qObj.a}`;
      sentenceFeedbackDiv.style.color = "#d32f2f";
    }
    sentenceGameState.userAnswers.push({q: qObj, user: choice, correct});
    setTimeout(() => {
      sentenceGameState.current++;
      nextSentenceQuestion();
    }, 900);
  }

  function dragStartHandler(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.word);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => { e.target.classList.add("dragging"); }, 0);
  }
  function dragEndHandler(e) {
    e.target.classList.remove("dragging");
  }

  function renderDropRow(dropRow, qObj) {
    dropRow.innerHTML = "";
    if (!sentenceGameState.orderAnswer || sentenceGameState.orderAnswer.length === 0) {
      const placeholder = document.createElement("span");
      placeholder.className = "sentence-drop-placeholder";
      placeholder.textContent = "Kelimeleri buraya sürükleyin";
      dropRow.appendChild(placeholder);
      return;
    }
    sentenceGameState.orderAnswer.forEach((word, idx) => {
      const wordBtn = document.createElement("button");
      wordBtn.className = "sentence-draggable drop-word placed";
      wordBtn.textContent = word;
      wordBtn.setAttribute("draggable", "true");
      wordBtn.dataset.word = word;
      wordBtn.addEventListener("dragstart", dragStartHandler);
      wordBtn.addEventListener("dragend", dragEndHandler);
      dropRow.appendChild(wordBtn);
    });
  }

  function checkOrderAnswer(qObj, dropRow) {
    let correct = JSON.stringify(sentenceGameState.orderAnswer) === JSON.stringify(qObj.a);
    if (correct) {
      sentenceGameState.score += 10;
      sentenceGameState.correct++;
      sentenceFeedbackDiv.textContent = "Doğru!";
      sentenceFeedbackDiv.style.color = "#388e3c";
    } else {
      sentenceGameState.score -= 2;
      sentenceGameState.wrong++;
      sentenceFeedbackDiv.textContent = `Yanlış! Doğru sıra: ${qObj.a.join(" ")}`;
      sentenceFeedbackDiv.style.color = "#d32f2f";
    }
    sentenceGameState.userAnswers.push({q: qObj, user: [...sentenceGameState.orderAnswer], correct});
    setTimeout(() => {
      sentenceGameState.current++;
      nextSentenceQuestion();
    }, 1200);
  }

  function endSentenceGame() {
    clearInterval(sentenceGameState.timer);
    sentenceGamePlay.style.display = "none";
    sentenceGameOver.style.display = "flex";
    let accuracy = Math.round((sentenceGameState.correct / sentenceGameState.questions.length) * 100);
    sentenceFinalScore.innerHTML = `Doğru: <b>${sentenceGameState.correct}</b> / Yanlış: <b>${sentenceGameState.wrong}</b><br>Skor: <b>${sentenceGameState.score}</b><br>Doğruluk: <b>${accuracy}%</b>`;
  // Yanlış cevap özetini göster
const summaryDiv = document.getElementById("sentenceSummary");
if (summaryDiv) {
  const wrongs = sentenceGameState.userAnswers.filter(ans => !ans.correct);
  if (wrongs.length === 0) {
    summaryDiv.innerHTML = "<h3>Tebrikler! Tüm sorular doğru 🎉</h3>";
  } else {
    let html = "<h3>Yanlış Yaptığın Sorular</h3><ul>";
    wrongs.forEach((ans, i) => {
      const qText = typeof ans.q.q === "string" ? ans.q.q : ans.q.q.join(" ");
      const userAnswer = Array.isArray(ans.user) ? ans.user.join(" ") : (ans.user ?? "Cevap verilmedi");
      const correctAnswer = Array.isArray(ans.q.a) ? ans.q.a.join(" ") : ans.q.a;
      const instruction = getInstructionText(ans.q.type);
      html += `
        <li style="margin-bottom:1em;">
          <div><strong>Soru ${i + 1}:</strong> ${qText}</div>
          <div><em>${instruction}</em></div>
          <div><span style="color:#d32f2f;">Senin cevabın:</span> ${userAnswer}</div>
          <div><span style="color:#388e3c;">Doğru cevap:</span> ${correctAnswer}</div>
        </li>`;
    });
    html += "</ul>";
    summaryDiv.innerHTML = html;
  }
}

  }

  // Silver, Gold, Platinum -> A2, B1, B2-C1 eşlemesi
  function getLevelFromRadio() {
    if (document.getElementById('glass-a1a2').checked) return 'A1-A2';
    if (document.getElementById('glass-b1b2').checked) return 'B1-B2';
    if (document.getElementById('glass-c1c2').checked) return 'C1-C2';
    if (document.getElementById('glass-ai').checked) return 'AI';
    return 'A1-A2';
  }

  if (startSentenceGameBtn) {
    startSentenceGameBtn.onclick = function() {
      const level = getLevelFromRadio();
      startSentenceGameFlow(level);
    };
  }
if (sentencePlayAgain) {
  sentencePlayAgain.onclick = function() {
    // Sadece ekranları ayarla — oyunu baştan başlatma
    sentenceLevelSelect.style.display = "flex";
    sentenceGamePlay.style.display = "none";
    sentenceGameOver.style.display = "none";
  };
}


}); 