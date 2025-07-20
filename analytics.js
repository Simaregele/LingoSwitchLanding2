// Analytics and UTM Tracking Script
// Отслеживание рекламных параметров из Google Ads и Яндекс.Директ

class AnalyticsTracker {
    constructor() {
        this.utmParams = {};
        this.clickId = null;
        this.userId = null;
        this.sessionData = {};
        this.init();
    }

    init() {
        this.extractUTMParams();
        this.extractGoogleAdsParams();
        this.extractYandexDirectParams();
        this.saveToSession();
        this.sendToAnalytics();
        this.setupEventListeners();
    }

    // Извлечение UTM параметров
    extractUTMParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        
        utmKeys.forEach(key => {
            const value = urlParams.get(key);
            if (value) {
                this.utmParams[key] = value;
            }
        });
    }

    // Извлечение параметров Google Ads
    extractGoogleAdsParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Google Ads параметры
        const googleParams = {
            'gclid': urlParams.get('gclid'), // Google Click ID
            'gclsrc': urlParams.get('gclsrc'), // Google Click Source
            'dclid': urlParams.get('dclid'), // Display Click ID
        };

        Object.keys(googleParams).forEach(key => {
            if (googleParams[key]) {
                this.utmParams[key] = googleParams[key];
                if (key === 'gclid') {
                    this.clickId = googleParams[key];
                }
            }
        });
    }

    // Извлечение параметров Яндекс.Директ
    extractYandexDirectParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Яндекс.Директ параметры
        const yandexParams = {
            'yclid': urlParams.get('yclid'), // Яндекс Click ID
        };

        Object.keys(yandexParams).forEach(key => {
            if (yandexParams[key]) {
                this.utmParams[key] = yandexParams[key];
                if (key === 'yclid') {
                    this.clickId = yandexParams[key];
                }
            }
        });
    }

    // Сохранение данных в sessionStorage
    saveToSession() {
        this.sessionData = {
            utmParams: this.utmParams,
            clickId: this.clickId,
            userId: this.generateUserId(),
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            landingPage: window.location.href,
        };

        try {
            sessionStorage.setItem('analytics_data', JSON.stringify(this.sessionData));
            console.log('Analytics data saved:', this.sessionData);
        } catch (error) {
            console.error('Error saving analytics data:', error);
        }
    }

    // Генерация уникального ID пользователя
    generateUserId() {
        let userId = localStorage.getItem('user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('user_id', userId);
        }
        return userId;
    }

    // Отправка данных в аналитику
    sendToAnalytics() {
        if (Object.keys(this.utmParams).length === 0) {
            console.log('No advertising parameters found');
            return;
        }

        // Отправка в Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                utm_source: this.utmParams.utm_source,
                utm_medium: this.utmParams.utm_medium,
                utm_campaign: this.utmParams.utm_campaign,
                click_id: this.clickId,
            });
        }

        // Отправка в Яндекс.Метрику
        if (typeof ym !== 'undefined') {
            ym('12345678', 'reachGoal', 'advertising_click', {
                utm_source: this.utmParams.utm_source,
                utm_medium: this.utmParams.utm_medium,
                utm_campaign: this.utmParams.utm_campaign,
                click_id: this.clickId,
            });
        }
    }

    // Настройка слушателей событий
    setupEventListeners() {
        // Отслеживание кликов по кнопкам
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href="#get-started"], .hero-cta, .nav-cta')) {
                this.trackEvent('button_click', {
                    button_text: e.target.textContent,
                    button_class: e.target.className,
                });
            }
        });
    }

    // Отслеживание событий
    trackEvent(eventName, eventData) {
        const event = {
            event_name: eventName,
            event_data: eventData,
            timestamp: new Date().toISOString(),
            session_data: this.sessionData,
        };

        console.log('Event tracked:', event);

        // Отправка в аналитику
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }

        if (typeof ym !== 'undefined') {
            ym('12345678', 'reachGoal', eventName, eventData);
        }
    }

    // Получение данных аналитики
    getAnalyticsData() {
        return this.sessionData;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.analyticsTracker = new AnalyticsTracker();
}); 