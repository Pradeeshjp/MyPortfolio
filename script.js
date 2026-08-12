document.addEventListener('DOMContentLoaded', () => {

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Scroll Reveal Animation (Apple Style)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    document.querySelectorAll('.bento-grid').forEach(grid => {
        const children = grid.querySelectorAll('.bento-card'); // Target cards specifically
        children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 100}ms`;
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // --- Email Animation Logic ---
    const emailBtn = document.getElementById('email-btn');
    const emailOverlay = document.getElementById('email-overlay');

    if (emailBtn && emailOverlay) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop immediate navigation
            const targetHref = emailBtn.getAttribute('href');

            // 1. Hide actual content
            document.querySelector('header').classList.add('content-fade-out');
            document.querySelectorAll('section').forEach(sec => sec.classList.add('content-fade-out'));
            document.querySelector('footer').classList.add('content-fade-out');

            // 2. Show overlay
            emailOverlay.classList.add('active');

            // 3. Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = targetHref;

                // 4. Reset page state after redirect
                setTimeout(() => {
                    // Remove fade-out classes
                    document.querySelector('header').classList.remove('content-fade-out');
                    document.querySelectorAll('section').forEach(sec => sec.classList.remove('content-fade-out'));
                    document.querySelector('footer').classList.remove('content-fade-out');

                    // Hide overlay
                    emailOverlay.classList.remove('active');

                    // Scroll to Top (Home)
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 1000); // 1 extra second delay allow redirect to initiate
            }, 2500);
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // --- Typing Effect ---
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        const textStr = "Redefining Data"; // Hardcoded for simplicity or could be fetched
        // Or better, keep original text if it was static in HTML, but since we clear it, 
        // we need to store it. The previous code read from innerHTML which might contain cursor if re-run.
        // Let's use a fixed string effectively or read it once safely.

        let typingTimeout;

        function startTypingAnimation() {
            // Clear existing content and timeout
            if (typingTimeout) clearTimeout(typingTimeout);
            heroTitle.innerHTML = '';

            let i = 0;
            const speed = 50;

            // Create cursor element
            const cursor = document.createElement('span');
            cursor.classList.add('typing-cursor');
            heroTitle.appendChild(cursor);

            function typeWriter() {
                if (i < textStr.length) {
                    cursor.insertAdjacentText('beforebegin', textStr.charAt(i));
                    i++;

                    // Randomize typing speed
                    const randomSpeed = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
                    typingTimeout = setTimeout(typeWriter, randomSpeed);
                }
            }

            typeWriter();
        }

        // Start initial animation
        setTimeout(startTypingAnimation, 500);

        // Add click listener to restart
        heroTitle.addEventListener('click', startTypingAnimation);
    }

    // --- Certification Gallery Logic ---
    const certModal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalIndicators = document.getElementById('modal-indicators');
    let currentCertIndex = 0;

    // Certificate Data
    const certifications = [
        { src: "Certifications/Databricks - Introduction to Generative AI.png", caption: "Databricks Generative AI Fundamentals" },
        { src: "Certifications/Microsoft Office Certification.png", caption: "Microsoft Office Specialist" },
        { src: "Certifications/Advanced SQL.png", caption: "SQL for Data Analysis: Advanced SQL Querying Techniques" },
        { src: "Certifications/PowerBi 1 .png", caption: "Microsoft Power BI Desktop for Business Intelligence" },
        { src: "Certifications/Innovation , Business Models and Entrepreneurship.png", caption: "Innovations, Business Models and Entrepreneurship (NPTEL)" },
        { src: "Certifications/pradeesh-j-certificate.png", caption: "Foundations of Data Science" },
        { src: "Certifications/Apple iWork .png", caption: "Apple iWork" }
    ];

    window.openCertGallery = function (index) {
        console.log("Opening gallery at index:", index);
        const modal = document.getElementById('cert-modal');
        if (!modal) {
            console.error("CRITICAL: Cert modal element NOT found in DOM via getElementById!");
            return;
        }
        console.log("Modal found:", modal);

        currentCertIndex = index;
        updateGalleryContent();
        modal.classList.add('active');
        console.log("Added 'active' class to modal. Class list:", modal.classList);
        document.body.style.overflow = 'hidden';
    };

    window.closeCertGallery = function () {
        if (!certModal) return;
        certModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    window.moveGallery = function (direction) {
        currentCertIndex += direction;
        if (currentCertIndex < 0) currentCertIndex = certifications.length - 1;
        if (currentCertIndex >= certifications.length) currentCertIndex = 0;
        updateGalleryContent();
    };

    function updateGalleryContent() {
        const cert = certifications[currentCertIndex];
        modalImg.src = cert.src;
        modalCaption.textContent = cert.caption;

        // Update indicators
        modalIndicators.innerHTML = '';
        certifications.forEach((_, i) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === currentCertIndex) indicator.classList.add('active');
            indicator.onclick = (e) => {
                e.stopPropagation();
                currentCertIndex = i;
                updateGalleryContent();
            };
            modalIndicators.appendChild(indicator);
        });
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!certModal || !certModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeCertGallery();
        if (e.key === 'ArrowLeft') moveGallery(-1);
        if (e.key === 'ArrowRight') moveGallery(1);
    });

    // Close on background click
    if (certModal) {
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) closeCertGallery();
        });
    }
});
