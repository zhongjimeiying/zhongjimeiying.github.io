var mask = document.getElementById('mask');
var password = document.getElementById('password');
var btn_decipher = document.getElementById('btn_decipher');
var content = document.getElementById('content');

btn_decipher.addEventListener('click', function () {
    var key = password.value;
    var ciphertext = content.innerHTML;
    try {
        var bytes = CryptoJS.AES.decrypt(ciphertext, key);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        content.innerHTML = originalText;
    } catch (error) {
        content.innerHTML = '<div class="alert alert-primary text-center" role="alert"><strong>解密码错误，请刷新重新！</strong></div>';
    }
    content.style.display = 'block';
    mask.style.display = 'none';
})