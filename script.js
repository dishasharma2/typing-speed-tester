   (() => {
      "use strict";

      // DOM Elements
      const paragraphContainer = document.getElementById("paragraphContainer");
      const typingInput = document.getElementById("typingInput");
      const wpmDisplay = document.getElementById("wpm");
      const accuracyDisplay = document.getElementById("accuracy");
      const timeElapsedDisplay = document.getElementById("timeElapsed");
      const correctCharsDisplay = document.getElementById("correctChars");
      const incorrectCharsDisplay = document.getElementById("incorrectChars");
      const restartBtn = document.getElementById("restartBtn");
      const randomParagraphBtn = document.getElementById("randomParagraphBtn");
      const timerSelect = document.getElementById("timerSelect");
      const darkModeToggle = document.getElementById("darkModeToggle");
      const darkModeIcon = document.getElementById("darkModeIcon");
      const darkModeLabel = document.getElementById("darkModeLabel");
      const soundToggleBtn = document.getElementById("soundToggleBtn");
      const soundIcon = document.getElementById("soundIcon");
      const volumeRange = document.getElementById("volumeRange");
      const customParagraphTextarea = document.getElementById("customParagraph");
      const useCustomParagraphBtn = document.getElementById("useCustomParagraphBtn");
      const typingSound = document.getElementById("typingSound");
      const progressBar = document.getElementById("progressBar");
      const confettiCanvas = document.getElementById("confettiCanvas");
      const resultModalTemplate = document.getElementById("resultModalTemplate");

      // State variables
      const defaultParagraphs = [
        "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is often used to test typing skills.",
        "Typing speed tests are a great way to improve your keyboard skills and increase your productivity in daily computer tasks.",
        "Practice makes perfect, so keep typing and challenge yourself to beat your previous best scores every day.",
        "JavaScript is a versatile language that can be used to create interactive web applications and dynamic user experiences.",
        "Tailwind CSS provides utility-first classes that make styling websites fast and efficient without writing custom CSS.",
        "Accessibility is crucial in web development to ensure that all users, including those with disabilities, can use your applications.",
        "Dark mode is a popular feature that reduces eye strain and saves battery life on devices with OLED screens.",
        "Responsive design allows websites to adapt their layout and content to different screen sizes and devices seamlessly.",
        "Frontend development requires a good understanding of HTML, CSS, and JavaScript to build engaging user interfaces.",
        "Consistent practice and learning new techniques are key to becoming a proficient and professional frontend developer.",
        "Typing tests help you build muscle memory and improve your overall typing speed and accuracy.",
        "Using a variety of paragraphs can help you get used to different word patterns and punctuation.",
        "The more you practice, the more confident and efficient you will become at typing.",
        "This app is designed to be accessible and easy to use for everyone, including those with disabilities.",
        "You can customize the test duration to fit your available time and goals.",
        "Typing speed is measured in words per minute, with accuracy being equally important.",
        "A good typing speed can boost your productivity and reduce fatigue during long computer sessions.",
        "Try to maintain a steady rhythm and avoid looking at the keyboard while typing.",
        "Remember to take breaks and stretch your hands to prevent strain and injury.",
        "Challenge yourself daily and watch your typing skills improve over time."
      ];

      let currentParagraph = "";
      let timer = null;
      let timeLeft = 0;
      let totalTime = 60; // default 60 seconds
      let isTestRunning = false;
      let startTime = null;
      let correctChars = 0;
      let incorrectChars = 0;
      let totalTyped = 0;
      let soundEnabled = true;
      let volume = 0.3;
      let darkMode = false;
      let fontSize = 18;
      let bestWPM = 0;

      // Confetti setup
      const confettiCtx = confettiCanvas.getContext("2d");
      let confettiParticles = [];
      let confettiAnimationId = null;

      // Motivational quotes for after test
      const motivationalQuotes = [
        "Keep up the great work!",
        "You're typing like a pro!",
        "Practice makes perfect!",
        "Amazing speed, keep going!",
        "Your fingers are flying!",
        "Typing mastery in progress!",
        "Great job, keep improving!",
        "You're on fire!",
        "Keep pushing your limits!",
        "Typing champion in the making!"
      ];

      // Save settings and user paragraph to localStorage
      function saveSettings() {
        localStorage.setItem("typingTestDuration", totalTime);
        localStorage.setItem("typingTestSoundEnabled", soundEnabled);
        localStorage.setItem("typingTestVolume", volume);
        localStorage.setItem("typingTestDarkMode", darkMode);
        localStorage.setItem("typingTestFontSize", fontSize);
        localStorage.setItem("typingTestBestWPM", bestWPM);
        if (customParagraphTextarea.value.trim()) {
          localStorage.setItem("typingTestCustomParagraph", customParagraphTextarea.value.trim());
        } else {
          localStorage.removeItem("typingTestCustomParagraph");
        }
      }

      // Load settings and user paragraph from localStorage
      function loadSettings() {
        const duration = localStorage.getItem("typingTestDuration");
        const sound = localStorage.getItem("typingTestSoundEnabled");
        const vol = localStorage.getItem("typingTestVolume");
        const theme = localStorage.getItem("typingTestDarkMode");
        const fSize = localStorage.getItem("typingTestFontSize");
        const best = localStorage.getItem("typingTestBestWPM");
        const customPara = localStorage.getItem("typingTestCustomParagraph");

        if (duration && ["30", "60", "180"].includes(duration)) {
          totalTime = parseInt(duration, 10);
          timerSelect.value = duration;
        } else {
          totalTime = 60;
          timerSelect.value = "60";
        }

        if (sound !== null) {
          soundEnabled = sound === "true";
        } else {
          soundEnabled = true;
        }

        if (vol !== null) {
          volume = parseFloat(vol);
          volumeRange.value = volume;
        } else {
          volume = 0.3;
          volumeRange.value = volume;
        }

        if (theme !== null) {
          darkMode = theme === "true";
        } else {
          darkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        }

        if (fSize !== null) {
          fontSize = parseInt(fSize, 10);
        } else {
          fontSize = 18;
        }

        if (best !== null) {
          bestWPM = parseInt(best, 10);
        } else {
          bestWPM = 0;
        }

        if (customPara !== null) {
          customParagraphTextarea.value = customPara;
        }
      }

      // Apply dark mode to document
      function applyDarkMode(enabled) {
        if (enabled) {
          document.documentElement.setAttribute("data-theme", "dark");
          document.documentElement.classList.add("dark");
          darkModeIcon.textContent = "🌙";
          darkModeLabel.textContent = "Dark";
          darkModeToggle.setAttribute("aria-pressed", "true");
        } else {
          document.documentElement.setAttribute("data-theme", "light");
          document.documentElement.classList.remove("dark");
          darkModeIcon.textContent = "☀️";
          darkModeLabel.textContent = "Light";
          darkModeToggle.setAttribute("aria-pressed", "false");
        }
      }

      // Apply font size to typing input and paragraph container
      function applyFontSize(size) {
        typingInput.style.fontSize = `${size}px`;
        paragraphContainer.style.fontSize = `${size}px`;
      }

      // Load a paragraph (random or custom) and wrap each character in a span
      function loadParagraph(paragraph = null) {
        paragraphContainer.innerHTML = "";
        currentParagraph = "";

        if (paragraph && paragraph.trim().length > 0) {
          currentParagraph = paragraph.trim();
        } else {
          // Pick random paragraph from default list
          const idx = Math.floor(Math.random() * defaultParagraphs.length);
          currentParagraph = defaultParagraphs[idx];
        }

        // Wrap each character in a span with untyped style
        for (const char of currentParagraph) {
          const span = document.createElement("span");
          span.textContent = char;
          span.classList.add("text-neutral-500", "select-none");
          paragraphContainer.appendChild(span);
        }
      }

      // Start the test on first keystroke
      function startTest() {
        if (isTestRunning) return;
        isTestRunning = true;
        startTime = Date.now();
        timeLeft = totalTime;
        updateTimerDisplay(timeLeft);
        typingInput.disabled = false;
        typingInput.focus();
        restartBtn.disabled = true;
        randomParagraphBtn.disabled = true;
        timerSelect.disabled = true;
        useCustomParagraphBtn.disabled = true;
        customParagraphTextarea.disabled = true;
        darkModeToggle.disabled = true;
        soundToggleBtn.disabled = true;
        volumeRange.disabled = true;
        updateStats();
        timer = setInterval(() => {
          timeLeft--;
          updateTimerDisplay(timeLeft);
          if (timeLeft <= 0) {
            endTest();
          }
        }, 1000);
      }

      // Update timer display
      function updateTimerDisplay(seconds) {
        timeElapsedDisplay.textContent = `${totalTime - seconds}s`;
      }

      // Update stats: WPM, accuracy, correct/incorrect chars
      function updateStats() {
        const minutesElapsed = (totalTime - timeLeft) / 60 || 1 / 60; // avoid div by zero
        const wpm = Math.round((correctChars / 5) / minutesElapsed);
        const accuracy = totalTyped === 0 ? 100 : Math.round((correctChars / totalTyped) * 100);

        wpmDisplay.textContent = wpm;
        accuracyDisplay.textContent = `${accuracy}%`;
        correctCharsDisplay.textContent = correctChars;
        incorrectCharsDisplay.textContent = incorrectChars;

        // Update progress bar width
        const progressPercent = Math.min((totalTyped / currentParagraph.length) * 100, 100);
        progressBar.style.width = `${progressPercent}%`;
      }

      // Compare input to paragraph and update spans colors
      function compareInputToText() {
        const input = typingInput.value;
        totalTyped = input.length;
        correctChars = 0;
        incorrectChars = 0;

        const spans = paragraphContainer.querySelectorAll("span");
        spans.forEach((span, idx) => {
          const char = input[idx];
          span.classList.remove(
            "text-green-500",
            "text-red-500",
            "underline",
            "animate-shake",
            "caret-blink",
            "text-neutral-500"
          );
          if (char == null) {
            span.classList.add("text-neutral-500");
          } else if (char === span.textContent) {
            span.classList.add("text-green-500");
            correctChars++;
          } else {
            span.classList.add("text-red-500", "underline", "animate-shake");
            incorrectChars++;
          }
        });

        // Add blinking caret to next character or last if done
        const caretIndex = input.length < spans.length ? input.length : spans.length - 1;
        spans.forEach((span, idx) => {
          if (idx === caretIndex) {
            span.classList.add("caret-blink");
          }
        });

        updateStats();
      }

      // Restart the test
      function restartTest() {
        clearInterval(timer);
        timer = null;
        isTestRunning = false;
        startTime = null;
        correctChars = 0;
        incorrectChars = 0;
        totalTyped = 0;
        timeLeft = totalTime;
        updateTimerDisplay(timeLeft);
        wpmDisplay.textContent = "0";
        accuracyDisplay.textContent = "100%";
        correctCharsDisplay.textContent = "0";
        incorrectCharsDisplay.textContent = "0";
        typingInput.value = "";
        typingInput.disabled = false;
        typingInput.focus();
        restartBtn.disabled = false;
        randomParagraphBtn.disabled = false;
        timerSelect.disabled = false;
        useCustomParagraphBtn.disabled = false;
        customParagraphTextarea.disabled = false;
        darkModeToggle.disabled = false;
        soundToggleBtn.disabled = false;
        volumeRange.disabled = false;
        progressBar.style.width = "0%";
        loadParagraph();
        stopConfetti();
      }

      // Play typing sound on valid keypress
      function handleTypingSound(event) {
        if (!soundEnabled) return;
        // Exclude keys: Backspace, Shift, Ctrl, Alt, Meta, CapsLock, Tab, Enter, Space
        if (
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.metaKey
        ) {
          typingSound.volume = volume;
          typingSound.currentTime = 0;
          typingSound.play().catch(() => {});
        }
      }

      // End the test and show results modal
      function endTest() {
        clearInterval(timer);
        timer = null;
        isTestRunning = false;
        typingInput.disabled = true;
        restartBtn.disabled = false;
        randomParagraphBtn.disabled = false;
        timerSelect.disabled = false;
        useCustomParagraphBtn.disabled = false;
        customParagraphTextarea.disabled = false;
        darkModeToggle.disabled = false;
        soundToggleBtn.disabled = false;
        volumeRange.disabled = false;

        // Calculate final stats
        const minutesElapsed = totalTime / 60;
        const wpm = Math.round((correctChars / 5) / minutesElapsed);
        const accuracy = totalTyped === 0 ? 100 : Math.round((correctChars / totalTyped) * 100);

        // Save best WPM
        if (wpm > bestWPM) {
          bestWPM = wpm;
          localStorage.setItem("typingTestBestWPM", bestWPM);
          startConfetti();
        }

        showResultsModal({ wpm, accuracy, totalTime, correctChars, incorrectChars });
      }

      // Show results modal overlay
      function showResultsModal({ wpm, accuracy, totalTime, correctChars, incorrectChars }) {
        const modalClone = resultModalTemplate.content.cloneNode(true);
        const modalOverlay = modalClone.querySelector("div[role='dialog']");
        const resultWPM = modalClone.getElementById("resultWPM");
        const resultAccuracy = modalClone.getElementById("resultAccuracy");
        const resultTime = modalClone.getElementById("resultTime");
        const resultCorrectChars = modalClone.getElementById("resultCorrectChars");
        const resultIncorrectChars = modalClone.getElementById("resultIncorrectChars");
        const motivationalMsg = modalClone.getElementById("motivationalMsg");
        const tryAgainBtn = modalClone.getElementById("tryAgainBtn");
        const shareBtn = modalClone.getElementById("shareBtn");
        const copyBtn = modalClone.getElementById("copyBtn");

        resultWPM.textContent = wpm;
        resultAccuracy.textContent = accuracy;
        resultTime.textContent = totalTime;
        resultCorrectChars.textContent = correctChars;
        resultIncorrectChars.textContent = incorrectChars;

        if (wpm >= 80) {
          motivationalMsg.textContent = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        } else {
          motivationalMsg.textContent = "Keep practicing to improve your speed and accuracy!";
        }

        document.body.appendChild(modalOverlay);

        // Focus trap for modal
        trapFocus(modalOverlay);

        // Event listeners
        tryAgainBtn.addEventListener("click", () => {
          document.body.removeChild(modalOverlay);
          restartTest();
        });

        shareBtn.addEventListener("click", () => {
          const shareText = `I just typed at ${wpm} WPM with ${accuracy}% accuracy in ${totalTime} seconds! Try the Typing Speed Tester by Disha Sharma: https://dishasharma02.github.io/typing-speed-tester`;
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
          window.open(twitterUrl, "_blank", "noopener,noreferrer");
        });

        copyBtn.addEventListener("click", () => {
          const copyText = `Typing Speed Tester Results:\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nTime: ${totalTime} seconds\nCorrect Characters: ${correctChars}\nIncorrect Characters: ${incorrectChars}`;
          navigator.clipboard.writeText(copyText).then(() => {
            copyBtn.textContent = "Copied!";
            setTimeout(() => {
              copyBtn.textContent = "Copy Results";
            }, 2000);
          });
        });

        // Close modal on Escape key or click outside modal content
        modalOverlay.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            if (document.body.contains(modalOverlay)) {
              document.body.removeChild(modalOverlay);
              restartTest();
            }
          }
        });

        modalOverlay.addEventListener("click", (e) => {
          if (e.target === modalOverlay) {
            if (document.body.contains(modalOverlay)) {
              document.body.removeChild(modalOverlay);
              restartTest();
            }
          }
        });
      }

      // Trap focus inside modal for accessibility
      function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
        );
        if (focusableElements.length === 0) return;
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];
        element.addEventListener("keydown", function trap(e) {
          if (e.key === "Tab") {
            if (e.shiftKey) {
              if (document.activeElement === firstEl) {
                e.preventDefault();
                lastEl.focus();
              }
            } else {
              if (document.activeElement === lastEl) {
                e.preventDefault();
                firstEl.focus();
              }
            }
          }
          if (e.key === "Escape") {
            e.preventDefault();
            if (document.body.contains(element)) {
              document.body.removeChild(element);
              restartTest();
            }
          }
        });
        firstEl.focus();
      }

      // Confetti particle class
      class ConfettiParticle {
        constructor(x, y, r, d, color) {
          this.x = x;
          this.y = y;
          this.r = r;
          this.d = d;
          this.color = color;
          this.tilt = Math.floor(Math.random() * 10) - 10;
          this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
          this.tiltAngle = 0;
        }
        draw(ctx) {
          ctx.beginPath();
          ctx.lineWidth = this.r / 2;
          ctx.strokeStyle = this.color;
          ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
          ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
          ctx.stroke();
        }
      }

      // Initialize confetti particles
      function initConfetti() {
        confettiParticles = [];
        const width = (confettiCanvas.width = window.innerWidth);
        const height = (confettiCanvas.height = window.innerHeight);
        const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"];
        for (let i = 0; i < 150; i++) {
          confettiParticles.push(
            new ConfettiParticle(
              Math.random() * width,
              Math.random() * height - height,
              Math.random() * 10 + 5,
              Math.random() * 20,
              colors[Math.floor(Math.random() * colors.length)]
            )
          );
        }
      }

      // Animate confetti
      function animateConfetti() {
        const width = confettiCanvas.width;
        const height = confettiCanvas.height;
        confettiCtx.clearRect(0, 0, width, height);
        confettiParticles.forEach((p) => {
          p.tiltAngle += p.tiltAngleIncremental;
          p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
          p.x += Math.sin(p.d);
          p.tilt = Math.sin(p.tiltAngle) * 15;

          if (p.y > height) {
            p.x = Math.random() * width;
            p.y = -20;
            p.tilt = Math.floor(Math.random() * 10) - 10;
          }
          p.draw(confettiCtx);
        });
        confettiAnimationId = requestAnimationFrame(animateConfetti);
      }

      // Start confetti animation
      function startConfetti() {
        initConfetti();
        animateConfetti();
        confettiCanvas.style.display = "block";
        setTimeout(stopConfetti, 5000);
      }

      // Stop confetti animation
      function stopConfetti() {
        if (confettiAnimationId) {
          cancelAnimationFrame(confettiAnimationId);
          confettiAnimationId = null;
        }
        confettiCanvas.style.display = "none";
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }

      // Event Listeners

      // Typing input events
      typingInput.addEventListener("keydown", (e) => {
        if (!isTestRunning && e.key.length === 1) {
          startTest();
        }
        if (isTestRunning) {
          handleTypingSound(e);
        }
      });

      typingInput.addEventListener("input", () => {
        if (!isTestRunning) return;
        compareInputToText();
      });

      // Restart button
      restartBtn.addEventListener("click", () => {
        restartTest();
      });

      // Load random paragraph button
      randomParagraphBtn.addEventListener("click", () => {
        restartTest();
      });

      // Timer select change
      timerSelect.addEventListener("change", () => {
        totalTime = parseInt(timerSelect.value, 10);
        restartTest();
      });

      // Dark mode toggle
      darkModeToggle.addEventListener("click", () => {
        darkMode = !darkMode;
        applyDarkMode(darkMode);
        saveSettings();
      });

      // Sound toggle button
      soundToggleBtn.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        soundToggleBtn.setAttribute("aria-pressed", soundEnabled.toString());
        if (soundEnabled) {
          soundIcon.classList.remove("fa-volume-mute");
          soundIcon.classList.add("fa-volume-up");
        } else {
          soundIcon.classList.remove("fa-volume-up");
          soundIcon.classList.add("fa-volume-mute");
        }
        saveSettings();
      });

      // Volume range change
      volumeRange.addEventListener("input", () => {
        volume = parseFloat(volumeRange.value);
        saveSettings();
      });

      // Use custom paragraph button
      useCustomParagraphBtn.addEventListener("click", () => {
        const customText = customParagraphTextarea.value.trim();
        if (customText.length === 0) {
          alert("Please enter a paragraph to use.");
          return;
        }
        loadParagraph(customText);
        restartTest();
        saveSettings();
      });

      // Window resize for confetti canvas
      window.addEventListener("resize", () => {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
      });

      // Initialization
      function init() {
        loadSettings();
        applyDarkMode(darkMode);
        applyFontSize(fontSize);
        loadParagraph(customParagraphTextarea.value.trim() || null);
        timeLeft = totalTime;
        updateTimerDisplay(timeLeft);
        wpmDisplay.textContent = "0";
        accuracyDisplay.textContent = "100%";
        correctCharsDisplay.textContent = "0";
        incorrectCharsDisplay.textContent = "0";
        typingInput.value = "";
        typingInput.disabled = false;
        restartBtn.disabled = false;
        randomParagraphBtn.disabled = false;
        timerSelect.disabled = false;
        useCustomParagraphBtn.disabled = false;
        customParagraphTextarea.disabled = false;
        darkModeToggle.disabled = false;
        soundToggleBtn.disabled = false;
        volumeRange.disabled = false;
        soundToggleBtn.setAttribute("aria-pressed", soundEnabled.toString());
        if (soundEnabled) {
          soundIcon.classList.remove("fa-volume-mute");
          soundIcon.classList.add("fa-volume-up");
        } else {
          soundIcon.classList.remove("fa-volume-up");
          soundIcon.classList.add("fa-volume-mute");
        }
        progressBar.style.width = "0%";
        confettiCanvas.style.display = "none";
      }

      // Initialize on DOM ready
      document.addEventListener("DOMContentLoaded", init);
    })();
