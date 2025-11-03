// Signup form validation and handling

document.addEventListener('DOMContentLoaded', function() {
    // Show error/success message if exists
    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');
    
    if (errorMsg && errorMsg.textContent.trim() !== '') {
        errorMsg.classList.add('show');
    }
    
    if (successMsg && successMsg.textContent.trim() !== '') {
        successMsg.classList.add('show');
    }

    // Password match validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const confirmPasswordGroup = confirmPassword.closest('.form-group');

    function validatePasswordMatch() {
        if (confirmPassword.value !== '') {
            if (password.value !== confirmPassword.value) {
                confirmPassword.classList.add('error');
                let errorText = confirmPasswordGroup.querySelector('.error-text');
                if (!errorText) {
                    errorText = document.createElement('div');
                    errorText.className = 'error-text';
                    confirmPasswordGroup.appendChild(errorText);
                }
                errorText.textContent = 'Mật khẩu không khớp!';
                errorText.classList.add('show');
                return false;
            } else {
                confirmPassword.classList.remove('error');
                const errorText = confirmPasswordGroup.querySelector('.error-text');
                if (errorText) {
                    errorText.classList.remove('show');
                }
                return true;
            }
        }
        return true;
    }

    confirmPassword.addEventListener('input', validatePasswordMatch);
    password.addEventListener('input', function() {
        if (confirmPassword.value !== '') {
            validatePasswordMatch();
        }
    });

    // Email validation
    const email = document.getElementById('email');
    const emailGroup = email.closest('.form-group');

    email.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value !== '' && !emailRegex.test(email.value)) {
            email.classList.add('error');
            let errorText = emailGroup.querySelector('.error-text');
            if (!errorText) {
                errorText = document.createElement('div');
                errorText.className = 'error-text';
                emailGroup.appendChild(errorText);
            }
            errorText.textContent = 'Email không hợp lệ!';
            errorText.classList.add('show');
        } else {
            email.classList.remove('error');
            const errorText = emailGroup.querySelector('.error-text');
            if (errorText) {
                errorText.classList.remove('show');
            }
        }
    });

    // Phone validation (Vietnamese phone number)
    const phone = document.getElementById('phone');
    const phoneGroup = phone.closest('.form-group');

    phone.addEventListener('blur', function() {
        const phoneRegex = /^(0|\+84)[1-9][0-9]{8,9}$/;
        const cleanPhone = phone.value.replace(/\s+/g, '');
        if (cleanPhone !== '' && !phoneRegex.test(cleanPhone)) {
            phone.classList.add('error');
            let errorText = phoneGroup.querySelector('.error-text');
            if (!errorText) {
                errorText = document.createElement('div');
                errorText.className = 'error-text';
                phoneGroup.appendChild(errorText);
            }
            errorText.textContent = 'Số điện thoại không hợp lệ!';
            errorText.classList.add('show');
        } else {
            phone.classList.remove('error');
            const errorText = phoneGroup.querySelector('.error-text');
            if (errorText) {
                errorText.classList.remove('show');
            }
        }
    });

    // Form validation
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        const name = document.getElementById('name').value.trim();
        const emailValue = email.value.trim();
        const phoneValue = phone.value.trim();
        const passwordValue = password.value.trim();
        const confirmPasswordValue = confirmPassword.value.trim();

        // Check all required fields
        if (!name || !emailValue || !phoneValue || !passwordValue || !confirmPasswordValue) {
            e.preventDefault();
            const errorMsg = document.getElementById('errorMessage');
            if (!errorMsg.textContent.trim()) {
                errorMsg.textContent = 'Vui lòng điền đầy đủ thông tin!';
                errorMsg.classList.add('show');
            }
            return false;
        }

        // Check password match
        if (passwordValue !== confirmPasswordValue) {
            e.preventDefault();
            validatePasswordMatch();
            return false;
        }

        // Check password length
        if (passwordValue.length < 6) {
            e.preventDefault();
            password.classList.add('error');
            let errorText = password.closest('.form-group').querySelector('.error-text');
            if (!errorText) {
                errorText = document.createElement('div');
                errorText.className = 'error-text';
                password.closest('.form-group').appendChild(errorText);
            }
            errorText.textContent = 'Mật khẩu phải có ít nhất 6 ký tự!';
            errorText.classList.add('show');
            return false;
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            e.preventDefault();
            email.classList.add('error');
            return false;
        }

        // Check terms agreement
        if (!document.getElementById('agreeTerms').checked) {
            e.preventDefault();
            const errorMsg = document.getElementById('errorMessage');
            errorMsg.textContent = 'Vui lòng đồng ý với điều khoản sử dụng!';
            errorMsg.classList.add('show');
            return false;
        }
    });
});

