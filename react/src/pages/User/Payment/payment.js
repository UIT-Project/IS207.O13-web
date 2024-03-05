 
import images from "../../../assets/images";
import "./payment.css";
import 'bootstrap/dist/css/bootstrap.css'; 
import { useEffect, useState } from "react";
import request from "../../../utils/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCheckCircle, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";


function Payment(){
    useEffect(() => {
        document.title = "DosiIn | Thanh toán"
    }, []);
    //Khi thanh toán thì cần phải lôi thông tin sản phẩm trong đơn hàng, địa chỉ cũ của người dùng đã đặt hàng và voucher
    //nên infoForPayment sẽ lưu những dữ liệu này khi load vào trang web payment
    const [errorDinhDangSDT, setErrorDinhDangSDT] = useState(false);

    const {formatPrice} = useGlobalVariableContext(); 
    const [isLoading, setIsLoading] = useState(false);
    const [iserror_soluong_SP, setIsError_soluong_SP] = useState(false);
    const {isClickedPayment, setIsClickedPayment} = useGlobalVariableContext(); 
    const [contentPopup, setContentPopup] = useState({
        title: '',
        content: '',
    })
    const Navigate = useNavigate();
    const [infoForPayment, setInfoForPayment] = useState({
        infoProduct: [],
        infoVoucher: [],
        infoAdress: [],
    });
    const [hienThiThanhToan, setHienThiThanhToan] = useState(false);
    // const URL_APIAdsress = 'https://provinces.open-api.vn/api/';
    const URL_APIAdsress = 'https://vapi.vnappmob.com/api/province';
    //lưu thông tin voucher mà người dùng nhập vào để kiểm tra voucher có sử dụng được hay không
    const [inputvouchers, setInputVoucher] = useState('');

    //nếu discountvoucher > 0 và < 1 thì sẽ dùng disocuntvoucher để biết nó giảm nhiêu
    const [discountVoucher, setDiscountVoucher] = useState('0');

    //mã thông tin giao hàng cũ
    const [mattghOldAddress, setMattghOldAddress] = useState('');

    //kiem tra thong tin giao hang
    const [isInputShipInformationValidated, setIsInputShipInformationValidated] = useState(false);

    //chọn phương thức thanh toán
    const [phuongThucThanhToan, setPhuongThucThanhToan] = useState('Thanh toán khi nhận hàng');
    var tongtienSP = 0;
    const phivanchuyen_default = 25000;
    const phivanchuyen_hcm = 20000;
    const [phivanchuyen, setPhivanchuyen] = useState(phivanchuyen_default);
    const [phivanchuyen__truockhiapvoucher, setPhivanchuyen__truockhiapvoucher] = useState(0);
    const [dataAPIAddress, setDataAPIAddress] = useState({
        province: [],
        districts: [],
        commune: [],
    })

    //thông tin này dùng để chuẩn bị dữ liệu để lưu xuống DB thông qua laravel
    const [shipInformation, setShipInformation] = useState({
        name_ship: '',
        numberPhone_ship: '',
        address_ship: '',   
        option_thanhpho: '', 
        option_quan: '',
        option_phuong: '',
    });
    
    const shipInformation_Array = Object.entries(shipInformation).map(([key, value]) => (
        {
            key: key,
            value: value
        }
    )) 
    const openPopup = () => {
        const popupOverlay = document.querySelector(".popup-overlay");
        const popupContainer = document.querySelector(".popup-container");
    
        popupOverlay.style.display = "flex";
        setTimeout(() => {
          popupContainer.style.opacity = "1";
          popupContainer.style.transform = "scale(1)";
        }, 100);
    };
    
    const closePopup = () => {
        const popupContainer = document.querySelector(".popup-container");
        popupContainer.style.opacity = "0";
        popupContainer.style.transform = "scale(0.8)";
        setTimeout(() => {
        const popupOverlay = document.querySelector(".popup-overlay");
        popupOverlay.style.display = "none";
        }, 300);
        setIsError_soluong_SP(false)
    };
    const [tongSoTien, setTongSoTien] = useState('')
    // useEffect(() => {
    //     if(typeof(parseInt(discountVoucher) > 0)){
    //         console.log('929292', tongtienSP + phivanchuyen - parseInt(discountVoucher))
    //         setTongSoTien(tongtienSP + phivanchuyen - parseInt(discountVoucher))
    //     }
    // }, [discountVoucher])
    //valid voucher
    const handleApplyVoucher = (e) => {
        // const found = infoForPayment.infoVoucher.find(item => item.MAVOUCHER === inputvouchers);
        // if(found !== undefined) setDiscountVoucher(found.GIATRIGIAM);
        // else setDiscountVoucher("Voucher không khả dụng");
        let i = 0;
        infoForPayment.infoVoucher.forEach(item => {
            console.log(item.MAVOUCHER, inputvouchers, 'ksksk')
            if(item.MAVOUCHER === inputvouchers){
                if(item.SOLUONG_CONLAI === 0){
                    setDiscountVoucher("Voucher hết lượt sử dụng");
                    console.log('1')
                }
                else if(item.PHANLOAI_VOUCHER === 'Vận chuyển'){
                    if(tongtienSP < item.GIATRI_DH_MIN){
                        setDiscountVoucher("Giá trị đơn hàng không đạt tối thiểu");
                        console.log('5')
                    }
                    else{
                        
                        setPhivanchuyen__truockhiapvoucher(phivanchuyen)
                        setPhivanchuyen(phivanchuyen - (item.GIATRIGIAM * phivanchuyen)); 
                        console.log('2') 
                        setTongSoTien(tongtienSP + phivanchuyen - (item.GIATRIGIAM * phivanchuyen))
                        setDiscountVoucher(parseFloat(item.GIATRIGIAM) );
                        console.log(item.GIATRIGIAM * phivanchuyen, 'vanchuyen')
                    }
                    console.log(item.GIATRIGIAM * phivanchuyen, 'vanchuyen')
                }
                else if(tongtienSP >= item.GIATRI_DH_MIN){
                    if(tongtienSP * item.GIATRIGIAM > item.GIATRI_GIAM_MAX){
                        setDiscountVoucher(item.GIATRI_GIAM_MAX / tongtienSP);
                        console.log('3', item.GIATRI_GIAM_MAX / tongtienSP)
                        setTongSoTien(tongtienSP + phivanchuyen - tongtienSP * (item.GIATRI_GIAM_MAX / tongtienSP))

                    }
                    else if(tongtienSP * item.GIATRIGIAM <= item.GIATRI_GIAM_MAX){
                        setDiscountVoucher(parseFloat(item.GIATRIGIAM));
                        console.log('4', item.GIATRIGIAM)
                        setTongSoTien(tongtienSP + phivanchuyen - tongtienSP * item.GIATRIGIAM)

                    }
                }
                else if(tongtienSP < item.GIATRI_DH_MIN){
                    setDiscountVoucher("Giá trị đơn hàng không đạt tối thiểu");
                    console.log('5')
                }
                i++;
                console.log(phivanchuyen, 'vanchuyen')
            }
        });
        if(i === 0) setDiscountVoucher("Nhập sai mã voucher");
    }

    //xử lý nhập thông tin giao hàng
    const handleInputShipInformation = (e) => {
        e.persist();
        setShipInformation({...shipInformation, [e.target.name]: e.target.value});
        if(e.target.value === 'Thành phố Hồ Chí Minh'){
            setPhivanchuyen(phivanchuyen_hcm)
            setTongSoTien(tongtienSP + phivanchuyen_hcm)
        }
        else{
            setPhivanchuyen(phivanchuyen_default)
            setTongSoTien(tongtienSP + phivanchuyen_default) 
        }
        let ID_Province = 1;
        let ID_District = 1;
        dataAPIAddress.province.forEach(item => {
            if(item.province_name === e.target.value) {
                ID_Province = item.code;
                handleGetDistrict(ID_Province);
                dataAPIAddress.districts.forEach(item => {
                    if(item.district_name === shipInformation.option_quan) {
                        ID_District = item.code;
                        handleGetCommune(ID_District);
                    }
                })
            }
        })
        dataAPIAddress.districts.forEach(item => {
            if(item.district_name === e.target.value) {
                ID_District = item.code;
                handleGetCommune(ID_District); 
                // console.log('asd')
            }
        })
    }
    // console.log(shipInformation);

    //xử lý nhập voucher
    const handleInputVoucher = (e) => {
        e.persist();
        setInputVoucher(e.target.value);
    }

    //xử lý chọn địa chỉ cũ
    const handleChooseAdress = (index) => {
        console.log(infoForPayment.infoAdress[index])
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
            clickPaymentFromCart: isClickedPayment
        }  
        request.get("/api/infoForPayment", {params: conditionToGetInfoForPayment})
        .then(res => { 
            setInfoForPayment({
                infoProduct: res.data.data_sanpham,
                infoVoucher: res.data.data_voucher,
                infoAdress: res.data.data_adress,
            });  
            console.log(conditionToGetInfoForPayment, '029292');
            console.log(res.data.data_sanpham, '029292');
            res.data.data_sanpham.forEach(item => {
                tongtienSP += item.TONGGIA; 
            }) 
            setTongSoTien(tongtienSP + phivanchuyen)
            setIsClickedPayment(0)
        })
        
    }
    const handleGetProvince = () => {
        axios.get(URL_APIAdsress)
        .then(res => {
            console.log(res.data.results.map(item => item.province_name), 'nhkjn8');
            setDataAPIAddress({
                ...dataAPIAddress,
                province: res.data.results.filter(item => item)
            }) 
            // setShipInformation({...shipInformation, option_thanhpho: res.data[0].name})
        })
    }
    const handleGetDistrict = async (ID_Province) => {
        console.log(ID_Province, 'ạcbnj23')
        axios.get(`${URL_APIAdsress}/district/${(ID_Province)}`)
        .then(res => {
            console.log(res.data.results, 'sdksk');
            setDataAPIAddress({
                ...dataAPIAddress,
                districts: res.data.results
            }) 
        })
    }
    const handleGetCommune = (ID_District) => {
        axios.get(`${URL_APIAdsress}/ward/${ID_District}`)
        .then(res => {
            console.log(res.data.results, 'kák');
            setDataAPIAddress({
                ...dataAPIAddress,
                commune: res.data.results
            })
            // setShipInformation({...shipInformation, option_quan: res.data.wards[0].name})

        })
    } 

    const handleClickAddNewAddress = () => {
        //cái này dùng để xem là có cần lưu thông tin từ những ô nhập thông tin giao hàng không, nếu rỗng thì không
        setMattghOldAddress('');
        setShipInformation({
            name_ship: '',
            numberPhone_ship: '',
            address_ship: '',   
            option_thanhpho: '', 
            option_quan: '',
            option_phuong: '',
        })
    }

    // xử lý khi chọn phương thức thanh toán là tiền măt hay chuyển khoản
    const handleChooseMethodPayment = (e) => {  
        setPhuongThucThanhToan(e.target.value); 
    }

    infoForPayment.infoProduct.forEach(item => {
        tongtienSP += item.TONGGIA; 
    }) 
    useEffect(() => {
        const found = dataAPIAddress.province.find((item, index) => item.province_name === shipInformation.option_thanhpho)
        if(found){
            handleGetDistrict(found.province_id) 
        }
        console.log('đây là district')
        
    }, [shipInformation.option_thanhpho])
    useEffect(() => {
        const found = dataAPIAddress.districts.find((item, index) => item.district_name === shipInformation.option_quan) 
        if(found){
            handleGetCommune(found.district_id) 
        }
    }, [shipInformation.option_quan])
    
    const renderProvince = dataAPIAddress.province.map((item, index) =>  
        <option 
            value={item.province_name} 
            key={index}  
        >{item.province_name}</option>  
    )
    const renderDistrict = dataAPIAddress.districts.map((item, index) => 
        <option 
            value={item.district_name} 
            key={index}  
        >{item.district_name}</option> 
    )
    const renderCommune = dataAPIAddress.commune.map((item, index) => 
        <option 
            value={item.ward_name} 
            key={index}  
        >{item.ward_name}</option> 
    )
    //in ra thông tin sản phẩm đã được chọn để thanh toán từ giỏ hàng
    const renderInfoProductOrders = infoForPayment.infoProduct.map((item, index) => {  
        return (
            <tr key={index}>
                <td class="col-2">
                    <img class="payment_product rounded mx-auto d-block" src={item.imgURL} alt=""/>
                </td>
                <td class="col-4">
                    <span class="fw-bold">{item.TENSP}</span>
                    <br/>
                    <span>{item.TENMAU}, {item.MASIZE}</span>
                </td>
                <td class="col-2">{formatPrice(item.GIABAN)}</td>
                <td class="col-2">{item.SOLUONG}</td>
                <td class="col-2">{formatPrice(item.TONGGIA)}</td>
            </tr>
        )
    })
    
    //hiển thị thông tin giao hàng người dùng đã nhập ở những lần mua hàng trước
    const renderInfoAdsressShip = infoForPayment.infoAdress.map((item, index) => {
        return (
            <div class="address_box_payment" key={index}>
                    <div class="address_info row text-start align-items-center">
                        <div class="col-auto text-center">
                            <input 
                                type="radio" 
                                name="address_radio" 
                                data-bs-toggle="collapse" 
                                href="#address_change" 
                                onClick={() => handleChooseAdress(index)}
                                // checked 
                            />
                        </div>
                        <div class="col-2 bold_text_info_address" id="itemmm">
                            <span>{item.TEN}</span>
                        </div>
                        <div class="col-2 bold_text_info_address">
                            <span>{item.SDT}</span>
                        </div>
                        <div class="col bold_text_info_address">
                            <span>{item.DIACHI}, {item.PHUONG_XA}, {item.QUAN_HUYEN}, {item.TINH_TP}</span>
                        </div>
                    </div>
                </div>
        );
    })

    const handleFormSubmit = (event) => {
        const form = event.currentTarget;

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        setIsInputShipInformationValidated(true);
    };
    
    //lưu thông tin thanh toán
    const handleSaveInfoForPayment = () => {
        // Kiểm tra xem có bất kỳ thông tin nào trống hay không
        setIsLoading(true)
        const phoneRegex = /^0\d{9}$/; // Biểu thức chính quy để kiểm tra định dạng số điện thoại

        if (shipInformation.numberPhone_ship !== '') {
            if (!phoneRegex.test(shipInformation.numberPhone_ship)) {
                setErrorDinhDangSDT(true);
                setIsLoading(false)
                return; // Không gửi request nếu số điện thoại không đúng định dạng
            }
        }
        const isEmpty = Object.values(shipInformation).some(value => value === '');

        // Nếu có bất kỳ thông tin nào trống, hiển thị thông báo
        if (isEmpty) {
            setIsInputShipInformationValidated(true);
            setIsLoading(false)

            alert('Vui lòng điền đầy đủ thông tin giao hàng');
        } else {
            // Thực hiện những câu lệnh khác nếu không có thành phần nào trống
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
                vouchergiam: (phivanchuyen === phivanchuyen_default || phivanchuyen === phivanchuyen_hcm) ? (typeof(discountVoucher) !== 'string'  ? tongtienSP * discountVoucher : 0 ) : phivanchuyen__truockhiapvoucher - phivanchuyen,
                tongtiendonhang: (phivanchuyen === phivanchuyen_default || phivanchuyen === phivanchuyen_hcm) ? (tongtienSP - tongtienSP * discountVoucher + phivanchuyen) : tongtienSP + phivanchuyen,
                phivanchuyen: phivanchuyen,
                hinhthucthanhtoan: phuongThucThanhToan,
                trangthaithanhtoan: 'Chưa thanh toán',
                trangthaidonhang: phuongThucThanhToan === 'Thanh toán khi nhận hàng' ? 'Chuẩn bị hàng' : 'Đang thanh toán',
                mavoucher: typeof(discountVoucher) !== 'string' ? inputvouchers : '',
                mattgh: mattghOldAddress,
                ghichu: '',
            }
        console.log(infoForOrder, '09010102')
            
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
                request.post("api/saveInfoForPayment", allDataForSaveInfoPayment)
                .then(res => {  
                    // console.log(res.data.error_soluong_SP.length, "ok");
                    setHienThiThanhToan(true);
                    // console.log(res.data.data.data);
                    if(infoForOrder.hinhthucthanhtoan != 'Thanh toán khi nhận hàng'){
                        window.location.href = res.data.data.data; 
                    }
                    else if(res.data.error_soluong_SP.length > 0){
                        const contentString = res.data.error_soluong_SP.join('\n');

                        setIsLoading(false)
                        setContentPopup({
                            title: 'Số lượng sản phẩm còn lại không đáp ứng đủ',
                            content: contentString
                        })
                        openPopup(); 
                        setIsError_soluong_SP(true)
                    }
                    else{
                        if(infoForOrder.hinhthucthanhtoan != 'Thanh toán khi nhận hàng') window.location.href = res.data.data.data;
                        setIsLoading(false)
                        setContentPopup({
                            title: 'Đơn hàng đã được tạo thành công',
                            content: 'Chuyển đến trang quản lý đơn hàng trong 3s'
                        })
                        openPopup();   
                        setTimeout(() => {
                            window.location.href = `/myorder`;
                        }, 1500);  
                        setTimeout(() => {
                            window.location.reload()
                        }, 2001); 
                    }
                }) 
                .catch(error => {
                    console.log(error);
                })
        }
    }

    useEffect(()=> {
        handleGetInfoForPayment(); 
        handleGetProvince();
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

    const renderLoading = () => {
        return (
            <div class={`donut multi ${isLoading ? '' : 'display_hidden'}`}></div> 
        )
    }

    return (
        
        // <form className={`needs-validation ${isInputShipInformationValidated ? 'was-validated' : ''}`} noValidate >
        <div>
            <div className="popup-overlay">
                <div className="popup-container">
                    <div className="popup-card">
                    <h2>{contentPopup.title}</h2>
                    <p>{contentPopup.content}</p>
                    <button 
                        id="close-popup" 
                        onClick={closePopup}
                        className={` ${iserror_soluong_SP ? '' : 'display_hidden)'}`}
                    >Close</button>
                    </div>
                </div>
            </div>
            <div className={`body_box container col-lg-7 needs-validation ${isInputShipInformationValidated ? 'was-validated' : ''} ${hienThiThanhToan ? '' : ''}`} >
                
                <div class={` address_box_payment `} >
                    <div class="address_title row">
                        <div>
                            <FontAwesomeIcon class="fa-location-dot" icon={faLocationDot}></FontAwesomeIcon>
                            <span>Thông tin giao hàng đã đặt hàng những lần trước</span>
                        </div>
                        <div>
                            <a class="link-dark" data-bs-toggle="collapse" href="#address_change">
                                <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="address_change collapse" id="address_change">
                    <div class="address_box_container"> 
                        <div class="address_box_payment">
                            <div class="row text-center">
                                <div class="col-auto">
                                    <span>&nbsp;</span>
                                </div>
                                <div class="col-2 bold_title_address">
                                    <div>
                                        <span className="bold_title_address_info">Tên người nhận</span>
                                    </div>
                                </div>
                                <div class="col-2 bold_title_address">
                                    <div>
                                        <span className="bold_title_address_info">SĐT</span>
                                    </div>
                                </div>
                                <div class="col bold_title_address">
                                    <div>
                                        <span className="bold_title_address_info">Địa chỉ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ở đây có chèn nội dung phần render  */}
                        {renderInfoAdsressShip}
                        {/* ở đây có xử lý onlcick addnewaddress khi thêm địa chỉ mới  */}
                        <button 
                            type="button" 
                            className="address_add_button_payment link-dark"  
                            data-bs-toggle="collapse" 
                            href="#address_change"  
                            onClick={handleClickAddNewAddress}
                        >+ Thêm địa chỉ mới</button>
                    </div>
                </div>
                <div class="address_update" id="address_update">
                    <div class="row mb-2">
                        <div class="col-6">
                            <label for="#" class="form-label">Tên người nhận hàng</label>
                            {/* xử lý nhập thông tin */}
                            <input 
                                type="text" 
                                class="width_input_payment form-control " 
                                value={shipInformation.name_ship} 
                                onChange={handleInputShipInformation} 
                                name="name_ship"
                                required
                            />
                        </div>
                        <div class="col-6">
                            <label for="#" class="form-label">SDT người nhận hàng</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                value={shipInformation.numberPhone_ship} 
                                onChange={handleInputShipInformation} 
                                name="numberPhone_ship"
                                required
                            />
                        </div>
                    </div>
                    <div class="row mb-2">
                        <span className={`${errorDinhDangSDT ? "" : "display_hidden"} saidinhdang_mau_do`}>Sai định dạng SĐT</span>
                    </div>
                    <div class="row mb-3">
                        <div class="col-4">
                            <label for="#" class="form-label">Tỉnh/Thành phố</label>
                            {/* xử lý chọn thông tin */}
                            <select class="form-select phuongThucThanhToan_dropDown" required 
                                value={shipInformation.option_thanhpho}
                                onChange={handleInputShipInformation}
                                name="option_thanhpho"
                            >
                                <option selected value="">-- Chọn tỉnh/thành phố --</option>  
                                {renderProvince} 
                            </select>
                        </div>
                        <div class="col-4">
                            <label for="#" class="form-label">Quận/Huyện</label>
                            <select class="form-select phuongThucThanhToan_dropDown" required
                                value={shipInformation.option_quan}
                                onChange={handleInputShipInformation}
                                name="option_quan"
                            >
                                <option selected value="">-- Chọn quận/huyện --</option>   
                                {renderDistrict}
                                {/* <option selected value="Quận 1">Quận 1</option>  */}
                            </select>
                        </div>
                        <div class="col-4">
                            <label for="#" class="form-label">Phường/Xã</label>
                            <select class="form-select phuongThucThanhToan_dropDown" required
                                value={shipInformation.option_phuong}
                                onChange={handleInputShipInformation}
                                name="option_phuong"
                            >
                                <option selected value="">-- Chọn phường/xã --</option>   
                                {renderCommune} 
                            </select>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-12">
                            <label for="#" class="form-label">Địa chỉ chi tiết</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                value={shipInformation.address_ship} 
                                onChange={handleInputShipInformation} 
                                name="address_ship"
                                required
                            />
                        </div>
                    </div>
                    {/* <div class="address_update_button_contain row">
                        <div>
                            <button class="address_confirm_button btn btn-dark">Xác nhận</button>
                            <button class="address_cancel_button btn btn-outline-secondary">Hủy</button>
                        </div>
                        
                    </div> */}
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
                <div class="row justify-content-end justify-content-end-voucher">
                        <div class="vertical_align_center col-3">
                            <span>Mã Voucher:</span>
                        </div>
                        <div class="col-4">
                            <input 
                                type="text" 
                                class="form-control" 
                                value={inputvouchers} 
                                onChange={handleInputVoucher}
                                disabled={typeof(discountVoucher) !== 'string'}
                            />
                        </div>
                        <div class="vertical_align_center col-2">
                            {/* áp dụng voucher */}
                            <button 
                                class=""
                                onClick={handleApplyVoucher} 
                                className={
                                    `
                                        btn-ApplyVoucher
                                        ${
                                            
                                            (typeof(discountVoucher) !== 'string' || (phivanchuyen !== phivanchuyen_default && phivanchuyen !== phivanchuyen_hcm))
                                            ? 'display_hidden'
                                            : ''
                                        }
                                    `
                                }
                            >Áp dụng</button>
                            <FontAwesomeIcon 
                                icon={faCheckCircle}
                                className={
                                    `   iconCheckApplyVoucherSuccess
                                        ${
                                            (typeof(discountVoucher) !== 'string' || (phivanchuyen !== phivanchuyen_default && phivanchuyen !== phivanchuyen_hcm))
                                            ? ''
                                            : 'display_hidden'
                                        }
                                    `
                                }
                            ></FontAwesomeIcon>
                        </div>
                    </div>
                    <div class="row justify-content-end">
                        <div class="vertical_align_center col-3">
                            <span>Số tiền Voucher giảm:</span>
                        </div>
                        <div class="col-4"></div>
                        <div class="col-2 text-start">
                            <span class="discount_price">
                                { 
                                    typeof(discountVoucher) === 'string' && discountVoucher !== '0'
                                    ? discountVoucher 
                                    : `-${ (phivanchuyen === phivanchuyen_default || phivanchuyen === phivanchuyen_hcm) ? formatPrice(parseInt(discountVoucher * tongtienSP)) : formatPrice(parseInt(phivanchuyen__truockhiapvoucher - phivanchuyen))} đ`
                                } 
                            </span>
                        </div>
                    </div>
                    <div class="row justify-content-end">
                        <div class="vertical_align_center  col-3">
                            <span>Tổng tiền sản phẩm:</span>
                        </div>
                        <div class="col-4"></div>
                        <div class="col-2 text-start">
                            <span class="discount_price">{formatPrice(tongtienSP)} đ</span>
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
                        <div class="vertical_align_center col-2 text-start">
                            <span>{formatPrice(phivanchuyen)} đ</span>
                        </div>
                    </div>
                    <div class="row justify-content-end">
                        <div class="vertical_align_center col-3">
                            <span>Phương thức thanh toán</span>
                        </div>
                        <div class="col-4">
                            <select class="form-select phuongThucThanhToan_dropDown" required
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
                        <div class="col-2 text-start">
                            <span class="discount_price fs-4 fw-bold">
                        {/* {tongtienSP + phivanchuyen - parseInt(discountVoucher)} */}
                        {tongSoTien === '' ? '' : formatPrice(parseInt(tongSoTien))}
                         đ
                    </span>
                        </div>
                    </div>
                    <div class="payment_confirm justify-content-end">
                        <button 
                            class= {`button_confirm float-end ${isLoading ? '' : ''}`}  
                            onClick={handleSaveInfoForPayment}
                        >
                            {renderLoading()}
                            <span class = {`${isLoading ? 'display_hidden' : ''}`}  >Thanh toán</span>
                        </button>

                    </div>  
                </div> 
            </div> 
        </div>
    );
}

export default Payment;