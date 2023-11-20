import { useEffect, useRef, useState } from "react";
import images from "../../assets/images";
import './infoProduct2.css';
import "bootstrap"
import { useParams } from "react-router-dom";
import request from "../../utils/request";
import useGlobalVariableContext from "../../context_global_variable/context_global_variable";

function InfoProduct(){

    //dùng để lấy thông tin từ thanh địa chỉ (URL), cái này sẽ còn được ứng dụng để lấy thông tin thanh toán mà ngân hàng trả về
    //sau khi thanh toán thành công
    const urlParams = new URLSearchParams(window.location.search);
    //ví dụ http://localhost:3000/infoProduct?id=1 thì mình sẽ lấy được biến id có giá trị là 1
    //các biến cách nhau bởi dấu ?
    const id = urlParams.get('id'); 

    //biến global
    const {divPopupCartRef, infoCarts, setInfoCarts, setStatusPressAddToCart, statusPressAddToCart} = useGlobalVariableContext(); 

    //
    const buttonAddToCartRef = useRef(null);  

    //tạo biến selectPropertyProduct để lưu thông tin sản phẩm thêm và giỏ hàng
    const [selectPropertyProduct, setSelectPropertyProduct] = useState({
        mamau: '',
        masize: '',
        soluong: 1,
    })  

    // khi load vào trang thông tin sản phẩm thì sẽ dùng infoProduct để lưu dữ liệu từ server gửi lên để hiển thị tt sản phẩm
    const [infoProduct, setInfoProduct] = useState({
        data_sanpham: [],
        data_mausac: [],
        data_mamau: [],
        data_size: []
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
 
    //sử dụng ctrl + f để tìm hàm này thì sẽ thấy nó nằm trong onchange của thẻ input radio chọn màu và size
    //trong thẻ input chú ý đến name và value, giá trị name phải trùng với key trong setSelectPropertyProduct và sẽ nhận được giá trị từ e.target.value
    //setSelectPropertyProduct({...selectPropertyProduct, [e.target.name] : e.target.value}); : đoạn code này là chèn thêm dữ liệu mới và dữ nguyên dữ liệu cũ
    //có thể chatgpt để hiểu thêm về cách viết này, đây là cú pháp trong es6 của js
    const handleInputPropertyProduct = (e) => {
        setSelectPropertyProduct({...selectPropertyProduct, [e.target.name] : e.target.value});
    }
 
    //thực hiện lấy thông tin sản phẩm khi load vào trang với id tương ứng
    const getInfo = () => {  
        request.get(`/api/infoProduct?id=${id}`)
        .then(res => { 
            setInfoProduct({
                data_sanpham: res.data.data_sanpham[0],
                data_mausac: res.data.data_mausac,
                data_mamau: res.data.data_mamau,
                data_size: res.data.data_size,
            });  
        })
        .catch(e => {
            console.log(e);
        })
    }

    // xử lý khi hết hàng vẫn cố chấp thêm 
    const handleAddToCart =  (e) => {
        e.preventDefault(); 
        dataAddProductToCart = { 
            matk: localStorage.getItem("auth_matk"),
            masp: id,
            mamau:  selectPropertyProduct.mamau,
            masize: selectPropertyProduct.masize,
            soluongsp: selectPropertyProduct.soluong,
            tonggia: selectPropertyProduct.soluong * infoProduct.data_sanpham.GIABAN,
        }
        
        let found = false;

        infoCarts.map(item => {
            console.log(item.MASP, 'ok');
            console.log(item.MATK, dataAddProductToCart.matk)
            if(item.MASP === parseInt(dataAddProductToCart.masp) && item.MATK === parseInt(dataAddProductToCart.matk)
                && item.MAMAU === parseInt(dataAddProductToCart.mamau) && item.MASIZE === dataAddProductToCart.masize){
                    try{
                        request.post("/api/updateQuantityProductInCart", dataAddProductToCart)
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
    
    //phần code trong này sẽ liên quan đến việc ẩn và hiện popup cart
    useEffect(() => {
        getInfo(); 

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
    
    return ( 
        <div class="container col-sm-12 ">
            <div class="container-fluid">
                <div class="container_info_product"> 
                    <div class="product_image col-sm-7">
                    <div class="product_image__list_mini_image" id="style-7">
                        <div class="product_image__list_mini_image__item">
                            <img src={images.mini_image__item} alt="" class="product_image__list_mini_image__item__img"/>
                        </div> 
                        <div class="product_image__list_mini_image__item">
                            <img src={images.mini_image__item} alt="" class="product_image__list_mini_image__item__img"/>
                        </div>
                        <div class="product_image__list_mini_image__item">
                            <img src={images.mini_image__item} alt="" class="product_image__list_mini_image__item__img"/>
                        </div>
                        <div class="product_image__list_mini_image__item">
                            <img src={images.mini_image__item} alt="" class="product_image__list_mini_image__item__img"/>
                        </div>
                        <div class="product_image__list_mini_image__item">
                            <img src={images.mini_image__item} alt="" class="product_image__list_mini_image__item__img"/>
                        </div>
                    </div>
                    <div class="product_image__main_image">
                        <img src={images.mini_image__item} alt="" class="product_image__main_image__img"/>
                    </div>
                    </div>
                    <div class="detail_info_product col-sm-5">
                        <div class="detail_info_product__title">
                            <h4>{infoProduct.data_sanpham.TENSP}</h4>
                        </div>
                        <div class="detail_info_product__price detail_info_product__price__css_chung">
                            <div class="detail_info_product__price__info_price">
                                <span class="detail_info_product__price__info_price__sell">{infoProduct.data_sanpham.GIABAN}</span>
                                <span class="detail_info_product__price__info_price__origin">{infoProduct.data_sanpham.GIAGOC}</span>
                                <span class="detail_info_product__price__info_price__decrease_percent">{parseInt((infoProduct.data_sanpham.GIABAN / infoProduct.data_sanpham.GIAGOC) * 100)}%</span> 
                            </div>
                            <div class="detail_info_product__price__review_quanlity">
                                <div class="product-content-right-product-rating">
                                    <i class="fa-solid fa-star product-content-right-product-rating_sao"></i>
                                    <i class="fa-solid fa-star product-content-right-product-rating_sao"></i>
                                    <i class="fa-solid fa-star product-content-right-product-rating_sao"></i>
                                    <i class="fa-solid fa-star product-content-right-product-rating_sao"></i>
                                    <i class="fa-solid fa-star product-content-right-product-rating_sao"></i>
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
                                            <input type="radio" class="check_color" id={"color_" + index} name="mamau" onChange={handleInputPropertyProduct} value={item.MAMAU}/>
                                            <label for={"color_" + index} class="color_icon" style={{backgroundColor: item.HEX}}></label>
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
                                            <input type="radio" class="check_size" id={"size_" + index} name="masize" onChange={handleInputPropertyProduct} value={item.MASIZE}/>
                                            <label for={"size_" + index} class="size_icon" id="size_1">
                                                <span class="detail_info_product__size__item__text">{item.MASIZE}</span>
                                            </label>
                                        </div>
                                    )
                                })} 
                            </div>
                        </div>
                        <div class="detail_info_product__quantity detail_info_product__price__css_chung">
                            <div class="detail_info_product__quantity__div-small">
                                <input type="button" value="-" class="detail_info_product__quantity__adjust"/>
                                {/* onchange */}
                                <input type="text"  onChange={handleInputPropertyProduct} value={selectPropertyProduct.soluong} min={1} name="soluong"  class="detail_info_product__quantity__input_text"/>
                                <input type="button" value="+" class="detail_info_product__quantity__adjust"/>
                            </div>
                        </div>
                        <div class="detail_info_product_button " >
                            <div class="detail_info_product_button_detail " >
                                {/* quan trọng */}
                                <button id="them_hang" ref={buttonAddToCartRef} onClick={handleAddToCart}>
                                    <i class="fa-solid fa-cart-shopping detail_info_product_button_detail__icon_addToCart"></i>
                                    <p className="detail_info_product_button_detail__text_addToCart">THÊM VÀO GIỎ HÀNG</p>
                                </button>
                                <button id="mua_hang">MUA NGAY</button>
                                <button id="fav"><i class="fa-solid fa-heart"></i></button>
                            </div>
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
                        <div class="detail_info_product_tab_body">
                            <div class="detail_info_product_tab_body_gioi-thieu">
                                <p>Crepe Dress tự tin thể hiện vẻ đẹp hiện đại và phong cách nổi bật cho người mặc. 
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
                                    điều kiện ánh sáng khi chụp và màu sắc hiển thị qua màn hình máy tính/ điện thoại.</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default InfoProduct;