import * as requestGet from "../../utils/request";
import images from "../../assets/images";
import "./payment.css";
import 'bootstrap/dist/css/bootstrap.css'; 
import { useEffect, useState } from "react";
import request from "../../utils/request";


function Payment(){

    //Khi thanh toán thì cần phải lôi thông tin sản phẩm trong đơn hàng, địa chỉ cũ của người dùng đã đặt hàng và voucher
    //nên infoForPayment sẽ lưu những dữ liệu này khi load vào trang web payment
    const [infoForPayment, setInfoForPayment] = useState({
        infoProduct: [],
        infoVoucher: [],
        infoAdress: [],
    });
    const [hienThiThanhToan, setHienThiThanhToan] = useState(false);

    //lưu thông tin voucher mà người dùng nhập vào để kiểm tra voucher có sử dụng được hay không
    const [inputvouchers, setInputVoucher] = useState('');

    //nếu discountvoucher > 0 và < 1 thì sẽ dùng disocuntvoucher để biết nó giảm nhiêu
    const [discountVoucher, setDiscountVoucher] = useState(0);

    //mã thông tin giao hàng cũ
    const [mattghOldAddress, setMattghOldAddress] = useState('');

    //chọn phương thức thanh toán
    const [phuongThucThanhToan, setPhuongThucThanhToan] = useState('Thanh toán khi nhận hàng');
    var tongtienSP = 0;
    var phivanchuyen = 25000;

    //thông tin này dùng để chuẩn bị dữ liệu để lưu xuống DB thông qua laravel
    const [shipInformation, setShipInformation] = useState({
        name_ship: '',
        numberPhone_ship: '',
        address_ship: '',   
        option_thanhpho: '', 
        option_quan: '',
        option_phuong: '',
    });

    //valid voucher
    const handleApplyVoucher = (e) => {
        const found = infoForPayment.infoVoucher.find(item => item.MAVOUCHER === inputvouchers);
        if(found !== undefined) setDiscountVoucher(found.GIATRIGIAM);
        else setDiscountVoucher("Voucher không khả dụng");
    }

    //xử lý nhập thông tin giao hàng
    const handleInputShipInformation = (e) => {
        e.persist();
        setShipInformation({...shipInformation, [e.target.name]: e.target.value});
    }

    //xử lý nhập voucher
    const handleInputVoucher = (e) => {
        e.persist();
        setInputVoucher(e.target.value);
    }

    //xử lý chọn địa chỉ cũ
    const handleChooseAdress = (index) => {
        setMattghOldAddress(infoForPayment.infoAdress[index].MATTGH);
        setShipInformation({
            name_ship: infoForPayment.infoAdress[index].TEN,
            numberPhone_ship:infoForPayment.infoAdress[index].SDT,
            address_ship: infoForPayment.infoAdress[index].DIACHI,
            option_thanhpho: infoForPayment.infoAdress[index].TINH_TP,
            option_quan: infoForPayment.infoAdress[index].QUAN_HUYEN,
            option_phuong: infoForPayment.infoAdress[index].PHUONG_XA,
        })
         
    } 

    // xử lý lấy thông tin phục vụ cho việc thanh toán
    const handleGetInfoForPayment = () => { 
        // điều kiện để thực hiện câu truy vấn lấy dữ liệu là matk và selected trong chitietgiohangs, 
        // nếu ở trang giỏ hàng chuyển quan trang thanh toán, thì những sản phẩm được tích chọn ở trang thanh toán 
        // sẽ có selected = 1 và những sản phẩm đó sẽ được hiển thị trong trang thanh toán để người dùng thanh toán
        const conditionToGetInfoForPayment = {
            matk: localStorage.getItem('auth_matk'),
            selected: 1,
        }  
        requestGet.get("/api/infoForPayment",  conditionToGetInfoForPayment)
        .then(res => { 
            setInfoForPayment({
                infoProduct: res.data_sanpham,
                infoVoucher: res.data_voucher,
                infoAdress: res.data_adress,
            });  
            console.log(res.data_sanpham);
        })
        
    }

    const handleClickAddNewAddress = () => {
        //cái này dùng để xem là có cần lưu thông tin từ những ô nhập thông tin giao hàng không, nếu rỗng thì không
        setMattghOldAddress('');
    }

    // xử lý khi chọn phương thức thanh toán là tiền măt hay chuyển khoản
    const handleChooseMethodPayment = (e) => {  
        setPhuongThucThanhToan(e.target.value); 
    }

    infoForPayment.infoProduct.forEach(item => {
        tongtienSP += item.TONGGIA; 
    })

    //in ra thông tin sản phẩm đã được chọn để thanh toán từ giỏ hàng
    const renderInfoProductOrders = infoForPayment.infoProduct.map((item, index) => {  
        return (
            <tr key={index}>
                <td class="col-2">
                    <img class="payment_product rounded mx-auto d-block" src={images.paymen_1} alt=""/>
                </td>
                <td class="col-4">
                    <span class="fw-bold">{item.TENSP}</span>
                    <br/>
                    <span>{item.TENMAU}, {item.MASIZE}</span>
                </td>
                <td class="col-2">{item.GIABAN}</td>
                <td class="col-2">{item.SOLUONG}</td>
                <td class="col-2">{item.TONGGIA}</td>
            </tr>
        )
    })
    
    //hiển thị thông tin giao hàng người dùng đã nhập ở những lần mua hàng trước
    const renderInfoAdsressShip = infoForPayment.infoAdress.map((item, index) => {
        return (
            <div class="address_box" key={index}>
                    <div class="address_info row">
                        <div class="col-1">
                            <input type="radio" name="address_radio" data-bs-toggle="collapse" href="#address_change" onClick={() => handleChooseAdress(index)}
                                checked />
                        </div>
                        <div class="col-5 fw-bold">
                            <span>{item.TEN}</span>
                            <span>{item.SDT}</span>
                        </div>
                        <div class="col-6">
                            <span>{item.DIACHI}, {item.PHUONG_XA}, {item.QUAN_HUYEN}, {item.TINH_TP}</span>
                        </div>
                    </div>
                </div>
        );
    })
    
    //lưu thông tin thanh toán
    const handleSaveInfoForPayment = () => {
         
        const getCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Thêm 0 phía trước nếu tháng < 10
            const day = String(today.getDate()).padStart(2, '0'); // Thêm 0 phía trước nếu ngày < 10
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
        };

        //thông tin cần lưu trữ trong bảng đơn hàng
        const infoForOrder = {
            matk: localStorage.getItem('auth_matk'),
            ngayorder: getCurrentDate(),
            tongtien_SP: tongtienSP,
            vouchergiam: tongtienSP * discountVoucher,
            tongtiendonhang: tongtienSP - tongtienSP * discountVoucher - phivanchuyen,
            phivanchuyen: phivanchuyen,
            hinhthucthanhtoan: phuongThucThanhToan,
            trangthaithanhtoan: 'chuatra',
            trangthaidonhang: 'choxacnhan',
            mavoucher: inputvouchers,
            mattgh: mattghOldAddress,
            ghichu: 'ok',
        }
        
        //bởi vì infoProduct là mảng nên cần chuyển đổi sang stringify để thêm vào đối tượng allDataForSaveInfoPayment
        const infoProductJSON = JSON.stringify(infoForPayment.infoProduct); 
        //3 biến đầu tiên là đối tượng nên ko cần stringify
        const allDataForSaveInfoPayment = {
            ...shipInformation,
            ...infoForPayment.infoProduct,
            ...infoForOrder,
            infoProductJSON,
            
        }

        console.log(phuongThucThanhToan); 
            // gọi api phương thức saveInfoForPayment và kèm thông tin allDataForSaveInfoPayment để lưu xuỐNG DB
            request.post("/api/saveInfoForPayment", allDataForSaveInfoPayment)
            .then(res => {  
                console.log(res.data, "ok");
                setHienThiThanhToan(true);
                console.log(res.data.data.data);
                // window.location.href = res.data.data.data;
            }) 
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(()=> {
        handleGetInfoForPayment(); 
    },[]);

    //cái này có thể không dùng đến
    const data_shipInformation = {
        name: shipInformation.name_ship,
        numberPhone: shipInformation.numberPhone_ship,  
        address: shipInformation.address_ship,
        phuongxa: shipInformation.option_phuong,
        quanhuyen: shipInformation.option_quan, 
        tinhthanhpho: shipInformation.option_thanhpho, 
    }

    return (
        <div class="body_box container col-lg-7">
        <div class="address_box">
            <div class="address_title row text-start">
                <div>
                    <i class="fa-solid fa-location-dot"></i>
                    <span>Địa chỉ nhận hàng</span>
                </div>
            </div>
            <div class="address_info row justify-content-between">
                <div class="col-auto fw-bold">
                    <span>Nguyễn Văn A</span>
                    <span>(+84)123456789</span>
                </div>
                <div class="col-auto">
                    <span>1 đường A, phường B, Quận 1, Tp.HCM</span>
                </div>
                <div class="col-auto">
                    <a class="link-dark" data-bs-toggle="collapse" href="#address_change">Thay đổi</a>
                </div>
            </div>
        </div>
        <div class="address_change collapse" id="address_change">
            <div class="address_box_container"> 
                {/* ở đây có chèn nội dung phần render  */}
                {renderInfoAdsressShip}
                {/* ở đây có xử lý onlcick addnewaddress khi thêm địa chỉ mới  */}
                <button type="button" class="address_add_button" onClick={handleClickAddNewAddress}>+ Thêm địa chỉ mới</button>
            </div>
        </div>
        <div class="address_update" id="address_update">
            <div class="row mb-2">
                <div class="col-12">
                    <label for="#" class="form-label">Tên người nhận hàng</label>
                    {/* xử lý nhập thông tin */}
                    <input type="text" class="form-control" value={shipInformation.name_ship} onChange={handleInputShipInformation} name="name_ship"/>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-12">
                    <label for="#" class="form-label">SDT người nhận hàng</label>
                    <input type="text" class="form-control" value={shipInformation.numberPhone_ship} onChange={handleInputShipInformation} name="numberPhone_ship"/>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-12">
                    <label for="#" class="form-label">Địa chỉ</label>
                    <input type="text" class="form-control" value={shipInformation.address_ship} onChange={handleInputShipInformation} name="address_ship"/>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-4">
                    <label for="#" class="form-label">Thành phố</label>
                    {/* xử lý chọn thông tin */}
                    <select class="form-select" required 
                        value={shipInformation.option_thanhpho}
                        onChange={handleInputShipInformation}
                        name="option_thanhpho"
                    >
                        <option value="Tp.HCM">Tp.HCM</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                    </select>
                </div>
                <div class="col-4">
                    <label for="#" class="form-label">Quận</label>
                    <select class="form-select" required
                        value={shipInformation.option_quan}
                        onChange={handleInputShipInformation}
                        name="option_quan"
                    >
                        <option selected value="Quận 1">Quận 1</option>
                        <option value="Quận 2">Quận 2</option>
                        <option value="Quận 3">Quận 3</option>
                        <option value="Quận 4">Quận 4</option>
                        <option value="Quận 5">Quận 5</option>
                    </select>
                </div>
                <div class="col-4">
                    <label for="#" class="form-label">Phường</label>
                    <select class="form-select" required
                        value={shipInformation.option_phuong}
                        onChange={handleInputShipInformation}
                        name="option_phuong"
                    >
                    <option selected value="Phường A">Phường A</option>
                    <option value="Phường B">Phường B</option>
                    <option value="Phường C">Phường C</option>
                    <option value="Phường D">Phường D</option>
                    <option value="Phường E">Phường E</option>
                    </select>
                </div>
            </div>
            <div class="address_update_button_contain row">
                <div>
                    <button class="address_confirm_button btn btn-dark">Xác nhận</button>
                    <button class="address_cancel_button btn btn-outline-secondary">Hủy</button>
                </div>
                
            </div>
        </div>
        <div class="product_list">
            <table>
                <tr>
                    <th class="ps-5" colspan="2">Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                </tr>
                {renderInfoProductOrders}
            </table>
        </div>
        <div class="payment_info">
        <div class="row justify-content-end">
                <div class="vertical_align_center col-3">
                    <span>Mã Voucher:</span>
                </div>
                <div class="col-4">
                    <input type="text" class="form-control" value={inputvouchers} onChange={handleInputVoucher}/>
                </div>
                <div class="vertical_align_center horizontal_align_right col-2 text-end">
                    {/* áp dụng voucher */}
                    <button onClick={handleApplyVoucher}>Áp dụng</button>
                </div>
            </div>
            <div class="row justify-content-end">
                <div class="vertical_align_center col-3">
                    <span>Số tiền Voucher giảm:</span>
                </div>
                <div class="col-4"></div>
                <div class="col-2 text-end">
                    <span class="discount_price">-{parseInt(discountVoucher * tongtienSP)}</span>
                </div>
            </div>
            <div class="row justify-content-end">
                <div class="vertical_align_center  col-3">
                    <span>Tổng tiền sản phẩm:</span>
                </div>
                <div class="col-4"></div>
                <div class="col-2 text-end">
                    <span class="discount_price">{tongtienSP}</span>
                </div>
            </div>
            <div class="row justify-content-end">
                <div class="vertical_align_center col-3">
                    <span>Phí vận chuyển:</span>
                </div>
                <div class="col-4">
                    {/* <select class="form-select" required>
                        <option selected value="">Giao hàng tiêu chuẩn</option>
                        <option value="">Giao hàng hỏa tốc</option>
                    </select> */}
                </div>
                <div class="vertical_align_center horizontal_align_right col-2 text-end">
                    <span>25000đ</span>
                </div>
            </div>
            <div class="row justify-content-end">
                <div class="vertical_align_center col-3">
                    <span>Phương thức thanh toán</span>
                </div>
                <div class="col-4">
                    <select class="form-select" required
                        name="phuongThucThanhToan"
                        onChange={handleChooseMethodPayment}
                        value={phuongThucThanhToan}
                    >
                        <option selected value="Thanh toán khi nhận hàng">Thanh toán khi nhận hàng</option>
                        <option value="Chuyển khoản">Chuyển khoản</option>
                    </select>
                </div>
                <div class="col-2"></div>
            </div>
            <div class="row justify-content-end">
                <div class="col-7 text-end">
                    <span class="fs-4">Tổng số tiền:</span>
                </div>
                <div class="col-2 text-end">
                    <span class="discount_price fs-4 fw-bold">{tongtienSP + phivanchuyen}đ</span>
                </div>
            </div>
            <div class="payment_confirm justify-content-end">
                <button class="button_confirm float-end" onClick={handleSaveInfoForPayment}>Thanh toán</button>
            </div>
        </div> 
    </div>
    );
}

export default Payment;