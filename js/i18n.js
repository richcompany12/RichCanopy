let currentLanguage = 'ko';
let translations = {};

// 번역 파일 로드
async function loadTranslations(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        translations = await response.json();
        applyTranslations();
    } catch (error) {
        console.error('번역 파일 로드 실패:', error);
    }
}

// 언어 변경
function changeLanguage(lang) {
    currentLanguage = lang;
    document.getElementById('html-lang').lang = lang;
    
    // 활성 버튼 변경
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    loadTranslations(lang);
    localStorage.setItem('language', lang);
}

// 번역 적용
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations, key);
        
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
}

// 중첩된 번역 키 처리
function getNestedTranslation(obj, key) {
    return key.split('.').reduce((o, i) => o && o[i], obj);
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('language') || 'ko';
    changeLanguage(savedLanguage);
});
