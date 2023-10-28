function tinhGiaTour() {
    var tourSelect = document.getElementById("tour");
    var selectedTour = tourSelect.options[tourSelect.selectedIndex].value;

    var nguoiLon = parseInt(document.getElementById("nguoiLon").value);
    var treEm = parseInt(document.getElementById("treEm").value);

    var giaTourNguoiLon = 0;
    var giaTourTreEm = 0;
    

    switch (selectedTour) {
        case "Hà Nội - Hạ Long - Tuần Châu":
            giaTourNguoiLon = 10000000;
            break;
        case "Hà Nội - Sapa":
            giaTourNguoiLon = 6000000;
            break;
        case "Đà Nẵng - Hội An":
            giaTourNguoiLon = 3000000;
            break;
        case "Buôn Mê Thuộc - Kon Tum":
            giaTourNguoiLon = 2000000;
            break;
        case "TP.HCM - Nha Trang":
            giaTourNguoiLon = 3500000;
            break;
        case "TP.HCM - Cần Thơ - Cà Mau":
            giaTourNguoiLon = 2500000;
            break;
    }
    giaTourTreEm = giaTourNguoiLon / 2;

    var tongGiaNguoiLon = nguoiLon * giaTourNguoiLon;
    var tongGiaTreEm = treEm * giaTourTreEm;
    var tongGia = tongGiaNguoiLon + tongGiaTreEm;

    var note = document.getElementById("note").value;
    

    // Hiển thị thông tin đăng ký

    
    var thongTin = "  Ngày đăng ký:         " + new Date().toLocaleString() + "\n";
    
    thongTin += "  Nhân Viên:            Họ tên nhân viên\n";
    thongTin += "  Họ tên khách:         " + document.getElementById("hoten").value + "\n";
    thongTin += "  Địa chỉ:              " + document.getElementById("diachi").value + "\n";
    thongTin += "  Tour:                 " + selectedTour + "\n";
    thongTin += "  Số lượng đoàn khách:  Người lớn - " + nguoiLon + ", Trẻ em - " + treEm + "\n";
    thongTin += "  Ghi chú:              " + note + "\n";
   
    
    // Hiển thị thông tin số lượng khách đoàn và tổng tiền
    var soLuongKhachDoan = "\t\tSL\tĐơn giá\t\tThành Tiền\n";
    soLuongKhachDoan += "Người lớn\t" + nguoiLon + "\t" + giaTourNguoiLon + "\t" + tongGiaNguoiLon + "\n";
    soLuongKhachDoan += "Trẻ em\t\t" + treEm + "\t" + giaTourTreEm + "\t\t" + tongGiaTreEm + "\n";
    ;
    
    // Mở trang web khác và hiển thị thông tin đăng ký và số lượng khách đoàn
    var newWindow = window.open("", "Thông tin đăng ký và số lượng khách đoàn", "width=600,height=400");
    newWindow.document.write("<div style='border:1px solid black;width:400px;'>");
    newWindow.document.write("<b><pre>                 Thông tin đăng ký</pre></b>");
    newWindow.document.write("<pre>"+ thongTin +"</pre>");
    newWindow.document.write("</div>")
    newWindow.document.write("<div style='border:1px solid black;width:400px;'>");
    newWindow.document.write("<b><pre>Số lượng khách đoàn</pre></b>");
    newWindow.document.write("<pre>"+ soLuongKhachDoan +"</pre>");
    newWindow.document.write("<b><pre> Tổng tiền:      " + tongGia+ "đ</pre></b>");
    newWindow.document.write("</div>")


}