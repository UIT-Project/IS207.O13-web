import "./cart.css"
import 'bootstrap/dist/css/bootstrap.css';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import request from "../../../utils/request";
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faXmark } from '@fortawesome/free-solid-svg-icons';

 
function Cart() {

    // CÁCH PHẦN CẦN XỬ LÝ TRONG FILE NÀY
    // 1.Lấy dữ liệu sản phẩm trong giỏ hàng (bảng chitiet_giohangs) của tài khoản đang đăng nhập và hiển thị dữ liệu
    // 2.Xử lý khi người dùng checked, chọn và bỏ chọn một sản phẩm
    // 3.Cập nhật số lượng
    // 4.Xoá sản phẩm khỏi giỏ hàng
    // 5.Click để chuyển sang thanh toán

    //dùng ctrl + f để biết những hàm handle nằm ở thẻ tag nào trong phần return
    useEffect(() => {
        document.title = "DosiIn | Giỏ hàng"
    }, []);
    const {formatPrice} = useGlobalVariableContext(); 

    //isCheckedAll xử lý khi tất cả sản phẩm trong giỏ hàng được chọn để thanh toán
    const [isCheckedAll, setIsCheckedAll] = useState(false); 
    //itemCarts chứa thông tin từng sản phẩm trong giỏ hàng để hiển thị ra màn hình và thao tác
    const [itemCarts, setItemCart] = useState([]);
    const [tongTienAllItem, setTongTienAllItem] = useState(0);

    //sử dụng để chuyển hướng web
    const Navigate = useNavigate();

    //khi mà người dùng nhấn chọn tất cả thì itemCarts sẽ chạy qua tất cả các sản phẩm và cho nó giá trị trái với 
    //trạng thái nút clickAll, ví dụ nếu clickAll đang được tích thì khi nhấn tick thì tất cả sản phẩm sẽ không được chọn và ngược lại
    const handleClickCheckboxAll = () => {   
        itemCarts.forEach(item => {
            (!isCheckedAll ) ? item.SELECTED = 1 : item.SELECTED = 0;
        }) 
        setIsCheckedAll(!isCheckedAll);

        let tinhtongtien = 0;
        itemCarts.map(item => (item.SELECTED === 1 ) ? tinhtongtien = tinhtongtien + item.TONGGIA : tinhtongtien)
        setTongTienAllItem(tinhtongtien);
        console.log(tongTienAllItem, ' ', tinhtongtien)
    }

     
    //trong này cẩn xử lý 3 cái
    const handleClickCheckbox = (index) => {  
        // 1 là chuyển đổi trạng thái của sản phẩm khi tick vào
        // nếu được chọn slected = 1 và ko thì = 0
        const listItemCarts = [...itemCarts];
        console.log(itemCarts, '2222');
        (listItemCarts[index].SELECTED === 0 ) ? listItemCarts[index].SELECTED = 1 :  listItemCarts[index].SELECTED = 0;
        setItemCart(listItemCarts);
        setIsCheckedAll(listItemCarts.every((itemCarts) => itemCarts.SELECTED)); 
 
        // 2 tính lại tổng tiền để hiển thị
        let tinhtongtien = 0;
        listItemCarts.map(item => (item.SELECTED === 1 ) ? tinhtongtien = tinhtongtien + item.TONGGIA : tinhtongtien)
        setTongTienAllItem(tinhtongtien);
        console.log(tongTienAllItem, ' ', tinhtongtien)

        //3. cập nhật thông tin của thuộc tính selected trong bảng chitiet_giohang
        //trong chitiet_giohang thuộc tính selected để lưu trạng thái được chọn trong giỏ hàng
        const infoUpdateSelectedProperty = {
            matk: localStorage.getItem('auth_matk'),
            masp: listItemCarts[index].MASP,
            mamau: listItemCarts[index].MAMAU,
            masize: listItemCarts[index].MASIZE,

            selected: listItemCarts[index].SELECTED,
        }
        // cập nhật selected của một sản phẩm
        try{
            request.post("/api/updateSelectedProperty", infoUpdateSelectedProperty)
            .then(res => {  
                console.log(res.data.message);
            })
        }
        catch(err){ 
            console.log(err);
        }
        console.log(itemCarts[index].SELECTED);
    };

    //cái này cũng xử lý 3 cái giống ở trên
    const hanelInputSoLuong = (index, event) => {

        const ListItemCarts = [...itemCarts];
        ListItemCarts[index].SOLUONG = parseInt(event.target.value === '' || event.target.value === NaN  ? 0 : event.target.value, 10);
        ListItemCarts[index].TONGGIA = ListItemCarts[index].SOLUONG * ListItemCarts[index].GIABAN;
        setItemCart(ListItemCarts); 

        let tinhtongtien = 0;
        ListItemCarts.map(item => tinhtongtien = tinhtongtien + item.TONGGIA)
        setTongTienAllItem(tinhtongtien);
        
        const infoUpdateQuantityItemCart = {
            matk: parseInt(localStorage.getItem('auth_matk')),
            masp: itemCarts[index].MASP,
            mamau: itemCarts[index].MAMAU,
            masize: itemCarts[index].MASIZE, 
            soluong: itemCarts[index].SOLUONG,
            tonggia: itemCarts[index].SOLUONG * itemCarts[index].GIABAN,
        } 
        console.log(infoUpdateQuantityItemCart.soluong);

        try{
            request.post("/api/updateQuantityProperty", infoUpdateQuantityItemCart)
            .then(res => {  
                console.log(res.data.matk);
            })
        }
        catch(err){ 
            console.log(err);
        }

    }

    //chuyển hướng sang thanh toán
    const handleClickPayment = () => { 
        Navigate("/payment");
    }

    const handleContinuelyBuy = () => {
        // Navigate("/payment");
    }

    //xử lý xoá sản phẩm giống với cập nhật số lượng và chọn sản phẩm ddthanh toán
    const handleClickDelete = (index) => {
        
        const infoDeleteItemCart = {
            matk: parseInt(localStorage.getItem('auth_matk')),
            masp: itemCarts[index].MASP,
            mamau: itemCarts[index].MAMAU,
            masize: itemCarts[index].MASIZE,
 
        } 
        console.log(infoDeleteItemCart);
        request.post('/api/deleteItemCart', infoDeleteItemCart) 
        .then(res => {
            console.log(res.data.message);
        })  

        itemCarts.splice(index, 1);

        const listItemCarts = [...itemCarts];
        setItemCart(listItemCarts); 

        let tinhtongtien = 0;
        listItemCarts.map(item => tinhtongtien = tinhtongtien + item.TONGGIA)
        setTongTienAllItem(tinhtongtien);
        console.log(tongTienAllItem, ' ', tinhtongtien)
    }

    //lấy ra danh sách sản phẩm trong giỏ hàng với mã tài khoản
    const handleGetListProductCart = () => {
        request.get(`/api/infoCart`, {params: {matk : localStorage.getItem('auth_matk')}})
        .then(res => { 
            const infoCartReverse = [...res.data.data].reverse()
            setItemCart( infoCartReverse );    
            
            setIsCheckedAll(infoCartReverse.every((itemCarts) => itemCarts.SELECTED)); 
            let tinhtongtien = 0;
            infoCartReverse.map(item => tinhtongtien = tinhtongtien + item.TONGGIA)
            setTongTienAllItem(tinhtongtien); 
            console.log(res.matk);
        })
        .catch(e => {
            console.log(e);
        })  
    }

    useEffect(() => {
        handleGetListProductCart();
    }, [])

    

    const renderInfoCart = itemCarts.map((item, index) => {   
        
        return (
            <tr class="row1" key={index}>
                <td>
                    <input 
                        type="checkbox" 
                        name="checkboxProductInCart" id=""   
                        checked = {(item.SELECTED === 1) ? true : false}   
                        onChange={() => handleClickCheckbox(index)}
                    />
                </td>

                <td>
                    <div class="box-row1-column1">
                        <div class="row1-column1-item">
                            <img class="img-row1" src={item.imgURL} alt=""/>
                        </div>
                        <div class="row1-column1-item">
                            <p>
                                {item.TENSP} <br/>
                                Màu: {item.TENMAU} <br/>
                                Size: {item.MASIZE}
                            </p>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="box-row1-column2 box-row1">
                        <b class="row1-item">{formatPrice(item.GIABAN)} đ</b>
                    </div>
                </td>
                <td>
                    <div class="box-row1-column3 box-row1">
                        <input type="number" min={1} value={item.SOLUONG} onChange={(event) => hanelInputSoLuong(index, event)}  class="input-number row1-item" />
                    </div>
                </td>
                <td>
                    <div class="box-row1-column4 box-row1">
                        <b class="row1-item">{formatPrice(item.TONGGIA)} đ</b>
                    </div>
                </td>
                <td>
                    <div class="box-row1-column5 box-row1">
                        <button class="btn-deletee_cart" onClick={() => handleClickDelete(index)}>
                            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                        </button> 
                    </div>
                </td>
                
            </tr>
        )
    })

    return( 
    <div class="container mt-3 container-content">
        <h1 class="text-header-content">GIỎ HÀNG</h1>
        <div class="tbody_table_cart">

            <table class="table table-hover">
                <thead class="table-header">
                    <tr class="table-header-row">
                        <th class="header-column0">                        
                            <input type="checkbox" name="checkboxProductInCart" id=""  
                                checked = {isCheckedAll} 
                                onChange={handleClickCheckboxAll}
                            />
                        </th>
                        <th class="header-column1">Sản phẩm</th>
                        <th class="header-column2">Giá</th>
                        <th class="header-column3">Số lượng</th>
                        <th class="header-column4">Thành tiền</th>
                        <th class="header-column5">  
                            <button class ="btn-deletee_cart"><FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></button>
                        </th> 
                    </tr>
                </thead>
                    <tbody>
                        {renderInfoCart} 
                    </tbody> 
            </table>
        </div>

        <div class="container mt-5 content-bottom">
            <div>
                <button class="btn-continue" onClick={handleContinuelyBuy}>Tiếp tục mua sắm</button>
            </div>
            <div class="box-thanh-toan">
                {/* <div class="box-thanh-toan-discount">
                    <p><b>Mã giảm giá</b></p>
                    <p>Chọn hoặc nhập mã</p>
                </div> */}
                <hr class="line-thanh-toan"/>
                <div class="box-thanh-toan-tongtien">
                    <p><b>Tổng tiền</b></p>
                    <p class="total">
                        <b>
                            {formatPrice(tongTienAllItem)}
                            đ
                        </b>
                    </p>
                </div>
                <div class="box-thanh-toan-button">
                    <button class="btn-thanh-toan__cart" onClick={handleClickPayment}>THANH TOÁN</button>
                </div>
            </div>
        </div>
        </div>
    )
}
export default Cart;