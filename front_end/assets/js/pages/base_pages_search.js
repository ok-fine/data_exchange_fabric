
const URL = 'file:///Users/weijieyang/go/src/github.com/hyperledger/dateExchange-demo/front_end';

function logout(){
    console.log(document.cookie);
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
                // location.href = `${URL}/base_pages_login.html`;
                location.href = 'base_pages_login.html';
            },
            error: function(data){
                console.log(`用户${document.cookie}退出失败!`);
                console.log(data);
            }

        });
    // }
};

function delRole(rolekey){
    console.log('delete rolekey: ' + rolekey);

    $.ajax({
        // url: 'http://localhost:8088/admin/role/delete',
        url: '/admin/role/delete',
        crossDomain: true,
        async: false,
        type: 'post',
        // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
        data: { // 需要发送的数据
            'username': App.getStorage('username'),
            'rolekey': rolekey
        },
        dataType: 'json', // 接受数据格式
        success: function (data) {
            if(data.code === '200'){
                 alert(`角色${rolekey}删除成功`)
                // location.href = `${URL}/base_pages_search.html`;
                location.href = 'base_pages_search.html';

            } else {
                alert(`角色${rolekey}删除失败`)
            }
        },
        error: function (data, statusCode, c) {
          
            console.log('error');
            console.log(data); 
        }
    }); 
};


function editRole(rolekey){
    console.log('edit rolekey: ' + rolekey);
    let btnAuth = document.getElementById('ctr-auth');
    if(btnAuth.style.display === "none"){
        btnAuth.style.display=""; // 显示框框
        document.getElementById('editauth').setAttribute("role", rolekey);

        // 
        document.getElementById('ctr-data').style.display = "none";
    }else{
        btnAuth.style.display="none"; // 隐藏框框
    }
    
};

function delData(datakey){
    console.log('delete datakey: ' + datakey);

    $.ajax({
        // url: 'http://localhost:8088/admin/data/delete',
        url: '/admin/data/delete',
        crossDomain: true,
        async: false,
        type: 'post',
        // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
        data: { // 需要发送的数据
            'username': App.getStorage('username'),
            // 'func': 'searchByOwner'，
            'datakey': datakey
        },
        dataType: 'json', // 接受数据格式
        success: function (data) {
            if(data.code === '200'){
                alert(`数据${datakey}删除成功`);
                // location.href = `${URL}/base_pages_search.html`;
                location.href = 'base_pages_search.html';

            } else {
                alert(`数据${datakey}删除失败`);
            }
        },
        error: function (data, statusCode, c) {
          
            console.log('error');
            console.log(data); 
        }
    }); 
};


function editData(datakey, position){
    console.log('edit datakey: ' + datakey);
    let btnAuth = document.getElementById('ctr-data');
    if(btnAuth.style.display === "none"){
        btnAuth.style.display=""; // 显示框框
        document.getElementById('editdata').setAttribute("data", datakey);
        document.getElementById('editdata').setAttribute("pos", position);
        document.getElementById('editdata').value = position;

        document.getElementById('ctr-auth').style.display = "none";
    }else{
        btnAuth.style.display="none"; // 隐藏框框
    }
};

function try1(){
    console.log('try1');
}



function createTr(cont){

    var pt = document.createElement("tr");//创建一行
    var photoBox = document.createElement("td");//创建选择列      
    photoBox.setAttribute("class", "text-center");
                      
    photoBox.innerHTML=`<td class="text-center">1</td>`;
    pt.appendChild(photoBox);//加入行
                                
    var photoId=document.createElement("td");//创建id
    photoId.innerHTML=`<td class="font-w600">Bruce Edwards</td>`;
    pt.appendChild(photoId);
                                
    var photoClass=document.createElement("td");//创建分类
    photoClass.innerHTML=`<td class="hidden-xs">client7@example.com</td>`;
    pt.appendChild(photoClass);

    
    var introduce=document.createElement("td");//创建文本内容
    introduce.innerHTML=`<td class="hidden-xs hidden-sm">
         <span class="label label-success">VIP</span>
     </td>`;
    pt.appendChild(introduce);

    return pt;
};

var Data = function(){
    var user =  App.getStorage('username').split(':');
    var username =user[1];
    var type = user[0];

   
    var initRoleTable = function(roles){
        console.log('init role table');
        console.log(roles);
        if(roles === 'null'){
            createTr();
            return null;
        }

        var rbody = document.getElementById('role-body');

        for(var num in roles){
            var pt = document.createElement("tr");
            var id = document.createElement("td");//创建选择列
            id.setAttribute("class", "text-center");
            id.innerHTML = parseInt(num) + 1;
            pt.appendChild(id);

            var rolename = document.createElement("td");
            rolename.innerHTML = roles[num].Record.name;
            pt.appendChild(rolename)

            var auth = document.createElement("td");
            auth.setAttribute("class", "hidden-xs");
            let authlist = roles[num].Record.authlist;
            let spclass = ["label label-primary", "label label-info", "label label-warning", "label label-danger", "label label-success"];
            var anum = 0;
            for(var a in authlist){
                var divsp = document.createElement("div");
                divsp.setAttribute("style", "display: block; margin-bottom: 8px; margin-top: 8px");
                // divsp.setAttribute("class", "text-center");
                var sp1 = document.createElement("span");
                sp1.setAttribute("class", spclass[anum]);
                sp1.setAttribute("style", "margin-right: 3px;");
                // sp.innerHTML = '[' + a + '] -> ' + authlist[a];
                sp1.innerHTML = a;

                var sp2 = document.createElement("span");
                sp2.setAttribute("class", spclass[anum]);
                sp2.setAttribute("style", "margin-left: 3px;");
                sp2.innerHTML = authlist[a];

                divsp.appendChild(sp1);
                divsp.appendChild(sp2);

                auth.appendChild(divsp);
                anum = (anum + 1) % 5;
            }

            pt.appendChild(auth);

            var op = document.createElement("td");//创建选择列
            op.setAttribute("class", "text-center");
            let div = document.createElement("div");
            div.setAttribute("class", "btn-group");

            let bt1 = document.createElement("button");
            bt1.setAttribute("num", num);
            bt1.onclick = function(){
                let i1 = bt1.getAttribute("num");
                editRole(roles[i1].Record.org+":"+roles[i1].Record.name);
            };
            bt1.setAttribute("type", "button");
            bt1.setAttribute("class", "btn btn-xs btn-default");
            bt1.setAttribute("data-toggle", "tooltip");
            bt1.setAttribute("title", "编辑角色");
            bt1.innerHTML = '<i class="fa fa-pencil"></i>';

            let bt2 = document.createElement("button");
            bt2.setAttribute("num", num);
            bt2.onclick = function(){
                let i2 = bt2.getAttribute("num");
                delRole(roles[i2].Record.org+":"+roles[i2].Record.name);
            };
            bt2.setAttribute("type", "button");
            bt2.setAttribute("class", "btn btn-xs btn-default");
            bt2.setAttribute("data-toggle", "tooltip");
            bt2.setAttribute("title", "删除角色");
            bt2.innerHTML = '<i class="fa fa-times"></i>';
            div.appendChild(bt1);
            div.appendChild(bt2);
            op.appendChild(div);

            pt.appendChild(op); 
            rbody.appendChild(pt);
        }
    };

    // 渲染data展示列表
    var initDataTable = function(datas){
        console.log('init datas table');
        console.log(datas);
        if(datas === 'null'){
            createTr();
            return null;
        }

        var dbody = document.getElementById('data-body');

        for(var num in datas){
            var pt = document.createElement("tr");
            var id = document.createElement("td");//创建选择列
            id.setAttribute("class", "text-center");
            id.innerHTML = parseInt(num) + 1;
            pt.appendChild(id);

            var dataname = document.createElement("td");
            dataname.innerHTML = datas[num].Record.name;
            pt.appendChild(dataname)

            var owner = document.createElement("td");
            owner.innerHTML = datas[num].Record.owner;
            pt.appendChild(owner)

            var pos = document.createElement("td");
            pos.innerHTML = datas[num].Record.position;
            pt.appendChild(pos)

            var op = document.createElement("td");//创建选择列
            op.setAttribute("class", "text-center");
            let div = document.createElement("div");
            div.setAttribute("class", "btn-group");
            let bt1 = document.createElement("button");
            bt1.setAttribute("num", num);
            // console.log(datas[num].Record.name+":"+datas[num].Record.owner);
            bt1.onclick = function(){
                let i1 = bt1.getAttribute("num");
                editData(datas[i1].Record.name+":"+datas[i1].Record.owner, datas[i1].Record.position);
            };
            bt1.setAttribute("type", "button");
            bt1.setAttribute("class", "btn btn-xs btn-default");
            bt1.setAttribute("data-toggle", "tooltip");
            bt1.setAttribute("title", "编辑资源");
            bt1.innerHTML = '<i class="fa fa-pencil"></i>';

            let aa = 'aaa';

            let bt2 = document.createElement("button");
            bt2.setAttribute("num", num);
            bt2.onclick = function(){
                let i2 = bt2.getAttribute("num");
                delData(datas[i2].Record.name+":"+datas[i2].Record.owner);
            };
            bt2.setAttribute("type", "button");
            bt2.setAttribute("class", "btn btn-xs btn-default");
            bt2.setAttribute("data-toggle", "tooltip");
            bt2.setAttribute("title", "删除资源");
            bt2.innerHTML = '<i class="fa fa-times"></i>';
            div.appendChild(bt1);
            div.appendChild(bt2);
            op.appendChild(div);

            pt.appendChild(op);
            dbody.appendChild(pt);
        }

    };

    var initRoles = function(){
        console.log(username);
        var roleNum = document.getElementById('tt-role');

        $.ajax({
            // url: 'http://localhost:8088/admin/search/roles',
            url: '/admin/search/roles',
            crossDomain: true,
            async: false,
            type: 'post',
            // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
            data: { // 需要发送的数据
                'username': App.getStorage('username'),
            },
            dataType: 'json', // 接受数据格式
            success: function (data) {
                console.log('role num: ' + data.message.num);
                if(data.code === '200'){

                    roleNum.setAttribute('data-to', data.message.num * 10);
                    initRoleTable(data.message.roles);

                } else {
                    // location.href = `${URL}/base_pages_500.html`;
                    location.href = 'base_pages_500.html';
                }
            },
            error: function (data, statusCode, c) {
                roleNum.setAttribute('data-to', 270);

                initRoleTable('null');
                console.log('error');
                console.log(data); 
            }

        });

    };

    var initDataAsset = function(){
        console.log(type);
        var dataNum = document.getElementById('tt-data');

        $.ajax({
            // url: 'http://localhost:8088/admin/search/datas',
            url: '/admin/search/datas',
            crossDomain: true,
            async: false,
            type: 'post',
            // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
            data: { // 需要发送的数据
                'username': App.getStorage('username'),
            },
            dataType: 'json', // 接受数据格式
            success: function (data) {
                if(data.code === '200'){
                    
                    dataNum.setAttribute('data-to', data.message.num * 10);
                    initDataTable(data.message.datas);

                } else {
                    // dataNum.setAttribute('data-to', 590);
                    // location.href = `${URL}/base_pages_500.html`;
                     location.href ='base_pages_500.html';
                }
            },
            error: function (data, statusCode, c) {
                dataNum.setAttribute('data-to', 590);
                // alert('error');
                console.log('error');
                console.log(data); 
            }

        });
    };

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

    var initValidationAuth = function(){
        jQuery('.js-validation-editauth').validate({
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
                'editauth': {
                    required: true
                }
            },
            messages: {
                'editauth': '请输入角色权限管理指令'
            }
        });
    };

    var initValidationData = function(){
        jQuery('.js-validation-editdata').validate({
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
                'editdata': {
                    required: true
                }
            },
            messages: {
                'editdata': '请输入资源管理指令'
            }
        });
    };


    return {
        init: function () {
            // Init Meterial Forms Validation
            initValidationMaterial();
            initValidationAuth();
        }
    };
}();


$(function () {


    Data.init();

    BaseFormValidation.init();

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
                        // document.getElementById('allocation').value = '';
                         // location.href = `${URL}/base_pages_search.html`;
                         location.href = 'base_pages_search.html';

                    } else {
                        alert('角色分配失败，请使用：org1:wjy1,Admin:111');
                        document.getElementById('allocation').value = '';
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

    $('#btn-auth').click(function(){
        console.log('valid:' + jQuery('.js-validation-editauth').valid());
        if( jQuery('.js-validation-editauth').valid()){
            var editauth = $('#editauth').val().split(',');

            if(editauth.length !== 3 || editauth[0].indexOf(':') === -1){
                alert('角色权限操作失败，请使用：data1.txt:org1:admin,deleteAuth,searchByOwner:searchByName');
            }else{
                var rolekey = document.getElementById('editauth').getAttribute("role");
                console.log(`edit ${rolekey} auth: ${editauth}`);

                $.ajax({
                    // url: 'http://localhost:8088/admin/role/editauth',
                    url: '/admin/role/editauth',
                    crossDomain: true,
                    async: false,
                    type: 'post',
                    // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
                    data: { // 需要发送的数据
                        'username': App.getStorage('username'),
                        'role': rolekey,
                        'op': editauth[1],
                        'authlist': editauth[2],
                        'datakey': editauth[0]
                    },
                    dataType: 'json', // 接受数据格式
                    success: function (data) {
                        if(data.code === '200'){
                            alert(data.message);
                            // location.href = `${URL}/base_pages_search.html`;
                            location.href = 'base_pages_search.html';

                        } else {
                            console.log(data.message);
                            alert('角色权限操作失败，请使用：data1.txt:org1:admin,deleteAuth,searchByOwner:searchByName');
                            document.getElementById('editauth').value = '';
                        }
                    },
                    error: function (data, statusCode, c) {
                        alert('角色权限操作失败，请使用：data1.txt:org1:admin,deleteAuth,searchByOwner:searchByName');
                        // alert('error');
                        console.log('error');
                        console.log(data); 
                    }
                });

            }
        }

    });

    $('#btn-data').click(function(){
        console.log('valid:' + jQuery('.js-validation-editdata').valid());
        if( jQuery('.js-validation-editdata').valid()){
            var position = $('#editdata').val();

            var datakey = document.getElementById('editdata').getAttribute("data");
            console.log(`edit ${datakey} data: ${position}`);

            $.ajax({
                // url: 'http://localhost:8088/admin/data/update',
                url: '/admin/data/update',
                crossDomain: true,
                async: false,
                type: 'post',
                // contentType: 'application/json',  // 数据发送格式，如果设置了需要传JSON.stringify，并在服务端JSON.parse还原
                data: { // 需要发送的数据
                    'username': App.getStorage('username'),
                    'datakey': datakey,
                    'position': position
                },
                dataType: 'json', // 接受数据格式
                success: function (data) {
                    if(data.code === '200'){
                        alert(data.message);
                        // location.href = `${URL}/base_pages_search.html`;
                        location.href = 'base_pages_search.html';

                    } else if(data.code === '500') {
                        alert('资源更新失败，请使用正确的数据位置');
                        document.getElementById('editdata').value = document.getElementById('editdata').getAttribute("pos");
                    }else {
                        console.log(data.message);
                        alert('资源更新失败: ' + data.message);
                        document.getElementById('editdata').value = document.getElementById('editdata').getAttribute("pos");
                    }
                },
                error: function (data, statusCode, c) {
                    alert('资源更新失败，请使用正确的数据位置');
                    // alert('error');
                    console.log('error');
                    console.log(data); 
                }
            });
        }

    });



});

// var a = 'asafs'
// console.log(a.indexOf(':'));

// var a = Data.init;
// a();


// App.setCookie("name", "peter");
//     App.setCookie("sex", "man");
//     App.setCookie("age", "19");

//     console.log(App.getCookie("name"));
//     console.log(App.getCookie("sex"));
//     console.log(App.getCookie("age"));