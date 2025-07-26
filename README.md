
# ⚡ Typing Speed Tester

A fully responsive, dynamic **Typing Speed Tester** web application built using **Vanilla JavaScript**, **HTML5**, and **modern CSS3**. This project offers a real-time typing experience with speed and accuracy calculations, a timer selector, dark mode toggle, paragraph randomization, and restart functionality — all without using any external libraries or frameworks.

Developed by [Disha Sharma](https://github.com/dishasharma2), this app demonstrates strong DOM manipulation, real-time data processing, custom animations, and component-based UI design patterns using pure frontend technologies.

---

## 🖼️ Preview

![Typing Speed Tester Preview](screenshot.png) <!-- You can add a real screenshot later -->

👉 **Live Demo**: [Typing Speed Tester](https://dishasharma2.github.io/typing-speed-tester)  

---

## 🧠 Project Objectives

- Build a performance-optimized frontend project without libraries
- Practice precise **DOM manipulation** and **event-driven architecture**
- Implement a real-time typing algorithm from scratch
- Enhance UI/UX with smooth animations and accessibility
- Apply **Mobile-first responsive design principles**
- Provide recruiters with a demonstration of real-world coding skills

---

## 🚀 Features

| Feature                      | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| 🔤 Real-Time Typing Logic    | Live WPM (Words Per Minute), Accuracy %, and error detection on every keystroke |
| 🧠 Intelligent Scoring       | Automatically calculates correct/incorrect words based on input             |
| ⏱️ Timer Selection           | Choose test durations: 15s, 30s, 60s                                        |
| ♻️ Restart Button            | Resets everything: time, stats, input, and new paragraph                    |
| 🌙 Dark Mode Toggle          | Toggle theme with persistent accessibility styling                         |
| 🧾 Custom Paragraph Input    | Add your own practice content via simple text field                        |
| 🔄 Paragraph Randomization   | Preloaded practice text pool that rotates every test                       |
| 💅 CSS Animations & UX       | Custom blinking caret, shake animation on errors, scroll-styled textarea   |
| 📱 Fully Responsive Design   | Mobile-first layout, optimized for tablets and desktops too                |
| 📎 Footer with Social Links  | Instagram and portfolio links included for developer branding              |

---

## 🧩 Technologies Used

- **HTML5** – Semantic markup, accessibility, and responsive layout
- **CSS3** – Custom scrollbar, dark mode, keyframe animations, transitions
- **JavaScript (ES6+)** – `addEventListener`, array methods, timers (`setInterval`), DOM tree traversal
- **No frameworks** – Zero dependencies for fast performance and full control

---

## 🛠️ Project Structure

```plaintext
📁 typing-speed-tester/
├── index.html      # Semantic layout and HTML structure
├── style.css       # Modular styling, animations, dark mode
└── script.js       # Typing logic, timer control, WPM/accuracy algorithm
````

### Breakdown:

* **`index.html`**

  * Includes layout structure for timer, typing box, result stats, and controls
  * Responsive using mobile-first meta tags and semantic sections

* **`style.css`**

  * Includes a custom caret animation using `::after` pseudo-element
  * Shake animation on error keystroke via `@keyframes`
  * Dark mode and responsive design support using media queries
  * Styled scrollbars and transition effects for smooth UI

* **`script.js`**

  * Generates random paragraphs from array
  * Implements timer countdown using `setInterval`
  * Calculates WPM, accuracy, and error count live
  * Validates each word by comparing input with actual paragraph
  * Adds event listeners for timer dropdown, restart button, dark mode toggle

---

## 📈 Performance Considerations

* ⚡ No third-party libraries used — lightweight and fast
* 🧠 Optimized reflows — DOM updates only on significant changes
* 🎯 Input throttling logic (if extended) can improve performance under stress
* 📲 Mobile tested on small screen devices for usability

---

## 📝 How to Use

1. Clone the repository:

```bash
git clone https://github.com/dishasharma02/typing-speed-tester.git
cd typing-speed-tester
```

2. Run in browser:

```bash
# Simply open index.html in any browser
open index.html
```

No build tools or installations required.

---

## 💼 About the Developer

👩‍💻 **Disha Sharma** – Frontend Developer | Freelancer
Passionate about building responsive, accessible, and visually aesthetic web applications with a focus on clean UI and robust logic.

* 📧 Email: [sharmadisha5987@gmail.com](mailto:sharmadisha5987@gmail.com)
* 🌐 Portfolio: [dishasharma02.github.io/portfolio](https://dishasharma2.github.io/portfolio)
* 💼 LinkedIn: [in/dishasharma02](https://in.linkedin.com/in/dishasharma02)
* 💻 GitHub: [@dishasharma02](https://github.com/dishasharma2)

---

## ⚖️ License

This project is licensed under the **MIT License** — feel free to fork, modify, or use in your own portfolios.

```
