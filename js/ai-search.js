// ==================== КОНФИГУРАЦИЯ ====================
const APP_CONFIG = {
    VERSION: '1.0',
    MODE: 'gemini', // Используем Gemini API
    API_URL: 'http://localhost:3000/api/gemini', // API на том же порту, что и веб-сервер
    CONFIG_URL: 'http://localhost:3000/api/config', // URL для получения конфигурации
    GEMINI_MODEL: null // Будет загружен с сервера
};

// Глобальные переменные
let conversationHistory = [];
let isTyping = false;
let userPreferences = {
    age: '',
    gender: '',
    interests: [],
    occasion: '',
    budget: '',
    relationship: ''
};

// ==================== БАЗА ДАННЫХ ПОДАРКОВ ====================
const giftsDatabase = [
    {
        id: 1,
        name: "Подарочный набор косметики",
        price: "2000-4000 ₽",
        description: "Набор из кремов, масок и сывороток от известного бренда",
        category: "Красота",
        tags: ["женщина", "красота", "уход"],
        age: ["19-30", "31-50", "Старше 50"],
        budget: ["1000-3000", "3000-5000"],
        interests: ["Красота и уход"],
        occasion: ["День рождения", "8 марта", "Просто так"]
    },
    {
        id: 2,
        name: "Билеты на концерт или спектакль",
        price: "3000-8000 ₽",
        description: "Подарочный сертификат на культурное мероприятие",
        category: "Развлечения",
        tags: ["женщина", "мужчина", "культура", "унисекс"],
        age: ["19-30", "31-50"],
        budget: ["3000-5000", "5000-10000"],
        interests: ["Книги/кино", "Творчество"],
        occasion: ["День рождения", "Годовщина"]
    },
    {
        id: 3,
        name: "Умный браслет-фитнес-трекер",
        price: "2500-6000 ₽",
        description: "Следит за активностью, сном и пульсом",
        category: "Технологии",
        tags: ["спорт", "технологии", "здоровье", "унисекс"],
        age: ["13-18", "19-30", "31-50"],
        budget: ["1000-3000", "3000-5000"],
        interests: ["Спорт", "Технологии"],
        occasion: ["День рождения", "Новый год"]
    },
    {
        id: 4,
        name: "Книга с автографом автора",
        price: "1500-4000 ₽",
        description: "Коллекционное издание любимого автора",
        category: "Книги",
        tags: ["книги", "подарок", "коллекция", "унисекс"],
        age: ["19-30", "31-50", "Старше 50"],
        budget: ["1000-3000", "3000-5000"],
        interests: ["Книги/кино"],
        occasion: ["День рождения", "Просто так"]
    },
    {
        id: 5,
        name: "Набор для творчества",
        price: "1500-5000 ₽",
        description: "Набор для вышивания, рисования или лепки",
        category: "Творчество",
        tags: ["творчество", "хобби", "рукоделие", "унисекс"],
        age: ["13-18", "19-30", "31-50"],
        budget: ["1000-3000", "3000-5000"],
        interests: ["Творчество"],
        occasion: ["День рождения", "Новый год"]
    },
    {
        id: 6,
        name: "Портативная колонка JBL",
        price: "4000-8000 ₽",
        description: "Водонепроницаемая Bluetooth-колонка с отличным звуком",
        category: "Технологии",
        tags: ["музыка", "технологии", "отдых", "унисекс"],
        age: ["13-18", "19-30", "31-50"],
        budget: ["3000-5000", "5000-10000"],
        interests: ["Технологии"],
        occasion: ["День рождения", "Новый год"]
    },
    {
        id: 7,
        name: "Подарочный сертификат в спа-салон",
        price: "3000-7000 ₽",
        description: "На массаж и косметические процедуры",
        category: "Красота",
        tags: ["релакс", "уход", "здоровье", "женщина"],
        age: ["19-30", "31-50", "Старше 50"],
        budget: ["3000-5000", "5000-10000"],
        interests: ["Красота и уход"],
        occasion: ["8 марта", "День рождения"]
    },
    {
        id: 8,
        name: "Настольная игра для компании",
        price: "2000-5000 ₽",
        description: "Популярная игра для вечеринок или семейных посиделок",
        category: "Развлечения",
        tags: ["игры", "компания", "отдых", "унисекс"],
        age: ["19-30", "31-50"],
        budget: ["1000-3000", "3000-5000"],
        interests: ["Книги/кино", "Творчество"],
        occasion: ["День рождения", "Новый год"]
    },
    {
        id: 9,
        name: "Электросамокат",
        price: "15000-30000 ₽",
        description: "Компактный транспорт для города",
        category: "Технологии",
        tags: ["технологии", "спорт", "транспорт", "унисекс"],
        age: ["13-18", "19-30"],
        budget: ["Более 10000"],
        interests: ["Спорт", "Технологии"],
        occasion: ["День рождения", "Новый год"]
    },
    {
        id: 10,
        name: "Фотосессия с профессиональным фотографом",
        price: "5000-15000 ₽",
        description: "Подарочный сертификат на съемку",
        category: "Творчество",
        tags: ["фото", "память", "творчество", "унисекс"],
        age: ["19-30", "31-50"],
        budget: ["5000-10000", "Более 10000"],
        interests: ["Творчество"],
        occasion: ["День рождения", "Годовщина"]
    },
    {
        id: 11,
        name: "Конструктор LEGO для взрослых",
        price: "3000-8000 ₽",
        description: "Сложные наборы для коллекционеров",
        category: "Хобби",
        tags: ["хобби", "творчество", "коллекция", "мужчина"],
        age: ["19-30", "31-50"],
        budget: ["3000-5000", "5000-10000"],
        interests: ["Творчество"],
        occasion: ["День рождения", "23 февраля"]
    },
    {
        id: 12,
        name: "Кофемашина капсульная",
        price: "6000-12000 ₽",
        description: "Для приготовления вкусного кофе дома",
        category: "Бытовая техника",
        tags: ["кухня", "техника", "кофе", "унисекс"],
        age: ["19-30", "31-50", "Старше 50"],
        budget: ["5000-10000", "Более 10000"],
        interests: ["Технологии"],
        occasion: ["День рождения", "Новый год"]
    },
    {
        id: 13,
        name: "Уютный плед с именной вышивкой",
        price: "1500-3500 ₽",
        description: "Мягкий теплый плед с персонализацией",
        category: "Дом",
        tags: ["уют", "личное", "дом", "унисекс"],
        age: ["19-30", "31-50", "Старше 50"],
        budget: ["1000-3000", "3000-5000"],
        interests: ["Творчество"],
        occasion: ["День рождения", "Новый год", "Просто так"]
    },
    {
        id: 14,
        name: "Билет на мастер-класс",
        price: "2000-5000 ₽",
        description: "Кулинарный, художественный или ремесленный мастер-класс",
        category: "Образование",
        tags: ["обучение", "творчество", "опыт", "унисекс"],
        age: ["19-30", "31-50"],
        budget: ["1000-3000", "3000-5000"],
        interests: ["Творчество"],
        occasion: ["День рождения", "Годовщина"]
    },
    {
        id: 15,
        name: "Именная звезда на небе",
        price: "3000 ₽",
        description: "Сертификат о регистрации звезды в честь получателя",
        category: "Романтика",
        tags: ["романтика", "память", "уникально", "унисекс"],
        age: ["19-30", "31-50"],
        budget: ["1000-3000", "3000-5000"],
        interests: ["Книги/кино"],
        occasion: ["День рождения", "Годовщина"]
    }
];

// ==================== ВОПРОСЫ ДЛЯ ДИАЛОГА ====================
const questions = [
    {
        id: 1,
        text: "Кому выбираем подарок?",
        options: ["Женщине", "Мужчине", "Ребенку", "Коллеге", "Другу/подруге"],
        key: "relationship"
    },
    {
        id: 2,
        text: "Сколько лет человеку?",
        options: ["До 12 лет", "13-18 лет", "19-30 лет", "31-50 лет", "Старше 50 лет"],
        key: "age"
    },
    {
        id: 3,
        text: "Какой повод для подарка?",
        options: ["День рождения", "Новый год", "8 марта / 23 февраля", "Свадьба / годовщина", "Просто так"],
        key: "occasion"
    },
    {
        id: 4,
        text: "Каков ваш бюджет?",
        options: ["До 1000 ₽", "1000-3000 ₽", "3000-5000 ₽", "5000-10000 ₽", "Более 10000 ₽"],
        key: "budget"
    },
    {
        id: 5,
        text: "Какие интересы у человека? Можно выбрать несколько вариантов.",
        options: ["Технологии", "Спорт", "Творчество", "Книги/кино", "Красота и уход", "Путешествия", "Другое"],
        key: "interests",
        multiple: true
    }
];

let currentQuestionIndex = 0;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🎯 ИИ помощник с Gemini API инициализирован');
    console.log('📊 База подарков:', giftsDatabase.length, 'подарков');
    console.log('🔗 API URL:', APP_CONFIG.API_URL);
    
    // Проверяем наличие элементов
    checkElements();
    
    // Загружаем конфигурацию с сервера (модель Gemini)
    await loadConfigFromServer();
    
    // Тихая проверка доступности сервера (не блокирует загрузку)
    checkServerAvailability().catch(() => {
        // Игнорируем ошибки проверки - это не критично
    });
    
    // Загружаем историю
    const savedHistory = localStorage.getItem('ai-chat-history-local');
    if (savedHistory) {
        try {
            conversationHistory = JSON.parse(savedHistory);
            restoreChatHistory();
        } catch (e) {
            console.error('Ошибка истории:', e);
            startConversation();
        }
    } else {
        startConversation();
    }
    
    setupEventListeners();
});

// Загрузка конфигурации с сервера
async function loadConfigFromServer() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(APP_CONFIG.CONFIG_URL, {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const config = await response.json();
            if (config.model) {
                APP_CONFIG.GEMINI_MODEL = config.model;
                console.log('✅ Конфигурация загружена с сервера');
                console.log('🤖 Модель:', APP_CONFIG.GEMINI_MODEL);
                return true;
            } else {
                console.warn('⚠️ Конфигурация получена, но модель отсутствует');
            }
        } else {
            console.warn('⚠️ Ошибка при получении конфигурации:', response.status);
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.warn('⚠️ Не удалось загрузить конфигурацию с сервера:', error.message);
            console.warn('💡 Используется значение по умолчанию. Убедитесь, что сервер запущен.');
        }
    }
    
    // Используем значение по умолчанию, если не удалось загрузить
    if (!APP_CONFIG.GEMINI_MODEL) {
        APP_CONFIG.GEMINI_MODEL = 'gemini-pro'; // Fallback значение
        console.log('🤖 Используется модель по умолчанию:', APP_CONFIG.GEMINI_MODEL);
    }
    
    return false;
}

// Проверка доступности сервера (тихая проверка без критических ошибок)
async function checkServerAvailability() {
    try {
        // Создаем контроллер для таймаута
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 секунды (быстрее)
        
        const response = await fetch('http://localhost:3000/api-status', {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            console.log('✅ Сервер доступен и работает');
            return true;
        } else {
            console.warn('⚠️ Сервер отвечает, но с ошибкой:', response.status);
            return false;
        }
    } catch (error) {
        // Не критическая ошибка - просто информируем, что сервер не запущен
        // Это нормально, если пользователь еще не запустил сервер
        if (error.name === 'AbortError' || error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
            console.info('ℹ️ Сервер не запущен. Для работы ИИ запустите: npm start или node server.js');
        } else {
            console.warn('⚠️ Не удалось проверить сервер:', error.message);
        }
        return false;
    }
}

function checkElements() {
    const elements = [
        'chatMessages',
        'chatInput', 
        'sendMessageBtn',
        'typingIndicator',
        'giftsGrid',
        'resultsCount',
        'emptyState'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`${element ? '✅' : '❌'} Элемент #${id}:`, element ? 'найден' : 'НЕ НАЙДЕН');
    });
}

async function startConversation() {
    const welcomeMessage = `🤖 **Привет! Я ваш ИИ помощник по подбору подарков!**\n\nРасскажите мне о человеке, для которого вы хотите выбрать подарок. Я задам несколько вопросов, чтобы понять, какой подарок подойдет лучше всего.\n\nНапример, вы можете сказать: "Нужен подарок для мамы, 45 лет, день рождения, бюджет 5000 рублей"`;
    
    conversationHistory = [{
        role: 'assistant',
        text: welcomeMessage,
        time: new Date().toLocaleTimeString()
    }];
    
    saveHistory();
    addMessageToChat('ai', welcomeMessage, conversationHistory[0].time);
}

// ==================== ФУНКЦИИ ЧАТА ====================
function addMessageToChat(sender, text, customTime = null) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) {
        console.error('❌ Не найден элемент #chatMessages');
        return;
    }
    
    const time = customTime || new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender === 'user' ? 'user' : 'ai'}`;
    messageDiv.innerHTML = `
        <div class="message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
        <div class="message-content">
            <div class="message-text">${formatText(text)}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollChatToBottom();
}

function formatText(text) {
    return text.replace(/\n/g, '<br>');
}

function scrollChatToBottom() {
    setTimeout(() => {
        const container = document.getElementById('chatMessagesContainer');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, 100);
}

// ==================== ИНТЕГРАЦИЯ С GEMINI API ====================
async function sendToGemini(userMessage, isSystemMessage = false) {
    if (isSystemMessage) {
        // Для системного сообщения просто инициализируем контекст
        return;
    }
    
    showTypingIndicator();
    
    try {
        // Системный промпт для Gemini
        const systemPrompt = `Ты - дружелюбный ИИ помощник по подбору подарков на сайте Sparks. 

Твоя задача - помочь пользователю выбрать идеальный подарок, задавая уточняющие вопросы о:
- Кому выбирается подарок (пол, возраст, отношения: мама, папа, друг, коллега и т.д.)
- Возраст получателя
- Повод для подарка (день рождения, новый год, 8 марта, 23 февраля, годовщина и т.д.)
- Бюджет (в рублях)
- Интересы и предпочтения получателя (технологии, спорт, творчество, книги, красота, путешествия и т.д.)

Будь дружелюбным и естественным в общении. Задавай вопросы по одному, не перегружай пользователя. 

После того, как соберешь достаточно информации (хотя бы возраст/пол, бюджет или интересы), скажи что-то вроде: "Отлично! Теперь я подберу для вас несколько вариантов подарков" или "Хорошо, давайте найдем подходящие варианты". Это будет сигналом для системы, что нужно показать подарки.

Отвечай кратко, по делу, на русском языке. Будь вежливым и энтузиастичным.`;
        
        // Формируем историю сообщений для контекста
        const messages = [];
        
        // Добавляем системный промпт как первое сообщение
        messages.push({
            role: "user",
            text: systemPrompt
        });
        messages.push({
            role: "assistant",
            text: "Понял, буду следовать этим инструкциям и помогу подобрать идеальный подарок!"
        });
        
        // Добавляем историю диалога (последние 10 сообщений для контекста)
        const recentHistory = conversationHistory.slice(-10);
        recentHistory.forEach(msg => {
            if (msg.role === 'user') {
                messages.push({
                    role: "user",
                    text: msg.text
                });
            } else if (msg.role === 'assistant') {
                messages.push({
                    role: "assistant",
                    text: msg.text
                });
            }
        });
        
        // Добавляем текущее сообщение пользователя
        messages.push({
            role: "user",
            text: userMessage
        });
        
        // Формируем запрос к API
        const requestBody = {
            messages: messages,
            completionOptions: {
                stream: false,
                temperature: 0.7,
                maxTokens: 1000
            }
        };
        
        console.log('📤 Отправка запроса к Gemini API');
        
        const response = await fetch(APP_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        console.log('📥 Ответ от Gemini API:', data);
        
        hideTypingIndicator();
        
        // Проверяем наличие ошибок в ответе
        if (!response.ok || data.error) {
            let errorMessage = 'Извините, произошла ошибка при обращении к ИИ.\n\n';
            
            // Используем понятные сообщения об ошибках
            if (data.userMessage) {
                errorMessage = data.userMessage + '\n\n';
                if (data.userDetails) {
                    errorMessage += data.userDetails;
                }
            } else if (response.status === 403) {
                errorMessage += '❌ Ошибка доступа к Gemini API (403 Forbidden)\n\n';
                errorMessage += 'Возможные причины:\n';
                errorMessage += '1. Неверный или истекший API ключ\n';
                errorMessage += '2. Нет прав доступа в Google AI Studio\n';
                errorMessage += '3. Превышен лимит запросов\n\n';
                errorMessage += 'Проверьте настройки в файле .env';
            } else if (response.status === 401) {
                errorMessage += '❌ Неверный API ключ (401 Unauthorized)\n\n';
                errorMessage += 'Проверьте GEMINI_API_KEY в файле .env';
            } else if (response.status === 429) {
                errorMessage += '⚠️ Превышен лимит запросов\n\n';
                errorMessage += 'Подождите немного и попробуйте снова';
            } else {
                errorMessage += `❌ Ошибка ${response.status}: ${data.error?.message || 'Неизвестная ошибка'}`;
            }
            
            addMessageToChat('ai', errorMessage);
            conversationHistory.push({
                role: 'assistant',
                text: errorMessage,
                time: new Date().toLocaleTimeString()
            });
            saveHistory();
            return;
        }
        
        // Извлекаем текст ответа (формат Gemini)
        const aiResponse = data.result?.alternatives?.[0]?.message?.text || 
                          data.candidates?.[0]?.content?.parts?.[0]?.text ||
                          'Извините, не удалось получить ответ. Попробуйте еще раз.';
        
        // Добавляем ответ ИИ в чат
        addMessageToChat('ai', aiResponse);
        
        // Сохраняем в историю
        conversationHistory.push({
            role: 'assistant',
            text: aiResponse,
            time: new Date().toLocaleTimeString()
        });
        
        // Извлекаем информацию из всей истории перед проверкой готовности
        extractPreferencesFromHistory();
        
        saveHistory();
        
        // Проверяем, не пора ли искать подарки
        checkIfReadyToSearchGifts(aiResponse);
        
    } catch (error) {
        console.error('❌ Ошибка при запросе к Gemini API:', error);
        console.error('🔍 Детали ошибки:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            apiUrl: APP_CONFIG.API_URL
        });
        hideTypingIndicator();
        
        // Более детальное сообщение об ошибке
        let errorMessage = 'Извините, произошла ошибка при обращении к ИИ.\n\n';
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage += '❌ Не удалось подключиться к серверу.\n\n';
            errorMessage += 'Проверьте:\n';
            errorMessage += '1. Запущен ли сервер: `npm start` или `node server.js`\n';
            errorMessage += '2. Доступен ли сервер по адресу: http://localhost:3000\n';
            errorMessage += '3. Нет ли блокировки файрволом или антивирусом\n\n';
            errorMessage += `Попробуйте открыть в браузере: http://localhost:3000`;
        } else if (error.message.includes('HTTP error')) {
            errorMessage += `❌ Ошибка сервера: ${error.message}\n\n`;
            errorMessage += 'Возможные причины:\n';
                errorMessage += '1. Неверный API ключ Gemini\n';
                errorMessage += '2. Проблема с подключением к Gemini API\n';
            errorMessage += '3. Превышен лимит запросов';
        } else {
            errorMessage += `❌ Ошибка: ${error.message}`;
        }
        
        addMessageToChat('ai', errorMessage);
        
        conversationHistory.push({
            role: 'assistant',
            text: errorMessage,
            time: new Date().toLocaleTimeString()
        });
        
        saveHistory();
    }
}

// Проверка готовности к поиску ПЕРЕД отправкой запроса к API
function isReadyToSearchGifts(userMessage) {
    console.log('🔍 Проверка готовности к поиску подарков (перед запросом к API)...');
    console.log('📋 Текущие предпочтения:', userPreferences);
    
    // Проверяем, достаточно ли информации для поиска подарков
    const hasAge = !!userPreferences.age;
    const hasRelationship = !!userPreferences.relationship;
    const hasBudget = !!userPreferences.budget;
    const hasInterests = userPreferences.interests && userPreferences.interests.length > 0;
    
    const infoCount = [hasAge, hasRelationship, hasBudget, hasInterests].filter(Boolean).length;
    const hasEnoughInfo = infoCount >= 3; // Минимум 3 параметра для автоматического поиска
    
    console.log('📊 Количество заполненных параметров:', infoCount);
    console.log('✅ Достаточно информации:', hasEnoughInfo);
    
    // Проверяем, просит ли пользователь явно показать подарки
    const userText = userMessage.toLowerCase();
    const userWantsGifts = (userText.includes('покажи') || userText.includes('найди') || 
                           userText.includes('подбери') || userText.includes('ищи') ||
                           userText.includes('найти') || userText.includes('найдем') ||
                           userText.includes('подобрать') || userText.includes('выбрать')) && 
                           (userText.includes('подарк') || userText.includes('вариант') || 
                            userText.includes('что') || userText.includes('что-то') ||
                            userText.includes('рекоменд'));
    
    console.log('💬 Пользователь просит показать подарки:', userWantsGifts);
    
    // Если пользователь явно просит подарки и есть минимум 2 параметра
    if (userWantsGifts && infoCount >= 2) {
        console.log('✅ Пользователь явно просит подарки, информации достаточно');
        return true;
    }
    
    // Если информации достаточно (3+ параметра), запускаем поиск автоматически
    if (hasEnoughInfo) {
        console.log('✅ Информации достаточно для автоматического поиска');
        return true;
    }
    
    console.log('⏳ Информации недостаточно, отправляем запрос к API для уточнения');
    return false;
}

// Проверка готовности к поиску ПОСЛЕ получения ответа от API (для случаев, когда ИИ сам предлагает поиск)
function checkIfReadyToSearchGifts(aiResponse) {
    // Извлекаем информацию из всей истории разговора
    extractPreferencesFromHistory();
    
    console.log('🔍 Проверка готовности к поиску подарков (после ответа от API)...');
    console.log('📋 Текущие предпочтения:', userPreferences);
    
    // Проверяем, достаточно ли информации для поиска подарков
    const hasAge = !!userPreferences.age;
    const hasRelationship = !!userPreferences.relationship;
    const hasBudget = !!userPreferences.budget;
    const hasInterests = userPreferences.interests && userPreferences.interests.length > 0;
    
    const infoCount = [hasAge, hasRelationship, hasBudget, hasInterests].filter(Boolean).length;
    const hasEnoughInfo = infoCount >= 2; // Минимум 2 параметра
    
    console.log('📊 Количество заполненных параметров:', infoCount);
    console.log('✅ Достаточно информации:', hasEnoughInfo);
    
    // Проверяем, упоминает ли ИИ подарки, варианты или готовность к поиску
    const mentionsGifts = /подарк|вариант|рекоменд|предлож|найд|подобрал|вот|следующ|выбрал/i.test(aiResponse);
    const readyKeywords = /готов|можно|теперь|давай|найдем|подберем|начнем|приступим/i.test(aiResponse);
    const searchKeywords = /ищу|ищем|искать|поиск|найти|найдем/i.test(aiResponse);
    
    console.log('💬 ИИ упоминает подарки:', mentionsGifts);
    console.log('💬 ИИ готов к поиску:', readyKeywords);
    console.log('💬 ИИ упоминает поиск:', searchKeywords);
    
    // Если есть достаточно информации и ИИ упоминает подарки или готовность
    if (hasEnoughInfo && (mentionsGifts || readyKeywords || searchKeywords)) {
        console.log('✅ ИИ предлагает поиск, запускаем поиск подарков...');
        // Даем небольшую задержку перед поиском подарков
        setTimeout(() => {
            findAndShowGifts();
        }, 2000);
        return;
    }
}

function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.style.display = 'flex';
        isTyping = true;
    }
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.style.display = 'none';
        isTyping = false;
    }
}

function showOptions(options, multiple = false) {
    const optionsContainer = document.querySelector('.quick-actions');
    if (!optionsContainer) {
        console.error('❌ Не найден .quick-actions');
        return;
    }
    
    optionsContainer.innerHTML = '';
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quick-action-btn';
        btn.textContent = option;
        btn.addEventListener('click', function() {
            processUserChoice(option, multiple);
        });
        optionsContainer.appendChild(btn);
    });
    
    if (multiple) {
        const doneBtn = document.createElement('button');
        doneBtn.className = 'quick-action-btn';
        doneBtn.innerHTML = '<i class="fas fa-check"></i> Готово';
        doneBtn.addEventListener('click', function() {
            if (userPreferences.interests.length === 0) {
                addMessageToChat('ai', 'Пожалуйста, выберите хотя бы один интерес.');
                return;
            }
            askNextQuestion();
        });
        optionsContainer.appendChild(doneBtn);
    }
}

// ==================== ОБРАБОТКА ОТВЕТОВ ====================
function processUserChoice(choice, multiple = false) {
    if (isTyping) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const key = currentQuestion.key;
    
    console.log(`📝 Выбор пользователя: ${choice} для ключа ${key}`);
    
    // Обработка интересов (множественный выбор)
    if (multiple && key === 'interests') {
        if (!userPreferences.interests) userPreferences.interests = [];
        
        if (userPreferences.interests.includes(choice)) {
            // Удаляем если уже есть
            userPreferences.interests = userPreferences.interests.filter(i => i !== choice);
            addMessageToChat('user', `Убрали: ${choice}`);
        } else {
            // Добавляем
            userPreferences.interests.push(choice);
            addMessageToChat('user', `Добавили: ${choice}`);
        }
        
        conversationHistory.push({
            role: 'user',
            text: choice,
            time: new Date().toLocaleTimeString()
        });
        
        // Показываем текущий выбор
        const selectedText = userPreferences.interests.length > 0 
            ? `Выбрано: ${userPreferences.interests.join(', ')}`
            : 'Ничего не выбрано';
        
        showOptions(options, multiple);
        return;
    }
    
    // Одиночный выбор
    userPreferences[key] = choice;
    
    addMessageToChat('user', choice);
    conversationHistory.push({
        role: 'user',
        text: choice,
        time: new Date().toLocaleTimeString()
    });
    
    askNextQuestion();
}

function askNextQuestion() {
    currentQuestionIndex++;
    console.log(`➡️ Переход к вопросу ${currentQuestionIndex}`);
    
    if (currentQuestionIndex < questions.length) {
        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                const nextQuestion = questions[currentQuestionIndex];
                addMessageToChat('ai', nextQuestion.text);
                conversationHistory.push({
                    role: 'assistant',
                    text: nextQuestion.text,
                    time: new Date().toLocaleTimeString(),
                    questionId: currentQuestionIndex
                });
                
                showOptions(nextQuestion.options, nextQuestion.multiple || false);
                saveHistory();
            }, 800);
        }, 500);
    } else {
        // Все вопросы заданы, подбираем подарки
        console.log('✅ Все вопросы заданы, подбираю подарки...');
        console.log('📋 Предпочтения пользователя:', userPreferences);
        
        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                findAndShowGifts();
            }, 1200);
        }, 500);
    }
}

// ==================== ПОДБОР ПОДАРКОВ ====================
function findAndShowGifts() {
    console.log('🔍 Начинаю поиск подарков...');
    
    let filteredGifts = giftsDatabase.filter(gift => {
        let matches = 0;
        let totalCriteria = 0;
        
        // Возраст
        if (userPreferences.age && gift.age) {
            totalCriteria++;
            if (gift.age.includes(userPreferences.age)) {
                matches++;
            }
        }
        
        // Бюджет (убираем символ ₽ для сравнения)
        if (userPreferences.budget && gift.budget) {
            totalCriteria++;
            const userBudget = userPreferences.budget.replace(' ₽', '');
            if (gift.budget.includes(userBudget)) {
                matches++;
            }
        }
        
        // Интересы
        if (userPreferences.interests && userPreferences.interests.length > 0 && gift.interests) {
            totalCriteria++;
            const hasMatchingInterest = userPreferences.interests.some(interest => 
                gift.interests.includes(interest)
            );
            if (hasMatchingInterest) {
                matches++;
            }
        }
        
        // Повод
        if (userPreferences.occasion && gift.occasion) {
            totalCriteria++;
            if (gift.occasion.includes(userPreferences.occasion)) {
                matches++;
            }
        }
        
        // Отношения
        if (userPreferences.relationship) {
            totalCriteria++;
            const isUnisex = gift.tags.includes("унисекс");
            const isForGender = gift.tags.includes("женщина") || gift.tags.includes("мужчина");
            
            if (userPreferences.relationship === "Женщине") {
                if (gift.tags.includes("женщина") || isUnisex || !isForGender) {
                    matches++;
                }
            } else if (userPreferences.relationship === "Мужчине") {
                if (gift.tags.includes("мужчина") || isUnisex || !isForGender) {
                    matches++;
                }
            } else {
                // Для остальных категорий (ребенок, коллега и т.д.)
                matches++;
            }
        }
        
        // Минимум 40% совпадений или хотя бы 2 критерия
        const matchPercentage = totalCriteria > 0 ? (matches / totalCriteria) : 0;
        return matchPercentage >= 0.4 || matches >= 2;
    });
    
    console.log(`🎁 После фильтрации: ${filteredGifts.length} подарков`);
    
    // Если мало подарков, показываем любые
    if (filteredGifts.length < 3) {
        console.log('⚠️ Мало подарков, показываю популярные...');
        filteredGifts = [...giftsDatabase].sort(() => 0.5 - Math.random()).slice(0, 6);
    }
    
    // Берем до 6 подарков
    const selectedGifts = filteredGifts.slice(0, 6);
    console.log(`🎁 Итог: ${selectedGifts.length} подарков для показа`);
    
    // Формируем ответ
    let response = `**Отлично! На основе ваших ответов я подобрал ${selectedGifts.length} вариантов:**\n\n`;
    
    selectedGifts.forEach((gift, index) => {
        response += `${index + 1}. **${gift.name}** | ${gift.price}\n   ${gift.description}\n\n`;
    });
    
    response += `**Параметры поиска:**\n`;
    response += `• Кому: ${userPreferences.relationship || 'не указано'}\n`;
    response += `• Возраст: ${userPreferences.age || 'не указано'}\n`;
    response += `• Повод: ${userPreferences.occasion || 'не указано'}\n`;
    response += `• Бюджет: ${userPreferences.budget || 'не указано'}\n`;
    if (userPreferences.interests && userPreferences.interests.length > 0) {
        response += `• Интересы: ${userPreferences.interests.join(', ')}\n`;
    }
    
    addMessageToChat('ai', response);
    conversationHistory.push({
        role: 'assistant',
        text: response,
        time: new Date().toLocaleTimeString()
    });
    
    // Показываем подарки в интерфейсе
    displayGifts(selectedGifts);
    saveHistory();
}

// ==================== ОТОБРАЖЕНИЕ ПОДАРКОВ ====================
function displayGifts(gifts) {
    const grid = document.getElementById('giftsGrid');
    const count = document.getElementById('resultsCount');
    const emptyState = document.getElementById('emptyState');
    const resultsContainer = document.querySelector('.ai-results-container');
    
    if (!grid) {
        console.error('❌ Не найден элемент #giftsGrid');
        return;
    }
    
    console.log(`🎁 Отображаю ${gifts.length} подарков в интерфейсе`);
    
    // Скрываем пустое состояние
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Показываем контейнер результатов
    if (resultsContainer) {
        resultsContainer.style.display = 'block';
    }
    
    // Очищаем и заполняем сетку
    grid.innerHTML = '';
    grid.style.display = 'grid';
    
    gifts.forEach((gift) => {
        const card = document.createElement('div');
        card.className = 'gift-card';
        card.innerHTML = `
            <div class="gift-image">
                <i class="fas fa-gift"></i>
            </div>
            <div class="gift-content">
                <div class="gift-header">
                    <h4 class="gift-title">${gift.name}</h4>
                    <span class="gift-price">${gift.price}</span>
                </div>
                <p class="gift-description">${gift.description}</p>
                <div class="gift-tags">
                    <span class="tag">${gift.category}</span>
                    ${gift.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="gift-actions">
                    <button class="btn-small btn-outline" onclick="saveGift(${gift.id})">
                        <i class="far fa-heart"></i> Сохранить
                    </button>
                    <button class="btn-small btn-primary" onclick="showGiftDetails(${gift.id})">
                        <i class="fas fa-info-circle"></i> Подробнее
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Обновляем счетчик
    if (count) {
        count.textContent = gifts.length.toString();
        console.log(`🔢 Счетчик обновлен: ${gifts.length}`);
    }
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ ====================
function setupEventListeners() {
    // Кнопка очистки истории
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function() {
            clearChatHistory();
        });
        console.log('✅ Кнопка очистки истории подключена');
    } else {
        console.warn('⚠️ Кнопка очистки истории не найдена');
    }
    
    const sendBtn = document.getElementById('sendMessageBtn');
    const chatInput = document.getElementById('chatInput');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
        console.log('✅ Кнопка отправки подключена');
    } else {
        console.error('❌ Не найдена кнопка отправки #sendMessageBtn');
    }
    
    if (chatInput) {
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
        
        console.log('✅ Поле ввода подключено');
    } else {
        console.error('❌ Не найдено поле ввода #chatInput');
    }
    
    // Быстрые кнопки из HTML
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const prompt = this.getAttribute('data-prompt');
            console.log('🎯 Быстрая кнопка:', prompt);
            
            if (prompt) {
                // Отправляем промпт как сообщение пользователя
                const chatInput = document.getElementById('chatInput');
                if (chatInput) {
                    chatInput.value = prompt;
                    await sendMessage();
                }
            }
        });
    });
}

async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    
    const message = chatInput.value.trim();
    if (!message || isTyping) return;
    
    console.log('📤 Пользователь отправил:', message);
    
    // Очищаем поле
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Добавляем сообщение пользователя
    addMessageToChat('user', message);
    conversationHistory.push({
        role: 'user',
        text: message,
        time: new Date().toLocaleTimeString()
    });
    
    // Извлекаем информацию из сообщения для предпочтений
    extractPreferencesFromMessage(message);
    
    // Извлекаем информацию из всей истории
    extractPreferencesFromHistory();
    
    saveHistory();
    
    // Проверяем готовность к поиску ПЕРЕД отправкой запроса к API
    const readyToSearch = isReadyToSearchGifts(message);
    
    if (readyToSearch) {
        console.log('✅ Информации достаточно, запускаем поиск подарков без запроса к API');
        // Добавляем сообщение от ИИ о том, что начинаем поиск
        const searchMessage = 'Отлично! Сейчас подберу для вас подходящие варианты подарков...';
        addMessageToChat('ai', searchMessage);
        conversationHistory.push({
            role: 'assistant',
            text: searchMessage,
            time: new Date().toLocaleTimeString()
        });
        saveHistory();
        
        // Запускаем поиск подарков
        setTimeout(() => {
            findAndShowGifts();
        }, 1000);
        return; // Не отправляем запрос к API
    }
    
    // Если информации недостаточно, отправляем запрос к API для уточнения
    await sendToGemini(message);
}

function extractPreferencesFromMessage(text) {
    const lowerText = text.toLowerCase();
    
    // Извлекаем возраст (расширенные паттерны)
    if (lowerText.match(/\d+\s*(лет|год|года)/)) {
        const ageMatch = lowerText.match(/(\d+)\s*(лет|год|года)/);
        const age = parseInt(ageMatch[1]);
        if (age < 13) userPreferences.age = "До 12 лет";
        else if (age < 19) userPreferences.age = "13-18 лет";
        else if (age < 31) userPreferences.age = "19-30 лет";
        else if (age < 51) userPreferences.age = "31-50 лет";
        else userPreferences.age = "Старше 50 лет";
    } else if (lowerText.match(/(подросток|школьник|студент)/)) {
        if (!userPreferences.age) userPreferences.age = "13-18 лет";
    } else if (lowerText.match(/(взросл|молод)/)) {
        if (!userPreferences.age) userPreferences.age = "19-30 лет";
    }
    
    // Извлекаем бюджет (расширенные паттерны)
    if (lowerText.match(/\d+\s*(рубл|₽|р\.|руб)/)) {
        const budgetMatch = lowerText.match(/(\d+)\s*(рубл|₽|р\.|руб)/);
        const budget = parseInt(budgetMatch[1]);
        if (budget < 1000) userPreferences.budget = "До 1000 ₽";
        else if (budget < 3000) userPreferences.budget = "1000-3000 ₽";
        else if (budget < 5000) userPreferences.budget = "3000-5000 ₽";
        else if (budget < 10000) userPreferences.budget = "5000-10000 ₽";
        else userPreferences.budget = "Более 10000 ₽";
    } else if (lowerText.match(/(недорог|дешев|бюджет)/)) {
        if (!userPreferences.budget) userPreferences.budget = "1000-3000 ₽";
    } else if (lowerText.match(/(дорог|премиум|люкс)/)) {
        if (!userPreferences.budget) userPreferences.budget = "Более 10000 ₽";
    }
    
    // Извлекаем пол/отношения (расширенные паттерны)
    if (lowerText.includes('мам') || lowerText.includes('матер') || 
        lowerText.includes('женщин') || lowerText.includes('девушк') ||
        lowerText.includes('жена') || lowerText.includes('бабушк')) {
        userPreferences.relationship = "Женщине";
    } else if (lowerText.includes('пап') || lowerText.includes('отц') ||
               lowerText.includes('мужчин') || lowerText.includes('парн') ||
               lowerText.includes('муж') || lowerText.includes('дедушк')) {
        userPreferences.relationship = "Мужчине";
    } else if (lowerText.includes('ребенк') || lowerText.includes('дет') ||
               lowerText.includes('сын') || lowerText.includes('доч')) {
        userPreferences.relationship = "Ребенку";
    } else if (lowerText.includes('коллег')) {
        userPreferences.relationship = "Коллеге";
    } else if (lowerText.includes('друг') || lowerText.includes('подруг')) {
        userPreferences.relationship = "Другу/подруге";
    }
    
    // Извлекаем интересы (расширенный список)
    const interestsMap = {
        'технолог': 'Технологии',
        'компьютер': 'Технологии',
        'гаджет': 'Технологии',
        'смартфон': 'Технологии',
        'спорт': 'Спорт',
        'фитнес': 'Спорт',
        'тренировк': 'Спорт',
        'футбол': 'Спорт',
        'творчеств': 'Творчество',
        'рисован': 'Творчество',
        'музык': 'Творчество',
        'книг': 'Книги/кино',
        'чтение': 'Книги/кино',
        'фильм': 'Книги/кино',
        'кино': 'Книги/кино',
        'красот': 'Красота и уход',
        'косметик': 'Красота и уход',
        'уход': 'Красота и уход',
        'путешеств': 'Путешествия',
        'туризм': 'Путешествия',
        'отдых': 'Путешествия'
    };
    
    for (const [key, value] of Object.entries(interestsMap)) {
        if (lowerText.includes(key) && !userPreferences.interests.includes(value)) {
            userPreferences.interests.push(value);
        }
    }
    
    // Извлекаем повод
    if (lowerText.includes('день рождени') || lowerText.includes('др') || 
        lowerText.includes('днюха')) {
        userPreferences.occasion = "День рождения";
    } else if (lowerText.includes('новый год') || lowerText.includes('нг')) {
        userPreferences.occasion = "Новый год";
    } else if (lowerText.includes('8 марта') || lowerText.includes('23 февраля')) {
        userPreferences.occasion = "8 марта / 23 февраля";
    } else if (lowerText.includes('свадьб') || lowerText.includes('годовщин')) {
        userPreferences.occasion = "Свадьба / годовщина";
    }
    
    // Сохраняем обновленные предпочтения
    saveHistory();
}

// Извлекаем информацию из всей истории разговора
function extractPreferencesFromHistory() {
    // Проходим по всей истории и извлекаем информацию из каждого сообщения пользователя
    conversationHistory.forEach(msg => {
        if (msg.role === 'user' && msg.text) {
            extractPreferencesFromMessage(msg.text);
        }
    });
}

function saveHistory() {
    localStorage.setItem('ai-chat-history-local', JSON.stringify(conversationHistory));
    localStorage.setItem('user-preferences', JSON.stringify(userPreferences));
}

function restoreChatHistory() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages || !conversationHistory.length) return;
    
    chatMessages.innerHTML = '';
    conversationHistory.forEach(msg => {
        if (msg.role === 'user' || msg.role === 'assistant') {
            addMessageToChat(msg.role, msg.text, msg.time);
        }
    });
    
    // Восстанавливаем предпочтения
    const savedPrefs = localStorage.getItem('user-preferences');
    if (savedPrefs) {
        userPreferences = JSON.parse(savedPrefs);
    }
    
    // Если диалог был прерван, продолжаем с последнего вопроса
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    if (lastMessage && lastMessage.questionId !== undefined) {
        currentQuestionIndex = lastMessage.questionId;
    }
    
    // Если все вопросы уже были заданы, показываем кнопку для нового поиска
    if (currentQuestionIndex >= questions.length) {
        showOptions(['Начать новый поиск'], false);
    } else {
        const currentQuestion = questions[currentQuestionIndex];
        showOptions(currentQuestion.options, currentQuestion.multiple || false);
    }
}

// ==================== ГЛОБАЛЬНЫЕ ФУНКЦИИ ====================
window.saveGift = function(giftId) {
    const savedGifts = JSON.parse(localStorage.getItem('saved-gifts') || '[]');
    const gift = giftsDatabase.find(g => g.id === giftId);
    
    if (gift && !savedGifts.find(g => g.id === giftId)) {
        savedGifts.push(gift);
        localStorage.setItem('saved-gifts', JSON.stringify(savedGifts));
        
        // Показываем уведомление
        showNotification(`Подарок "${gift.name}" сохранен в избранное!`, 'success');
    }
};

window.showGiftDetails = function(giftId) {
    const gift = giftsDatabase.find(g => g.id === giftId);
    if (!gift) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-gift"></i> ${gift.name}</h3>
                <button class="close-modal" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="gift-detail-image">
                    <i class="fas fa-gift"></i>
                </div>
                <div class="gift-detail-info">
                    <div class="detail-row">
                        <span class="detail-label">Цена:</span>
                        <span class="detail-value price">${gift.price}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Категория:</span>
                        <span class="detail-value">${gift.category}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Описание:</span>
                        <p class="detail-value">${gift.description}</p>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Теги:</span>
                        <div class="tags-container">
                            ${gift.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="saveGift(${gift.id}); this.closest('.modal-overlay').remove()">
                        <i class="far fa-heart"></i> Сохранить в избранное
                    </button>
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

// Функция для очистки истории чата
function clearChatHistory() {
    if (confirm('Очистить историю чата и начать заново?')) {
        // Очищаем переменные
        conversationHistory = [];
        userPreferences = {
            age: '',
            gender: '',
            interests: [],
            occasion: '',
            budget: '',
            relationship: ''
        };
        currentQuestionIndex = 0;
        
        // Очищаем localStorage
        localStorage.removeItem('ai-chat-history-local');
        localStorage.removeItem('user-preferences');
        
        // Очищаем интерфейс чата
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
            // Добавляем начальное приветственное сообщение
            addMessageToChat('ai', 'Привет! Я помогу подобрать идеальный подарок. Расскажите мне о человеке:');
            conversationHistory.push({
                role: 'assistant',
                text: 'Привет! Я помогу подобрать идеальный подарок. Расскажите мне о человеке:',
                time: new Date().toLocaleTimeString()
            });
        }
        
        // Скрываем результаты
        const resultsContainer = document.querySelector('.ai-results-container');
        const emptyState = document.getElementById('emptyState');
        const grid = document.getElementById('giftsGrid');
        const resultsCount = document.getElementById('resultsCount');
        
        if (resultsContainer) resultsContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        if (grid) grid.innerHTML = '';
        if (resultsCount) resultsCount.textContent = '0';
        
        // Сохраняем очищенное состояние
        saveHistory();
        
        console.log('✅ История чата очищена');
    }
}

// Сохраняем функцию в window для обратной совместимости
window.clearChat = clearChatHistory;

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .gift-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transition: transform 0.3s;
    }
    
    .gift-card:hover {
        transform: translateY(-5px);
    }
    
    .gift-image {
        height: 150px;
        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 3rem;
    }
    
    .gift-content {
        padding: 20px;
    }
    
    .gift-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
    }
    
    .gift-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #333;
        margin: 0;
        flex: 1;
    }
    
    .gift-price {
        background: #4CAF50;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 600;
        margin-left: 10px;
    }
    
    .gift-description {
        color: #666;
        font-size: 0.95rem;
        line-height: 1.4;
        margin-bottom: 15px;
    }
    
    .gift-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 15px;
    }
    
    .tag {
        background: #f0f0f0;
        color: #666;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .gift-actions {
        display: flex;
        gap: 10px;
    }
    
    .btn-small {
        padding: 8px 12px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.3s;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }
    
    .btn-outline {
        background: transparent;
        border: 1px solid #4a90e2;
        color: #4a90e2;
    }
    
    .btn-outline:hover {
        background: #4a90e2;
        color: white;
    }
    
    .btn-primary {
        background: #4a90e2;
        color: white;
        border: 1px solid #4a90e2;
    }
    
    .btn-primary:hover {
        background: #3a7bc8;
    }
`;
document.head.appendChild(style);

console.log('🚀 ИИ помощник готов к работе!');