class RealTimeTranslator {
    constructor() {
        this.currentLanguage = CONFIG.DEFAULT_LANGUAGE;
        this.cache = this.loadCache();
        this.isTranslating = false;
    }

    // 언어 변경 메인 함수
    async changeLanguage(targetLang) {
        // 이미 번역 중이면 중단
        if (this.isTranslating) return;
        
        // 현재 언어와 같으면 무시
        if (this.currentLanguage === targetLang) return;
        
        this.isTranslating = true;
        this.showLoadingState();
        
        try {
            if (targetLang === 'ko') {
                this.showOriginalContent();
            } else {
                await this.translateAllContent(targetLang);
            }
            
            this.currentLanguage = targetLang;
            this.updateActiveLanguageButton(targetLang);
            this.saveLanguagePreference(targetLang);
            
        } catch (error) {
            console.error('언어 변경 실패:', error);
            this.showErrorMessage();
        } finally {
            this.isTranslating = false;
            this.hideLoadingState();
        }
    }

    // 모든 콘텐츠 번역
    async translateAllContent(targetLang) {
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        const batchSize = 10; // 한 번에 처리할 요소 수
        
        for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
            const batch = Array.from(elementsToTranslate).slice(i, i + batchSize);
            await this.translateBatch(batch, targetLang);
        }
    }

    // 배치 번역 처리
    async translateBatch(elements, targetLang) {
        const promises = elements.map(async (element) => {
            const originalText = element.dataset.original || element.textContent.trim();
            
            // 원본 텍스트가 비어있으면 스킵
            if (!originalText) return;
            
            element.dataset.original = originalText;
            
            try {
                const translatedText = await this.translateText(originalText, targetLang);
                element.textContent = translatedText;
            } catch (error) {
                console.error('번역 실패:', originalText, error);
                // 실패시 원본 유지
            }
        });
        
        await Promise.all(promises);
    }

    // 단일 텍스트 번역
    async translateText(text, targetLang) {
        // 빈 텍스트 체크
        if (!text || text.trim() === '') return text;
        
        const cacheKey = `${text}_${targetLang}`;
        
        // 캐시 확인
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // API 키 확인
        if (!CONFIG.GOOGLE_TRANSLATE_API_KEY || CONFIG.GOOGLE_TRANSLATE_API_KEY === 'YOUR_API_KEY_HERE') {
            console.warn('Google Translate API 키가 설정되지 않았습니다');
            return text; // 원본 반환
        }

        try {
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${CONFIG.GOOGLE_TRANSLATE_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: 'ko',
                    target: targetLang,
                    format: 'text'
                })
            });

            if (!response.ok) {
                throw new Error(`API 요청 실패: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            const translatedText = data.data.translations[0].translatedText;
            
            // 캐시에 저장
            this.cache.set(cacheKey, translatedText);
            this.saveCache();
            
            return translatedText;
            
        } catch (error) {
            console.error('번역 API 오류:', error);
            return text; // 실패시 원본 반환
        }
    }

    // 원본 콘텐츠 복원
    showOriginalContent() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            if (element.dataset.original) {
                element.textContent = element.dataset.original;
            }
        });
    }

    // 언어 버튼 업데이트
    updateActiveLanguageButton(lang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // 로딩 상태 표시
    showLoadingState() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        // 로딩 인디케이터 표시 (선택사항)
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'translation-loading';
        loadingIndicator.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(102, 126, 234, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 10000;
            font-size: 0.9rem;
        `;
        loadingIndicator.textContent = '번역 중...';
        document.body.appendChild(loadingIndicator);
    }

    // 로딩 상태 숨김
    hideLoadingState() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.disabled = false;
        });
        
        const loadingIndicator = document.getElementById('translation-loading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    // 에러 메시지 표시
    showErrorMessage() {
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(231, 76, 60, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 10000;
            font-size: 0.9rem;
        `;
        errorMsg.textContent = '번역 중 오류가 발생했습니다';
        document.body.appendChild(errorMsg);
        
        setTimeout(() => errorMsg.remove(), 3000);
    }

    // 캐시 관리
    loadCache() {
        try {
            const cached = localStorage.getItem('translation_cache');
            return cached ? new Map(JSON.parse(cached)) : new Map();
        } catch {
            return new Map();
        }
    }

    saveCache() {
        try {
            localStorage.setItem('translation_cache', JSON.stringify([...this.cache]));
        } catch (error) {
            console.error('캐시 저장 실패:', error);
        }
    }

    // 언어 설정 저장/불러오기
    saveLanguagePreference(lang) {
        localStorage.setItem('preferred_language', lang);
    }

    loadLanguagePreference() {
        return localStorage.getItem('preferred_language') || this.detectBrowserLanguage();
    }

    // 브라우저 언어 감지
    detectBrowserLanguage() {
        const browserLang = navigator.language.split('-')[0];
        return Object.keys(CONFIG.SUPPORTED_LANGUAGES).includes(browserLang) 
            ? browserLang 
            : CONFIG.DEFAULT_LANGUAGE;
    }

    // 초기화
    init() {
        const preferredLang = this.loadLanguagePreference();
        if (preferredLang !== 'ko') {
            this.changeLanguage(preferredLang);
        } else {
            this.updateActiveLanguageButton('ko');
        }
    }
}

// 전역 인스턴스 생성
const translator = new RealTimeTranslator();

// 전역 함수
window.changeLanguage = (lang) => translator.changeLanguage(lang);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    translator.init();
});
