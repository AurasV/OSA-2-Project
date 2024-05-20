// register.js

$(document).ready(function() {
    // Password restrictions
    $('#password-info').text('Password must be at least 8 characters long, contain at least one uppercase letter and one number.');

    $('#register-button').click(function() {
        var email = $('#email').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirm-password').val();

        // Password validation
        var passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            console.log(password)
            $('#registration-message').text('Password does not meet requirements.');
            $('#registration-message').addClass('text-red-500');
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/register',
            data: {
                email: email,
                password: password,
                'confirm-password': confirmPassword
            },
            success: function(response) {
                // Show registration message
                $('#registration-message').text(response.message);
                if (response.success) {
                    $('#registration-message').addClass('text-green-500');
                } else {
                    $('#registration-message').addClass('text-red-500');
                }
            }
        });
    });
});