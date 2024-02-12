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
                'content': {
                    required: true,
                    minlength: 2
                }
            },
            messages: {
                'name': {
                    required: '请输入商户名称',
                    minlength: '至少需要2个字符'
                },
                'content': {
                    required: '请输入税务登记证的相关信息',
                    minlength: '至少需要2个字符'
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

    $('#btn-apply').click(function(){
        // console.log(jQuery('.js-validation-login').valid());
        if( jQuery('.js-validation-material').valid()){
            var username = App.getStorage('username');
            var name = $('#name').val();
            var content = $('#content').val();

            console.log('do -> ' + username + ' : ' + name + ' : ' + content);

            $.ajax({
                // url: 'http://localhost:8088/client/tax/apply',
                url: '/client/tax/apply',
                crossDomain: true,
                type: 'post',
                // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
                data: { // 需要发送的数据
                    'username': username,
                    'name': name, 
                    'content': content
                },
                dataType: 'json', // 接受数据格式
                success: function (data) {
                    // alert('123');
                    console.log(data);
                    if(data.code === '200'){
                        console.log(data.message);
                        alert(`${name} 税务登记证办理成功`);
                        // location.href = `${URL}/frontend_tax.html`;
                        location.href = 'frontend_tax.html';

                    }else{
                        alert(data.message);
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