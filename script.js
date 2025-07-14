// Configurações globais
const config = {
    animationDuration: 800,
    scrollOffset: 100,
    navHeight: 80,
};

// Inicialização quando DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
    loadGitHubData();
    initNavigation();
    initAnimations();
    initContactForm();
    initSmoothScroll();
    initParallax();
    initTypingEffect();
});

// Navegação
function initNavigation() {
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const navbar = document.getElementById("navbar");

    // Toggle menu mobile
    mobileMenuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        mobileMenuToggle.classList.toggle("active");
        document.body.classList.toggle("menu-open");
    });

    // Fechar menu mobile ao clicar em link
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            mobileMenuToggle.classList.remove("active");
            document.body.classList.remove("menu-open");
        });
    });

    // Fechar menu mobile ao clicar fora
    document.addEventListener("click", (e) => {
        if (
            !navMenu.contains(e.target) &&
            !mobileMenuToggle.contains(e.target)
        ) {
            navMenu.classList.remove("active");
            mobileMenuToggle.classList.remove("active");
            document.body.classList.remove("menu-open");
        }
    });

    // Scroll do navbar e link ativo
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.pageYOffset;

        // Alterar estilo do navbar
        if (scrollY > config.scrollOffset) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Atualizar link ativo
        updateActiveLink();
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

// Atualizar link ativo baseado na seção visível
function updateActiveLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - config.navHeight - 50;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
}

// Animações de scroll
function initAnimations() {
    // Configuração do Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate");

                // Animação escalonada para elementos em grid
                if (entry.target.classList.contains("stagger-children")) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add("animate");
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observar elementos com animação
    document
        .querySelectorAll(
            ".fade-in-up, .fade-in-left, .fade-in-right, .scale-in"
        )
        .forEach((el) => {
            observer.observe(el);
        });
}

// Navegação suave
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop =
                    targetElement.offsetTop - config.navHeight + 10;

                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth",
                });
            }
        });
    });
}

// Efeito parallax
function initParallax() {
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector(".hero");
        const parallaxElements = document.querySelectorAll(".parallax");

        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.2}px)`;
        }

        parallaxElements.forEach((el) => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// Efeito de digitação
function initTypingEffect() {
    const typingElement = document.querySelector(".typing-effect");
    if (!typingElement) return;

    const texts = [
        "Desenvolvedor Full Stack",
        "Líder de Equipe",
        "Analista de Dados",
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
    }

    typeText();
}

// Formulário de contato
function initContactForm() {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    // Adicionar máscara e validação aos campos
    addInputMasks();
    addFormValidation();

    contactForm.addEventListener("submit", handleFormSubmit);
}

function addInputMasks() {
    // Aqui você pode adicionar máscaras para telefone, etc.
    // Por simplicidade, vamos focar na validação
}

function addFormValidation() {
    const inputs = document.querySelectorAll(
        "#contact-form input, #contact-form textarea"
    );

    inputs.forEach((input) => {
        input.addEventListener("blur", validateField);
        input.addEventListener("input", clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Remover erro anterior
    clearFieldError({ target: field });

    if (field.hasAttribute("required") && !value) {
        isValid = false;
        errorMessage = "Este campo é obrigatório";
    } else if (field.type === "email" && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = "Por favor, insira um email válido";
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector(".error-message");
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove("error");
}

function showFieldError(field, message) {
    field.classList.add("error");

    const errorElement = document.createElement("span");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    errorElement.style.color = "#ef4444";
    errorElement.style.fontSize = "0.875rem";
    errorElement.style.marginTop = "0.25rem";
    errorElement.style.display = "block";

    field.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const inputs = e.target.querySelectorAll("input, textarea");
    let isFormValid = true;

    // Validar todos os campos
    inputs.forEach((input) => {
        if (!validateField({ target: input })) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showNotification("Por favor, corrija os erros no formulário", "error");
        return;
    }

    // Mostrar loading
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;

    // Simular envio
    setTimeout(() => {
        // Criar link mailto
        const subject = formData.get("subject");
        const message = `Nome: ${formData.get("name")}\nEmail: ${formData.get(
            "email"
        )}\n\nMensagem:\n${formData.get("message")}`;
        const mailtoLink = `mailto:cs.rib8@gmail.com?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(message)}`;

        window.location.href = mailtoLink;

        // Resetar formulário
        e.target.reset();
        showNotification(
            "Mensagem preparada! Seu cliente de email será aberto.",
            "success"
        );

        // Restaurar botão
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 1000);
}

// Sistema de notificações
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

    // Estilos da notificação
    Object.assign(notification.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        background:
            type === "error"
                ? "#ef4444"
                : type === "success"
                ? "#10b981"
                : "#3b82f6",
        color: "white",
        padding: "1rem 1.5rem",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: "10000",
        maxWidth: "400px",
        transform: "translateX(100%)",
        transition: "transform 0.3s ease",
    });

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = "translateX(0)";
    }, 100);

    // Botão de fechar
    const closeButton = notification.querySelector(".notification-close");
    closeButton.addEventListener("click", () => {
        hideNotification(notification);
    });

    // Auto remover após 5 segundos
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

function hideNotification(notification) {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Contador animado para estatísticas
function animateCounters() {
    const counters = document.querySelectorAll(".stat-number");

    counters.forEach((counter) => {
        const target = parseInt(counter.textContent.replace(/\D/g, ""));
        if (isNaN(target)) return;

        const increment = target / 50;
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current) + "+";
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + "+";
            }
        };

        updateCounter();
    });
}

// Observar seção de estatísticas para animar contadores
const statsSection = document.querySelector("#about");
if (statsSection) {
    const statsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statsObserver.observe(statsSection);
}

// Tema escuro/claro (funcionalidade extra)
function initThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

// Lazy loading de imagens
function initLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove("lazy");
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach((img) => imageObserver.observe(img));
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle helper
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Performance optimization
window.addEventListener("load", () => {
    // Remover animações se usuário prefere movimento reduzido
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.style.setProperty(
            "--animation-duration",
            "0s"
        );
    }
});

// Error handling
window.addEventListener("error", (e) => {
    console.error("Erro capturado:", e.error);
});

// Service Worker (opcional)
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => console.log("SW registrado"))
            .catch((error) => console.log("SW falhou"));
    });
}

// GitHub API com informações extras
async function loadGitHubData() {
    try {
        const response = await fetch(
            "https://api.github.com/users/osouzacaique"
        );
        const userData = await response.json();

        if (userData.avatar_url) {
            loadAvatar(userData.avatar_url);
            updateFavicon(userData.avatar_url); // Atualizar favicon com a foto do GitHub
        }

        // Opcional: carregar dados extras do GitHub
        if (userData.public_repos) {
            updateGitHubStats(userData);
        }
    } catch (error) {
        console.log("Erro ao buscar dados do GitHub:", error);
    }
}

function loadAvatar(avatarUrl) {
    const avatarImg = document.getElementById("github-avatar");
    const fallback = document.getElementById("avatar-fallback");

    if (!avatarImg || !fallback) return;

    // Preload da imagem
    const img = new Image();
    img.onload = function () {
        avatarImg.src = avatarUrl;
        avatarImg.style.display = "block";
        avatarImg.classList.add("loaded");
        fallback.style.display = "none";

        // Adicionar efeito de entrada
        setTimeout(() => {
            avatarImg.style.opacity = "1";
            avatarImg.style.transform = "scale(1)";
        }, 100);

        // Atualizar favicon
        updateFavicon(avatarUrl);
        updateOpenGraphImage(avatarUrl); // Atualizar imagem Open Graph
    };

    img.onerror = function () {
        console.log("Erro ao carregar avatar do GitHub, usando fallback");
        fallback.style.display = "flex";
    };

    // Preparar imagem para animação
    avatarImg.style.opacity = "0";
    avatarImg.style.transform = "scale(0.8)";
    avatarImg.style.transition = "all 0.3s ease";

    img.src = avatarUrl;
}

function updateGitHubStats(userData) {
    // Opcional: atualizar estatísticas com dados reais do GitHub
    const stats = {
        repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
    };

    console.log("Dados do GitHub carregados:", stats);

    // Você pode usar esses dados para atualizar as estatísticas na página
    // Por exemplo, substituir o número de projetos pelos repos reais
}

// Criar favicon dinâmico com a foto do GitHub
function updateFavicon(avatarUrl) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 32;
    canvas.height = 32;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
        // Desenhar círculo de fundo
        ctx.fillStyle = "#6366f1";
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, 2 * Math.PI);
        ctx.fill();

        // Desenhar imagem circular
        ctx.save();
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, 2, 2, 28, 28);
        ctx.restore();

        // Converter para favicon
        const favicon =
            document.querySelector('link[rel="icon"]') ||
            document.createElement("link");
        favicon.rel = "icon";
        favicon.href = canvas.toDataURL();
        if (!document.querySelector('link[rel="icon"]')) {
            document.head.appendChild(favicon);
        }
    };
    img.src = avatarUrl;
}

// Atualizar meta tags Open Graph
function updateOpenGraphImage(avatarUrl) {
    // Atualizar meta tags Open Graph
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
        ogImage = document.createElement("meta");
        ogImage.setAttribute("property", "og:image");
        document.head.appendChild(ogImage);
    }
    ogImage.setAttribute("content", avatarUrl);

    // Adicionar outras meta tags se não existirem
    const metaTags = [
        {
            property: "og:title",
            content: "Caique Souza | Desenvolvedor Full Stack",
        },
        {
            property: "og:description",
            content:
                "+6 anos de experiência em PHP, JavaScript e tecnologias cloud",
        },
        { property: "og:type", content: "website" },
        { property: "twitter:card", content: "summary" },
        {
            property: "twitter:title",
            content: "Caique Souza | Desenvolvedor Full Stack",
        },
        {
            property: "twitter:description",
            content:
                "+6 anos de experiência em PHP, JavaScript e tecnologias cloud",
        },
        { property: "twitter:image", content: avatarUrl },
    ];

    metaTags.forEach((tag) => {
        let existingTag = document.querySelector(
            `meta[property="${tag.property}"]`
        );
        if (!existingTag) {
            existingTag = document.createElement("meta");
            existingTag.setAttribute("property", tag.property);
            document.head.appendChild(existingTag);
        }
        existingTag.setAttribute("content", tag.content);
    });
}

//# sourceMappingURL=main.js.map
