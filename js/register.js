// Регистрация пользователей

// Проверка существующих пользователей
function getUsers() {
    const usersJSON = localStorage.getItem('sparks-users');
    return usersJSON ? JSON.parse(usersJSON) : [];
}

// Сохранение пользователей
function saveUsers(users) {
    localStorage.setItem('sparks-users', JSON.stringify(users));
}

// Проверка email на уникальность
function isEmailUnique(email, users) {
    return !users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Валидация формы
function validateForm(formData, users) {
    const errors = {};
    
    // Проверка ФИО
    if (!formData.fullName.trim()) {
        errors.name = 'Пожалуйста, введите ФИО';
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.email = 'Введите корректный email';
    } else if (!isEmailUnique(formData.email, users)) {
        errors.email = 'Этот email уже зарегистрирован';
    }
    
    // Проверка пароля
    if (formData.password.length < 6) {
        errors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    // Проверка подтверждения пароля
    if (formData.password !== formData.confirmPassword) {
        errors.confirm = 'Пароли не совпадают';
    }
    
    return errors;
}

// Отображение ошибок
function showErrors(errors) {
    // Скрываем все ошибки сначала
    document.querySelectorAll('.form-error').forEach(el => {
        el.style.display = 'none';
    });
    
    // Показываем нужные ошибки
    if (errors.name) {
        document.getElementById('nameError').textContent = errors.name;
        document.getElementById('nameError').style.display = 'block';
    }
    
    if (errors.email) {
        document.getElementById('emailError').textContent = errors.email;
        document.getElementById('emailError').style.display = 'block';
    }
    
    if (errors.password) {
        document.getElementById('passwordError').textContent = errors.password;
        document.getElementById('passwordError').style.display = 'block';
    }
    
    if (errors.confirm) {
        document.getElementById('confirmError').textContent = errors.confirm;
        document.getElementById('confirmError').style.display = 'block';
    }
    
    return Object.keys(errors).length === 0;
}

// Регистрация пользователя
function registerUser(userData) {
    const users = getUsers();
    
    // Создаем нового пользователя
    const newUser = {
        id: Date.now(), // Уникальный ID
        ...userData,
        createdAt: new Date().toISOString(),
        wishlist: [] // Пустой вишлист
    };
    
    // Добавляем в список пользователей
    users.push(newUser);
    saveUsers(users);
    
    // Сохраняем текущего пользователя в сессию
    localStorage.setItem('sparks-current-user', JSON.stringify(newUser));
    
    return newUser;
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Собираем данные формы
            const formData = {
                fullName: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                birthdate: document.getElementById('birthdate').value,
                gender: document.getElementById('gender').value,
                interests: document.getElementById('interests').value.trim()
            };
            
            // Получаем существующих пользователей
            const users = getUsers();
            
            // Валидируем форму
            const errors = validateForm(formData, users);
            
            if (!showErrors(errors)) {
                return; // Есть ошибки, останавливаем
            }
            
            // Убираем confirmPassword перед сохранением
            const userData = { ...formData };
            delete userData.confirmPassword;
            
            // Регистрируем пользователя
            const user = registerUser(userData);
            
            // Показываем успешное сообщение
            alert(`Добро пожаловать, ${user.fullName}! Регистрация успешна.`);
            
            // Перенаправляем в профиль
            window.location.href = 'profile.html';
        });
    }
});