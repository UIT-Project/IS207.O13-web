import "../Assets/adminLayout.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
// import "../Assets/vendor/jquery/jquery.min.js"
// import "../Assets/vendor/bootstrap/js/bootstrap.bundle.min.js"
// import "../Assets/vendor/jquery-easing/jquery.easing.min.js"
// import "../Assets/js/sb-admin-2.min.js"

function SideBar(){
    return ( 
        <div class="col-sm-2">
            <div class="sidebar">
                <div class="sidebar_div"> 
                    <div class="sidebar_element color_white">
                        <div class="sidebar_element_title">
                            <i class="fa-solid fa-user"></i>
                            <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>

                            <h6>
                                Tài khoản
                            </h6>  
                        </div>
                        <div class="sidebar_element__item">
                            <span class="color_white">User</span>
                            <span class="color_white">Nhân viên</span>
                        </div>
                    </div>
                    <div class="sidebar_element color_white">
                        <div class="sidebar_element_title">
                            <i class="fa-solid fa-user"></i>
                            <h6>Sản phẩm</h6>
                        </div>  
                        <div class="sidebar_element__item">
                            <span class="color_white">Danh mục sản phẩm</span>
                            <span>Danh sách ssản phẩm</span>
                            <span>Thêm sản phẩm</span>
                        </div>
                    </div>
                    <div class="sidebar_element">
                        <div class="sidebar_element_title">
                            <i class="fa-solid fa-user"></i>
                            <h6>
                                Hoá đơn
                            </h6>  
                        </div>
                        <div class="sidebar_element__item">
                            <span>Danh mục sản phẩm</span>
                            <span>Danh sách sản phẩm</span>
                            <span>Thêm sản phẩm</span>
                        </div>
                    </div>
                    <div class="sidebar_element">
                        <i class="fa-solid fa-shirt"></i>
                        Khách hàng
                        <div class="sidebar_element__item">
                            <span>Danh mục sản phẩm</span>
                            <span>Danh sách sản phẩm</span>
                            <span>Thêm sản phẩm</span>
                        </div>
                    </div>
                    <div class="sidebar_element">
                        <i class="fas fa-fw fa-chart-area"></i>
                        Thống kê
                        <div class="sidebar_element__item">
                            <span>Danh mục sản phẩm</span>
                            <span>Danh sách sản phẩm</span>
                            <span>Thêm sản phẩm</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBar;