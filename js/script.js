document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initScrollAnimation();
    initMobileMenu();
    initContactForm();
    initBackToTop();
    highlightActiveNavLink();
});

function initThemeToggle() {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    if (!themeToggleBtns.length) return;

    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const sunSvg = '<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>';
    const moonSvg = '<svg viewBox="0 0 24 24"><path d="M12.3 2a10 10 0 0 0-.19 2 10 10 0 0 0 10 10c.7 0 1.37-.07 2-.19A10 10 0 1 1 12.3 2z"/></svg>';

    themeToggleBtns.forEach(btn => {
        if (theme === 'dark') {
            btn.innerHTML = sunSvg;
            btn.setAttribute('title', 'Chế độ sáng');
            btn.setAttribute('aria-label', 'Chuyển sang chế độ sáng');
        } else {
            btn.innerHTML = moonSvg;
            btn.setAttribute('title', 'Chế độ tối');
            btn.setAttribute('aria-label', 'Chuyển sang chế độ tối');
        }
    });
}

function initScrollAnimation() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }
}

function initMobileMenu() {
    const mobileToggleBtn = document.querySelector('.mobile-toggle-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (!mobileToggleBtn || !mobileMenu) return;

    mobileToggleBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        mobileToggleBtn.classList.toggle('open', isOpen);
        mobileToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            mobileToggleBtn.classList.remove('open');
            mobileToggleBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('formStatus');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Gửi tin nhắn';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Đang gửi...';
        }

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method || 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                if (statusDiv) {
                    statusDiv.className = 'form-status success';
                    statusDiv.innerHTML = 'Tin nhắn đã được gửi thành công. Cảm ơn bạn!';
                }
                form.reset();
            } else {
                const data = await response.json();
                if (statusDiv) {
                    statusDiv.className = 'form-status error';
                    statusDiv.innerHTML = (data.errors ? data.errors.map(err => err.message).join(', ') : 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
                }
            }
        } catch (error) {
            if (statusDiv) {
                statusDiv.className = 'form-status error';
                statusDiv.innerHTML = 'Không thể gửi tin nhắn. Vui lòng kiểm tra lại kết nối mạng hoặc gửi email trực tiếp.';
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });
}

function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function highlightActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
