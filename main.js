// Main Shared JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggling Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootElement = document.documentElement;
    
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Fallback to system preference
        document.body.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('app-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
    }

    // 2. Global Clock Widget
    const clockWidget = document.getElementById('global-clock');
    if (clockWidget) {
        setInterval(() => {
            const now = new Date();
            clockWidget.innerText = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit'
            });
        }, 1000);
    }


    // 4. Scroll Reveal
    function reveal() {
        var reveals = document.querySelectorAll('.tool-card');
        for (var i = 0; i < reveals.length; i++) {
            if (!reveals[i].classList.contains('reveal')) {
                reveals[i].classList.add('reveal');
            }
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 50;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }
    window.addEventListener('scroll', reveal);
    reveal();

    // 4.1 Glass Card Hover Spotlight
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '35%');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', `${x}%`);
            card.style.setProperty('--my', `${y}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mx', '50%');
            card.style.setProperty('--my', '35%');
        });
    });

    // 5. Page Transition (Fade-in on load)
    const transitionEl = document.getElementById('page-transition');
    if (transitionEl) {
        setTimeout(() => {
            transitionEl.classList.add('fade-out');
        }, 200);
    }

    // 6. Ripple Effect for Buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple');
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });

    // 7. Vanilla Tilt Init
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
            max: 14,
            speed: 700,
            scale: 1.03,
            perspective: 900,
            easing: "cubic-bezier(.2,.8,.2,1)",
            glare: true,
            "max-glare": 0.2
        });
    }

});
