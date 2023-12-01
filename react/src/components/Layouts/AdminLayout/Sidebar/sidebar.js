import "../Assets/adminLayout.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faCaretDown, faChartLine, faClipboardList, faHouse, faShirt, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../Assets/vendor/jquery/jquery.min.js"
// import "../Assets/vendor/bootstrap/js/bootstrap.bundle.min.js"
// import "../Assets/vendor/jquery-easing/jquery.easing.min.js"
// import "../Assets/js/sb-admin-2.min.js"

function SideBar(){
    const Navigation = useNavigate();
    const [stateClickInSideBar, setStateClickInSideBar] = useState({
        taikhoan: false,
        sanpham: false,
        voucher: false
    })

    const handleClickInSideBar = (name) => {  
        const stateClickInSideBar_copy = {...stateClickInSideBar, [name] : !stateClickInSideBar[name]}
        setStateClickInSideBar(stateClickInSideBar_copy) 
    }
    return ( 
        <div class="col-sm-2 sidebarTest">
            <div class="sidebar">
                <div class="sidebar_logo">
                    <img src="https://dosi-in.com/images/assets/icons/logo-white.png" alt="logo dosi-in"/>
                </div>
                <ul class="sidebar_nav">
                    {/* <!-- nav item: home --> */}
                    <li class="sidebar_nav_item">
                        <a class="sidebar_nav_item_content" href="trang_chu.html"> 
                            <FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>
                            <span>Trang chủ</span>
                        </a>
                    </li>

                    {/* <!-- nav item: account --> */}
                    <li 
                        class={`sidebar_nav_item accordion ${stateClickInSideBar.taikhoan ? "active" : ""}`} 
                        onClick={() => handleClickInSideBar('taikhoan')}
                    >
                        <a class="sidebar_nav_item_content" href="#"> 
                            <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                            <span className="category_text_inSideBar">Tài khoản</span> 
                            <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
                        </a> 
                    </li>
                    <div class={`panel ${stateClickInSideBar.taikhoan ? "block_category" : "block_category_none"}`}>
                        <ul class="sidebar_subnav">
                            <li class="sidebar_nav_item">
                                <a class="sidebar_nav_item_content medium_font" onClick={()=> {Navigation('/admin/manageAccountCustomer')}}>Quản lý khách hàng</a>
                            </li>
                            <li class="sidebar_nav_item">
                                <a class="sidebar_nav_item_content medium_font" onClick={()=> {Navigation('/admin/manageAccountStaff')}}>Quản lý nhân viên</a>
                            </li>
                        </ul>
                    </div>

                    {/* <!-- nav item: product --> */}
                    <li 
                        class={`sidebar_nav_item accordion ${stateClickInSideBar.sanpham ? "active" : ""}`} 
                        onClick={() => handleClickInSideBar('sanpham')}
                    >
                        <a class="sidebar_nav_item_content" href="#">
                            <i class="fa-solid fa-shirt"></i> 
                            <FontAwesomeIcon icon={faShirt}></FontAwesomeIcon>
                            <span className="category_text_inSideBar">Sản phẩm</span> 
                            <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
                        </a> 
                    </li>
                    <div class={`panel ${stateClickInSideBar.sanpham ? "block_category" : "block_category_none"}`}>
                        <ul class="sidebar_subnav">
                            <li class="sidebar_nav_item">
                                <a class="sidebar_nav_item_content medium_font" href="#">Danh mục sản phẩm</a>
                            </li>
                            <li class="sidebar_nav_item">
                                <span class="sidebar_nav_item_content medium_font" onClick={()=> {Navigation('/admin/manageProduct')}}>Danh sách sản phẩm</span>
                            </li>
                            <li class="sidebar_nav_item">
                                <span class="sidebar_nav_item_content medium_font" onClick={()=> {Navigation('/admin/addProduct')}}>Thêm sản phẩm</span>
                            </li>
                        </ul>
                    </div>
                    {/* <!-- <li class="sidebar_nav_item nav-item">
                        <a class="sidebar_nav_item_content" href="#">
                            
                        </a>
                        <ul class="dropdown_content">
                            <li>
                                <a href="#">Danh mục sản phẩm</a>
                            </li>
                            <li>
                                <a href="#">Danh sách sản phẩm</a>
                            </li>
                            <li>
                                <a href="#">Thêm sản phẩm</a>
                            </li>
                        </ul>
                    </li> -->

                    <!-- nav item: report --> */}
                    {/* <li class="sidebar_nav_item">
                        <a class="sidebar_nav_item_content" href="#"> 
                            <FontAwesomeIcon icon={faClipboardList}></FontAwesomeIcon>
                            <span className="category_text_inSideBar">Hóa đơn</span>
                        </a>
                    </li> */}
                    <li class="sidebar_nav_item">
                        <a class="sidebar_nav_item_content" href="#"> 
                            <FontAwesomeIcon icon={faClipboardList}></FontAwesomeIcon>
                            <span className="category_text_inSideBar" onClick={()=> {Navigation('/admin/manageOrder')}}>Đơn hàng</span>
                        </a>
                    </li>

                    {/* <!-- nav item: chart --> */}
                    <li 
                        class={`sidebar_nav_item accordion ${stateClickInSideBar.voucher ? "active" : ""}`} 
                        onClick={() => handleClickInSideBar('voucher')}
                    >
                        <a class="sidebar_nav_item_content" href="#">
                            <i class="fa-solid fa-shirt"></i> 
                            <FontAwesomeIcon icon={faShirt}></FontAwesomeIcon>
                            <span className="category_text_inSideBar">Voucher</span> 
                            <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
                        </a> 
                    </li>
                    <div class={`panel ${stateClickInSideBar.voucher ? "block_category" : "block_category_none"}`}>
                        <ul class="sidebar_subnav"> 
                            <li class="sidebar_nav_item">
                                <span class="sidebar_nav_item_content medium_font" onClick={()=> {Navigation('/admin/manageVoucher')}}>Danh sách Voucher</span>
                            </li>
                            <li class="sidebar_nav_item">
                                <span class="sidebar_nav_item_content medium_font" onClick={()=> {Navigation('/admin/AddVoucher')}}>Thêm Voucher</span>
                            </li>
                        </ul>
                    </div>
                    <li class="sidebar_nav_item">
                        <a class="sidebar_nav_item_content" href="#"> 
                            <FontAwesomeIcon icon={faChartLine}></FontAwesomeIcon>
                            <span className="category_text_inSideBar">Thống kê</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default SideBar;