import images from "../../assets/images"; 
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'; 
import * as request from "../../utils/request";
import { useEffect, useState } from "react";
import { Button } from "bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import useGlobalVariableContext from "../../context_global_variable/context_global_variable";


function SearchProduct(){ 
    const { resultQuery } = useGlobalVariableContext();

    useEffect(() => {  
    }, []);  
    
    const product = resultQuery.map((product) => (
        <div key={product.MASP} class="product_item_div__out">
            <div class="product_item_div__in">
                <a href="#">
                    <div>
                        <img src={images.product_1} alt="sản phẩm test" width="247.5" height="250" class="product_item__img"/> 
                    </div>
                </a>
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
                            <button  className="product_item__summary__heart">
                                <FontAwesomeIcon icon={faHeart} ></FontAwesomeIcon>
                            </button> 
                        </div>
                    </div>
                </div>
                <div class="grid__column_10__product_thumbail__yeuthich">
                    <i class="fa-solid fa-check grid__column_10__product_thumbail__yeuthich__check_icon"></i>
                    <span class="grid__column_10__product_thumbail__text_yeuthich">Hot</span> 
                </div> 
            </div>
        </div>
    ))
     
    return ( 
        <div class="container"> 
            {/* <!-- show_product hiển thị phần "SẢN PHẨM MỚI"--> */}
            <div class="show_product">
                <div class="show_product__title_div">
                    <h1 class="show_product__title">Sản phẩm tìm thấy</h1> 
                </div>
                {/* <!-- product_item_container__out khối bọc ngoài cho tất cả sản phẩm để dễ padding, margin --> */}
                <div class="product_item_container__out">
                    {/* <!-- product_item_container__in khối bọc trong cho tất cả sản phẩm --> */}
                    <div class="product_item_container__in">
                        {/* <!-- product_item_div__out hiển thị thông tin từng sản phẩm --> */} 
                        {product} 
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default SearchProduct;