/*
 *  Document   : base_pages_login.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Login Page
 */

const URL = 'file:///Users/weijieyang/go/src/github.com/hyperledger/dateExchange-demo/front_end';

var BasePagesLogin = function() {
    // Init Login Form Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
    var initValidationLogin = function(){
        // $('#btn-login').validate({
        jQuery('.js-validation-login').validate({
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
                'password': {
                    required: true,
                    minlength: 3
                }
            },
            messages: {
                'username': {
                    required: '请输入用户名',
                    minlength: '至少需要输入3个字符'
                },
                'password': {
                    required: '请输入密码',
                    minlength: '密码长度至少为3'
                }
            }
        });

    };

    return {
        init: function () {
            // Init Login Form Validation
            initValidationLogin();
        }
    };
}();

// Initialize when page loads
jQuery(function(){
    BasePagesLogin.init();

    $('#btn-login').click(function(){
        // console.log(jQuery('.js-validation-login').valid());
        if( jQuery('.js-validation-login').valid()){
            // window.username = username;
            var username = $('#username').val();
            var password = $('#password').val();

            $.ajax({
                // url: 'http://localhost:8088/login/admin',
                url: '/login/admin',
                crossDomain: true,
                type: 'post',
                // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
                data: { // 需要发送的数据
                    'username': username,
                    'password': password
                },
                dataType: 'json', // 接受数据格式
                success: function (data) {
                    // alert('123');
                    console.log(data);
                    if(data.code === '200'){
                        App.setStorage('username', `admin:${username}`);
            
                        console.log(App.getStorage('username'));

                        // location.href = `${URL}/base_pages_search.html`;
                        location.href = 'base_pages_search.html';

                    }else{
                        // location.href = '/frontend_signup.html';
                        // var error = document.getElementById("");
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
                    // if(data.code === '200'){
                    //     // location.href = '/';
                    // }else{
                    //     $('#show-error').val(data.message);
                    // }
                }
            });
        }
    })

});











