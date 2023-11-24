import images from "../../assets/images"; 
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import { isWishReq } from "./wishLish";
import * as request from "../../utils/request";
import { useEffect, useState } from "react";
import { Button } from "bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

function Home(){

    // NHỮNG THỨ CẦN XỬ LÝ
    // 1.Lấy thông tin sản phẩm từ DB và hiển thị
    // 2.Xử dụng các hàm hỗ trợ lấy dữ liệu và dùng biến renderNewProduct để render dữ liệu ra màn hình

    // chứa thông tin sản phẩm mới
    const [productsInNewProduct, setProductsInNewProduct] = useState([]);
    // chứa thông tin sản phẩm hot
    const [hotProduct, setHotProduct] = useState([]);
    const [cart, setCart] = useState([]);
 
    // khi load trang thì useEffect sẽ gọi getInfoAtStartLoadingHome để gửi request 1 lần đến serve để lấy dữ liệu 
    const getInfoAtStartLoadingHome = () => { 
        request.get('/api/getInfoAtStartLoadingHome')
        .then(res=>{ 
            setProductsInNewProduct(res.dataNewProduct); 
            setHotProduct(res.dataHotProduct);
        })
        .catch(res=>{
            console.log(res.data);
        })
    }
    useEffect(() => { 
        getInfoAtStartLoadingHome();
    }, []); 
    
    // addProductToCart không cần quan tâm, cái này định phát triển làm chức năng lưu  sản phẩm yêu thích mà chắc để sau
    const addProductToCart = (product) => {
        const cartItem = {
            MASP: product.MASP,
            TENSP: product.TENSP,
            GIABAN: product.GIABAN,
            SOLUONG: 1,
            TONGTIEN: product.GIABAN,
        }
        const addCartItem = [...cart, cartItem];

        setCart(addCartItem);

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    //hiển thị thông tin sản phẩm mới
    const renderNewProduct = productsInNewProduct.map( (product) => {
        const url = `/infoProduct?id=${product.MASP}`;
        return (
            <div key={product.MASP} class="product_item_div__out">
                <a href={url}>
                    <div class="product_item_div__in"> 
                        <div>
                            <img src={product.imgURL} alt="sản phẩm test" width="247.5" height="250" class="product_item__img"/> 
                        </div>
                        <div class="product_item__summary">
                            <a href="#">
                                <h6 class="product_item__summary__title">{product.TENSP}</h6>
                            </a>
                            <div class="product_item__summary__price_and_heart">
                                <div class="product_item__summary__price">
                                    <span class="product_item__summary__sale_price">{product.GIABAN}₫
                                    </span>
                                    <span class="product_item__summary__origin_price">
                                        <del>{product.GIAGOC}₫</del>
                                    </span>
                                </div> 
                                <div>
                                    <button  onClick={() => addProductToCart(product) } className="product_item__summary__heart">
                                        <FontAwesomeIcon icon={faHeart} ></FontAwesomeIcon>
                                    </button> 
                                </div>
                            </div>
                        </div>
                        <div class="grid__column_10__product_thumbail__yeuthich">
                            <i class="fa-solid fa-check grid__column_10__product_thumbail__yeuthich__check_icon"></i>
                            <span class="grid__column_10__product_thumbail__text_yeuthich">NEW</span> 
                        </div> 
                    </div> 
                </a>
            </div>
        )
    })

    // //hiển thị thông tin sản phẩm hot
    const renderHotProduct = hotProduct.map( (product) => {
        const url = `/infoProduct?id=${product.MASP}`;
        return (
            <div key={product.MASP} class="product_item_div__out">
                <a href={url}>
                    <div class="product_item_div__in"> 
                        <div>
                            <img src={product.imgURL} alt="sản phẩm test" width="247.5" height="250" class="product_item__img"/> 
                        </div>
                        <div class="product_item__summary">
                            <a href="#">
                                <h6 class="product_item__summary__title">{product.TENSP}</h6>
                            </a>
                            <div class="product_item__summary__price_and_heart">
                                <div class="product_item__summary__price">
                                    <span class="product_item__summary__sale_price">{product.GIABAN}₫
                                    </span>
                                    <span class="product_item__summary__origin_price">
                                        <del>{product.GIAGOC}₫</del>
                                    </span>
                                </div> 
                                <div>
                                    <button  onClick={() => addProductToCart(product) } className="product_item__summary__heart">
                                        <FontAwesomeIcon icon={faHeart} ></FontAwesomeIcon>
                                    </button> 
                                </div>
                            </div>
                        </div>
                        <div class="grid__column_10__product_thumbail__yeuthich">
                            <i class="fa-solid fa-check grid__column_10__product_thumbail__yeuthich__check_icon"></i>
                            <span class="grid__column_10__product_thumbail__text_yeuthich">HOT</span> 
                        </div> 
                    </div> 
                </a>
            </div>
        )
    })
 
    return (         
        <div class="container left">
        {/* <!-- carousel slide là phần ảnh slide --> */}
        <div id="demo" class="carousel slide" data-bs-ride="carousel">

            {/* <!-- Indicators/dots --> */}
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#demo" data-bs-slide-to="0" class="active"></button>
                <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
            </div>
            
            {/* <!-- The slideshow/carousel --> */}
            <div class="carousel-inner carousel_img">
                <div class="carousel-item active">
                <img src={images.main_slide_la} alt="Los Angeles" class="d-block w-100 carousel_img"/>
                </div>
                <div class="carousel-item carousel_img">
                <img src={images.main_slide_chicago} alt="Chicago" class="d-block w-100 carousel_img"/>
                </div>
                <div class="carousel-item carousel_img">
                <img src={images.main_slide_ny} alt="New York" class="d-block w-100 carousel_img"/>
                </div>
            </div>
            
            {/* <!-- Left and right controls/icons --> */}
            <button class="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
            </button>
        </div>
        {/* <!-- show_product hiển thị phần "SẢN PHẨM MỚI"--> */}
        <div class="show_product">
            <div class="show_product__title_div">
                <h1 class="show_product__title">Sản phẩm mới</h1> 
            </div>
            {/* <!-- product_item_container__out khối bọc ngoài cho tất cả sản phẩm để dễ padding, margin --> */}
            <div class="product_item_container__out">
                {/* <!-- product_item_container__in khối bọc trong cho tất cả sản phẩm --> */}
                <div class="product_item_container__in">
                    {/* <!-- product_item_div__out hiển thị thông tin từng sản phẩm --> */} 
                    {renderNewProduct} 
                </div>
            </div>
        </div>
        <div class="show_product">
            <div class="show_product__title_div">
                <h1 class="show_product__title">Sản phẩm HOT</h1> 
            </div>
            {/* <!-- product_item_container__out khối bọc ngoài cho tất cả sản phẩm để dễ padding, margin --> */}
            <div class="product_item_container__out">
                {/* <!-- product_item_container__in khối bọc trong cho tất cả sản phẩm --> */}
                <div class="product_item_container__in">
                    {/* <!-- product_item_div__out hiển thị thông tin từng sản phẩm --> */} 
                    {renderHotProduct}
                </div>
            </div>
        </div>
        {/* <!-- Hiển thị "TOP DANH MỤC" --> */}
        <div class="top_category">
            <div class="show_product__title_div">
                <h1 class="show_product__title">Top Danh Mục</h1>
            </div>
            <div class="top_category__container__out">
                <div class="top_category__container__in">
                    <div class="top_category__item">
                        <i class="fa-solid fa-shirt top_category__item__icon"></i>
                        <div class="top_category__item_text">
                            <p class="top_category__item_text__top">Áo khoác</p>
                            <p class="top_category__item_text__bottom">100 sản phẩm</p>
                        </div>
                        <i class="fa-solid fa-caret-right top_category__item__icon"></i>
                    </div>
                    <div class="top_category__item">
                        <i class="fa-solid fa-shirt top_category__item__icon"></i>
                        <div class="top_category__item_text">
                            <p class="top_category__item_text__top">Áo khoác</p>
                            <p class="top_category__item_text__bottom">100 sản phẩm</p>
                        </div>
                        <i class="fa-solid fa-caret-right top_category__item__icon"></i>
                    </div>
                    <div class="top_category__item">
                        <i class="fa-solid fa-shirt top_category__item__icon"></i>
                        <div class="top_category__item_text">
                            <p class="top_category__item_text__top">Áo khoác</p>
                            <p class="top_category__item_text__bottom">100 sản phẩm</p>
                        </div>
                        <i class="fa-solid fa-caret-right top_category__item__icon"></i>
                    </div>
                    <div class="top_category__item">
                        <i class="fa-solid fa-shirt top_category__item__icon"></i>
                        <div class="top_category__item_text">
                            <p class="top_category__item_text__top">Áo khoác</p>
                            <p class="top_category__item_text__bottom">100 sản phẩm</p>
                        </div>
                        <i class="fa-solid fa-caret-right top_category__item__icon"></i>
                    </div>
                    <div class="top_category__item">
                        <i class="fa-solid fa-shirt top_category__item__icon"></i>
                        <div class="top_category__item_text">
                            <p class="top_category__item_text__top">Áo khoác</p>
                            <p class="top_category__item_text__bottom">100 sản phẩm</p>
                        </div>
                        <i class="fa-solid fa-caret-right top_category__item__icon"></i>
                    </div>
                    <div class="top_category__item">
                        <i class="fa-solid fa-shirt top_category__item__icon"></i>
                        <div class="top_category__item_text">
                            <p class="top_category__item_text__top">Áo khoác</p>
                            <p class="top_category__item_text__bottom">100 sản phẩm</p>
                        </div>
                        <i class="fa-solid fa-caret-right top_category__item__icon"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Home;