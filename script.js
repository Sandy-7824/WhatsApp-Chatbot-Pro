// Ensure DOM is fully parsed and loaded
document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. Loading Spinner Logic
    // ==========================================================================
    const loader = document.getElementById("loader");
    if (loader) {
        window.addEventListener("load", () => {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
            }, 500);
        });
        // Fallback safety trigger in case load event takes too long
        setTimeout(() => {
            if (loader.style.display !== "none") {
                loader.style.opacity = "0";
                setTimeout(() => loader.style.display = "none", 500);
            }
        }, 1500);
    }

    // ==========================================================================
    // 2. Sticky Navbar and Header scroll adjustments
    // ==========================================================================
    const header = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Mobile Hamburger Menu Activation
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
        // Auto-close menu when link is clicked
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                hamburger.classList.remove("active");
            });
        });
    }

    // ==========================================================================
    // 3. Dark / Light Mode Feature Toggle
    // ==========================================================================
    const themeToggleBtn = document.getElementById("themeToggle");
    const body = document.body;

    // Check configuration preferences inside LocalStorage
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        body.classList.add("dark-theme");
        updateThemeToggleIcon(true);
    } else {
        updateThemeToggleIcon(false);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            body.classList.toggle("dark-theme");
            const isDark = body.classList.contains("dark-theme");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateThemeToggleIcon(isDark);
            showToast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`, "info");
        });
    }

    function updateThemeToggleIcon(isDark) {
        const icon = themeToggleBtn.querySelector("i");
        if (isDark) {
            icon.className = "fas fa-sun";
        } else {
            icon.className = "fas fa-moon";
        }
    }

    // ==========================================================================
    // 4. Back To Top Button Event Trigger
    // ==========================================================================
    const backToTopButton = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    });
    if (backToTopButton) {
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ==========================================================================
    // 5. Toast Notifications Builder
    // ==========================================================================
    const toastContainer = document.getElementById("toast-container");

    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        
        let iconClass = "fas fa-check-circle";
        if (type === "error") iconClass = "fas fa-exclamation-circle";
        if (type === "info") iconClass = "fas fa-info-circle";

        toast.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        // Remove toast smoothly after 4 seconds
        setTimeout(() => {
            toast.style.animation = "slideIn 0.3s ease reverse forwards";
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    // ==========================================================================
    // 6. Interactive WhatsApp Simulation Logic
    // ==========================================================================
    const chatMessages = document.getElementById("chatMessages");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const suggestionBtns = document.querySelectorAll(".suggestion-btn");

    // Sample bot keywords database configuration
    const responses = {
        "hello": "Hello there! How can I assist you with WhatsApp marketing, chatbot integrations, or lead capture metrics today? Try typing 'Pricing' or 'Services'.",
        "pricing": "We offer 3 scalable tiers:\n• Starter: $29/mo (1,000 contacts)\n• Business: $79/mo (10,000 contacts + AI)\n• Enterprise: $199/mo (Unlimited + SLA).\n\nWould you like our team to help you select a plan?",
        "services": "Our core integration services include:\n• 24/7 Automated Customer Support\n• AI NLP Contextual Response Systems\n• CRM syncing & Webhook configurations\n• Bulk broadcast marketing campaigns.",
        "contact": "Our customer success managers are available 24/7! You can reach us at sales@whatsappchatbotpro.com or via phone at +1 (555) 019-2834.",
        "help": "No problem! You can use these standard commands to ask me questions:\n• 'Hello' - Start conversation\n• 'Services' - Display solutions\n• 'Pricing' - See plans\n• 'Contact' - Support coordinates."
    };

    if (chatForm && chatMessages && chatInput) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const messageText = chatInput.value.trim();
            if (messageText) {
                handleUserMessage(messageText);
                chatInput.value = "";
            }
        });

        // Event hooks for suggestion chips/buttons
        suggestionBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const triggerText = btn.getAttribute("data-text");
                handleUserMessage(triggerText);
            });
        });
    }

    function handleUserMessage(text) {
        // Render user message bubble
        renderMessage(text, "sent");

        // Trigger typing state, reply with automated answer
        renderTypingIndicator();

        const cleanedInput = text.toLowerCase().replace(/[^\w\s]/gi, '').trim();
        let botResponse = "I am not quite sure about that query, but our customer team can assist. Type 'Help' to see my valid interactive system triggers.";

        // Match keyword
        for (const keyword in responses) {
            if (cleanedInput.includes(keyword)) {
                botResponse = responses[keyword];
                break;
            }
        }

        // Output chatbot response following simulated delay
        setTimeout(() => {
            removeTypingIndicator();
            renderMessage(botResponse, "received");
        }, 1200);
    }

    function renderMessage(text, sender) {
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${sender}`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Replace carriage returns with standard break structures
        const formattedText = text.replace(/\n/g, "<br>");

        bubble.innerHTML = `
            <span>${formattedText}</span>
            <span class="bubble-time">${timestamp}</span>
        `;
        chatMessages.appendChild(bubble);
        autoScrollChat();
    }

    function renderTypingIndicator() {
        const indicator = document.createElement("div");
        indicator.className = "chat-bubble received typing-indicator-bubble";
        indicator.id = "typingIndicator";
        indicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(indicator);
        autoScrollChat();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById("typingIndicator");
        if (indicator) {
            indicator.remove();
        }
    }

    function autoScrollChat() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ==========================================================================
    // 7. Dynamic Stats Counter Logic
    // ==========================================================================
    const statsSection = document.querySelector(".stats-section");
    const statNumbers = document.querySelectorAll(".stat-number");
    let countersTriggered = false;

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersTriggered) {
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute("data-target"));
                        animateCounter(stat, target);
                    });
                    countersTriggered = true;
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    function animateCounter(element, target) {
        let current = 0;
        const duration = 2000; // 2 seconds animation duration
        const stepTime = Math.max(Math.floor(duration / target), 10);
        
        const timer = setInterval(() => {
            current += Math.ceil(target / 100);
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            // Format metrics output dynamically
            if (target >= 1000000) {
                element.textContent = (current / 1000000).toFixed(0) + "M+";
            } else if (target >= 1000) {
                element.textContent = (current / 1000).toFixed(0) + "k+";
            } else if (target === 99 || target === 80) {
                element.textContent = current + "%";
            } else {
                element.textContent = current;
            }
        }, stepTime);
    }

    // ==========================================================================
    // 8. FAQ Accordion Click Operations
    // ==========================================================================
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const questionBlock = item.querySelector(".faq-question");
        questionBlock.addEventListener("click", () => {
            // Close other items if open (Accordion style)
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains("active")) {
                    otherItem.classList.remove("active");
                }
            });
            item.classList.toggle("active");
        });
    });

    // ==========================================================================
    // 9. Contact Form Handling & Validation
    // ==========================================================================
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Collect Form Values (Mock submission parsing)
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const business = document.getElementById("business").value.trim();
            const message = document.getElementById("message").value.trim();

            if (name && email && phone && business && message) {
                showToast(`Thank you, ${name}! Your request was successfully sent.`, "success");
                contactForm.reset();
            } else {
                showToast("Please fill in all details before submitting.", "error");
            }
        });
    }
});