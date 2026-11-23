document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio của Nguyễn Hoàng Anh đã load xong!');

    alert('Chào mừng bạn đến với portfolio thật trên Internet của mình!');

    // Xử lý gửi biểu mẫu liên hệ nếu có trên trang contact.html
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('name');
            const name = nameInput ? nameInput.value : 'bạn';
            alert(`Cảm ơn bạn ${name}! Tin nhắn của bạn đã được gửi thành công.`);
            contactForm.reset();
        });
    }
});
