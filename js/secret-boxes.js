// JavaScript для функциональности секретных боксов

// Данные секретных боксов
const secretBoxes = [
    {
        id: 1,
        price: 500,
        name: "Мини Сюрприз",
        categories: ["food", "care", "random"],
        description: "Небольшой, но приятный подарок-сюрприз",
        features: [
            "Подарок в крафтовой упаковке",
            "Красная лента",
            "Небольшой, но душевный сюрприз"
        ],
        icon: "fa-box"
    },
    {
        id: 2,
        price: 1500,
        name: "Стандарт",
        categories: ["food", "care", "random"],
        description: "Качественный подарок с заботой о деталях",
        features: [
            "Подарок в крафтовой упаковке",
            "Красная лента",
            "2-3 предмета в наборе",
            "Индивидуальный подход"
        ],
        icon: "fa-box-open"
    },
    {
        id: 3,
        price: 3000,
        name: "Премиум",
        categories: ["food", "care", "random"],
        description: "Эксклюзивный подарок в премиальной упаковке",
        features: [
            "Подарок в крафтовой упаковке",
            "Красная лента",
            "3-5 предметов в наборе",
            "Эксклюзивные товары",
            "Поздравительная открытка"
        ],
        icon: "fa-gift"
    },
    {
        id: 4,
        price: 5000,
        name: "Люкс",
        categories: ["food", "care", "random"],
        description: "Роскошный подарок для особого случая",
        features: [
            "Дизайнерская упаковка",
            "Красная лента",
            "5-7 предметов в наборе",
            "Товары премиум-класса",
            "Персонализированная открытка"
        ],
        icon: "fa-gem"
    },
    {
        id: 5,
        price: 10000,
        name: "Элитный",
        categories: ["random"],
        description: "Эксклюзивный подарок премиум-класса",
        features: [
            "Красная обертка с золотой лентой",
            "7+ предметов в наборе",
            "Элитные товары",
            "Эксклюзивная упаковка",
            "VIP доставка",
            "Персонализированный сервис"
        ],
        icon: "fa-crown",
        premium: true
    }
];

// Текущий выбранный бокс и категория
let selectedBox = null;
let selectedCategory = 'random';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализируем секретные боксы...');
    loadBoxes();
    setupBoxesEvents();
});

// Загрузка боксов в сетку
function loadBoxes(filterPrice = 'all') {
    const container = document.getElementById('boxesContainer');
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Фильтруем боксы по цене
    const filteredBoxes = secretBoxes.filter(box => 
        filterPrice === 'all' || box.price === parseInt(filterPrice)
    );
    
    // Добавляем каждый бокс в контейнер
    filteredBoxes.forEach(box => {
        const boxElement = createBoxElement(box);
        container.appendChild(boxElement);
    });
    
    console.log('Загружено боксов:', filteredBoxes.length);
}

// Создание элемента бокса
function createBoxElement(box) {
    const boxDiv = document.createElement('div');
    boxDiv.className = `box-card ${box.premium ? 'premium' : ''}`;
    
    // Создаем HTML для бокса
    boxDiv.innerHTML = `
        ${box.premium ? '<div class="premium-badge">PREMIUM</div>' : ''}
        
        <div class="box-header">
            <div class="box-icon">
                <i class="fas ${box.icon}"></i>
            </div>
            <h3>${box.name}</h3>
            <div class="box-price">${box.price.toLocaleString()} руб.</div>
            <p>${box.description}</p>
        </div>
        
        <div class="box-body">
            <ul class="box-features">
                ${box.features.map(feature => `
                    <li>
                        <i class="fas fa-check"></i>
                        ${feature}
                    </li>
                `).join('')}
            </ul>
            
            <div class="category-selector">
                ${box.categories.map(category => `
                    <div class="category-option ${category === 'random' ? 'active' : ''}" 
                         data-category="${category}" 
                         data-box-id="${box.id}">
                        ${getCategoryName(category)}
                    </div>
                `).join('')}
            </div>
            
            <button class="order-btn" data-box-id="${box.id}">
                <i class="fas fa-shopping-cart"></i>
                Заказать за ${box.price.toLocaleString()} руб.
            </button>
        </div>
    `;
    
    return boxDiv;
}

// Получение читаемого названия категории
function getCategoryName(category) {
    const categoryNames = {
        'food': 'Еда',
        'care': 'Уход',
        'random': 'Рандом'
    };
    return categoryNames[category] || category;
}

// Настройка обработчиков событий
function setupBoxesEvents() {
    console.log('Настраиваем обработчики событий для боксов...');
    
    // Фильтрация по цене
    const priceCategories = document.querySelectorAll('.price-category');
    priceCategories.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            priceCategories.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Загружаем боксы с фильтром по цене
            const price = this.getAttribute('data-price');
            loadBoxes(price);
        });
    });
    
    // Делегирование событий для выбора категории и заказа
    document.getElementById('boxesContainer').addEventListener('click', function(e) {
        // Выбор категории
        if (e.target.closest('.category-option')) {
            const categoryOption = e.target.closest('.category-option');
            const boxId = parseInt(categoryOption.getAttribute('data-box-id'));
            const category = categoryOption.getAttribute('data-category');
            
            // Сбрасываем активные классы у всех категорий этого бокса
            const allOptions = categoryOption.parentElement.querySelectorAll('.category-option');
            allOptions.forEach(opt => opt.classList.remove('active'));
            
            // Активируем выбранную категорию
            categoryOption.classList.add('active');
            
            // Сохраняем выбранную категорию
            selectedCategory = category;
            console.log('Выбрана категория:', category, 'для бокса:', boxId);
        }
        
        // Заказ бокса
        if (e.target.closest('.order-btn')) {
            const orderBtn = e.target.closest('.order-btn');
            const boxId = parseInt(orderBtn.getAttribute('data-box-id'));
            orderBox(boxId);
        }
    });
    
    // Обработка формы заказа
    document.getElementById('secretBoxOrderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        processOrder();
    });
}

// Заказ бокса
function orderBox(boxId) {
    // Находим выбранный бокс
    const box = secretBoxes.find(b => b.id === boxId);
    
    if (!box) {
        console.error('Бокс не найден:', boxId);
        return;
    }
    
    // Сохраняем выбранный бокс
    selectedBox = box;
    
    // Заполняем форму заказа
    document.getElementById('selectedBox').value = `${box.name} - ${box.price.toLocaleString()} руб.`;
    document.getElementById('selectedCategory').value = getCategoryName(selectedCategory);
    
    // Показываем форму заказа
    document.getElementById('orderForm').classList.add('active');
    
    // Прокручиваем к форме
    document.getElementById('orderForm').scrollIntoView({ behavior: 'smooth' });
    
    console.log('Заказываем бокс:', box.name, 'категория:', selectedCategory);
}

// Обработка заказа
function processOrder() {
    const recipientName = document.getElementById('recipientName').value.trim();
    const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
    const deliveryDate = document.getElementById('deliveryDate').value;
    const giftMessage = document.getElementById('giftMessage').value.trim();
    
    // Проверяем обязательные поля
    if (!recipientName || !deliveryAddress || !deliveryDate) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    // Создаем объект заказа
    const order = {
        box: selectedBox,
        category: selectedCategory,
        recipientName: recipientName,
        deliveryAddress: deliveryAddress,
        deliveryDate: deliveryDate,
        giftMessage: giftMessage,
        orderDate: new Date().toISOString(),
        orderId: 'SPK-' + Date.now()
    };
    
    // В реальном приложении здесь будет отправка на сервер
    console.log('Создан заказ:', order);
    
    // Показываем подтверждение
    showOrderConfirmation(order);
    
    // Сбрасываем форму и скрываем ее
    document.getElementById('secretBoxOrderForm').reset();
    document.getElementById('orderForm').classList.remove('active');
}

// Показ подтверждения заказа
function showOrderConfirmation(order) {
    const confirmationMessage = `
        🎉 Заказ оформлен успешно!
        
        Номер заказа: ${order.orderId}
        Бокс: ${order.box.name}
        Категория: ${getCategoryName(order.category)}
        Получатель: ${order.recipientName}
        Адрес доставки: ${order.deliveryAddress}
        Дата доставки: ${new Date(order.deliveryDate).toLocaleDateString('ru-RU')}
        
        С вами свяжутся для подтверждения заказа в течение 24 часов.
        
        Спасибо, что выбрали Sparks! 🎁
    `;
    
    alert(confirmationMessage);
    
    // Можно также сохранить заказ в localStorage для истории
    saveOrderToHistory(order);
}

// Сохранение заказа в историю (упрощенная версия)
function saveOrderToHistory(order) {
    const ordersHistory = JSON.parse(localStorage.getItem('sparks-orders') || '[]');
    ordersHistory.push(order);
    localStorage.setItem('sparks-orders', JSON.stringify(ordersHistory));
    console.log('Заказ сохранен в историю');
}