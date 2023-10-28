 

var nuocuong_thucan = document.querySelectorAll(".nuocuong_thucan");   
var btn_register = document.getElementById("btn_register_id");
var tongtien = document.getElementById("tongtien");
 

var tong = 0;

// nuocuong_thucan là một list input 
// foreach sẽ chạy lược qua từng phần thử trong list để thêm sự kiện cho từng input
// foreach là function callback trong js, với đối số truyền vào là một function
// trong function truyền vào là một đối số, đối số này chứa giá trị của một phần tử trong list
nuocuong_thucan.forEach(function(input) {
    input.addEventListener("click", function() {
        var label = input.nextElementSibling; // Lấy label kế tiếp của input
        if (input.checked) { 
            // khi có sự kiện click vào thẻ input thì sẽ kiểm tra xem, nếu checked thì sẽ style backgroundcolor thành grey
            // và cộng tổng
            // còn không thì ngược lại
            label.style.backgroundColor = "grey";
            tong += parseInt(input.value) 
        } else {
            label.style.backgroundColor = "transparent";
            tong -= parseInt(input.value) 
        }
    });
}); 

btn_register.addEventListener("click", function(){  
    tongtien.textContent = tong;
})