class RealTimeTranslator {
    constructor() {
        this.currentLanguage = 'ko';
        this.cache = new Map(); // 번역 캐시
        this.apiKey = 'YOUR_GOOGLE_TRANSLATE_API_KEY'; // 나중에 설정
    }

    // 언어 변경
    async changeLanguage(targetLang) {
        if (targetLang === 'ko') {
            // 한국어는 원본 그대로
            this.currentLanguage = 'ko';
            this.showOriginalContent();
            return;
        }

        this.currentLanguage = targetLang;
        await this.translateAllContent(targetLang);
        this.updateActiveLanguageButton(targetLang);
        localStorage.setItem('language', targetLang);
    }

    // 모든 콘텐츠 번역
    async translateAllContent(targetLang) {
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        
        for (const element of elementsToTranslate) {
            const originalText = element.dataset.original || element.textContent;
            element.dataset.original = originalText; // 원본 저장
            
            const translatedText = await this.translateText(originalText, targetLang);
            element.textContent = translatedText;
        }
    }

    // 텍스트 번역 (캐시 활용)
    async translateText(text, targetLang) {
        const cacheKey = `${text}_${targetLang}`;
        
        // 캐시에 있으면 캐시 사용
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            // Google Translate API 호출
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`, {
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

            const data = await response.json();
            const translatedText = data.data.translations[0].translatedText;
            
            // 캐시에 저장
            this.cache.set(cacheKey, translatedText);
            
            return translatedText;
        } catch (error) {
            console.error('번역 오류:', error);
            return text; // 실패시 원본 반환
        }
    }

    // 원본 콘텐츠 표시
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
        document.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');
    }
}

// 전역 인스턴스 생성
const translator = new RealTimeTranslator();

// 전역 함수
window.changeLanguage = (lang) => translator.changeLanguage(lang);
