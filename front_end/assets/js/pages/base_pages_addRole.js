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
                'rolename': {
                    required: true,
                    minlength: 3
                },
                'description': {
                    required: true,
                    minlength: 3
                }
            },
            messages: {
                'rolename': {
                    required: '请输入角色名称',
                    minlength: '至少需要三个字符'
                },
                'description': '请输入角色描述语'
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

    $('#btn-create').click(function(){
        // console.log(jQuery('.js-validation-login').valid());
        if( jQuery('.js-validation-material').valid()){
            var username = App.getStorage('username');
            var rolename = $('#rolename').val();
            var description = $('#description').val();

            console.log('create -> ' + username + ' : ' + rolename + ' : ' + description);

            $.ajax({
                // url: 'http://localhost:8088/admin/role/create',
                url: '/admin/role/create',
                crossDomain: true,
                type: 'post',
                // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
                data: { // 需要发送的数据
                    'username': username,
                    'rolename': rolename,
                    'description': description
                },
                dataType: 'json', // 接受数据格式
                success: function (data) {
                    // alert('123');
                    console.log(data);
                    if(data.code === '200'){
                        alert(`角色${rolename}创建成功`);

                        // location.href = `${URL}/base_pages_addRole.html`;
                        location.href = 'base_pages_addRole.html';

                    }else{
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
    });



});