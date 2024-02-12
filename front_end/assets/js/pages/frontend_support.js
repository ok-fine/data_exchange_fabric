
const URL = 'file:///Users/weijieyang/go/src/github.com/hyperledger/dateExchange-demo/front_end';

function logout(){
    console.log(App.getStorage('username'));
    // if( window.username !== '' ){
        $.ajax({
            // url: 'http://localhost:8088/logout/all',
            url: '/logout/all',
            crossDomain: true,
            type: 'get',
            // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
            data: { // 需要发送的数据
                'username': App.getStorage('username')
            },
            dataType: 'json', // 接受数据格式
            success: function(data){
                alert(`用户${App.getStorage('username')}退出成功`);
                App.delStorage('username')
                // location.href = `${URL}/frontend_login.html`;
                location.href = 'frontend_login.html';
            },
            error: function(data){
                console.log(`用户${document.cookie}退出失败!`);
                console.log(data);
            }

        });
    // }
};


var Data = function(){
    var user =  App.getStorage('username').split(':');
    var username =user[1];
    var type = user[0];



    return {
        init: function(){
            initRoles();
            initDataAsset();
            // console.log('data init');
        }
    }
}();


var BaseFormValidation = function() {
    // Init Material Forms Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
    var initValidationMaterial = function(){
        jQuery('.js-validation-allocate').validate({
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
                'allocation': {
                    required: true
                }
            },
            messages: {
                'allocation': '请输入角色分配指令'
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


$(function () {


    // Data.init();

    // BaseFormValidation.init();

    // Init page helpers (Appear + CountTo plugins)
    App.initHelpers(['appear', 'appear-countTo']);

    $('#btn-alloc').click(function(){
        console.log('valid:' + jQuery('.js-validation-allocate').valid());
        if( jQuery('.js-validation-allocate').valid()){
            var allocation = $('#allocation').val().split(',');
            console.log('allocation: ' + allocation);

            $.ajax({
                // url: 'http://localhost:8088/admin/role/allocate',
                url: '/admin/role/allocate',
                crossDomain: true,
                async: false,
                type: 'post',
                // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
                data: { // 需要发送的数据
                    'username': App.getStorage('username'),
                    'role': allocation[0],
                    'touser': allocation[1]
                },
                dataType: 'json', // 接受数据格式
                success: function (data) {
                    if(data.code === '200'){
                        
                        alert('角色分配成功' );
                        $('#allocation').html("");

                    } else {
                        alert('角色分配失败，请使用：org1:wjy1,Admin:111');
                        $('#allocation').html("");
                    }
                },
                error: function (data, statusCode, c) {
                    dataNum.setAttribute('data-to', 590);
                    // alert('error');
                    console.log('error');
                    console.log(data); 
                }
            });
        }

    });

});



