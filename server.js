// Загружаем переменные окружения из .env файла
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

// Проверяем доступность встроенного fetch (Node.js 18+)
if (typeof fetch === 'undefined') {
    console.error('❌ ОШИБКА: Встроенный fetch недоступен!');
    console.error('💡 Требуется Node.js версии 18 или выше');
    console.error('📦 Текущая версия:', process.version);
    process.exit(1);
}

const app = express();

// Включаем CORS с расширенными настройками
app.use(cors({
    origin: '*', // Разрешаем запросы с любого источника
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Обработка preflight запросов
app.options('*', cors());

app.use(express.json());

// Раздаем статические файлы (HTML, CSS, JS, изображения)
app.use(express.static(path.join(__dirname)));

// Загружаем переменные окружения из .env файла
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Доступные модели: gemini-pro, gemini-1.5-pro, gemini-1.5-flash, gemini-1.5-flash-002
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-pro'; // По умолчанию gemini-pro

// Список валидных моделей
const VALID_MODELS = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro-latest'
];

// Проверяем наличие обязательных переменных
if (!GEMINI_API_KEY) {
    console.error('\n❌ ОШИБКА: Не заданы обязательные переменные окружения!');
    console.error('💡 Создайте файл .env в корне проекта со следующим содержимым:');
    console.error('\n   GEMINI_API_KEY=ваш_api_ключ');
    console.error('   GEMINI_MODEL=gemini-pro (опционально)\n');
    console.error('📝 Пример файла .env.example уже создан в проекте');
    console.error('📖 Подробнее см. README.md\n');
    process.exit(1);
}

// Проверяем формат API ключа (Gemini ключи обычно начинаются с "AIza")
if (!GEMINI_API_KEY.startsWith('AIza')) {
    console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА: API ключ не является ключом Gemini!');
    console.error('💡 Текущий ключ начинается с:', GEMINI_API_KEY.substring(0, 4) + '...');
    console.error('💡 Gemini API ключи ДОЛЖНЫ начинаться с "AIza" и иметь длину ~39 символов');
    console.error('⚠️ Если ключ начинается с "AQVN" - это ключ от Yandex, а не Gemini!');
    console.error('\n📋 Что делать:');
    console.error('1. Откройте Google AI Studio: https://aistudio.google.com/');
    console.error('2. Войдите в Google аккаунт');
    console.error('3. Нажмите "Get API Key" в левом меню');
    console.error('4. Создайте новый ключ (он будет начинаться с "AIza")');
    console.error('5. Обновите GEMINI_API_KEY в файле .env');
    console.error('\n📖 Подробнее см. файл GEMINI_API_SETUP.md\n');
    // Не останавливаем сервер, но предупреждаем пользователя
}

// Проверяем валидность модели
if (!VALID_MODELS.includes(GEMINI_MODEL) && !GEMINI_MODEL.startsWith('gemini-')) {
    console.warn('\n⚠️ ВНИМАНИЕ: Модель может быть неверной!');
    console.warn('💡 Используется модель:', GEMINI_MODEL);
    console.warn('📋 Рекомендуемые модели:', VALID_MODELS.join(', '));
    console.warn('💡 Если модель не работает, попробуйте: gemini-pro\n');
}

// Главная страница - отдаем index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint для получения конфигурации (без секретных данных)
app.get('/api/config', (req, res) => {
    res.json({
        model: GEMINI_MODEL,
        status: 'ok'
    });
});

// Прокси для Gemini API
app.post('/api/gemini', async (req, res) => {
    console.log('\n📨 [API] Получен запрос от сайта');
    console.log('🌐 Origin:', req.headers.origin || 'не указан');
    console.log('📦 Тело запроса:', JSON.stringify(req.body).substring(0, 200) + '...');
    
    try {
        // Преобразуем формат запроса из клиента в формат Gemini API
        const geminiRequest = convertToGeminiFormat(req.body);
        
        // Проверяем, что запрос правильно сформирован
        if (!geminiRequest.contents || geminiRequest.contents.length === 0) {
            return res.status(400).json({
                error: 'Неверный формат запроса',
                message: 'Запрос должен содержать массив messages',
                userMessage: 'Ошибка формата запроса',
                userDetails: 'Проверьте структуру данных запроса'
            });
        }
        
        // Формируем URL с правильной кодировкой ключа
        const encodedKey = encodeURIComponent(GEMINI_API_KEY);
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodedKey}`;
        
        console.log('🔗 Модель:', GEMINI_MODEL);
        console.log('📋 Количество сообщений в запросе:', geminiRequest.contents?.length || 0);
        console.log('📋 Первое сообщение:', geminiRequest.contents?.[0]?.parts?.[0]?.text?.substring(0, 100) || 'нет');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(geminiRequest)
        });
        
        console.log('📡 [API] Ответ от Gemini API, статус:', response.status);
        
        // Получаем данные ответа
        let data;
        let rawText = '';
        try {
            rawText = await response.text();
            data = JSON.parse(rawText);
        } catch (parseError) {
            console.error('❌ [API] Ошибка парсинга JSON:', parseError.message);
            console.error('📄 Сырой ответ:', rawText.substring(0, 1000));
            return res.status(500).json({
                error: 'Ошибка парсинга ответа',
                message: parseError.message,
                rawResponse: rawText.substring(0, 500)
            });
        }
        
        if (response.ok) {
            console.log('✅ [API] Успешный ответ от Gemini API');
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            console.log('💬 Текст ответа:', responseText.substring(0, 100) + '...');
            
            // Преобразуем ответ Gemini в формат, понятный клиенту
            const clientResponse = convertFromGeminiFormat(data);
            res.status(response.status).json(clientResponse);
        } else {
            console.error('❌ [API] Ошибка от Gemini API');
            console.error('📋 Полный ответ:', JSON.stringify(data, null, 2));
            
            // Улучшенная обработка ошибок
            let errorMessage = 'Ошибка Gemini API';
            let errorDetails = '';
            
            if (response.status === 400) {
                const errorMsg = data.error?.message || '';
                
                if (errorMsg.includes('API key not valid') || errorMsg.includes('invalid API key')) {
                    errorMessage = 'Неверный API ключ Gemini';
                    errorDetails = '❌ API ключ недействителен или неверен.\n\n' +
                        '📋 Решение:\n' +
                        '1. Откройте Google AI Studio: https://aistudio.google.com/\n' +
                        '2. Войдите в свой Google аккаунт\n' +
                        '3. Нажмите "Get API Key" (Получить API ключ)\n' +
                        '4. Создайте новый ключ или скопируйте существующий\n' +
                        '5. Обновите GEMINI_API_KEY в файле .env\n\n' +
                        '💡 Gemini API ключи обычно начинаются с "AIza" и имеют длину ~39 символов\n' +
                        '⚠️ Если ваш ключ начинается с "AQVN" - это ключ от Yandex, а не Gemini!\n' +
                        '📖 Подробнее см. файл GEMINI_API_SETUP.md';
                } else if (errorMsg.includes('model') || errorMsg.includes('Model')) {
                    errorMessage = 'Неверное название модели';
                    errorDetails = `❌ Модель "${GEMINI_MODEL}" не найдена или недоступна.\n\n` +
                        '📋 Рекомендуемые модели:\n' +
                        '- gemini-pro (стандартная)\n' +
                        '- gemini-1.5-pro (расширенный контекст)\n' +
                        '- gemini-1.5-flash (быстрая)\n\n' +
                        '💡 Обновите GEMINI_MODEL в файле .env';
                } else {
                    errorMessage = 'Неверный запрос к Gemini API';
                    errorDetails = 'Проверьте формат запроса и параметры';
                    if (data.error?.message) {
                        errorDetails += '\n\nДетали: ' + data.error.message;
                    }
                }
            } else if (response.status === 401) {
                errorMessage = 'Неверный API ключ';
                errorDetails = 'Проверьте GEMINI_API_KEY в файле .env';
            } else if (response.status === 403) {
                errorMessage = 'Доступ запрещен';
                errorDetails = 'Проверьте права доступа API ключа в Google AI Studio';
            } else if (response.status === 429) {
                errorMessage = 'Превышен лимит запросов';
                errorDetails = 'Подождите немного и попробуйте снова';
            } else if (response.status >= 500) {
                errorMessage = 'Ошибка сервера Gemini';
                errorDetails = 'Проблема на стороне Google. Попробуйте позже.';
            }
            
            // Добавляем детали ошибки в ответ
            const errorResponse = {
                error: data.error || { message: errorMessage },
                userMessage: errorMessage,
                userDetails: errorDetails,
                statusCode: response.status
            };
            
            res.status(response.status).json(errorResponse);
        }
        
    } catch (error) {
        console.error('🔥 [API] Критическая ошибка:', error.message);
        console.error('📋 Stack trace:', error.stack);
        res.status(500).json({ 
            error: 'Прокси ошибка',
            message: error.message,
            details: 'Проверьте подключение к интернету и настройки API ключа',
            timestamp: new Date().toISOString()
        });
    }
});

// Функция преобразования формата запроса клиента в формат Gemini API
function convertToGeminiFormat(clientRequest) {
    // Если запрос уже в формате Gemini, возвращаем как есть
    if (clientRequest.contents) {
        return clientRequest;
    }
    
    // Преобразуем из формата YandexGPT в формат Gemini
    const contents = [];
    
    // Обрабатываем системное сообщение
    if (clientRequest.messages) {
        clientRequest.messages.forEach(msg => {
            if (msg.role === 'system') {
                // В Gemini системные сообщения добавляются как первое сообщение пользователя
                contents.push({
                    role: 'user',
                    parts: [{ text: msg.text }]
                });
                contents.push({
                    role: 'model',
                    parts: [{ text: 'Понял, буду следовать этим инструкциям.' }]
                });
            } else if (msg.role === 'user') {
                contents.push({
                    role: 'user',
                    parts: [{ text: msg.text }]
                });
            } else if (msg.role === 'assistant') {
                contents.push({
                    role: 'model',
                    parts: [{ text: msg.text }]
                });
            }
        });
    }
    
    const geminiRequest = {
        contents: contents
    };
    
    // Добавляем параметры генерации, если они есть
    if (clientRequest.completionOptions) {
        geminiRequest.generationConfig = {
            temperature: clientRequest.completionOptions.temperature || 0.7,
            maxOutputTokens: clientRequest.completionOptions.maxTokens || 1000,
            topP: 0.8,
            topK: 40
        };
    }
    
    return geminiRequest;
}

// Функция преобразования ответа Gemini в формат, понятный клиенту
function convertFromGeminiFormat(geminiResponse) {
    const text = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Преобразуем в формат, похожий на YandexGPT для совместимости
    return {
        result: {
            alternatives: [{
                message: {
                    text: text
                }
            }]
        }
    };
}

// Тестовый эндпоинт
app.get('/api/test', async (req, res) => {
    try {
        console.log('🧪 Тестовый запрос к Gemini API...');
        
        // Проверяем формат ключа
        if (!GEMINI_API_KEY.startsWith('AIza')) {
            console.warn('⚠️ ВНИМАНИЕ: Ключ не начинается с "AIza" - возможно, это не Gemini ключ!');
            console.warn('💡 Gemini API ключи начинаются с "AIza" и имеют длину ~39 символов');
        }
        
        const encodedKey = encodeURIComponent(GEMINI_API_KEY);
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodedKey}`;
        
        console.log('🔗 Модель:', GEMINI_MODEL);
        console.log('📋 URL (без ключа):', apiUrl.replace(encodedKey, '***'));
        
        const testRequest = {
            contents: [{
                parts: [{
                    text: "Привет! Ответь одним словом: 'Работает'"
                }]
            }]
        };
        
        const testResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testRequest)
        });
        
        let data;
        try {
            data = await testResponse.json();
        } catch (parseError) {
            const text = await testResponse.text();
            return res.status(500).json({
                error: 'Ошибка парсинга ответа',
                message: parseError.message,
                rawResponse: text
            });
        }
        
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Нет ответа';
        
        res.json({
            success: testResponse.ok,
            status: testResponse.status,
            message: responseText,
            fullResponse: data
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint для проверки статуса сервера
app.get('/api-status', (req, res) => {
    res.json({
        status: 'ok',
        server: 'Sparks Web Server',
        port: PORT,
        gemini: {
            configured: !!GEMINI_API_KEY,
            model: GEMINI_MODEL,
            keyValid: GEMINI_API_KEY?.startsWith('AIza') || false
        }
    });
});

// Запускаем веб-сервер
const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 SPARKS - ВЕБ-СЕРВЕР С ИНТЕГРИРОВАННЫМ GEMINI API');
    console.log('='.repeat(50));
    console.log(`📄 Главная страница: http://localhost:${PORT}`);
    console.log(`📁 Статические файлы доступны на порту ${PORT}`);
    console.log(`🔗 API для ИИ: http://localhost:${PORT}/api/gemini`);
    console.log(`⚙️  Конфигурация: http://localhost:${PORT}/api/config`);
    console.log(`🧪 Тест API: http://localhost:${PORT}/api/test`);
    console.log(`📊 Статус: http://localhost:${PORT}/api-status`);
    console.log(`🔑 API Key: ${GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'НЕ НАСТРОЕН'}`);
    console.log(`🤖 Модель: ${GEMINI_MODEL}`);
    console.log('='.repeat(50));
    console.log('✅ Все готово! Откройте http://localhost:3000 в браузере');
    console.log('='.repeat(50) + '\n');
});
