// =========================================================
// JavaScriptMain.js
// Lógica compartilhada por todas as páginas: tema (dark/light),
// idioma (PT/EN), estado ativo do menu e animação de entrada
// dos elementos com [data-reveal]. Cada página carrega este
// arquivo antes do seu próprio script, que cuida só do que é
// específico daquela página (typewriter, carrossel, modal...).
// =========================================================

const body = document.body;
const themeIcon = document.getElementById("theme-icon");
const darkModeBtn = document.querySelector(".darkmode");

const langBtn = document.querySelector(".language-toggle h1");
const langToggleDiv = document.querySelector(".language-toggle");
const enTexts = document.querySelectorAll(".lang-en");
const ptTexts = document.querySelectorAll(".lang-pt");

const navLinks = document.querySelectorAll(".about h1, .nome h1");

// --- TEMA ---
function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
        themeIcon.src = "./icons/sun.svg";
    } else {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
        themeIcon.src = "./icons/moon.svg";
        if (!savedTheme) localStorage.setItem("theme", "dark");
    }
}
initializeTheme();

darkModeBtn.addEventListener("click", () => {
    themeIcon.classList.remove("spin");
    void themeIcon.offsetWidth; // reinicia a animação
    themeIcon.classList.add("spin");

    if (body.classList.contains("dark-theme")) {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
        themeIcon.src = "./icons/sun.svg";
        localStorage.setItem("theme", "light");
    } else {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
        themeIcon.src = "./icons/moon.svg";
        localStorage.setItem("theme", "dark");
    }
});

// --- IDIOMA ---
function applyLanguage(lang) {
    const isPt = lang === "pt";
    langBtn.textContent = isPt ? "EN" : "BR";
    enTexts.forEach(el => el.style.display = isPt ? "none" : "");
    ptTexts.forEach(el => el.style.display = isPt ? "" : "none");
}

function initializeLanguage() {
    applyLanguage(localStorage.getItem("lang") === "pt" ? "pt" : "en");
}
initializeLanguage();

langToggleDiv.addEventListener("click", () => {
    const goingToPt = langBtn.textContent === "BR"; // mostrando BR = site em inglês, clique vai para PT
    applyLanguage(goingToPt ? "pt" : "en");
    localStorage.setItem("lang", goingToPt ? "pt" : "en");
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang: goingToPt ? "pt" : "en" } }));
});

// --- ESTADO ATIVO DO MENU (clique) ---
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.forEach(el => el.classList.remove("active"));
        link.classList.add("active");
    });
});

// --- ANIMAÇÃO DE ENTRADA (scroll reveal) ---
const revealTargets = document.querySelectorAll("[data-reveal]");
if (revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => revealObserver.observe(el));
}
