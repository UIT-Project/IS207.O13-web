import images from "../../assets/images"; 
import './myorder.css'
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';

import * as request from "../../utils/request";
import { useEffect, useState } from "react";
import { Button } from "bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

function MyOrder(){

    const orderStatus = {
        danggiao: 'Đang giao',
        dagiao: 'Đã giao',
        dahuy: 'Đã huy',
        trahang: 'Trả hàng' 
        
    } 

    const [infOrder, setInfOrder] = useState([ [], [], [], [] ])

    const orderStatus_Array = Object.entries(orderStatus).map(([key, value]) => ({
        key: key,
        value: value
    }))

    const [orderStatusPointer, setOrderStatusPointer] = useState(orderStatus.danggiao);

    const handleClickNavState = (e) => {
        console.log(e.target.value)
        setOrderStatusPointer(e.target.value)
    }

    const renderNavState = orderStatus_Array.map((item, index) =>  
            <li class="nav-item col-auto p-2" key={index}>
                <button 
                    class={`nav-link ${orderStatusPointer === item.value ? 'active' : ''}`} 
                    aria-current="page" 
                    value={item.value}
                    onClick={handleClickNavState}
                >
                    {item.value}
                </button>
            </li> 
    )

    const renderEachProduct = (indexOrder) => 
        infOrder[indexOrder].map((product, index) =>  
            <div class="order_status_cover col-8" key={index}>
                <div class="row p-2">
                    <img src="./img/dam-yem-nhum-co-xep-ly-tang-2-510x765 1.png" class="col-2 p-2 float-start" alt=""/>
                    <div class="info1 col-5 p-2">
                        <span>
                            {product.MADH} <br/>
                            Màu:  <br/>
                            Size: 
                        </span>
                    </div>
                    <div class="info2 col-5 p-3 text-end d-flex align-items-end">
                        <div class="col p-0">
                            <span>
                                x{product.SOLUONG} <br/>
                                <del>230.000đ</del> 179.000đ
                            </span>
                        </div>
                        
                    </div>
                </div>
                <div class="sub_info_1 row p-2 text-sm-center">
                    <a class="text-decoration-none bland" href="#">Xem thêm sản phẩm</a>
                </div>
                <div class="sub_info_2 row p-2 justify-content-between">
                    <div class="col-auto text-start bland">
                        <span>3 sản phẩm</span>
                    </div>
                    <div class="col-auto text-end">
                        <span>Thành tiền: </span>
                        <span class="color_red">749.000đ</span>
                    </div>
                </div>
                <div class="sub_info_2 row p-2 justify-content-between">
                    <div class="col-auto text-start">
                        <i class="fa-solid fa-truck"></i>
                        <span>Đơn hàng đã được giao đến bạn</span>
                    </div>
                    <div class="col-auto text-end">
                        <a class="text-decoration-none bland" href="#">Chi tiết</a>
                    </div>
                </div>
                <div class="row p-2">
                    <div>
                        <button type="button" class="btn_black float-end">Đã nhận hàng</button>
                    </div>
                </div>
            </div>  
        )  

    const renderShowProductEveryState = orderStatus_Array.map((item, index) =>   
        {
            
            return(
            <div 
                class={`row justify-content-center ${orderStatusPointer === item.value ? "" : 'hiddenEachState'}`}
                key={index}
            >
                {
                    renderEachProduct(index)
                } 
            </div> 
            )
        }
    )

    const getInfoOrderForUsers = () => { 
        request.get('/api/getInfoOrderForUsers')
        .then(res=>{    
            setInfOrder([ 
                res.deliveringOrder, 
                res.deliveredOrder, 
                res.cancelOrder, 
                res.returnOrder, 
            ])  
        })
        .catch(res=>{
            console.log(res.data);
        })
    }

    useEffect(() => {
        getInfoOrderForUsers()
    }, [])

    return(
        <div class="order_info_body container">
        <div class="heading text-uppercase text-center">
            <h1>Đơn hàng</h1>
        </div>
        {/* <!-- nav bar trạng thái đơn hàng --> */}
        <ul class="nav nav-underline justify-content-center"> 
            {renderNavState}
        </ul>
        
        {/* <!--1 đơn hàng đang giao --> */} 
        {renderShowProductEveryState}  
 
    </div>
    )
}

export default MyOrder