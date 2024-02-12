/*
 *  Document   : base_pages_register.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Register Page
 */

const URL = 'file:///Users/weijieyang/go/src/github.com/hyperledger/dateExchange-demo/front_end';

var BasePagesRegister = function() {
    // Init Register Form Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
    var initValidationRegister = function(){
        jQuery('.js-validation-register').validate({
            errorClass: 'help-block text-right animated fadeInDown',
            errorElement: 'div',
            errorPlacement: function(error, e) {
                jQuery(e).parents('.form-group .form-material').append(error);
            },
            highlight: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            success: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            rules: {
                'username': {
                    required: true,
                    minlength: 3
                },
                'email': {
                    required: true,
                    email: true
                },
                'password': {
                    required: true,
                    minlength: 3
                },
                'password2': {
                    required: true,
                    equalTo: '#password'
                }
            },
            messages: {
                'username': {
                    required: '请输入用户名',
                    minlength: '至少需要输入3个字符'
                },
                'email': '请输入有效的邮箱地址',
                'password': {
                    required: '请输入密码',
                    minlength: '密码长度至少为3'
                },
                'password2': {
                    required: '请确认您的密码',
                    minlength: '密码长度至少为3',
                    equalTo: '请输入相同的密码'
                }
            }
        });
    };

    return {
        init: function () {
            // Init Register Form Validation
            initValidationRegister();
        }
    };
}();

// Initialize when page loads
jQuery(function(){ 
    BasePagesRegister.init();

    $('#btn-register').click(function(){
        if( jQuery('.js-validation-register').valid() ){
            var username = $('#username').val();
            var email = $('#email').val();
            var password = $('#password').val();
            console.log(username, email, password);
            // alert(username + email + password);

            $.ajax({
                // url: 'http://localhost:8088/register/admin',
                url: '/register/admin',
                crossDomain: true,
                type: 'post',
                // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
                data: { // 需要发送的数据
                    'username': username,
                    'password': password,
                    'email': email
                },
                dataType: 'json', // 接受数据格式
                success: function (data) {
                    // alert('123');
                    console.log(data);
                    if(data.code === '200'){
                        App.setStorage('username', `admin:${username}`);
                        // location.href = `${URL}/base_pages_search.html`;
                        location.href = 'base_pages_search.html';

                    }else{
                        // location.href = '/frontend_signup.html';
                        // var error = document.getElementById("show-error");
                        // error.style.color="Red";
                        // error.innerHTML = data.message;
                        // error.class = 'has-error';
                        $('#show-error').html(data.message);
                    }
                    // windos
                },
                error: function (data, statusCode, c) {
                    // alert('error');
                    console.log('error');
                    console.log(data); 
                }
            });
        }
            
    });
});