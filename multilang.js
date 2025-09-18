// Multilingual Support System

class MultiLangManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.setupLanguageSelector();
        this.applyTranslations();
    }

    async loadTranslations() {
        try {
            // Load English translations
            const enResponse = await fetch('assets/lang/en.json');
            this.translations.en = await enResponse.json();

            // Load Odia translations
            const odResponse = await fetch('assets/lang/od.json');
            this.translations.od = await odResponse.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback translations
            this.translations = {
                en: {
                    welcome: "Welcome to Interactive STEM Learning",
                    tagline: "Explore, Learn, and Discover the Wonders of Science, Technology, Engineering, and Mathematics",
                    student: "Student",
                    teacher: "Teacher",
                    studentDesc: "Start your learning journey with fun games and videos",
                    teacherDesc: "Manage content and track student progress",
                    dashboard: "Dashboard",
                    videos: "STEM Videos",
                    games: "Learning Games",
                    progress: "Progress",
                    achievements: "Achievements",
                    home: "Home"
                },
                od: {
                    welcome: "ଇଣ୍ଟରାକ୍ଟିଭ୍ STEM ଶିକ୍ଷାକୁ ସ୍ୱାଗତ",
                    tagline: "ବିଜ୍ଞାନ, ପ୍ରଯୁକ୍ତିବିଦ୍ୟା, ଇଞ୍ଜିନିୟରିଂ ଏବଂ ଗଣିତର ଆଶ୍ଚର୍ଯ୍ୟ ଅନ୍ୱେଷଣ, ଶିକ୍ଷା ଏବଂ ଆବିଷ୍କାର କରନ୍ତୁ",
                    student: "ଛାତ୍ର",
                    teacher: "ଶିକ୍ଷକ",
                    studentDesc: "ମଜାଦାର ଖେଳ ଏବଂ ଭିଡିଓ ସହିତ ଆପଣଙ୍କର ଶିକ୍ଷା ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ",
                    teacherDesc: "ବିଷୟବସ୍ତୁ ପରିଚାଳନା କରନ୍ତୁ ଏବଂ ଛାତ୍ରଙ୍କ ଅଗ୍ରଗତି ଟ୍ରାକ୍ କରନ୍ତୁ",
                    dashboard: "ଡ୍ୟାସବୋର୍ଡ",
                    videos: "STEM ଭିଡିଓ",
                    games: "ଶିକ୍ଷାଗତ ଖେଳ",
                    progress: "ଅଗ୍ରଗତି",
                    achievements: "ସଫଳତା",
                    home: "ଘର"
                }
            };
        }
    }

    setupLanguageSelector() {
        const selectors = document.querySelectorAll('#languageSelect');
        selectors.forEach(selector => {
            selector.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        });

        // Get saved language preference
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
            selectors.forEach(selector => {
                selector.value = savedLanguage;
            });
        }
    }

    changeLanguage(language) {
        if (!this.translations[language]) {
            console.error(`Language ${language} not supported`);
            return;
        }

        this.currentLanguage = language;
        localStorage.setItem('preferredLanguage', language);
        
        // Update all language selectors
        const selectors = document.querySelectorAll('#languageSelect');
        selectors.forEach(selector => {
            selector.value = language;
        });

        this.applyTranslations();
        
        // Update document direction for RTL languages if needed
        document.dir = language === 'ar' ? 'rtl' : 'ltr';
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update document title if needed
        const titleElement = document.querySelector('title');
        if (titleElement && titleElement.getAttribute('data-translate')) {
            const key = titleElement.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (translation) {
                titleElement.textContent = translation;
            }
        }
    }

    getTranslation(key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (translation && typeof translation === 'object') {
                translation = translation[k];
            } else {
                break;
            }
        }
        
        // Fallback to English if translation not found
        if (!translation && this.currentLanguage !== 'en') {
            translation = this.translations.en;
            for (const k of keys) {
                if (translation && typeof translation === 'object') {
                    translation = translation[k];
                } else {
                    break;
                }
            }
        }
        
        return translation || key;
    }

    // Method to add translations dynamically
    addTranslations(language, translations) {
        if (!this.translations[language]) {
            this.translations[language] = {};
        }
        
        Object.assign(this.translations[language], translations);
    }

    // Method to get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Method to get available languages
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }
}

// Initialize multilingual support
let multiLang;
document.addEventListener('DOMContentLoaded', () => {
    multiLang = new MultiLangManager();
});

// Format numbers based on language
function formatNumber(number, language = null) {
    const lang = language || (multiLang ? multiLang.getCurrentLanguage() : 'en');
    
    const formatters = {
        en: (num) => num.toLocaleString('en-US'),
        od: (num) => num.toLocaleString('or-IN')  // Odia formatting
    };
    
    return formatters[lang] ? formatters[lang](number) : number.toString();
}

// Format dates based on language
function formatDate(date, language = null) {
    const lang = language || (multiLang ? multiLang.getCurrentLanguage() : 'en');
    
    const formatters = {
        en: (date) => date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        od: (date) => date.toLocaleDateString('or-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    };
    
    return formatters[lang] ? formatters[lang](date) : date.toLocaleDateString();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MultiLangManager, formatNumber, formatDate };
}