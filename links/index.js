var left = document.getElementById('left');
var right = document.getElementById('right');
var express_title = document.getElementById('express_title');
var express = document.getElementById('express');
var input_keyword = document.getElementById('input_keyword');
var btn_search = document.getElementById('btn_search');

function renderDL(arr) {  // 将数组形式的数据渲染成DL文档格式到展示区中
    var _len = arr.length;
    if (_len === 0) {
        return '<div class="alert alert-danger" role="alert"><strong>该分类下暂无信息</strong></div>';
    } else {
        var dl = document.createElement('dl');
        var _obj = null;
        for (var j = 0; j < _len; j++) {
            _obj = arr[j];
            var a = document.createElement('a');
            a.href = _obj['href'];
            a.target = '_blank';
            a.innerText = _obj['title'];
            var dt = document.createElement('dt');
            dt.appendChild(a);
            var dd = document.createElement('dd');
            dd.className = 'text-muted';
            dd.innerText = _obj['comment'];
            dl.appendChild(dt);
            dl.appendChild(dd);
        }
        return dl;
    }
}

function renderROW(arr) {
    var _content = '';
    var _obj = null;
    for (var j = 0; j < arr.length; j++) {
        _obj = arr[j];
        _content += '<div class="row mb-3"><div class="col col-md-7">公众号名称：<span style="color: #a300ff;">' + _obj['wx_name'] + '</span></div><div class="col col-md-5">公众号：<span style="color: #a300ff;">' + _obj['wx_number'] + '</span></div><div class="col col-md-12">所属机构：<span style="color: #a300ff;">' + _obj['department'] + '</span></div><div class="col col-md-12 text-muted">' + _obj['desc'] + '</div></div>';
    }
    return _content;
}

function exec_search() {  // 执行搜素的操作
    var key_word = input_keyword.value;
    key_word = key_word.replace(/(^\s+)|(\s+$)/g, '');
    if (key_word === '') {
        return;
    }
    express_title.innerText = '当前分类：' + key_word;
    var key_words = key_word.split(/\s+/);

    var wx = [];
    var other = [];
    function traversal(key, dct) {
        if (dct instanceof Array) {
            for (var i = 0; i < dct.length; i++) {
                var _tmp = dct[i];
                if (key === '微信公众号') {
                    for (var j = 0; j < key_words.length; j++) {
                        if (_tmp['wx_name'].indexOf(key_words[j]) !== -1) {
                            wx.push(_tmp);
                            break;
                        }
                        if (_tmp['department'].indexOf(key_words[j]) !== -1) {
                            wx.push(_tmp);
                            break;
                        }
                        if (_tmp['desc'].indexOf(key_words[j]) !== -1) {
                            wx.push(_tmp);
                            break;
                        }
                    }
                } else {
                    for (var j = 0; j < key_words.length; j++) {
                        if (_tmp['title'].indexOf(key_words[j]) !== -1) {
                            other.push(_tmp);
                            break;
                        }
                        if (_tmp['comment'].indexOf(key_words[j]) !== -1) {
                            other.push(_tmp);
                            break;
                        }
                    }
                }
            }
        } else {
            for (var _key in dct) {
                traversal(_key, dct[_key]);
            }
        }
    }

    traversal('', ref);
    if ((other.length === 0) && (wx.length === 0)) {
        express.innerHTML = '<div class="alert alert-danger" role="alert"><strong>该分类下暂无信息</strong></div>';
    } else {
        express.innerHTML = '';
        if (other.length !== 0){
            var res_1 = renderDL(other);
            express.appendChild(res_1);
        } 
        if (wx.length !== 0){
            var res_2 = renderROW(wx);
            express.innerHTML += res_2;
        }
    }
}

input_keyword.addEventListener('keypress', function (e) {  // 监听输入框的回车事件
    if (e.keyCode === 13) {
        exec_search();
    }
})
btn_search.addEventListener('click', exec_search);  // 监听搜索按钮的点击事件

left.addEventListener('click', function (e) {
    if (e.target.nodeName === 'LI') {  // 监听列表项的点击事件
        if (e.target.className === 'li_closed') {
            e.target.className = 'li_open';
            e.target.nextElementSibling.style.display = 'block';
        } else if (e.target.className === 'li_open') {
            e.target.className = 'li_closed';
            e.target.nextElementSibling.style.display = 'none';
        }
        handle_li(e.target);
    } else if (e.target.classList.contains('group_title')) {  // 监听一级目录
        // if (e.target.nextElementSibling.style.display === 'none') {
        //     e.target.nextElementSibling.style.display = 'block';
        // } else {
        //     e.target.nextElementSibling.style.display = 'none'
        // }
        var target_next = e.target.nextElementSibling;
        var open_lis = target_next.querySelectorAll('li.li_open');
        for (var i = 0; i < open_lis.length; i++) {
            open_lis[i].className = 'li_closed';
        }
        var uls = target_next.querySelectorAll('ul');
        for (var i = 0; i < uls.length; i++) {
            uls[i].style.display = 'none';
        }
    }
});

function handle_li(ele) {  // 处理列表项点击的后续行为
    var order = [];
    order.push(ele.innerText);
    prev_li = ele.parentElement.previousElementSibling;
    while (!prev_li.classList.contains('group_title')) {
        order.push(prev_li.innerText);
        prev_li = prev_li.parentElement.previousElementSibling;
    }
    order.push(prev_li.innerText);

    var info = ref;
    var key = '';
    for (var i = order.length - 1; i >= 0; i--) {
        key = order[i];
        info = info[key];
    }

    express_title.innerText = '当前分类：' + key;
    if (info instanceof Array) {  // 数据格式是普通的数组
        if (key === '微信公众号') {
            var res = renderROW(info);
            express.innerHTML = res;
        } else {
            var res = renderDL(info);
            if (typeof (res) === 'string') {
                express.innerHTML = res;
            } else {
                express.innerHTML = '';
                express.appendChild(res);
            }
        }
    } else {  // 数据格式是对象（即下面一层才是数组）
        var _arr = [];
        for (var _key in info) {
            var _value = info[_key];
            _arr = _arr.concat(_value);
        }
        var res = renderDL(_arr);
        if (typeof (res) === 'string') {
            express.innerHTML = res;
        } else {
            express.innerHTML = '';
            express.appendChild(res);
        }
    }
}