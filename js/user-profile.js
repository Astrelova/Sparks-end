// Просмотр профиля другого пользователя

// Получение пользователя по ID
function getUserById(userId) {
    const users = getUsers();
    return users.find(user => user.id === userId);
}

// Загрузка профиля пользователя
function loadUserProfile() {
    const userId = parseInt(localStorage.getItem('sparks-view-user'));
    
    if (!userId) {
        window.location.href = 'index.html';
        return;
    }
    
    const user = getUserById(userId);
    const currentUser = JSON.parse(localStorage.getItem('sparks-current-user'));
    
    if (!user) {
        document.getElementById('userProfileContent').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-user-slash" style="font-size: 3rem; color: var(--text-secondary);"></i>
                <h3>Пользователь не найден</h3>
                <p>Пользователь мог удалить свой аккаунт</p>
            </div>
        `;
        return;
    }
    
    // Определяем первую букву имени для аватара
    const firstLetter = user.fullName.charAt(0).toUpperCase();
    
    // Определяем можно ли резервировать подарки (только если вошли не под этим же пользователем)
    const canReserve = currentUser && currentUser.id !== user.id;
    
    // Формируем HTML профиля
    let profileHTML = `
        <div class="user-profile-header">
            <div class="user-avatar">${firstLetter}</div>
            <h2>${user.fullName}</h2>
            ${user.interests ? `<p><i class="fas fa-heart"></i> ${user.interests}</p>` : ''}
        </div>
        
        <div class="user-info">
            <h3>Информация</h3>
            <div class="info-grid">
                ${user.email ? `<div class="info-item"><strong>Email:</strong><br>${user.email}</div>` : ''}
                ${user.birthdate ? `<div class="info-item"><strong>Дата рождения:</strong><br>${new Date(user.birthdate).toLocaleDateString('ru-RU')}</div>` : ''}
                ${user.gender ? `<div class="info-item"><strong>Пол:</strong><br>${user.gender === 'female' ? 'Женский' : 'Мужской'}</div>` : ''}
                <div class="info-item"><strong>На сайте с:</strong><br>${new Date(user.createdAt).toLocaleDateString('ru-RU')}</div>
            </div>
        </div>
    `;
    
    // Добавляем вишлист если он есть
    if (user.wishlist && user.wishlist.length > 0) {
        profileHTML += `
            <div class="wishlist-section">
                <h3>Вишлист пользователя</h3>
                <div class="wishlist-grid" id="userWishlist">
                    ${user.wishlist.map((wish, index) => `
                        <div class="wish-item">
                            ${wish.image ? `<img src="${wish.image}" alt="${wish.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">` : 
                              `<div style="width: 100%; height: 150px; background: var(--border-color); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-gift" style="font-size: 2rem; color: var(--text-secondary);"></i>
                              </div>`}
                            <div style="padding: 15px;">
                                <h4 style="margin: 0 0 10px 0;">${wish.name}</h4>
                                ${wish.description ? `<p style="color: var(--text-secondary); font-size: 0.9rem;">${wish.description}</p>` : ''}
                                ${wish.link ? `<a href="${wish.link}" target="_blank" style="display: inline-block; margin-top: 10px; color: var(--primary-color);">Ссылка на товар</a>` : ''}
                                ${canReserve ? `
                                    <button onclick="reserveGift(${userId}, ${index})" style="margin-top: 10px; width: 100%; padding: 8px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer;">
                                        Забронировать подарок
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        profileHTML += `
            <div class="wishlist-section">
                <h3>Вишлист пользователя</h3>
                <div style="text-align: center; padding: 40px; background: var(--card-bg); border-radius: 15px;">
                    <i class="fas fa-gift" style="font-size: 3rem; color: var(--border-color); margin-bottom: 15px;"></i>
                    <p>У пользователя пока нет вишлиста</p>
                </div>
            </div>
        `;
    }
    
    document.getElementById('userProfileContent').innerHTML = profileHTML;
}

// Резервирование подарка
function reserveGift(userId, wishIndex) {
    if (!confirm('Вы уверены, что хотите забронировать этот подарок? Другие пользователи увидят, что он уже зарезервирован.')) {
        return;
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return;
    
    // Добавляем информацию о резервировании
    if (!users[userIndex].wishlist[wishIndex].reservedBy) {
        const currentUser = JSON.parse(localStorage.getItem('sparks-current-user'));
        users[userIndex].wishlist[wishIndex].reservedBy = {
            userId: currentUser.id,
            userName: currentUser.fullName,
            reservedAt: new Date().toISOString()
        };
        
        saveUsers(users);
        alert('Подарок успешно забронирован!');
        loadUserProfile(); // Обновляем отображение
    } else {
        alert('Этот подарок уже забронирован другим пользователем.');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
});

// Функции из register.js должны быть доступны
function getUsers() {
    const usersJSON = localStorage.getItem('sparks-users');
    return usersJSON ? JSON.parse(usersJSON) : [];
}

function saveUsers(users) {
    localStorage.setItem('sparks-users', JSON.stringify(users));
}