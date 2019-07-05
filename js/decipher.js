var content = document.getElementById('content');

window.onload = function() {
    var key = window.location.hash.substring(1);
    var ciphertext = content.innerHTML;
    try {
        var bytes = CryptoJS.AES.decrypt(ciphertext, key);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        content.innerHTML = originalText;
    } catch (error) {
        content.innerHTML = '<div class="alert alert-primary text-center" role="alert"><strong>解密码错误，请刷新重新！</strong></div>';
    }
    content.style.display = 'block';
};