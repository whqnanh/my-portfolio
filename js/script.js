/**
 * JAVASCRIPT NÂNG CAO - PORTFOLIO NGUYỄN HOÀNG ANH
 * Chương 6: Domain Name & Hosting - BÀI TẬP THỰC HÀNH SỐ 8
 * Các chức năng chính:
 * 1. Dark Mode Toggle với LocalStorage & System Preference Detection
 * 2. Scroll Animation sử dụng Intersection Observer API
 * 3. Mobile Navigation Menu Toggle
 * 4. Xử lý Formspree Contact Form qua AJAX/Fetch API
 * 5. Nút cuộn lên đầu trang (Back to Top)
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initScrollAnimation();
    initMobileMenu();
    initContactForm();
    initBackToTop();
    highlightActiveNavLink();
});

/* ==========================================================================
   1. DARK MODE TOGGLE (LocalStorage + System Preference)
   ========================================================================== */
function initThemeToggle() {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    if (!themeToggleBtns.length) return;

    // Lấy theme đã lưu trong LocalStorage hoặc theo tùy chọn của hệ điều hành
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

    // Lắng nghe thay đổi theme từ hệ thống nếu người dùng chưa chọn thủ công
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
        if (theme === 'dark') {
            btn.innerHTML = '☀️';
            btn.setAttribute('title', 'Chuyển sang Chế độ Sáng (Light Mode)');
            btn.setAttribute('aria-label', 'Chuyển sang Chế độ Sáng');
        } else {
            btn.innerHTML = '🌙';
            btn.setAttribute('title', 'Chuyển sang Chế độ Tối (Dark Mode)');
            btn.setAttribute('aria-label', 'Chuyển sang Chế độ Tối');
        }
    });
}

/* ==========================================================================
   2. SCROLL ANIMATION (INTERSECTION OBSERVER API)
   ========================================================================== */
function initScrollAnimation() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    // Kiểm tra trình duyệt có hỗ trợ IntersectionObserver không
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Khi đã kích hoạt hiệu ứng một lần, hủy theo dõi để tối ưu hiệu năng
                    observerInstance.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback cho trình duyệt cũ không hỗ trợ IntersectionObserver
        revealElements.forEach(el => el.classList.add('active'));
    }
}

/* ==========================================================================
   3. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
    const mobileToggleBtn = document.querySelector('.mobile-toggle-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (!mobileToggleBtn || !mobileMenu) return;

    mobileToggleBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        mobileToggleBtn.classList.toggle('open', isOpen);
        mobileToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Đóng menu khi người dùng bấm vào bất kỳ liên kết nào
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            mobileToggleBtn.classList.remove('open');
            mobileToggleBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ==========================================================================
   4. XỬ LÝ FORMSPREE CONTACT FORM (AJAX / FETCH API)
   ========================================================================== */
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
            submitBtn.innerHTML = '⏳ Đang gửi tin nhắn...';
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
                    statusDiv.innerHTML = '🎉 Cảm ơn bạn! Tin nhắn đã được gửi thành công đến Nguyễn Hoàng Anh. Mình sẽ phản hồi sớm nhất qua email!';
                }
                form.reset();
            } else {
                const data = await response.json();
                if (statusDiv) {
                    statusDiv.className = 'form-status error';
                    statusDiv.innerHTML = '⚠️ ' + (data.errors ? data.errors.map(err => err.message).join(', ') : 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau hoặc gửi email trực tiếp!');
                }
            }
        } catch (error) {
            if (statusDiv) {
                statusDiv.className = 'form-status error';
                statusDiv.innerHTML = '⚠️ Không thể kết nối đến máy chủ gửi thư. Vui lòng kiểm tra lại kết nối mạng hoặc liên hệ qua email: nghoanganh559@gmail.com';
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });
}

/* ==========================================================================
   5. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
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

/* ==========================================================================
   6. HIGHLIGHT ACTIVE NAVIGATION LINK
   ========================================================================== */
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
