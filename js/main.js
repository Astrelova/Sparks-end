// Основной JavaScript файл для функциональности сайта

// Данные для демонстрации поиска людей
const demoUsers = [
    { id: 1, name: "Анна Иванова", age: 28, interests: ["книги", "йога", "кофе"] },
    { id: 2, name: "Петр Сидоров", age: 32, interests: ["футбол", "автомобили", "рыбалка"] },
    { id: 3, name: "Мария Петрова", age: 25, interests: ["рисование", "путешествия", "фотография"] },
    { id: 4, name: "Алексей Козлов", age: 30, interests: ["гитара", "вино", "горные лыжи"] },
    { id: 5, name: "Елена Смирнова", age: 29, interests: ["танцы", "кулинария", "театр"] }
];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена, инициализируем функциональность...');
    setupSearchFunctionality();
});

// Настройка функциональности поиска
function setupSearchFunctionality() {
    console.log('Настраиваем поиск людей...');
    
    const searchPeopleBtn = document.getElementById('searchPeopleBtn');
    const closeSearchSidebar = document.getElementById('closeSearchSidebar');
    const searchSidebar = document.getElementById('searchSidebar');
    const peopleSearchInput = document.getElementById('peopleSearchInput');
    
    // Проверяем, есть ли элементы на странице
    if (!searchPeopleBtn) {
        console.log('Кнопка поиска людей не найдена');
        return;
    }
    
    if (!searchSidebar) {
        console.log('Боковая панель поиска не найдена');
        return;
    }
    
    console.log('Все элементы поиска найдены, настраиваем события...');
    
    // Обработчик клика по кнопке поиска
    searchPeopleBtn.addEventListener('click', function(event) {
        console.log('Клик по кнопке поиска людей');
        event.preventDefault();
        event.stopPropagation();
        
        searchSidebar.classList.add('active');
        console.log('Боковая панель открыта');
        
        // Фокусируемся на поле ввода
        if (peopleSearchInput) {
            setTimeout(() => {
                peopleSearchInput.focus();
            }, 300);
        }
    });
    
    // Закрытие боковой панели
    if (closeSearchSidebar) {
        closeSearchSidebar.addEventListener('click', function() {
            console.log('Закрытие боковой панели');
            searchSidebar.classList.remove('active');
        });
    }
    
    // Закрытие при клике вне панели
    document.addEventListener('click', function(event) {
        if (searchSidebar.classList.contains('active') && 
            !searchSidebar.contains(event.target) && 
            event.target !== searchPeopleBtn) {
            console.log('Клик вне панели, закрываем');
            searchSidebar.classList.remove('active');
        }
    });
    
    // Поиск при вводе текста
    if (peopleSearchInput) {
        peopleSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            console.log('Поиск:', searchTerm);
            performPeopleSearch(searchTerm);
        });
        
        // Также поиск при нажатии Enter
        peopleSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                console.log('Поиск по Enter:', searchTerm);
                performPeopleSearch(searchTerm);
            }
        });
    }
    
    // Предотвращаем закрытие при клике внутри панели
    if (searchSidebar) {
        searchSidebar.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
}

// Выполнение поиска людей
// Обновленная функция поиска людей
function performPeopleSearch(searchTerm) {
    const searchResults = document.getElementById('searchResults');
    
    if (!searchResults) return;
    
    searchResults.innerHTML = '';
    
    if (!searchTerm) {
        searchResults.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">Начните вводить ФИО для поиска</p>';
        return;
    }
    
// main.js - добавьте эту функцию перед строкой 116
function getUsers(searchTerm) {
    console.log('Поиск пользователей по запросу:', searchTerm);
    
    // Заглушка для демонстрации - замените реальной логикой
    return Promise.resolve([
        { name: "Emma Wilson", email: "emmanna2000@gmail.com", phone: "+1234567890" },
        { name: "Anna Smith", email: "anna.smith@example.com", phone: "+0987654321" }
    ]);
}

    // Получаем ВСЕХ зарегистрированных пользователей
    const allUsers = getUsers();
    
    // Фильтруем пользователей
    const filteredUsers = allUsers.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredUsers.length === 0) {
        searchResults.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">Никого не найдено</p>';
        return;
    }
    
    // Создаем карточки пользователей
    filteredUsers.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'search-result-item';
        userElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-color); display: flex; align-items: center; justify-content: center; color: white;">
                    ${user.fullName.charAt(0)}
                </div>
                <div>
                    <h4 style="margin: 0 0 5px 0; color: var(--text-primary);">${user.fullName}</h4>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">
                        ${user.interests ? user.interests.substring(0, 50) + '...' : 'Интересы не указаны'}
                    </p>
                </div>
            </div>
        `;
        
        userElement.addEventListener('click', function() {
            viewUserProfile(user.id);
        });
        
        searchResults.appendChild(userElement);
    });
}

// Просмотр профиля другого пользователя
function viewUserProfile(userId) {
    // Сохраняем ID пользователя для просмотра
    localStorage.setItem('sparks-view-user', userId);
    
    // Переходим на страницу просмотра профиля
    window.location.href = 'user-profile.html';
}

// Умная шапка, которая скрывается при прокрутке вниз и появляется при прокрутке вверх

let lastScrollTop = 0; // Последняя позиция прокрутки
const header = document.querySelector('.header');
const headerHeight = header.offsetHeight; // Высота шапки
let ticking = false; // Флаг для оптимизации

// Функция для обработки прокрутки
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Если прокрутка вниз больше 50px и прошли высоту шапки
    if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
        // Прокрутка ВНИЗ - скрываем шапку
        header.classList.add('header-hidden');
        header.classList.remove('header-visible');
    } else {
        // Прокрутка ВВЕРХ - показываем шапку
        header.classList.remove('header-hidden');
        header.classList.add('header-visible');
    }
    
    // Сохраняем текущую позицию прокрутки
    lastScrollTop = scrollTop;
    ticking = false;
}

// Оптимизированная версия с requestAnimationFrame
function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            handleScroll();
        });
        ticking = true;
    }
}

// Добавляем обработчик события прокрутки
window.addEventListener('scroll', onScroll);

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем начальное состояние
    header.classList.add('header-visible');
    
    // Добавляем отступ для body чтобы контент не прыгал
    document.body.style.paddingTop = headerHeight + 'px';
});