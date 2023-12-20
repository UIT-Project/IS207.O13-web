import { useEffect, useRef, useState } from "react";
import images from "../../assets/images";
import './infoProduct2.css';
import "bootstrap"
import { useParams } from "react-router-dom";
import request from "../../utils/request";
import useGlobalVariableContext from "../../context_global_variable/context_global_variable";
import {Media} from "./image";

import ImageSlider from "./ImageSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faStar } from "@fortawesome/free-solid-svg-icons";
function InfoProduct(){
    // Trong file này cần xử lý
    // 1. lấy dữ liệu và hiển thị
    // 2. xử lý thêm nhấn vào thêm sản phẩm vào giỏ hàng và xử lý khi thêm sp vào giỏ trùng với sản phẩm đã có trong giỏ thì upadte số lượng
    

    //dùng để lấy thông tin từ thanh địa chỉ (URL), cái này sẽ còn được ứng dụng để lấy thông tin thanh toán mà ngân hàng trả về
    //sau khi thanh toán thành công
    const urlParams = new URLSearchParams(window.location.search);
    //ví dụ http://localhost:3000/infoProduct?id=1 thì mình sẽ lấy được biến id có giá trị là 1
    //các biến cách nhau bởi dấu ?
    const id = urlParams.get('id'); 

    //biến global
    const { divPopupCartRef, infoCarts, setInfoCarts, 
        setStatusPressAddToCart, statusPressAddToCart, formatPrice } = useGlobalVariableContext(); 
    const [hetHang, setHetHang] = useState(false);
    //
    const buttonAddToCartRef = useRef(null);  
    const [infoReviewProduct, setInfoReviewProduct] = useState([]);
    //tạo biến selectPropertyProduct để lưu thông tin sản phẩm thêm và giỏ hàng
    const [selectPropertyProduct, setSelectPropertyProduct] = useState({
        mamau: 0,
        masize: '',
        soluong: 1,
    })  

    // khi load vào trang thông tin sản phẩm thì sẽ dùng infoProduct để lưu dữ liệu từ server gửi lên để hiển thị tt sản phẩm
    const [infoProduct, setInfoProduct] = useState({
        data_sanpham: [],
        data_mausac: [],
        data_mamau: [],
        data_size: [],
        data_xacDinhSoLuong: [],
        imgURL: [],
    });

    //dataAddProductToCart là biến trung gian để lấy giá trị từ infoProduct gán vào để lưu sản phẩm vào giỏ hàng xuống DB
    var dataAddProductToCart = ({
        matk: 0,
        masp: 0,
        mamau: 0,
        masize: '',
        soluongsp: 1,
        tonggia: 1, 
    });
    const slides = [
        { url: "http://localhost:3000/hai1.jpg", type: "image" },
        { url: "http://localhost:3000/Thumbnail1.jpg", type: "image" },
        { url: "http://localhost:3000/Thumbnail2.jpg", type: "image" },
        { url: "http://localhost:3000/Thumbnail3.jpg", type: "image" },
        { url: "http://localhost:3000/Thumbnail4.jpg", type: "image" }
    ];
    const containerStyles = {
        width: "500px",
        height: "280px",
        margin: "0 auto",
    };
    //sử dụng ctrl + f để tìm hàm này thì sẽ thấy nó nằm trong onchange của thẻ input radio chọn màu và size
    //trong thẻ input chú ý đến name và value, giá trị name phải trùng với key trong setSelectPropertyProduct và sẽ nhận được giá trị từ e.target.value
    //setSelectPropertyProduct({...selectPropertyProduct, [e.target.name] : e.target.value}); : đoạn code này là chèn thêm dữ liệu mới và dữ nguyên dữ liệu cũ
    //có thể chatgpt để hiểu thêm về cách viết này, đây là cú pháp trong es6 của js
    const handleInputPropertyProduct = (e) => {
        // console.log(e.target.name, [setSelectPropertyProduct.soluong]);
        // setSelectPropertyProduct({...selectPropertyProduct, [e.target.name] : e.target.value});
        let { name, value } = e.target;
        setHetHang(false)
        if (name === 'soluong') {
            // Kiểm tra nếu value không phải là số thì không cập nhật state
            if (!/^\d*$/.test(value)) {
                return;
            }
        }
        if(name === 'mamau')
            value = parseInt(value)
        setSelectPropertyProduct({
            ...selectPropertyProduct,
            [name]: value
        });
        console.log(value)
    }
    useEffect(() => {
        console.log(selectPropertyProduct.mamau, 'aksdj')
    }, [ selectPropertyProduct.mamau])
    const handleClickButtonChangeQuantity = (e) => {
        let newQuantity = parseInt(selectPropertyProduct.soluong);
        if (e.target.value === '-' && parseInt(selectPropertyProduct.soluong) > 1) {
            newQuantity = parseInt(selectPropertyProduct.soluong) - 1;
        } 
        else if (e.target.value === '+'){
            newQuantity = parseInt(selectPropertyProduct.soluong) + 1;
        }
        // if(selectPropertyProduct.soluong - 1 >= 1)
            setSelectPropertyProduct({
                ...selectPropertyProduct, 
                soluong :  newQuantity}); 
        console.log(selectPropertyProduct.soluong, 'sjdjnsd')
    }

    //thực hiện lấy thông tin sản phẩm khi load vào trang với id tương ứng
    const getInfo = () => {  
        request.get(`/api/infoProduct?id=${id}`)
        .then(res => { 
            const sortedData = [...res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs].sort((a, b) => {
                if (a.imgURL.includes("thumnail") && !b.imgURL.includes("thumnail")) {
                  return -1; // Move a to a lower index (closer to the beginning)
                } else if (!a.imgURL.includes("thumnail") && b.imgURL.includes("thumnail")) {
                  return 1; // Move b to a lower index (closer to the beginning)
                } else {
                  return 0; // Keep the original order
                }
            });
            setInfoProduct({
                data_sanpham: res.data.data_sanpham[0],
                data_mausac: res.data.data_mausac,
                data_mamau: res.data.data_mamau,
                data_size: res.data.data_size,
                data_xacDinhSoLuong: res.data.data_xacDinhSoLuong,
                imgURL: res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs,
            });  
            console.log(res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs)
        })
        .catch(e => {
            console.log(e);
        })
    }

    const getInfoReviewProduct = () => {
        request.get(`/api/getInfoReviewProduct?masp=${id}`)
        .then(res => {
            console.log(res.data.infoReviewProduct, 'đây là info review')
            setInfoReviewProduct(res.data.infoReviewProduct);
        })
    }

    // xử lý khi hết hàng vẫn cố chấp thêm 
    const handleAddToCart =  (e) => {
        e.preventDefault(); 
        let i = 0;
        let soLuongMua = selectPropertyProduct.soluong;
        infoProduct.data_xacDinhSoLuong.forEach(item => {
            if(item.MAMAU === selectPropertyProduct.mamau && item.MASIZE === selectPropertyProduct.masize && item.SOLUONG === 0){
                setHetHang(true);
                i++;
            }
            if(item.MAMAU === selectPropertyProduct.mamau && item.MASIZE === selectPropertyProduct.masize && item.SOLUONG < soLuongMua)
                soLuongMua = item.SOLUONG
        });
        if(i === 0) {
            dataAddProductToCart = { 
                matk: localStorage.getItem("auth_matk"),
                masp: id,
                mamau:  selectPropertyProduct.mamau,
                masize: selectPropertyProduct.masize,
                soluongsp: soLuongMua,
                tonggia: soLuongMua * infoProduct.data_sanpham.GIABAN,
            }
            
            let found = false;
    
            infoCarts.map(item => {
                console.log(item.MASP, 'ok');
                console.log(item.MATK, dataAddProductToCart.matk)
                if(item.MASP === parseInt(dataAddProductToCart.masp) && item.MATK === parseInt(dataAddProductToCart.matk)
                    && item.MAMAU === parseInt(dataAddProductToCart.mamau) && item.MASIZE === dataAddProductToCart.masize){
                        try{
                            request.post(`api/updateQuantityProductInCart`, dataAddProductToCart)
                            .then(res => {  
                                setStatusPressAddToCart(statusPressAddToCart => !statusPressAddToCart);
                            })
                        }
                        catch(err){ 
                            console.log(err);
                        }
                    found = true;
                }
            })
            console.log(found)
            if(!found){ 
                try{
                    request.post("/api/addToCart", dataAddProductToCart)
                    .then(res => {  
                        setStatusPressAddToCart(statusPressAddToCart => !statusPressAddToCart);
                    })
                }
                catch(err){ 
                    console.log(err);
                }
            }
             
            setTimeout(() => {
                setStatusPressAddToCart(false);
            }, 3000); // Thay đổi giá trị thời gian theo nhu cầu của bạn 
        }
    }
    
    //phần code trong này sẽ liên quan đến việc ẩn và hiện popup cart
    useEffect(() => {
        getInfo(); 
        getInfoReviewProduct();
        //khi click ở ngoài popup thì pop sẽ ẩn đi
        const handleClickOutPopUpCart = (event) => {
            if(!buttonAddToCartRef.current.contains(event.target)){
                setStatusPressAddToCart(false); 
            }
        }
        //khi scroll thì sẽ ẩn popup
        const handleScroll = () => { 
            const scrollPosition = window.scrollY; 

            if (scrollPosition > 100) {
                setStatusPressAddToCart(false); 
            }  
        }
            
        window.addEventListener('scroll', handleScroll);
        document.addEventListener("click", handleClickOutPopUpCart);
    
        // Hủy đăng ký sự kiện khi component bị unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', handleClickOutPopUpCart);
        }; 
    } , []);
    const renderStarAtReviewProduct = (SOLUONG_SAO) => {
         
        const stars = []; 
        for (let i = 1; i <= SOLUONG_SAO; i++) {
        stars.push(
            <FontAwesomeIcon icon={faStar} class="product-content-right-product-rating_sao_review"></FontAwesomeIcon>
        );
        }
        return stars;
    }
    const renderReview = infoReviewProduct.map(item => 
        <div class="review-box-container">
            <div class="review-box">
                <div class="box-top">
                <div class="profile">
                    <div class="profile-image">
                        <img src="https://nhacchuonghinhnen.com/wp-content/uploads/2020/03/hinh-nen-gai-xinh-full-hd-cho-dien-thoai-2-scaled.jpg" alt=""/>
                    </div>
                   <div class="user">
                   <div class="user-name">
                        <strong>{item.TEN}</strong>
                        {/* <span>@mlmlml03</span> */}
                    </div>
                <div class="reviews">
                    {renderStarAtReviewProduct(item.SOLUONG_SAO)}
                </div>
                   </div>
                </div>
            </div>
            <div class="clients-comment">
                <p>{item.NOIDUNG_DANHGIA}</p>
            </div>
            </div>
        </div>
    )
    return ( 
        <div class="container col-sm-12 ">
            <div class="container-fluid">
                <div class="container_info_product"> 
                    <ImageSlider slides={infoProduct.imgURL.length > 0 ? infoProduct.imgURL : slides}/>
                    <div class="detail_info_product col-sm-5">
                        <div class="detail_info_product__title">
                            <h4>{infoProduct.data_sanpham.TENSP}</h4>
                        </div>
                        <div class="detail_info_product__price detail_info_product__price__css_chung">
                            <div class="detail_info_product__price__info_price">
                                <span class="detail_info_product__price__info_price__sell space_item_in_a_row">{infoProduct.data_sanpham.GIABAN ? formatPrice(infoProduct.data_sanpham.GIABAN) : ''}₫</span>
                                <span class="detail_info_product__price__info_price__origin space_item_in_a_row">{infoProduct.data_sanpham.GIABAN ? formatPrice(infoProduct.data_sanpham.GIAGOC) : ''}₫</span>

                                {/* <span class="detail_info_product__price__info_price__sell space_item_in_a_row">{(infoProduct.data_sanpham.GIABAN)}₫</span>
                                <span class="detail_info_product__price__info_price__origin space_item_in_a_row">{(infoProduct.data_sanpham.GIAGOC)}₫</span> */}

                                <span class="detail_info_product__price__info_price__decrease_percent space_item_in_a_row">{100 - (parseInt((infoProduct.data_sanpham.GIABAN / infoProduct.data_sanpham.GIAGOC) * 100))}%</span> 
                            </div>
                            <div class="detail_info_product__price__review_quanlity">
                                <div class="product-content-right-product-rating">
                                    <FontAwesomeIcon icon={faStar} class="product-content-right-product-rating_sao"></FontAwesomeIcon>
                                    <FontAwesomeIcon icon={faStar} class="product-content-right-product-rating_sao"></FontAwesomeIcon>
                                    <FontAwesomeIcon icon={faStar} class="product-content-right-product-rating_sao"></FontAwesomeIcon>
                                    <FontAwesomeIcon icon={faStar} class="product-content-right-product-rating_sao"></FontAwesomeIcon>
                                    <FontAwesomeIcon icon={faStar} class="product-content-right-product-rating_sao"></FontAwesomeIcon>
                                    <span>(0 danh gia)</span>
                                </div>
                            </div>
                        </div>
                        <div class="detail_info_product__color detail_info_product__price__css_chung">
                            <div class="detail_info_product__color__text">
                                Màu sắc
                            </div>
                            <div class="detail_info_product__color__choose">  
                                {infoProduct.data_mamau.map((item, index) => { 
                                    return(
                                        <div class="detail_info_product__color__item" key={index}>
                                            <input 
                                                type="radio" 
                                                class="check_color" 
                                                id={"color_" + index} 
                                                name="mamau" 
                                                onChange={handleInputPropertyProduct} 
                                                value={item.MAMAU}
                                                
                                            />
                                            <label 
                                                for={"color_" + index} 
                                                class={`color_icon ${selectPropertyProduct.mamau === item.MAMAU ? 'border_size_color' : ''}`} 
                                                style={{
                                                    backgroundColor: item.HEX,  
                                                }} 
                                            />
                                        </div> 
                                    )
                                })} 
                            </div>
                        </div>
                        <div class="detail_info_product__size detail_info_product__price__css_chung">
                            <div class="detail_info_product__size__text">
                                Kích thước
                            </div>
                            <div class="detail_info_product__size__choose">  
                                {infoProduct.data_size.map((item, index) => { 
                                    return(
                                        <div class="detail_info_product__size__item" key={index}>
                                            <input 
                                                type="radio" 
                                                class="check_size" 
                                                id={"size_" + index} 
                                                name="masize" 
                                                onChange={handleInputPropertyProduct} 
                                                value={item.MASIZE}
                                            />
                                            <label 
                                                for={"size_" + index} 
                                                class={`size_icon ${selectPropertyProduct.masize === item.MASIZE ? 'border_size_color' : ''}`} 
                                                id="size_1"
                                            >
                                                <span class="detail_info_product__size__item__text">{item.MASIZE}</span>
                                            </label>
                                        </div>
                                    )
                                })} 
                            </div>
                        </div>
                        <div class="detail_info_product__quantity detail_info_product__price__css_chung">
                            <div class="detail_info_product__quantity__div-small">
                                <input 
                                    type="button" 
                                    value="-" 
                                    class="detail_info_product__quantity__adjust"
                                    onClick={handleClickButtonChangeQuantity}
                                />
                                {/* onchange */}
                                <input type="text"  onChange={handleInputPropertyProduct} value={selectPropertyProduct.soluong} min={1} name="soluong"  class="detail_info_product__quantity__input_text"/>
                                <input 
                                    type="button" 
                                    value="+" 
                                    class="detail_info_product__quantity__adjust"
                                    onClick={handleClickButtonChangeQuantity}
                                />
                            </div>
                        </div>
                        <div class="detail_info_product_button " >
                            {
                                infoProduct.data_xacDinhSoLuong.map((item, index) => 
                                    <div 
                                        key={index} 
                                        className={`
                                            ${(
                                                selectPropertyProduct.mamau === item.MAMAU 
                                                && selectPropertyProduct.masize === item.MASIZE
                                            ) ? '' : 'display_hidden'}`}
                                    >số lượng còn lại: {item.SOLUONG}</div>
                                )
                            } 
                            <div class="detail_info_product_button_detail " >
                                {/* quan trọng */}
                                <button id="them_hang" ref={buttonAddToCartRef} onClick={handleAddToCart}>
                                    <FontAwesomeIcon icon={faCartShopping} class="detail_info_product_button_detail__icon_addToCart"></FontAwesomeIcon>
                                    <p className="detail_info_product_button_detail__text_addToCart">THÊM VÀO GIỎ</p>
                                </button>
                                {/* <button id="mua_hang">MUA NGAY</button>
                                <button id="fav"><i class="fa-solid fa-heart"></i></button> */}
                            </div>
                            <div className={`${hetHang ? '' : 'display_hidden'}`}>Hết hàng</div>
                        </div>
                        <div class="detail_info_product_tab_header">
                            <ul class="nav nav-underline">
                                <li class="nav-item">
                                <a class="nav-link active detail_info_product_tab_header__style1" aria-current="page" href="#"> Giới thiệu</a>
                                </li>
                                <li class="nav-item">
                                <a class="nav-link" href="#" >Chi tiết sản phẩm</a>
                                </li>
                                <li class="nav-item">
                                <a class="nav-link" href="#" >Hướng dẫn bảo quản</a>
                                </li>
                            </ul>
                        </div>
                        <div class="detail_info_product_tab_body ">
                            <div class="detail_info_product_tab_body_gioi-thieu ">
                                {/* <p>Crepe Dress tự tin thể hiện vẻ đẹp hiện đại và phong cách nổi bật cho người mặc. 
                                    Đầm là một lựa chọn táo bạo, sành điệu, tôn lên vẻ đẹp cơ thể nhẹ nhàng nhưng vẫn thật gợi cảm. </p>
                                <p>Thiết kế cổ chéo kết hợp tay dài giúp tổng thể trang phục trở nên độc đáo, nổi bật. 
                                    Phần thân dưới được xếp ly cách điệu một bên, thành công mang đến tính trendy, bắt mắt cho thiết kế.</p>
                                <p>Bạn có thể mix đầm với giày cao gót, bốt hoặc giày xăng đan tùy vào dịp và phong cách. 
                                    Bổ sung phụ kiện như vòng cổ, dây chuyền và túi xách để làm nổi bật trang phục.</p>
                                <p>
                                    <strong>Thông tin mẫu: </strong>
                                </p>
                                <p>
                                    <strong>Chiều cao: </strong>
                                    167cm
                                </p>
                                <p>
                                    <strong>Cân nặng: </strong>
                                    50kg
                                </p>
                                <p>
                                    <strong>Số đo 3 vòng:</strong>
                                    83-65-93 cm
                                </p>
                                <p>Mẫu mặc size M</p>
                                <p>Lưu ý: Màu sắc sản phẩm thực tế sẽ có sự chênh lệch nhỏ so với ảnh do
                                    điều kiện ánh sáng khi chụp và màu sắc hiển thị qua màn hình máy tính/ điện thoại.</p> */}
                                    <textarea value={infoProduct.data_sanpham.MOTA} className="motasanpham" cols="60" rows={40} disabled></textarea>
                                
                            </div>
                        </div>
                    </div>
                </div> 
                <section id="review">
                    <div class="review-heading">
                        <h1>Đánh giá</h1>
                    </div>
                    <div class="review-container">{renderReview}</div>
                    
                </section>
            </div>
 
        </div>
    )
}

export default InfoProduct;