var luong = document.getElementById("luong");
var hesoluong = document.getElementById("hesoluong");
var tinhluong = document.getElementById("tinhluong");
var luongthang = document.getElementById("luongthang");


tinhluong.addEventListener("click", function(){ 
    const tienluong = hesoluong.value * luong.value;
    luongthang.textContent = tienluong.toString(); 
})

luong.addEventListener("input", function(){
    const inputLuong = luong.value;
    if(/[^0-9]/.test(inputLuong) || inputLuong < 0){
        luong.value = inputLuong.replace(/[^0-9]/g, ''); 
    }
})


hesoluong.addEventListener("input", function(){
    const inputLuong = luong.value;
    if(/[^0-9]/.test(inputLuong) || inputLuong < 0){
        luong.value = inputLuong.replace(/[^0-9]/g, ''); 
    }
})
