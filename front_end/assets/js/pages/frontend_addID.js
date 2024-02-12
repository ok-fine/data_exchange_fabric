/*
 *  Document   : base_forms_validation.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Form Validation Page
 */

const URL = 'file:///Users/weijieyang/go/src/github.com/hyperledger/dateExchange-demo/front_end';


var BaseFormValidation = function() {
    // Init Material Forms Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
    var initValidationMaterial = function(){
        jQuery('.js-validation-material').validate({
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
                'name': {
                    required: true,
                    minlength: 2
                },
                'idcard': {
                    required: true,
                    minlength: 18
                }
            },
            messages: {
                'name': {
                    required: '请输入真实的姓名',
                    minlength: '至少需要2个字符'
                },
                'idcard': {
                    required: '请输入用户身份证号码',
                    minlength: '请输入18位身份证号码'
                }
            }
        });
    };

    return {
        init: function () {
            // Init Meterial Forms Validation
            initValidationMaterial();
        }
    };
}();

// Initialize when page loads
jQuery(function(){ 
    BaseFormValidation.init();

    $('#btn-idcard').click(function(){
        // console.log(jQuery('.js-validation-login').valid());
        if( jQuery('.js-validation-material').valid()){
            var username = App.getStorage('username');
            var name = $('#name').val();
            var idcard = $('#idcard').val();

            console.log('link -> ' + username + ' : ' + name + ' : ' + idcard);

            $.ajax({
                // url: 'http://localhost:8088/client/police/idcard',
                url: '/client/police/idcard',
                crossDomain: true,
                type: 'post',
                // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
                data: { // 需要发送的数据
                    'username': username,
                    'name': name, 
                    'idcard': idcard
                },
                dataType: 'json', // 接受数据格式
                success: function (data) {
                    // alert('123');
                    console.log(data);
                    if(data.code === '200'){
                        alert(`${name} 身份信息绑定成功`);
                        // location.href = `${URL}/frontend_addID.html`;
                        location.href = 'frontend_addID.html';

                    }else{
                        alert(dataf.message);
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