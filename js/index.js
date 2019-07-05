var mask = document.getElementById('mask');
var password = document.getElementById('password');
var btn_decipher = document.getElementById('btn_decipher');
var content = document.getElementById('content');

var key = '';  // 解密码

btn_decipher.addEventListener('click', function () {
    if (password.value === '') {
        return;
    }
    key = password.value;
    content.style.display = 'block';
    mask.style.display = 'none';
});

content.addEventListener('click', function (e) {
    if (e.target.nodeName === 'A') {
        if (e.target.href.substring(e.target.href.length -1) === '#') {
            e.target.href += key;
        }
    }
});