// Вход пользователей

// Проверка учетных данных
function authenticateUser(email, password) {
    const users = getUsers(); // Используем функцию из register.js
    
    // Ищем пользователя
    const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
    );
    
    return user || null;
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Скрываем ошибку
            loginError.style.display = 'none';
            
            // Получаем данные
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // Аутентификация
            const user = authenticateUser(email, password);
            
            if (user) {
                // Сохраняем текущего пользователя
                localStorage.setItem('sparks-current-user', JSON.stringify(user));
                
                // Перенаправляем в профиль
                window.location.href = 'profile.html';
            } else {
                // Показываем ошибку
                loginError.style.display = 'block';
            }
        });
    }
    
    // Если пользователь уже вошел, перенаправляем
    const currentUser = JSON.parse(localStorage.getItem('sparks-current-user') || 'null');
    if (currentUser) {
        window.location.href = 'profile.html';
    }
});

// Функция getUsers должна быть доступна (из register.js)
// Если login.js подключается отдельно, добавь:
function getUsers() {
    const usersJSON = localStorage.getItem('sparks-users');
    return usersJSON ? JSON.parse(usersJSON) : [];
}