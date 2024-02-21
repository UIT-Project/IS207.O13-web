import images from "../../../assets/images"; 
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'; 
import request from "../../../utils/request";
import { useEffect, useState } from "react";
import { Button } from "bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
// import useGlobalVariableContext from "../../context_global_variable/context_global_variable";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";

function SearchProduct(){ 

    // trang này hiển thị thông tin sản phẩm tìm kiếm được khi search ở thanh tìm kiếm trong header
    // sau đó sử dụng các bộ lọc để lọc sản phẩm
    // sau khi đọc các trang trước thì trang này mọi người có thể soi code để hiểu
    const {formatPrice} = useGlobalVariableContext(); 

    useEffect(() => {
        document.title = "DosiIn | Tìm kiếm"
     }, []);

    const { resultQuery, setResultQuery, textQuery, setTextQuery} = useGlobalVariableContext();

    const [filter, setFilter] = useState('');
    const [listFilter, setListFilter] = useState(['moinhat', 'banchay', 'thapDenCao', 'caoDenThap'])

    const handleClickFilter = (type) => {
        setFilter(type);
        console.log(type);
        const dataForFilterSearch = {
            filter: type,
            textQuery: textQuery, 
            giatri: 1,
        }
        console.log(dataForFilterSearch);
        request.get(`/api/filterSearchProduct`, {params: dataForFilterSearch} )
        .then(res => { 
            console.log(res, 'lk11');
            setResultQuery(res.data.data_product);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {  
    }, []);  
    
    const product = () => {
        if(Array.isArray(resultQuery)){
            return(
                resultQuery.map((product) => {
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
                                            <span class="product_item__summary__sale_price space_item_in_a_row">{formatPrice(product.GIABAN)}₫
                                            </span>
                                            <span class="product_item__summary__origin_price space_item_in_a_row">
                                                <del>{formatPrice(product.GIAGOC)}₫</del>
                                            </span>
                                        </div> 
                                        <div>
                                            {/* <button  onClick={() => addProductToCart(product) } className="product_item__summary__heart">
                                                <FontAwesomeIcon icon={faHeart} ></FontAwesomeIcon>
                                            </button>  */}
                                        </div>
                                    </div>
                                </div>
                                <div class="grid__column_10__product_thumbail__yeuthich">
                                    <i class="fa-solid fa-check grid__column_10__product_thumbail__yeuthich__check_icon"></i>
                                    <span class="grid__column_10__product_thumbail__text_yeuthich">{formatPrice(parseInt(100 - (product.GIABAN / product.GIAGOC * 100)))}%</span> 
                                </div> 
                            </div> 
                        </a>
                    </div>
                    )
                })
            )
        }
    }

    
     
    return ( 
        <div class="container"> 
            {/* <!-- show_product hiển thị phần "SẢN PHẨM MỚI"--> */}
            <div class="show_product__title_div">
                <h1 class="show_product__title">Sản phẩm tìm thấy</h1> 
            </div>
            <div className="row">
                <div class="grid__column_10__filter">
                    <div class="grid__column_10__filter__div_title">
                        <span class="grid__column_10__filter__text_title">Sắp xếp theo</span>
                    </div>
                    <div class="grid__column_10__filter__div_result_filter_select">
                        {/* <button class="grid__column_10__filter__result_filter_button grid__column_10__filter__result_filter_button--active">Phổ Biến</button> */}
                        <button 
                            className={
                                `
                                    grid__column_10__filter__result_filter_button 
                                    ${filter === listFilter[0]  ? "grid__column_10__filter__result_filter_button--active" : ""}   
                                `
                            }
                            onClick={() => handleClickFilter(`${listFilter[0]}`)}
                        >Mới Nhất</button>
                        <button 
                            class={
                                `
                                    grid__column_10__filter__result_filter_button
                                    ${filter === listFilter[1]  ? "grid__column_10__filter__result_filter_button--active" : ""}   
                                `
                            }
                            onClick={() => handleClickFilter(`${listFilter[1]}`)}
                        >Bán chạy</button>
                        <div class="grid__column_10__filter__div_result_filter_select__sort_price">
                            <span class="grid__column_10__filter__div_result_filter_select__text_sort_price">Giá
                                <div class="grid__column_10__filter__div_result_filter_select__select_text_sort_price">
                                    <div className={`${filter === listFilter[2]  ? "grid__column_10__filter__result_filter_button--active" : ""}`}>
                                        <span 
                                            class={
                                                `
                                                    header__body__search_and_recommend__search__selection_scope__in 
                                                    header__body__search_and_recommend__search__selection_scope__in_shop
                                                    // ${filter === listFilter[2]  ? "grid__column_10__filter__result_filter_button--active" : ""}   
                                                `
                                            }
                                            onClick={() => handleClickFilter(`${listFilter[2]}`)}
                                        >Thấp Đến Cao
                                            {/* <FontAwesomeIcon icon={faCheck} className="header__body__search_and_recommend__search__selection_scope__icon_in"></FontAwesomeIcon> */}
                                        </span>
                                    </div>
                                    <div className={`${filter === listFilter[3]  ? "grid__column_10__filter__result_filter_button--active" : ""}`}>
                                        <span 
                                            class={
                                                `
                                                    header__body__search_and_recommend__search__selection_scope__in 
                                                    header__body__search_and_recommend__search__selection_scope__in_shop
                                                    ${filter === listFilter[3]  ? "grid__column_10__filter__result_filter_button--active" : ""}   
                                                `
                                            }
                                            onClick={() => handleClickFilter(`${listFilter[3]}`)}
                                        >Cao Đến Thấp</span> 
                                    </div>
                                </div>
                            </span> 
                            <svg enable-background="new 0 0 11 11" viewBox="0 0 11 11" x="0" y="0" class="header__body__search_and_recommend__search__icon_scope">
                                <g><path d="m11 2.5c0 .1 0 .2-.1.3l-5 6c-.1.1-.3.2-.4.2s-.3-.1-.4-.2l-5-6c-.2-.2-.1-.5.1-.7s.5-.1.7.1l4.6 5.5 4.6-5.5c.2-.2.5-.2.7-.1.1.1.2.3.2.4z"></path></g>
                            </svg>                                        
                        </div>
                        {/* <!-- <div class="grid__column_10__filter__result_filter_select_price">
                            <span class="grid__column_10__filter__result_filter_select_price_text">Giá</span>
                        </div> --> */}
                    </div>
                    {/* <div class="grid__column_10__filter__select_display_page">
                        <div class="grid__column_10__filter__select_display_page__present_and_max_page_number">
                            <span class="grid__column_10__filter__select_display_page__present_page_number">1</span>
                            /
                            <span class="grid__column_10__filter__select_display_page__max_page_number">6</span>
                        </div>
                        <div class="grid__column_10__filter__select_display_page__button_div">
                            <button class="grid__column_10__filter__select_display_page__button">
                                <svg viewBox="0 0 7 11" class="grid__column_10__filter__select_display_page__button_icon">
                                    <path
                                        d="M4.694078 9.8185598L.2870824 5.4331785c-.1957415-.1947815-.1965198-.511363-.0017382-.7071046a.50867033.50867033 0 0 1 .000868-.0008702L4.7381375.2732784 4.73885.273991c.1411545-.127878.3284279-.205779.5338961-.205779.4393237 0 .7954659.3561422.7954659.7954659 0 .2054682-.077901.3927416-.205779.5338961l.0006632.0006632-.0226101.0226101a.80174653.80174653 0 0 1-.0105706.0105706L2.4680138 4.7933195c-.1562097.1562097-.1562097.4094757 0 .5656855a.45579485.45579485 0 0 0 .0006962.0006944l3.3930018 3.3763607-.0009482.0009529c.128869.1413647.2074484.3293723.2074484.5357331 0 .4393237-.3561422.7954659-.7954659.7954659-.2049545 0-.391805-.077512-.5328365-.2048207l-.0003877.0003896-.0097205-.0096728a.80042023.80042023 0 0 1-.0357234-.0355483z"
                                        fill-rule="nonzero"
                                    ></path>
                                </svg>                                            
                            </button>
                            <button class="grid__column_10__filter__select_display_page__button grid__column_10__filter__select_display_page__button--disable">
                                <svg viewBox="0 0 7 11" class="grid__column_10__filter__select_display_page__button_icon">
                                    <path
                                        d="M2.305922 9.81856l4.4069956-4.385381c.1957415-.194782.1965198-.511364.0017382-.707105a.26384055.26384055 0 0 0-.000868-.00087L2.2618625.273278 2.26115.273991C2.1199955.146113 1.9327221.068212 1.7272539.068212c-.4393237 0-.7954659.356142-.7954659.795466 0 .205468.077901.392741.205779.533896l-.0006632.000663.0226101.02261c.0034906.003557.0070143.00708.0105706.010571L4.5319862 4.79332c.1562097.156209.1562097.409475 0 .565685-.0002318.000232-.0004639.000463-.0006962.000694L1.1382882 8.73606l.0009482.000953c-.128869.141365-.2074484.329372-.2074484.535733 0 .439324.3561422.795466.7954659.795466.2049545 0 .391805-.077512.5328365-.204821l.0003877.00039.0097205-.009673c.012278-.011471.0241922-.023327.0357234-.035548z"
                                        fill-rule="nonzero"
                                    ></path>
                                </svg>                                            
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>
                
            <div class="show_product">
                {/* <!-- product_item_container__out khối bọc ngoài cho tất cả sản phẩm để dễ padding, margin --> */}
                <div class="product_item_container__out">
                    {/* <!-- product_item_container__in khối bọc trong cho tất cả sản phẩm --> */}
                    <div class="product_item_container__in">
                        {/* <!-- product_item_div__out hiển thị thông tin từng sản phẩm --> */} 
                        {product()} 
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default SearchProduct;