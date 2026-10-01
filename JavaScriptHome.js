// =========================================================
// JavaScriptHome.js
// Só a animação de digitação do subtítulo da Home.
// Tema, idioma e menu ativo ficam em JavaScriptMain.js.
// =========================================================

const textEn = document.getElementById("animated-text-en");
const textPt = document.getElementById("animated-text-pt");

function typeWriter(element) {
    const text = element.getAttribute("data-text") || element.textContent;
    element.textContent = "";
    element.style.display = "inline-block";
    element.style.borderRight = "3px solid";

    let i = 0;
    function typing() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, 70);
        } else {
            element.style.borderRight = "none";
        }
    }
    typing();
}

document.addEventListener("DOMContentLoaded", () => {
    textEn.setAttribute("data-text", textEn.textContent.trim());
    textPt.setAttribute("data-text", textPt.textContent.trim());

    const startInPt = localStorage.getItem("lang") === "pt";
    textEn.style.display = startInPt ? "none" : "inline-block";
    typeWriter(startInPt ? textPt : textEn);
});

// Redigita o subtítulo sempre que o idioma for trocado (evento disparado pelo main.js)
document.addEventListener("languagechange", (e) => {
    if (e.detail.lang === "pt") {
        textEn.style.display = "none";
        typeWriter(textPt);
    } else {
        textPt.style.display = "none";
        typeWriter(textEn);
    }
});
