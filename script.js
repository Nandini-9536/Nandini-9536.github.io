/**
 * Nandini Sisodiya - Portfolio Scripts
 * High-performance Vanilla JavaScript (ES6+)
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Dynamic Year in Footer
    const yearEl = document.getElementById("currentYear");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Navbar Scroll Behavior & Scroll-Progress Bar
    const navbar = document.getElementById("navbar");
    const progressBar = document.getElementById("scroll-progress");
    const scrollUpBtn = document.getElementById("scrollUpBtn");

    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Update progress bar
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Sticky navbar styling
        if (scrollTop > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Back to top button visibility
        if (scrollTop > 450) {
            scrollUpBtn.classList.add("show");
        } else {
            scrollUpBtn.classList.remove("show");
        }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 3. Smooth Mobile Drawer Menu
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("open");
            document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "auto";
        });

        // Close drawer when a link is clicked
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navMenu.classList.remove("open");
                document.body.style.overflow = "auto";
            });
        });

        // Close drawer on resize to desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth > 820 && navMenu.classList.contains("open")) {
                menuToggle.classList.remove("active");
                navMenu.classList.remove("open");
                document.body.style.overflow = "auto";
            }
        });
    }

    // 4. Active Nav Item on Scroll (ScrollSpy)
    const sections = document.querySelectorAll("section[id]");
    const spyScroll = () => {
        const scrollY = window.pageYOffset;

        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute("id");
            const navLink = document.querySelector(`.nav-links a[href*='${sectionId}']`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add("active");
                } else {
                    navLink.classList.remove("active");
                }
            }
        });
    };

    window.addEventListener("scroll", spyScroll, { passive: true });

    // 5. Dynamic Typewriter Effect for Hero Subtitle
    const typedTarget = document.getElementById("typed-text");
    if (typedTarget) {
        const phrases = [
            "Software Developer",
            "Project Associate @ NIESBUD",
            "PHP & Laravel Developer",
            "Python & Django Specialist",
            "Full-Stack Web Enthusiast"
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeLoop() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typedTarget.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typedTarget.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 110;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Pause at complete phrase
                typingSpeed = 1800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 400;
            }

            setTimeout(typeLoop, typingSpeed);
        }

        typeLoop();
    }

    // 6. Interactive Projects Filter
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                // Update active button state
                filterBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                const filterValue = btn.getAttribute("data-filter");

                projectCards.forEach((card) => {
                    const cardCategory = card.getAttribute("data-category");

                    if (filterValue === "all" || filterValue === cardCategory) {
                        card.classList.remove("hide");
                        card.style.opacity = "0";
                        card.style.transform = "scale(0.95)";
                        setTimeout(() => {
                            card.style.transition = "all 0.35s ease";
                            card.style.opacity = "1";
                            card.style.transform = "scale(1)";
                        }, 50);
                    } else {
                        card.classList.add("hide");
                    }
                });
            });
        });
    }

    // 7. Contact Form Handling via Formspree AJAX
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const formSpinner = document.getElementById("formSpinner");
    const formStatus = document.getElementById("formStatus");

    if (contactForm && submitBtn) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Set loading state
            submitBtn.disabled = true;
            submitBtn.querySelector(".btn-text").textContent = "Sending...";
            if (formSpinner) formSpinner.style.display = "inline-block";
            if (formStatus) {
                formStatus.style.display = "none";
                formStatus.className = "form-status";
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (response.ok) {
                    if (formStatus) {
                        formStatus.textContent = "Thank you! Your message has been sent successfully. I will get back to you soon.";
                        formStatus.classList.add("success");
                    }
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    let errMsg = "Oops! There was a problem submitting your form.";
                    if (errorData && errorData.errors) {
                        errMsg = errorData.errors.map((err) => err.message).join(", ");
                    }
                    if (formStatus) {
                        formStatus.textContent = errMsg;
                        formStatus.classList.add("error");
                    }
                }
            } catch (err) {
                console.error("Form submission error:", err);
                if (formStatus) {
                    formStatus.textContent = "Network error. Please try again or email directly at nandinisisodiya1002@gmail.com";
                    formStatus.classList.add("error");
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.querySelector(".btn-text").textContent = "Send Message";
                if (formSpinner) formSpinner.style.display = "none";
            }
        });
    }
});
