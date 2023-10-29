import "./cart.css"
import 'bootstrap/dist/css/bootstrap.css';
import request from "../../utils/request";
import images from "../../assets/images"; 
import { useEffect, useState } from "react";
 
function Cart() {

    const [isCheckedAll, setIsCheckedAll] = useState(true); 
    const [itemCarts, setItemCart] = useState([]);
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); 
 

    const handleClickCheckboxAll = () => {   
        itemCarts.forEach(item => {
            item.selected = !isCheckedAll;
        }) 
        setIsCheckedAll(!isCheckedAll);
    }
    
    const handleClickCheckbox = (index) => {
        const listItemCard = [...itemCarts];
        listItemCard[index].selected = !listItemCard[index].selected;
        setItemCart(listItemCard);
        setIsCheckedAll(listItemCard.every((itemCarts) => itemCarts.selected)); 
    };
    const hanelInputSoLuong = (index, event) => {
        const ListItemCarts = [...itemCarts];
        ListItemCarts[index].SOLUONG = parseInt(event.target.value, 10);
        ListItemCarts[index].TONGGIA = ListItemCarts[index].SOLUONG * ListItemCarts[index].GIABAN;
        setItemCart(ListItemCarts); 
    }

    useEffect(() => {
         
        request.get(`/api/infoCart`, {params: {matk : localStorage.getItem('auth_matk')}})
        .then(res => { 
            const infoCartReverse = [...res.data.data].reverse()
            setItemCart(
                infoCartReverse.map(item => (
                    {...item, selected: true}
                ))
            );    

        })
        .catch(e => {
            console.log(e);
        })  

    }, [])

    

    const renderInfoCart = itemCarts.map((item, index) => {  
        return (
            <tr class="row1" key={index}>
                <td>
                    <input type="checkbox" name="checkboxProductInCart" id=""   checked = {item.selected}  onChange={() => handleClickCheckbox(index)}
                    />
                </td>

                <td>
                    <div class="box-row1-column1">
                        <div class="row1-column1-item">
                            <img class="img-row1" src={images.cart_1} alt=""/>
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
                        <b class="row1-item">{item.GIABAN}</b>
                    </div>
                </td>
                <td>
                    <div class="box-row1-column3 box-row1">
                        <input type="number" min={1} value={item.SOLUONG} onChange={(event) => hanelInputSoLuong(index, event)}  class="input-number row1-item" />
                    </div>
                </td>
                <td>
                    <div class="box-row1-column4 box-row1">
                        <b class="row1-item">{item.TONGGIA}</b>
                    </div>
                </td>
                <td>
                    <div class="box-row1-column5 box-row1">
                        <button class="btn-delete"><i class="fa-solid fa-xmark"></i></button>
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
                        <th class="header-column5"></th>
                    </tr>
                </thead>
                    <tbody>
                        {renderInfoCart} 
                    </tbody> 
            </table>
        </div>

        <div class="container mt-5 content-bottom">
            <div>
                <button class="btn-continue">Tiếp tục mua sắm</button>
            </div>
            <div class="box-thanh-toan">
                <div class="box-thanh-toan-discount">
                    <p><b>Mã giảm giá</b></p>
                    <p>Chọn hoặc nhập mã</p>
                </div>
                <hr class="line-thanh-toan"/>
                <div class="box-thanh-toan-tongtien">
                    <p><b>Tổng tiền</b></p>
                    <p class="total"><b>779.000đ</b></p>
                </div>
                <div class="box-thanh-toan-button">
                    <button class="btn-thanh-toan">THANH TOÁN</button>
                </div>
            </div>
        </div>
        </div>
    )
}
export default Cart;