document.addEventListener('DOMContentLoaded', function() {
    // 부드러운 스크롤
    initSmoothScroll();
    
    // 폼 처리
    initContactForm();
    
    // 스크롤 애니메이션
    initScrollAnimations();
    
    // 헤더 효과
    initHeaderEffects();
});

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const phone = formData.get('phone');
            
            if (!name || !phone) {
                alert('이름과 연락처는 필수 입력 항목입니다.');
                return;
            }
            
            alert('상담 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
            this.reset();
        });
    }
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.product-card, .feature-card, .blog-card').forEach(el => {
        observer.observe(el);
    });
}

function initHeaderEffects() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(10, 11, 30, 0.95)';
            header.style.borderBottom = '1px solid rgba(102, 126, 234, 0.3)';
        } else {
            header.style.background = 'rgba(10, 11, 30, 0.9)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
        
        lastScrollY = currentScrollY;
    });
}
