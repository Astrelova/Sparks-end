// JavaScript для страницы рекомендаций

// Расширенные данные товаров
const allProducts = [
    // Товары для женщин
    {
        id: 1,
        name: "Набор ароматических свечей премиум",
        price: 2500,
        image: "images/6855765131.jpg",
        category: "уход",
        occasion: ["birthday", "anniversary", "just_because"],
        recipient: "female",
        description: "Набор из трех элегантных свечей с ароматами ванили, сандала и жасмина. Идеально для создания уютной атмосферы.",
        rating: 4.8,
        popular: true
    },
    {
        id: 2,
        name: "Косметический набор люкс",
        price: 4500,
        image: "images/XXL_height.jpg",
        category: "уход",
        occasion: ["birthday", "holiday"],
        recipient: "female",
        description: "Полный набор уходовой косметики от французского бренда. Включает крем для лица, сыворотку и тоник.",
        rating: 4.9,
        popular: true
    },
    {
        id: 3,
        name: "Шелковый платок с принтом",
        price: 3200,
        image: "images/450x600.jpg",
        category: "аксессуары",
        occasion: ["birthday", "anniversary", "romantic"],
        recipient: "female",
        description: "Шелковый платок ручной работы с уникальным цветочным принтом. 100% натуральный шелк.",
        rating: 4.7,
        popular: false
    },
    
    // Товары для мужчин
    {
        id: 4,
        name: "Набор для ухода за бородой",
        price: 2800,
        image: "images/orig (2).jpg",
        category: "уход",
        occasion: ["birthday", "just_because"],
        recipient: "male",
        description: "Премиальный набор масел и бальзамов для бороды от американского бренда. Включает расческу из натурального дерева.",
        rating: 4.6,
        popular: true
    },
    {
        id: 5,
        name: "Умная колонка с голосовым помощником",
        price: 5200,
        image: "images/orig (1).jpg",
        category: "техника",
        occasion: ["birthday", "holiday"],
        recipient: "male",
        description: "Умная колонка с премиальным звуком и голосовым помощником. Управление умным домом и отличный звук.",
        rating: 4.7,
        popular: true
    },
    {
        id: 6,
        name: "Умные часы Premium",
        price: 12990,
        image: "images/orig.jpg",
        category: "техника",
        occasion: ["birthday", "anniversary"],
        recipient: "all",
        description: "Современные умные часы с отслеживанием здоровья, уведомлениями и длительной работой батареи.",
        rating: 4.8,
        popular: true
    }
];

// Текущие настройки фильтров
let currentFilters = {
    category: 'all',
    priceRange: 'all',
    occasion: 'all',
    recipient: 'all',
    sortBy: 'popular'
};

// Текущая страница для пагинации
let currentPage = 1;
const productsPerPage = 8;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализируем страницу рекомендаций...');
    loadProducts();
    setupFilters();
    setupSorting();
});

// Загрузка товаров с учетом фильтров
function loadProducts() {
    console.log('Загружаем товары с фильтрами:', currentFilters);
    
    // Фильтруем товары
    let filteredProducts = filterProducts(allProducts, currentFilters);
    
    // Сортируем товары
    filteredProducts = sortProducts(filteredProducts, currentFilters.sortBy);
    
    // Обновляем счетчик результатов
    updateResultsCount(filteredProducts.length);
    
    // Отображаем товары для текущей страницы
    displayProductsPage(filteredProducts, currentPage);
    
    // Настраиваем кнопку "Показать еще"
    setupLoadMoreButton(filteredProducts.length);
}

// Фильтрация товаров
function filterProducts(products, filters) {
    return products.filter(product => {
        // Фильтр по категории
        if (filters.category !== 'all' && product.category !== filters.category) {
            return false;
        }
        
        // Фильтр по цене
        if (filters.priceRange !== 'all') {
            const [min, max] = parsePriceRange(filters.priceRange);
            if (min !== null && product.price < min) return false;
            if (max !== null && product.price > max) return false;
        }
        
        // Фильтр по поводу
        if (filters.occasion !== 'all' && filters.occasion !== 'all') {
            if (!product.occasion.includes(filters.occasion)) {
                return false;
            }
        }
        
        // Фильтр по получателю
        if (filters.recipient !== 'all') {
            if (product.recipient !== 'all' && product.recipient !== filters.recipient) {
                return false;
            }
        }
        
        return true;
    });
}

// Парсинг диапазона цен
function parsePriceRange(priceRange) {
    switch (priceRange) {
        case '0-1000':
            return [0, 1000];
        case '1000-3000':
            return [1000, 3000];
        case '3000-5000':
            return [3000, 5000];
        case '5000-10000':
            return [5000, 10000];
        case '10000+':
            return [10000, null];
        default:
            return [null, null];
    }
}

// Сортировка товаров
function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
        case 'price_asc':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price_desc':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'newest':
            return sortedProducts.sort((a, b) => b.id - a.id);
        case 'rating':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        case 'popular':
        default:
            return sortedProducts.sort((a, b) => {
                if (a.popular && !b.popular) return -1;
                if (!a.popular && b.popular) return 1;
                return b.rating - a.rating;
            });
    }
}

// Отображение страницы с товарами
function displayProductsPage(products, page) {
    const grid = document.getElementById('productsGrid');
    
    // Вычисляем индексы для текущей страницы
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = products.slice(startIndex, endIndex);
    
    // Если это первая страница - очищаем сетку
    if (page === 1) {
        grid.innerHTML = '';
    }
    
    // Если товаров нет - показываем сообщение
    if (pageProducts.length === 0 && page === 1) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить параметры фильтров</p>
            </div>
        `;
        return;
    }
    
    // Добавляем товары в сетку
    pageProducts.forEach(product => {
        const productElement = createProductElement(product);
        grid.appendChild(productElement);
    });
    
    console.log(`Отображено товаров: ${pageProducts.length} (страница ${page})`);
}

// Создание элемента товара
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-card';
    
    productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">${product.price.toLocaleString()} ₽</div>
            <span class="product-category">${product.category}</span>
            <p class="product-description">${product.description}</p>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 5px; color: #ffc107;">
                    ${generateStarRating(product.rating)}
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">${product.rating}</span>
                </div>
                ${product.popular ? '<span style="background: var(--primary-color); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">Популярный</span>' : ''}
            </div>
            
            <div class="product-actions">
                <button class="action-btn btn-outline" onclick="addToWishlist(${product.id})">
                    <i class="far fa-heart"></i> Желаю
                </button>
                <button class="action-btn btn-primary" onclick="orderProduct(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Заказать
                </button>
            </div>
        </div>
    `;
    
    return productDiv;
}

// Генерация звезд рейтинга
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Полные звезды
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Половина звезды
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Пустые звезды
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Настройка фильтров
function setupFilters() {
    // Применение фильтров
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            currentFilters = {
                category: document.getElementById('categoryFilter').value,
                priceRange: document.getElementById('priceRange').value,
                occasion: document.getElementById('occasionFilter').value,
                recipient: document.getElementById('recipientFilter').value,
                sortBy: currentFilters.sortBy
            };
            
            currentPage = 1;
            loadProducts();
        });
    }
    
    // Сброс фильтров
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            document.getElementById('categoryFilter').value = 'all';
            document.getElementById('priceRange').value = 'all';
            document.getElementById('occasionFilter').value = 'all';
            document.getElementById('recipientFilter').value = 'all';
            
            currentFilters = {
                category: 'all',
                priceRange: 'all',
                occasion: 'all',
                recipient: 'all',
                sortBy: currentFilters.sortBy
            };
            
            currentPage = 1;
            loadProducts();
        });
    }
}

// Настройка сортировки
function setupSorting() {
    const sortBySelect = document.getElementById('sortBy');
    if (sortBySelect) {
        sortBySelect.addEventListener('change', function() {
            currentFilters.sortBy = this.value;
            loadProducts();
        });
    }
}

// Настройка кнопки "Показать еще"
function setupLoadMoreButton(totalProducts) {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    
    if (currentPage >= totalPages) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.onclick = function() {
            currentPage++;
            loadProducts();
        };
    }
}

// Обновление счетчика результатов
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (!resultsCount) return;
    
    const countText = count === 0 ? 'ничего не найдено' : `${count} подар${getRussianPlural(count)}`;
    resultsCount.textContent = countText;
}

// Получение правильной формы слова для русского языка
function getRussianPlural(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'ок';
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'ка';
    return 'ков';
}

// Добавление в виш-лист
function addToWishlist(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        alert(`"${product.name}" добавлен в ваш виш-лист!`);
        console.log('Добавлен в виш-лист:', product);
    }
}

// Заказ товара - переход на страницу товара
function orderProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        // Переходим на страницу товара
        window.location.href = 'product.html';
    }
}