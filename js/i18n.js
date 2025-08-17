let currentLanguage = 'ko';
let translations = {};

// 번역 파일 로드
async function loadTranslations(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) {
            throw new Error('번역 파일을 찾을 수 없습니다');
        }
        translations = await response.json();
        applyTranslations();
        updatePageLanguage(lang);
    } catch (error) {
        console.error('번역 파일 로드 실패:', error);
        // 기본 언어(한국어)로 폴백
        if (lang !== 'ko') {
            loadTranslations('ko');
        }
    }
}

// 언어 변경
function changeLanguage(lang) {
    currentLanguage = lang;
    
    // 활성 버튼 변경
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
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
            } else if (element.hasAttribute('data-i18n-title')) {
                element.title = translation;
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

// 페이지 언어 속성 업데이트
function updatePageLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelector('html').setAttribute('lang', lang);
}

// 브라우저 언어 감지
function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.languages[0];
    const langCode = browserLang.split('-')[0];
    
    // 지원하는 언어 목록
    const supportedLanguages = ['ko', 'en', 'ja', 'zh', 'vi', 'th'];
    
    if (supportedLanguages.includes(langCode)) {
        return langCode;
    }
    
    return 'ko'; // 기본값
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('language') || detectBrowserLanguage();
    changeLanguage(savedLanguage);
});

// 전역 함수로 내보내기 (HTML에서 직접 호출용)
window.changeLanguage = changeLanguage;
