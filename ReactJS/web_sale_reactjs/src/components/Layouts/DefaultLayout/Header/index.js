import images from '../../../../assets/images' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faCaretDown, faCartShopping, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import Navigation from '../Header_Navigation/Navigation';
import useGlobalVariableContext from '../../../../context_global_variable/context_global_variable';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import request from '../../../../utils/request' 
 
// import * as Request from "../../utils/request";

function Header({settoggleFunctionLoginLogout}){
    
    //setLoginOrLogout:
    //- là một function global (các component từ các file khác nhau điều có thể trỏ đến function này để sử dụng) 
    //- dùng thay đổi trạng thái của biến LoginOrLogout
    //- nằm trong file toggleLoginLogout được import ở trên
    const {setLoginOrLogout, textQuery, setTextQuery, setResultQuery, statusPressAddToCart, setStatusPressAddToCart} = useGlobalVariableContext(); 

    const Navigate = useNavigate();  
    const [hasLogin, setHasLogin] = useState(false); 
    const divPopupCartRef = useGlobalVariableContext(); 

    const [infoCarts, setInfoCarts] = useState([]);
    const bodyPopupCart = useRef(null);

    const scrollToTop = () => {
        bodyPopupCart.current.scrollTop = 0;
    };    

    //useEffect
    useEffect(() => {
        request.get(`/api/infoCart`, {params: {matk : localStorage.getItem('auth_matk')}})
        .then(res => {
            setInfoCarts([...res.data.data].reverse());
             
        })
        .catch(e => {

            console.log(e);
        }) 
        scrollToTop();
    }, [statusPressAddToCart]) 
        
        
    useEffect(() => {


        if(localStorage.getItem('auth_token')){
            setHasLogin(true); 
        }
        else{
            setHasLogin(false); 
        }

        request.get(`/api/infoCart`, {params: {matk : localStorage.getItem('auth_matk')}})
        .then(res => { 
            setInfoCarts([...res.data.data].reverse());
        })
        .catch(e => {
            console.log(e);
        }) 

        
    }, [])

    //click ở component_small điều khiển tài khoản, trong trạgn thái logout
    const clickSignUp = (event) => {
        event.preventDefault();
        setLoginOrLogout("signUp");
        Navigate("/login");
    }
    const clickSignIn = (event) => {
        event.preventDefault();
        setLoginOrLogout("signIn");
        Navigate("/login");
    }

    //click ở component_small điều khiển tài khoản, trong trạgn thái login 
    const clickInfoAccount = (event) => {
        event.preventDefault();
    }
    const clickLogout = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }}
            ).then(res => {
            if(res.data.status === 200)
            {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_email');
                localStorage.removeItem('auth_matk');
                // swal("Success",res.data.message,"success"); 
                console.log(res.data.message);
            }
        });
        setHasLogin(false); 
    }


    // xử lý searchProduct
    const handleSearchProduct = (e) => {
        e.preventDefault();
        request.get(`/api/search?query=${textQuery}`)
        .then(res=>{
            setResultQuery(res.data.data); 
            console.log(res.data.data);
            Navigate(`/search?query=${textQuery}`);
        })
        .catch(e => {
            console.log(e);
        })
    }

    const renderInfoCart = infoCarts.map((item, index) => {
        return (
            <li class="header__body__cart__orders__item_body" key={index}>
            <img src={images.header_notification_img_item_1} alt="" class="header__body__cart__orders__item__image"/>
            <div class="header__body__cart__orders__item__info">
                <div>
                    <span class="header__body__cart__orders__item__info__title">{item.TENSP}</span>
                </div>
                <div> 
                    <span class="header__body__cart__orders__item__info__product_type">Màu: 
                        <span class="header__body__cart__orders__item__info__type">{item.TENMAU}</span>
                    </span>
                    <span class="header__body__cart__orders__item__info__product_type">Size: 
                        <span class="header__body__cart__orders__item__info__type">{item.MASIZE}</span>
                    </span>
                </div>
            </div>
            <div class="header__body__cart__orders__item__price_total">
                <div class="header__body__cart__orders__item_price_x_quantiry">
                    <span class="header__body__cart__orders__item__price_x_quantiry__price">{item.TONGGIA}</span>
                    <span class="header__body__cart__orders__item__price_x_quantiry__price">đ</span>
                    <div class="header__body__cart__orders__item__price_x_quantiry__x1"> 
                        <span class="header__body__cart__orders__item__price_x_quantiry__price__multiply">x</span>
                        <span class="header__body__cart__orders__item__price_x_quantiry__quantity">{item.SOLUONG}</span>
                    </div>
                </div>
                <div class="header__body__cart__orders__item__button_delete_div">
                    <span class="header__body__cart__orders__item__button_delete">Xoá</span> 
                </div>
            </div>
            </li>
        )
    }) 

    const handleXemGioHang = () => {
        Navigate("/cart");
    }
    
    return (
        <header class="header_block">
        {/* <!-- class container là một class trong bootstrap5 - ko hiểu thì gg search "container bootstap5 w3school để hiểu" --> */}
        <div class="container"> 
            {/* <!-- header_body chứa logo, search, sản phẩm yêu thích, trong giỏ hàng, đăng nhập, đăng xuất --> */}
            {/* <!-- row là một class  trong bootstrap5 - ko hiểu thì gg search "container bootstap5 w3school để hiểu"--> */}
            <div class="header_body row">
                {/* <!-- col-sm-2 là một class trong bootstrap5 - ko hiểu thì gg search "container bootstap5 w3school để hiểu" --> */}
                <div class="header_body__logo col-sm-2">
                    <img src="https://dosi-in.com/images/assets/icons/logo.svg" alt="logo dosi-in"/>
                </div>
                <div class="header_body__search col-sm-7"> 
                    <div class="header_body__search__div_css">
                        <input type="text" placeholder="Tìm kiếm sản phẩm" class="header_body__search__input" name='searchProduct' onChange={(e) => setTextQuery(e.target.value)}/> 
                        
                        <button class="header_body__search__button" onClick={handleSearchProduct}>
                            <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                        </button> 
                    </div>
                </div>
                <div class="header_body__option_and_info col-sm-3">
                    <div class="header_body__option_and_info__div_css"> 

                        <button class="header_body__option_and_info__button">
                            <FontAwesomeIcon icon={faHeart}/>
                        </button>    
                        <div className='header__body__cart'>  
                            <button class="header_body__option_and_info__button_cart">
                                <FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>
                            </button>
                            <div ref={divPopupCartRef} className={`header__body__cart__orders ${statusPressAddToCart ? 'show' : ''}`}>
                                        {/* <!-- <div class="header__body__cart__no_orders__container">
                                            <div class="header__body__cart__div_img_no_orders">
                                                <img src="./image/cart_have_not_purchase_order.png" alt="Chưa có đơn đặt hàng" class="header__body__cart__img_no_orders">
                                            </div>
                                            <p class="header__body__cart__text_no_orders">Chưa có sản phẩm</p>
                                        </div> -->

                                        <!-- Có sản phẩm --> */}
                                    <header class="header__body__cart__orders__header">
                                        <p class="header__body__cart__orders__text_header">Sản phẩm đã thêm</p>
                                    </header>   
                                        <ul class="header__body__cart__orders__body" ref={bodyPopupCart}> 
                                            {renderInfoCart}
                                        </ul>  
                                    <footer class="header__body__cart__orders__footer">
                                        <button class="header__body__cart__orders__watch_cart_button">
                                            Thanh toán
                                        </button>
                                        <button class="header__body__cart__orders__watch_cart_button" onClick={handleXemGioHang}>
                                            Xem giỏ hàng
                                        </button>
                                    </footer>
                            </div>  
                        </div>
                            
                        
                        <div class="header_body__option_and_info__user__div_css"> 
                            <button class="header_body__option_and_info__button">
                                <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                            </button>
                            <div class="header_body__option_and_info__user__text">   
                                <span class="header_body__option_and_info__user__text_taikhoan">Tài khoản</span>
                                <span class="header_body__option_and_info__user__text_xinchao">Xin chào!</span> 
                            </div>  
                            <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>   
                            <div class="header_body__option_and_info__user__select_login_or_logout">
                                <button class="header_body__option_and_info__user__select_login_or_logout__in" onClick={(hasLogin) ? clickInfoAccount : clickSignIn}>{(hasLogin) ? "Thông tin tài khoản" : "Đăng nhập" }</button>
                                <button class="header_body__option_and_info__user__select_login_or_logout__in" onClick={(hasLogin) ? clickLogout : clickSignUp}>{(hasLogin) ? "Đăng Xuất" : "Đăng ký" }</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
            {/* <!-- header_navigation điều hướng đến các danh mục: thời trang nam, nữ, trẻ em --> */}
            <Navigation/>
            {/* <div class="header_navigation">
                <ul class="header_navigation__ul">
                    <li class="header_navigation__text">Nam</li>
                    <li class="header_navigation__text">Nữ</li>
                    <li class="header_navigation__text">Trẻ Em</li>
                </ul>
            </div>  */}
        </div>
    </header>
    )
}
export default Header;