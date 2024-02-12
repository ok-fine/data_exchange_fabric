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
                'dataname': {
                    required: true,
                    minlength: 3
                },
                'position': {
                    required: true,
                    minlength: 3
                },
                'content':{
                    required: true
                }
            },
            messages: {
                'dataname': {
                    required: '请输入资源名称',
                    minlength: '至少需要三个字符'
                },
                'position': '请输入角色描述语',
                'content': '请输入数据内容'
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
            var dataname = $('#dataname').val();
            var position = $('#position').val();
            var content = $('#content').val();

            console.log('create -> ' + username + ' : ' + dataname + ' : ' + 'position');

            $.ajax({
                // url: 'http://localhost:8088/admin/data/create',
                url: '/admin/data/create',
                crossDomain: true,
                type: 'post',
                // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
                data: { // 需要发送的数据
                    'username': username,
                    'dataname': dataname, 
                    'position': position,
                    'content': content
                },
                dataType: 'json', // 接受数据格式
                success: function (data) {
                    // alert('123');
                    console.log(data);
                    if(data.code === '200'){
                        alert(`数据${dataname}上传成功`);

                        // location.href = `${URL}/base_pages_addData.html`;
                        location.href = 'base_pages_addData.html';

                    }else{
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

    $('#btn-upload').click(function(){
        if($('#upload').val() !== ''){
            var dir = $('#upload').val();
            console.log('dir: ' + dir);

            $.ajax({
                // url: 'http://localhost:8088/admin/data/upload',
                url: '/admin/data/upload',
                crossDomain: true,
                type: 'post',
                // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
                data: { // 需要发送的数据
                    'username': App.getStorage('username'),
                    'datadir': dir
                },
                dataType: 'json', // 接受数据格式
                success: function (data) {
                    // alert('123');
                    console.log(data);
                    if(data.code === '200'){
                        alert(`文件夹${dir}里的数据上传成功，如果数据已存在，不会覆盖或更改。`);

                        location.href = `${URL}/base_pages_addData.html`;
                        location.href = 'base_pages_addData.html';

                    }else{
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
        }else{
            console.log('false');
            $('#show-error').html("请输入需要上传的资源路径");
        }
        
    });



});