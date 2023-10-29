import { useEffect, useRef, useState } from "react";
import images from "../../assets/images";
import './infoProduct.css';
import "bootstrap"
import { useParams } from "react-router-dom";
import request from "../../utils/request";
import useGlobalVariableContext from "../../context_global_variable/context_global_variable";

function InfoProduct(){

    // let { id } = useParams(); 
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); 
    const {divPopupCartRef} = useGlobalVariableContext(); 
    const buttonAddToCartRef = useRef(null);

    const {setStatusPressAddToCart, statusPressAddToCart} = useGlobalVariableContext();
    const [selectPropertyProduct, setSelectPropertyProduct] = useState({
        mamau: '',
        masize: '',
        soluong: 1,
    })
    const [infoProduct, setInfoProduct] = useState({
        data_sanpham: [],
        data_mausac: [],
        data_mamau: [],
        data_size: []
    });
    var dataAddProductToCart = ({
        matk: '',
        masp: '',
        mamau: '',
        masize: '',
        soluongsp: 1,
        tonggia: 1, 
    });
 
    const handleInputPropertyProduct = (e) => {
        setSelectPropertyProduct({...selectPropertyProduct, [e.target.name] : e.target.value});
    }
 
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
        
        console.log(selectPropertyProduct.mamau, "   ", selectPropertyProduct.masize, "   ", selectPropertyProduct.soluong)

        dataAddProductToCart = { 
            matk: localStorage.getItem("auth_matk"),
            masp: id,
            mamau:  selectPropertyProduct.mamau,
            masize: selectPropertyProduct.masize,
            soluongsp: selectPropertyProduct.soluong,
            tonggia: selectPropertyProduct.soluong * infoProduct.data_sanpham.GIABAN,
        }

        console.log(dataAddProductToCart.mamau, "   ", dataAddProductToCart.masize, "   ", dataAddProductToCart.soluongsp)


        try{
            request.post("/api/addToCart", dataAddProductToCart)
            .then(res => {  
                setStatusPressAddToCart(statusPressAddToCart => !statusPressAddToCart);
            })
        }
        catch(err){ 
            console.log(err);
        }
         
        setTimeout(() => {
            setStatusPressAddToCart(false);
        }, 3000); // Thay đổi giá trị thời gian theo nhu cầu của bạn 
    }
    

    useEffect(() => {
        getInfo();
        
        

        const handleClickOutPopUpCart = (event) => {
            if(!buttonAddToCartRef.current.contains(event.target)){
                setStatusPressAddToCart(false); 
            }
        }

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
            <div class="container_info_product"> 
                <div class="product_image col-sm-7">
                    <div class="product_image__list_mini_image">
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
                            <span>đánh giá số sao</span>
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
                            <input type="text" onChange={handleInputPropertyProduct} value={selectPropertyProduct.soluong} min={1} name="soluong" class="detail_info_product__quantity__input_text"/>
                            <input type="button" value="+" class="detail_info_product__quantity__adjust"/>
                        </div>
                    </div>
                    <div ref={buttonAddToCartRef} class="detail_info_product__thanhtoan detail_info_product__price__css_chung">
                        <button  class="detail_info_product__thanhtoan__button" onClick={handleAddToCart}>
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default InfoProduct;