const CONFIG = {
    // 실제 API 키 입력 (Google Cloud에서 복사한 것)
    GOOGLE_TRANSLATE_API_KEY: 'AIzaSyDQot9m1ln5GXHEVQRnbuDYcoRjY9PebL0',
    
    SUPPORTED_LANGUAGES: {
        'ko': '한국어',
        'en': 'English', 
        'ja': '日본語',
        'zh': '中문',
        'vi': 'Tiếng Việt',
        'th': 'ไทย'
    },
    
    DEFAULT_LANGUAGE: 'ko',
    CACHE_EXPIRY: 24 * 60 * 60 * 1000
};

window.CONFIG = CONFIG;
