// JavaScript для функциональности профиля

// В начало файла profile.js добавь:
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    const currentUser = JSON.parse(localStorage.getItem('sparks-current-user'));
    
    if (!currentUser) {
        // Если не авторизован - перенаправляем на вход
        window.location.href = 'login.html';
        return;
    }
    
    // Загружаем данные текущего пользователя
    loadUserData(currentUser.id);
    // ... остальной код
});

// Обновляем loadUserData
function loadUserData(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
        userData = user;
        console.log('Данные пользователя загружены:', userData);
    } else {
        // Если пользователь не найден, создаем нового из localStorage
        const savedData = localStorage.getItem('sparks-user-data');
        if (savedData) {
            userData = JSON.parse(savedData);
        }
    }
    
    updateProfileDisplay();
}

// Данные пользователя
let userData = {
    name: "Иванова Анна Сергеевна",
    email: "anna@example.com",
    birthdate: "1995-03-15",
    interests: "Книги, путешествия, йога",
    wishlist: []
};

// Режим редактирования
let isEditing = false;

// Инициализация профиля при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализируем профиль...');
    loadUserData();
    loadWishlist();
    setupProfileEvents();
});

// Загрузка данных пользователя
function loadUserData() {
    const savedData = localStorage.getItem('sparks-user-data');
    if (savedData) {
        userData = JSON.parse(savedData);
        console.log('Данные пользователя загружены:', userData);
    }
    
    updateProfileDisplay();
}

// Обновление отображения профиля
function updateProfileDisplay() {
    document.getElementById('displayName').textContent = userData.name;
    document.getElementById('displayEmail').textContent = userData.email;
    document.getElementById('displayBirthdate').textContent = formatBirthdate(userData.birthdate);
    document.getElementById('displayInterests').textContent = userData.interests;
    
    document.getElementById('editName').value = userData.name;
    document.getElementById('editEmail').value = userData.email;
    document.getElementById('editBirthdate').value = userData.birthdate;
    document.getElementById('editInterests').value = userData.interests;
}

// Форматирование даты рождения
function formatBirthdate(dateString) {
    if (!dateString) return 'Не указана';
    
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

// Загрузка вишлиста
function loadWishlist() {
    const wishlistGrid = document.getElementById('wishlistGrid');
    const savedWishlist = localStorage.getItem('sparks-wishlist');
    
    if (savedWishlist) {
        userData.wishlist = JSON.parse(savedWishlist);
    }
    
    wishlistGrid.innerHTML = '';
    
    if (userData.wishlist.length === 0) {
        wishlistGrid.innerHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-gift"></i>
                <h3>Ваш вишлист пока пуст</h3>
                <p>Добавьте свои первые желания, чтобы друзья знали, что вам подарить!</p>
            </div>
        `;
        return;
    }
    
    userData.wishlist.forEach((wish, index) => {
        const wishElement = createWishElement(wish, index);
        wishlistGrid.appendChild(wishElement);
    });
    
    console.log('Вишлист загружен, элементов:', userData.wishlist.length);
}

// Создание элемента вишлиста
function createWishElement(wish, index) {
    const wishDiv = document.createElement('div');
    wishDiv.className = 'wish-item';
    
    wishDiv.innerHTML = `
        <div class="wish-image">
            ${wish.image ? 
                `<img src="${wish.image}" alt="${wish.name}" onerror="this.style.display='none'">` : 
                `<i class="fas fa-gift"></i>`
            }
        </div>
        <div class="wish-name">${wish.name}</div>
        <div class="wish-actions">
            ${wish.link ? `<a href="${wish.link}" target="_blank" class="wish-link">Магазин</a>` : ''}
            <button class="wish-remove" onclick="removeWishItem(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return wishDiv;
}

// Настройка обработчиков событий
function setupProfileEvents() {
    document.getElementById('editProfileBtn').addEventListener('click', startEditing);
    document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
    document.getElementById('addWishBtn').addEventListener('click', addToWishlist);
    
    // Enter для добавления в вишлист
    document.getElementById('wishName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addToWishlist();
        }
    });
}

// Начало редактирования профиля
function startEditing() {
    isEditing = true;
    
    document.getElementById('displayName').style.display = 'none';
    document.getElementById('displayEmail').style.display = 'none';
    document.getElementById('displayBirthdate').style.display = 'none';
    document.getElementById('displayInterests').style.display = 'none';
    
    document.getElementById('editName').style.display = 'block';
    document.getElementById('editEmail').style.display = 'block';
    document.getElementById('editBirthdate').style.display = 'block';
    document.getElementById('editInterests').style.display = 'block';
    
    document.getElementById('editProfileBtn').style.display = 'none';
    document.getElementById('saveProfileBtn').style.display = 'inline-block';
}

// Сохранение профиля
function saveProfile() {
    userData.name = document.getElementById('editName').value.trim();
    userData.email = document.getElementById('editEmail').value.trim();
    userData.birthdate = document.getElementById('editBirthdate').value;
    userData.interests = document.getElementById('editInterests').value.trim();
    
    if (!userData.name) {
        alert('Пожалуйста, введите ФИО');
        return;
    }
    
    if (!userData.email) {
        alert('Пожалуйста, введите email');
        return;
    }
    
    localStorage.setItem('sparks-user-data', JSON.stringify(userData));
    stopEditing();
    updateProfileDisplay();
}

// Выход из режима редактирования
function stopEditing() {
    isEditing = false;
    
    document.getElementById('displayName').style.display = 'block';
    document.getElementById('displayEmail').style.display = 'block';
    document.getElementById('displayBirthdate').style.display = 'block';
    document.getElementById('displayInterests').style.display = 'block';
    
    document.getElementById('editName').style.display = 'none';
    document.getElementById('editEmail').style.display = 'none';
    document.getElementById('editBirthdate').style.display = 'none';
    document.getElementById('editInterests').style.display = 'none';
    
    document.getElementById('editProfileBtn').style.display = 'inline-block';
    document.getElementById('saveProfileBtn').style.display = 'none';
}

// Добавление в вишлист
function addToWishlist() {
    const name = document.getElementById('wishName').value.trim();
    const image = document.getElementById('wishImage').value.trim();
    const link = document.getElementById('wishLink').value.trim();
    
    if (!name) {
        alert('Пожалуйста, введите название подарка');
        return;
    }
    
    const newWish = {
        id: Date.now(),
        name: name,
        image: image || null,
        link: link || null,
        createdAt: new Date().toISOString()
    };
    
    userData.wishlist.push(newWish);
    saveWishlist();
    
    document.getElementById('wishName').value = '';
    document.getElementById('wishImage').value = '';
    document.getElementById('wishLink').value = '';
    
    loadWishlist();
}

// Удаление из вишлиста
function removeWishItem(index) {
    if (confirm('Вы уверены, что хотите удалить этот подарок из вишлиста?')) {
        userData.wishlist.splice(index, 1);
        saveWishlist();
        loadWishlist();
    }
}

// Сохранение вишлиста
function saveWishlist() {
    localStorage.setItem('sparks-wishlist', JSON.stringify(userData.wishlist));
}