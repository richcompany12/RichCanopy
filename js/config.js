// Google Translate API 설정
const CONFIG = {
    // 나중에 실제 API 키로 교체
    GOOGLE_TRANSLATE_API_KEY: 'YOUR_API_KEY_HERE',
    
    // 지원 언어 목록
    SUPPORTED_LANGUAGES: {
        'ko': '한국어',
        'en': 'English', 
        'ja': '日本語',
        'zh': '中文',
        'vi': 'Tiếng Việt',
        'th': 'ไทย'
    },
    
    // 기본 언어
    DEFAULT_LANGUAGE: 'ko',
    
    // 캐시 설정
    CACHE_EXPIRY: 24 * 60 * 60 * 1000 // 24시간
};

// 전역 설정 내보내기
window.CONFIG = CONFIG;
