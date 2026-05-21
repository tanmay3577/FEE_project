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
    // 8. AI Chatbot Logic
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotPanel = document.getElementById('chatbot-panel');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotExpandBtn = document.getElementById('chatbot-expand-btn');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (chatbotToggleBtn && chatbotPanel) {
        // Open Chat
        chatbotToggleBtn.addEventListener('click', () => {
            chatbotPanel.classList.add('active');
        });

        // Close Chat
        chatbotCloseBtn.addEventListener('click', () => {
            chatbotPanel.classList.remove('active');
            chatbotPanel.classList.remove('fullscreen');
        });

        // Expand / Fullscreen
        chatbotExpandBtn.addEventListener('click', () => {
            chatbotPanel.classList.toggle('fullscreen');
            if (chatbotPanel.classList.contains('fullscreen')) {
                chatbotExpandBtn.innerHTML = '🗗';
                chatbotExpandBtn.title = "Restore Size";
            } else {
                chatbotExpandBtn.innerHTML = '⛶';
                chatbotExpandBtn.title = "Expand to Entire Tab";
            }
        });

        // Send Message
        const sendChatMessage = async () => {
            const text = chatbotInput.value.trim();
            if (!text) return;

            // Add user message
            appendMessage(text, 'user-message');
            chatbotInput.value = '';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            chatbotMessages.appendChild(typingIndicator);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            try {
                let targetUrl = '/api/chat';
                
                // If running locally (file://, or Live Server on localhost/127.0.0.1), find backend port
                const isLocal = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                
                if (isLocal) {
                    let port = 3000;
                    let found = false;
                    
                    // Scan ports to find the active backend
                    for (let p = 3000; p <= 3005; p++) {
                        try {
                            const checkRes = await fetch(`http://localhost:${p}/backend_port.json`, { method: 'GET' });
                            if (checkRes.ok) {
                                port = p;
                                found = true;
                                break;
                            }
                        } catch (scanErr) {
                            // Continue scanning
                        }
                    }
                    targetUrl = `http://localhost:${port}/api/chat`;
                }

                const response = await fetch(targetUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });

                // Check if the response is actually JSON before parsing
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Server returned HTML instead of JSON. Are you on GitHub Pages?");
                }

                const data = await response.json();
                typingIndicator.remove();

                if (response.ok && data.candidates && data.candidates.length > 0) {
                    const botResponse = data.candidates[0].content.parts[0].text;
                    appendMessage(botResponse, 'bot-message', true);
                } else {
                    console.error("API Error:", data);
                    appendMessage(`❌ API Error: ${data.error || 'Something went wrong.'} (Did you add your API key in Vercel settings?)`, 'bot-message');
                }
            } catch (error) {
                console.error("Network Error:", error);
                typingIndicator.remove();
                
                const isGithub = window.location.hostname.includes('github.io');
                
                if (isGithub) {
                    appendMessage("❌ **GitHub Pages Error:** GitHub Pages only hosts static files and does not support backends. Please open your **Vercel** link instead to use the AI Bot.", 'bot-message', true);
                } else if (error.name === 'TypeError' || error.message.includes('fetch')) {
                    appendMessage("❌ Network error. **Did you start the server?** Make sure to run `node server.js` in your terminal first.", 'bot-message', true);
                } else {
                    appendMessage("❌ Server error. If you are on Vercel, please make sure you added `GEMINI_API_KEY` to the **Environment Variables** in your Vercel Dashboard.", 'bot-message', true);
                }
            }
            
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        };

        chatbotSendBtn.addEventListener('click', sendChatMessage);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });

        function appendMessage(text, className, isMarkdown = false) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${className}`;
            
            if (isMarkdown && typeof marked !== 'undefined') {
                msgDiv.innerHTML = marked.parse(text);
            } else {
                msgDiv.textContent = text;
            }
            
            chatbotMessages.appendChild(msgDiv);
        }
    }
});
