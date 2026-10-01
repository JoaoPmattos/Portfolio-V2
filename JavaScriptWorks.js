// =========================================================
// JavaScriptWorks.js
// Carrossel dos cards (setas + dots + swipe) e o modal/galeria
// em tela cheia. Tema, idioma, menu ativo e a animação de
// entrada dos cards (via [data-reveal]) ficam em JavaScriptMain.js.
// =========================================================

// --- LÓGICA DO CARROSSEL (BOTÕES + SWIPE) ---
const carousels = document.querySelectorAll('.carousel');

carousels.forEach(carousel => {
    const images = carousel.querySelectorAll('img');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    let currentIndex = 0;

    // --- INDICADORES (DOTS) ---
    let dots = [];
    if (images.length > 1) {
        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add('carousel-dots');

        images.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.type = 'button';
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = i;
                showImage(currentIndex);
            });
            dotsContainer.appendChild(dot);
        });

        carousel.appendChild(dotsContainer);
        dots = Array.from(dotsContainer.children);
    }

    // --- FUNÇÃO PARA MOSTRAR IMAGEM E ATUALIZAR LINK ---
    const showImage = (index) => {
        // Faz o crossfade entre as imagens
        images.forEach((img, i) => img.classList.toggle('active', i === index));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));

        // Atualiza o link do botão "Visitar Site" principal do Card
        const currentImg = images[index];
        const card = carousel.closest('.work-card');
        const visitBtn = card.querySelector('a.btn-pill');
        const newUrl = currentImg.getAttribute('data-url');

        if (visitBtn && newUrl) {
            visitBtn.href = newUrl;
        }
    };

    // Inicialização
    showImage(currentIndex);

    // --- NAVEGAÇÃO POR CLIQUE (SETAS) ---
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    // --- NAVEGAÇÃO POR SWIPE (TOUCH) ---
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        // Se arrastou mais de 50px para a esquerda ou direita
        if (touchEndX < touchStartX - 50) {
            // Swipe Left (Próximo)
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe Right (Anterior)
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        }
    }

    // --- ABRIR MODAL AO CLICAR NA IMAGEM ---
    images.forEach(img => {
        img.addEventListener('click', () => {
            openModalSegmented(carousel.getAttribute('data-gallery'), img.src);
        });
    });
});


// --- MODAL / GALERIA (COM LINK DO PROJETO) ---
const modal = document.createElement('div');
modal.classList.add('modal-gallery');
document.body.appendChild(modal);

// Agora guardamos o SRC e a URL do link
let currentGallery = [];
let currentModalIndex = 0;

// --- NAVEGAÇÃO POR SWIPE NO MODAL (MOBILE) ---
let modalTouchStartX = 0;
let modalTouchEndX = 0;

modal.addEventListener('touchstart', (e) => {
    modalTouchStartX = e.changedTouches[0].screenX;
}, { passive: true });

modal.addEventListener('touchend', (e) => {
    modalTouchEndX = e.changedTouches[0].screenX;
    if (modalTouchEndX < modalTouchStartX - 50) {
        currentModalIndex = (currentModalIndex + 1) % currentGallery.length;
        updateModal();
    } else if (modalTouchEndX > modalTouchStartX + 50) {
        currentModalIndex = (currentModalIndex - 1 + currentGallery.length) % currentGallery.length;
        updateModal();
    }
}, { passive: true });

function openModalSegmented(group, clickedSrc) {
    // Mapeia as imagens pegando o SRC e o DATA-URL
    currentGallery = Array.from(document.querySelectorAll(`[data-gallery="${group}"] img`)).map(img => ({
        src: img.src,
        url: img.getAttribute('data-url')
    }));

    // Acha o índice da imagem clicada
    currentModalIndex = currentGallery.findIndex(item => item.src === clickedSrc);
    if (currentModalIndex === -1) currentModalIndex = 0;

    updateModal();
    modal.style.display = 'flex';
    // Aguarda o próximo frame para o CSS animar a transição de abertura
    requestAnimationFrame(() => modal.classList.add('open'));
}

function updateModal() {
    const currentItem = currentGallery[currentModalIndex];

    // Verifica o idioma atual para o texto do botão do modal
    const isEnglish = document.querySelector(".language-toggle h1").textContent === "BR"; // Se mostra BR, tá em inglês
    const btnText = isEnglish ? "Visit Project" : "Visitar Projeto";

    // Se tiver URL, mostra o botão. Se não, não mostra.
    const buttonHtml = currentItem.url
        ? `<a href="${currentItem.url}" target="_blank" class="modal-visit-btn">${btnText}</a>`
        : '';

    modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <img src="${currentItem.src}" class="modal-image">
      ${buttonHtml}
    </div>
    <button type="button" class="modal-nav-btn modal-prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
    <button type="button" class="modal-nav-btn modal-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
  `;

    // Re-adiciona os eventos pois o HTML foi reescrito
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.modal-next').addEventListener('click', nextImageModal);
    modal.querySelector('.modal-prev').addEventListener('click', prevImageModal);

    // Fecha o modal se clicar fora da imagem
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function closeModal() {
    modal.classList.remove('open');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}

function nextImageModal(e) {
    e.stopPropagation();
    currentModalIndex = (currentModalIndex + 1) % currentGallery.length;
    updateModal();
}

function prevImageModal(e) {
    e.stopPropagation();
    currentModalIndex = (currentModalIndex - 1 + currentGallery.length) % currentGallery.length;
    updateModal();
}
