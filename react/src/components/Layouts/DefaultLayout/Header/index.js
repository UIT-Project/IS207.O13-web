//images được import từ biến images trong file index.js của folder \assets
import images from '../../../../assets/images' 

//fortawesome là thư viện dùng để lấy icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faArrowRightFromBracket, faCaretDown, faCartShopping, faFileInvoiceDollar, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


//file css
import './index.css'

//thư viện bootstrap
import 'bootstrap/dist/css/bootstrap.css';

//module Navigation trong components/Layouts/DefaultLayout/Header_Navigation/Navigation
import Navigation from '../Header_Navigation/Navigation';

//useGlobalVariableContext trong context_global_variable/context_global_variable
import useGlobalVariableContext from '../../../../context_global_variable/context_global_variable';

//axios dùng để gửi request đến server, trong code này axios đã được cấu hình lại
//nên về sau đa số sẽ dùng request
//vì dùng axios mà không cấu hình lại thì tên miền sẽ lặp đi lặp lại nhiều lần và phải thêm header
//vì vậy được cấu hình lại trong request nằm trong folder utils/request
import axios from 'axios';
import request from '../../../../utils/request' 

// các hàm react hook hữu dụng, có thể lên w3school về cách dùng của  useNavigate, useNavigate, useRef, useState
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
 
// import * as Request from "../../utils/request";

function Header({settoggleFunctionLoginLogout}){
    

    //các biến ở dưới đây lấy từ file context_global_variable.js trong folder context_global_variable
    //và trao đổi, lấy giá trị của các biến thông qua default function useGlobalVariableContext()
    //các biến này có thể sử dụng ở tất cả các file

    //setLoginOrLogout: dùng thay đổi trạng thái của biến LoginOrLogout, dùng để xem có tk đăng nhập hay chưa

    //textQuery: lưu chuỗi tìm kiếm, setTextQuery dùng để lấy giá trị nhập vào từ ô input tìm kiếm set vào cho textQuery 

    //setResultQuery: Dùng để lưu trữ thông tin sản phẩm sau khi tìm kiếm

    //statusPressAddToCart: dùng để nhận biết người dùng đã nhấn thêm sản phẩm vào giỏ hàng hay chưa,trong trang thông tin 
    //sản phẩm khi người dùng nhấn button thêm sản phẩm vào giỏ hàng thì sẽ hiện popup chứa sản phẩm trong giỏ hàng và sau 3s sẽ tắt pop up
    //hoặc click chuột ngoài vùng popup thì sẽ tắt,  

    //divPopupCartRef: hỗ trợ để nhận biết xem người dùng click chuột ngoài vùng popup hay không

    //infoCarts: chứa thông tin sản phẩm đã được thêm vào giỏ hàng

    const {setLoginOrLogout, textQuery, setTextQuery, 
        setResultQuery, statusPressAddToCart, setStatusPressAddToCart, 
        divPopupCartRef, infoCarts, setInfoCarts, setIsClickedPayment, formatPrice} = useGlobalVariableContext(); 

    // dùng để chuyển hướng đến đường dẫn trong trang web
    const Navigate = useNavigate();  
    const [hasLogin, setHasLogin] = useState(false);  

    //tham chiếu đến thẻ ul của popup
    const bodyPopupCart = useRef(null);

    //khi sản phẩm được thêm, popup mở ra, nếu nhiều sản phẩm thì thanh scroll sẽ kéo lên trên cùng
    const scrollToTop = () => {
        bodyPopupCart.current.scrollTop = 0;
    };    

    //nhấn vào hình ảnh hoặc chữ của san phẩm trong popup cart thì sẽ chuyển hướng đến sản phẩm đó
    const handleClickProductPopupCart = (item) => { 
        Navigate(`/infoProduct?id=${item.MASP}`)
    }

    //useEffect thứ nhất, được dùng để khi vào một trang và cần get thông tin từ server thì phải để  hàm get thông tin 
    //trong useEffect để nó ko  gửi request lặp đi lặp lại mà không có điểm dừng
    //để trong useEffect thì chỉ load một lần
    //thứ 2, khi một biến thay đổi giá trị thì sẽ chạy khối lệnh trong useEffect
    //bởi vì useEffect dưới đây có dùng [statusPressAddToCart] nên dòng lệnh trong useEfft sẽ chạy khi statusPressAddToCart thay đổi
    //và muốn dùng trong trường hợp thứ nhất thì sẽ là [] rỗng

    useEffect(() => {

        //ở đây đang gửi một request đến server với phương thức get
        //trong laravel, vào routes sau đó vào api và tìm kiếm  infoCart sẽ thấy một route::get
        //sau đó, cũng trong laravel vào app/http/controller/testcontroller tìm function infoCart
        //sẽ thấy return dữ liệu, và dữ liệu sẽ được gửi về tham số res trong .then()
        //sau đó dùng setInfoCarts để gán thông tin sản phẩm vào biến InfoCarts
        //có thể chatgpt để hiểu đoạn code bên dưới
        request.get(`/api/infoCart`, {params: {matk : localStorage.getItem('auth_matk')}})
        .then(res => {
            setInfoCarts([...res.data.data].reverse()); 
            console.log(res)
        })
        .catch(e => {

            console.log(e);
        }) 
        scrollToTop();
    }, [statusPressAddToCart]) 
        
    //2 useEffect khá giống nhau đều là lấy giữ liệu, nhưng cái trên thì lấy dữ liệu trong popup khi trạng thái statusPressAddToCart thay đổi      
    //còn cái này thì sẽ kiểm tra xem có tài khoản đăng  nhập chưa, nếu có thì sẽ lấy thông tin trong giỏ hàng
    //của người đó ra hiển thị
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

    //click ở phía quản lý tài khoản, trong trạgn thái logout thì đăng ký đăng nhập
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

    //click ở phía quản lý tài khoản, trong trạgn thái login, đăng nhập thì logout 
    const clickInfoAccount = (event) => {
        event.preventDefault();
        Navigate("/infoAccount");

    }

    const clickMyOrder = (e) => {
        Navigate("/myorder")
    }

    // khi logout thì sẽ xoá dữ liệu được lưu trong localsorage
    const clickLogout = (event) => {
        event.preventDefault();
        // axios.post('http://localhost:8000/api/logout', {}, {
        //         headers: {
        //         'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        //         }})
        // .then(res => {
        //     if(res.data.status === 200)
        //     {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_email');
                localStorage.removeItem('auth_matk');
                // swal("Success",res.data.message,"success"); 
                // console.log(res.data.message);
                Navigate('/login')
        //     }
        // })
        // .catch(err => {
        //     console.log(err)
        // })
        setHasLogin(false); 
        
    }

    //xoá sản phẩm khỏi giỏ hàng
    const handleClickDelete = (index) => {
        
        const infoDeleteItemCart = {
            matk: parseInt(localStorage.getItem('auth_matk')),
            masp: infoCarts[index].MASP,
            mamau: infoCarts[index].MAMAU,
            masize: infoCarts[index].MASIZE,
 
        } 
        //bật f12 vào console thì sẽ hiện những thông tin này
        console.log(infoDeleteItemCart);
        request.post('/api/deleteItemCart', infoDeleteItemCart) 
        .then(res => {
            console.log(res.data.message);
        })   

        infoCarts.splice(index, 1);
        //cập nhật lại thông tin giỏ hàng sau khi xoá một phần tử 
        const listItemCarts = [...infoCarts];
        setInfoCarts(listItemCarts); 
    }


    // xử lý searchProduct
    const handleSearchProduct = (e) => {
        // e.preventDefault();
        //gửi request tìm kiểm thông tin sản phẩm tơi serve với chuỗi nhập vào là infoCarts
        request.get(`/api/search?query=${textQuery}`)
        .then(res=>{
            setResultQuery(res.data.data); 
            console.log(res.data.data, 'header');
            Navigate(`/collection?query=${textQuery}`);
        })
        .catch(e => {
            console.log(e);
        })
    }

    //có thể đọc thêm về map trong javascript hoặc chatgpt để hiểu rõ thêm
    //đoạn code dưới đây để hiển thị ra từng sản phẩm trong giỏ hàng
    const renderInfoCart = () => {
        return (
            infoCarts.map((item, index) => {
               if(infoCarts !== null){
                console.log(item, 'ok')
                   const url = `/infoProduct?id=${item.MASP}`;
                   return (
                       <li class="header__body__cart__orders__item_body" key={index}>
                           <a href={url}> 
                               <img src={item.imgURL} alt="" class="header__body__cart__orders__item__image"/>
                           </a>
                               <div class="header__body__cart__orders__item__info">
                                   <div>
                                       <a href={url}> 
                                           <span class="header__body__cart__orders__item__info__title">{item.TENSP}</span>
                                       </a>
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
                                       <span class="header__body__cart__orders__item__price_x_quantiry__price">{formatPrice(item.TONGGIA )}</span>
                                       <span class="header__body__cart__orders__item__price_x_quantiry__price">đ</span>
                                       <div class="header__body__cart__orders__item__price_x_quantiry__x1"> 
                                           <span class="header__body__cart__orders__item__price_x_quantiry__price__multiply">x</span>
                                           <span class="header__body__cart__orders__item__price_x_quantiry__quantity">{item.SOLUONG}</span>
                                       </div>
                                   </div>
                                   <div class="header__body__cart__orders__item__button_delete_div">
                                       <button class="header__body__cart__orders__item__button_delete" onClick={() => handleClickDelete(index)}>Xoá</button> 
                                   </div>
                               </div>
                       </li>
                   )
       
               }
           }) 

        )
    }

    const handleXemGioHang = () => {
        Navigate("/cart");
    }

    const handleThanhToan = () => {
        setIsClickedPayment(1)
        Navigate("/payment")
    }

    const handleClickLogo = () => {
        Navigate("/")
    }
 
    const renderTongTienTatCaSP = () => { 
        let tongTienTatCaSanPham = 0;
        infoCarts.map(item =>{
            tongTienTatCaSanPham += (item.TONGGIA)
        })
        
        return(
            <span className='tongtien_cartpopup'> {formatPrice(tongTienTatCaSanPham)} đ</span>
        ) 
    }
    // ở dưới đây là phần hiển thị thông tin giống html 
    // những sẽ có một số thẻ chứa thuộc tính là onChange, onClick để bắt sự kiện
    return (
        <header class="header_block">
        {/* <!-- class container là một class trong bootstrap5 - ko hiểu thì gg search "container bootstap5 w3school để hiểu" --> */}
        <div class="container"> 
            {/* <!-- header_body chứa logo, search, sản phẩm yêu thích, trong giỏ hàng, đăng nhập, đăng xuất --> */}
            {/* <!-- row là một class  trong bootstrap5 - ko hiểu thì gg search "container bootstap5 w3school để hiểu"--> */}
            <div class="header_body row">
                {/* <!-- col-sm-2 là một class trong bootstrap5 - ko hiểu thì gg search "container bootstap5 w3school để hiểu" --> */}
                <div class="header_body__logo col-sm-2">
                    <img src="https://dosi-in.com/images/assets/icons/logo.svg" alt="logo dosi-in" type="link" onClick={handleClickLogo}/>
                </div>
                <div class="header_body__search col-sm-7"> 
                    <div class="header_body__search__div_css">

                        {/* ở đây có onChange */}
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm sản phẩm" 
                            class="header_body__search__input" 
                            name='searchProduct' 
                            onChange={(e) => setTextQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearchProduct();
                                }
                            }}
                        /> 
                        
                        {/* ở đây có  onClick*/}
                        <button class="header_body__search__button" onClick={handleSearchProduct}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='faMagnifyingGlass_header'></FontAwesomeIcon>
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
                            {/* ref={divPopupCartRef} dùng để kiểm tra xem những phần tử click vào có nằm trong các phần tử của thẻ  div này hay không */}
                            {/*  ${statusPressAddToCart ? 'show' : ''}  nếu statusPressAddToCart == true thì sẽ thêm class show vào, có nghĩa là hiển thị popup */}
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
                                            {renderInfoCart()}
                                        </ul>  
                                        <div className='header__body__cart__orders__footer_tongtien'>
                                            Tổng tiền:  
                                            {renderTongTienTatCaSP()} 
                                        </div>
                                    <footer class="header__body__cart__orders__footer">
                                        <button class="header__body__cart__orders__watch_cart_button" onClick={handleThanhToan}>
                                            Thanh toán
                                        </button>
                                        {/* có onclick */}
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
                                <span class="header_body__option_and_info__user__text_taikhoan">
                                    Tài khoản
                                </span>
                                <span class="header_body__option_and_info__user__text_xinchao">Xin chào!</span> 
                            </div>  
                            <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>   
                            <div class="header_body__option_and_info__user__select_login_or_logout">
                                {/* có onclick */}
                                <button class="header_body__option_and_info__user__select_login_or_logout__in" onClick={(hasLogin) ? clickInfoAccount : clickSignIn}>
                                    <FontAwesomeIcon icon={faUser} className='fa_icon_header'></FontAwesomeIcon>
                                    {(hasLogin) ? "Tài khoản" : "Đăng nhập" }
                                </button>
                                <button class={`header_body__option_and_info__user__select_login_or_logout__in ${(hasLogin) ? "" : 'display_hidden' }`} onClick={(hasLogin) ? clickMyOrder : ''}>
                                    <FontAwesomeIcon icon={faFileInvoiceDollar} className='fa_icon_header'></FontAwesomeIcon>
                                    {(hasLogin) ? "Đơn hàng" : "" }
                                </button>
                                <button class="header_body__option_and_info__user__select_login_or_logout__in" onClick={(hasLogin) ? clickLogout : clickSignUp}>
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} className='fa_icon_header'></FontAwesomeIcon>
                                    {(hasLogin) ? "Đăng Xuất" : "Đăng ký" }
                                </button>

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
            {/* <div class="header_navigation">
                <ul class="header_navigation__popup_text">
                    <li class="header_navigation__text" onClick={handleClickNam}>Nam</li>
                    <ul className="header_navigation__popup">
                        <li>
                            <button>
                                Áo
                            </button>
                        </li>
                        <li>
                            <button>
                                Quần
                            </button>
                        </li> 
                    </ul>
                    <li class="header_navigation__text" onClick={handleClickNu}>Nữ</li>
                    <ul className="header_navigation__popup">
                        <li>
                            <button>
                                Áo
                            </button>
                        </li>
                        <li>
                            <button>
                                Quần
                            </button>
                        </li> 
                    </ul>
                    <li class="header_navigation__text" onClick={handleClickTreEm}>Trẻ em</li>
                    <ul className="header_navigation__popup">
                        <li>
                            <button>
                                Áo
                            </button>
                        </li>
                        <li>
                            <button>
                                Quần
                            </button>
                        </li> 
                    </ul>
                </ul>
            </div> */}
        </div>
    </header>
    )
}
export default Header;
//123