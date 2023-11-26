import "./manageOrder.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';

import request from "../../../utils/request";  
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faEye, faL, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';

function ManageOrder(){
    const numberOrderEachPage = 20;
    const [xoadau, setXoaDau] = useState(0);
    const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0); 
    const [watchOrderDetail, setWatchOrderDetail] = useState(false);
    const [infoOrderDetail, setInfoOrderDetail] = useState({
        data_relative_Donhang: [],
        data_sanPham_relative_CTDH: [],
    })
    const [note, setNote] = useState('');
    const [keySearch, setKeySearch] = useState('');
    const [listMASPTranferState, setListMASPTranferState] = useState([]);
    const [isCheckedAll, setIsCheckedAll] = useState(false); 
    const Navigate = useNavigate();
    const [typeSearch, setTypeSearch] = useState('MADH');
    const searchParams  = new URLSearchParams(window.location.search);
    const numberPagination = searchParams.get('numberPagination');

    const [orderStatus, setOrderStatus] = useState({
        danggiao:{
            nameState: 'Đang giao',
            orderList: [],
            pageQuantity: 0,
            paginationList: [],
            openingPage: 1,
            spaceGetDataFromOrderList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberOrderEachPage,
            }]
        },
        dagiao: {
            nameState: 'Đã giao',
            orderList: [],
            pageQuantity: 0,
            paginationList: [],
            openingPage: 1, 
            spaceGetDataFromOrderList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberOrderEachPage,
            }]
        },
        dahuy: {
            nameState: 'Đã huỷ',
            orderList: [],
            pageQuantity: 0,
            paginationList: [],
            openingPage: 1, 
            spaceGetDataFromOrderList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberOrderEachPage,
            }]
        },
        trahang: {
            nameState: 'Trả hàng',
            orderList: [],
            pageQuantity: 0,
            paginationList: [],
            openingPage: 1, 
            spaceGetDataFromOrderList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberOrderEachPage,
            }]
        }  
    }) 
    const orderStatus_Array = Object.entries(orderStatus).map(([key, value]) => (
        {
            key: key,
            value: value
        }
    )) 
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };
    const [orderStatusPointer, setOrderStatusPointer] = useState(
        orderStatus.danggiao.nameState
    );

    const handleClickNavState = (item_status, item_pagina) => {
        // console.log(e.target.value) 
        
        setOrderStatusPointer(item_status.value.nameState) 
        const updateOpeningPage = prevOrderStatus => (
            {
                ...prevOrderStatus, 
                [item_status.key] : {...prevOrderStatus[item_status.key],  openingPage:  item_pagina}
            }
        );
        setOrderStatus(updateOpeningPage) 
        getInfoOrderForUsers(item_status, item_pagina); 
    }

    const handleClickItemPagination = (item_status, item_pagina) => {
        const updateOpeningPage = prevOrderStatus => (
            {
                ...prevOrderStatus, 
                [item_status.key] : {...prevOrderStatus[item_status.key],  openingPage:  item_pagina}
            }
        );
        setOrderStatus(updateOpeningPage)  
        getInfoOrderForUsers(item_status, item_pagina);
        handleScrollToTop();
    }

    const handleTurnBack = () => {
        setWatchOrderDetail(false);
    }

    const handleWatchOrderDetail = (madh) => {
        getInforOrderDetail(madh);
        setWatchOrderDetail(true); 
    }

    const handleInputNote = (e) => {
        setNote(e.target.value)
        console.log(note)
    }

    const getInfoOrderForUsers =  (itemInOrderStatus_Array, openingPage) => {   
        const queryForGetInfoOrderForUsers = { 
            start: numberOrderEachPage * ( openingPage - 1),
            tenTrangThai: itemInOrderStatus_Array.value.nameState,
            numberOrderEachPage: numberOrderEachPage,
        }  

        try{
            request.get(`/api/getInfoManageOrder`, {params: queryForGetInfoOrderForUsers})
                // request.get('api/getInfoManageOrder', queryForGetInfoOrderForUsers)
            .then(res=>{      
                console.log(res.data, 'okk') ;
     
                setOrderStatus(prevOrderStatus => {
                    const itemIndex = prevOrderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList.findIndex(
                        item => item.paginationNumber === openingPage
                    );
                    if(itemIndex === -1 || (openingPage === 1 && paginationNumberRunFirst === 0)){
                        setPaginationNumberRunFirst(1);
                        // console.log(res.data.orderList_DB.length)
                        return {
                            ...prevOrderStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                            [itemInOrderStatus_Array.key] : 
                            {   
                                ...prevOrderStatus[itemInOrderStatus_Array.key], 
                                orderList:  [
                                    ...prevOrderStatus[itemInOrderStatus_Array.key].orderList.filter(item => item),
                                    ...res.data.orderList_DB.filter(item =>  item)
                                ],  
                                spaceGetDataFromOrderList: [
                                    ...orderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList,
                                    {
                                        paginationNumber: openingPage,
                                        ordinalNumber: orderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList.length + 1,
                                        startIndex: orderStatus[itemInOrderStatus_Array.key].orderList.length,
                                        endIndex: res.data.orderList_DB.length + orderStatus[itemInOrderStatus_Array.key].orderList.length,
                                    },
                                ] 
                            }
                        } 
                    }
                    else{  
                        return {
                            ...prevOrderStatus, 
                        } 
                    } 
                }) 
                // orderStatus[itemInOrderStatus_Array.key].paginationList.filter((item, index) => 
                //     orderStatus[itemInOrderStatus_Array.key].paginationList.indexOf(item) === index
                // );     
            }) 
        }
        catch(err){
            console.log(err)
        }
         
    }

    const getQuantityOrderToDevidePage = () => {
        request.get('/api/getQuantityOrderToDevidePage')
        .then(res=> {
            res.data.quantity.forEach(itemStatusFromDB => {
                orderStatus_Array.forEach(itemStatus => {
                    if(itemStatusFromDB.TRANGTHAI_DONHANG === itemStatus.value.nameState)
                    {
                        const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MADH / numberOrderEachPage)  

                        let arrAddToPaginationList = [];
                        for(let i = 1; i <= pageQuantityShow; i++)
                            arrAddToPaginationList.push(i);
                        // console.log(pageQuantityShow);
                        setOrderStatus(prevOrderStatus => ({
                            ...prevOrderStatus, 
                                [itemStatus.key] : 
                                    {...prevOrderStatus[itemStatus.key],  
                                    pageQuantity: itemStatusFromDB.SL_MADH, 
                                    paginationList: arrAddToPaginationList}
                        }))
                    }
                })
            });
            // console.log(orderStatus) 
         }) 
    }
    
    const getInforOrderDetail = (madh) => {
        const data = {
            madh: madh
        }
        request.get(`/api/infoOrderDetail`, {params: data})
        .then(res => {  
            // if(typeof res.data.data_relative_Donhang !== 'object')
                setInfoOrderDetail({
                    data_relative_Donhang: res.data.data_relative_Donhang[0],
                    data_sanPham_relative_CTDH: res.data.data_sanPham_relative_CTDH,
                })
            // else
            // setInfoOrderDetail({
            //     data_relative_Donhang: res.data.data_relative_Donhang,
            //     data_sanPham_relative_CTDH: res.data.data_sanPham_relative_CTDH,
            // })
            setNote(res.data.data_relative_Donhang[0].GHICHU);
            console.log(res, ' ', infoOrderDetail, ' ', madh);
        })
    };

    const saveNote = (madh, note) => {
        console.log(madh, "okokokok", note)
        const data = {
            note: note, 
            madh: madh
        }
        try{
            // requestPost.post(`api/saveNote?note=${note}&madh=${madh}`, {note, madh})
            request.post('api/saveNote', data)
            .then(res => {
                console.log(res)
            })
        }
        catch(err){
            console.log(err)
        }
    }

    const handleSearchInput = (e) => {
        setKeySearch(e.target.value)
    }

    const handleSearch = () => {
        Navigate(`/admin/searchOrder?keySearch=${keySearch}&typeSearch=${typeSearch}`)
    }

    const handleInputInfoTypeSearch = (e) => {
        setTypeSearch(e.target.value)
        console.log(typeSearch)
    }

    const handleClickCheckbox = (product, item) => {

        setListMASPTranferState([...listMASPTranferState, product.MADH]);
        console.log(listMASPTranferState);
 
        if(listMASPTranferState.includes(product.MADH)){
            setListMASPTranferState(listMASPTranferState.filter(item => item !== product.MADH)) 
        }
        else{
            setListMASPTranferState([...listMASPTranferState, product.MADH]);
        }  
    }

    const handleUpdateState = (nameStatusWillUpdate) => {
        console.log(listMASPTranferState);
        const data = {
            nameStatusWillUpdate: nameStatusWillUpdate,
            listMASPTranferState: listMASPTranferState
        }
        try{ 
            request.post(
                `api/updateOrderStatus`, data
            )
            .then(res => {})
        }
        catch(err){
            console.log(err)
        }
    }

    const handleClickCheckboxAll = (item) => {  
            if(!isCheckedAll){ 
                // setListMASPTranferState([
                //     ...listMASPTranferState,
                //     item.value.orderList.filter(item => {
                //         if(item.MADH !== listMASPTranferState.includes(item.MADH))
                //             return item.MADH
                //     })
                // ]);

                const allItems = item.value.orderList.map(orderItem => orderItem.MADH);
                // Thêm tất cả các phần tử đã được chọn vào listMASPTranferState
                setListMASPTranferState(allItems);

            }
            else if(isCheckedAll){
                listMASPTranferState.splice(0, listMASPTranferState.length);
            }  
        setIsCheckedAll(!isCheckedAll); 
    }

    useEffect(() => {   
        orderStatus_Array.map(item => getInfoOrderForUsers(item, 1))
        getQuantityOrderToDevidePage()
        // getInforOrderDetail(1);
    }, [])

 
    const renderNavState = orderStatus_Array.map((item, index) =>  
        <li class="nav-item col-auto p-2" key={index}>
            <button 
                class={`nav-link ${orderStatusPointer === item.value.nameState ? 'active' : ''}`} 
                aria-current="page"  
                onClick={()=>handleClickNavState(item, 1)}
            >
                {item.value.nameState}
            </button>
        </li> 
    )
 

    const renderEachProduct = (item, indexOrder) => {
        let index = {
            start: 0,
            end: 0,
        } 
        item.value.spaceGetDataFromOrderList.filter(item_pagination => {  
            if (item_pagination.paginationNumber ===  item.value.openingPage) {
                index.start = item_pagination.startIndex;
                index.end = item_pagination.endIndex;
            }   
        })
        // console.log(index)
        return ( 
            item.value.orderList.slice(index.start, index.end).map((product, index) =>  
                // <div class="order_status_cover " key={index}> 
                        <tr key={index}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    name="checkboxProductInCart" id=""   
                                    checked = {listMASPTranferState.includes(product.MADH)}   
                                    onChange={() => handleClickCheckbox(product, index)}
                                />
                            </td>
                            <td data-label="Order-code">{product.MADH}</td>
                            <td data-label="Name">{product.TEN}</td>
                            <td data-label="Phone-number">{product.SDT}</td>
                            <td data-label="Address">65 Lý Tự Trọng, TPHCM</td>
                            <td data-label="Day">15-06-2023</td>
                            <td><button type="button" id="btn-status-deliveried">Đã giao</button>
                            </td>
                            <td><button type="button" id="btn-payment-after">Trả sau</button>
                            </td>
                            <td data-label="Subtotal">540.000</td>
                            <td data-label="update">
                                <div class="icon-update">
                                    <FontAwesomeIcon icon={faEye} class="fa-solid fa-eye" ></FontAwesomeIcon>
                                    <FontAwesomeIcon class="fa-solid fa-print" icon={faPrint}></FontAwesomeIcon>
                                    <span onClick={()=>handleWatchOrderDetail(product.MADH)}>
                                        <FontAwesomeIcon class="fa-solid fa-pen-to-square" icon={faPenToSquare} ></FontAwesomeIcon>
                                    </span>
                                </div>
                                
                            </td>
                        </tr>  
                // </div>  
            )  
        )
    }

    const renderPagination = (item_status) => {
        return item_status.value.paginationList.map((item_pagina) => 
            <button key={item_pagina} onClick={() => handleClickItemPagination(item_status, item_pagina)}>{item_pagina}</button>
        )
    }

    const renderInfoProduct = infoOrderDetail.data_sanPham_relative_CTDH.map((item, index) => 
            <div className="div_thongtinsanpham" key={index}>
                <span>Tên sản phẩm: {item.TENSP}</span>  
                <span>Tên màu: {item.TENMAU}</span> 
                <span>Size: {item.MASIZE}</span> 
                <span>Giá bán: {item.GIABAN}</span> 
                <span>Số lượng: {item.SOLUONG}</span>  
                {/* <img src={item.imgURL} height={300} width={300}></img> */}
            </div>
        ) 

    const renderOrderDetail = () => {
        // console.log("ok");
        // getInforOrderDetail()   
        console.log(infoOrderDetail, 'render')
        if(watchOrderDetail === true) {
            return(  
                <div>
                    <h3>orderDetail</h3>
                    <button onClick={handleTurnBack}>turn back</button>
                    <div class="icon-update">
                        <span>
                            <FontAwesomeIcon class="fa-solid fa-pen-to-square" icon={faPenToSquare} ></FontAwesomeIcon>
                        </span>
                    </div>
                    <div className="div_thongTinGiaoHang">
                        <span className="thongTinGiaoHang">Thông tin giao hàng</span>  
                        <span>Tên: {infoOrderDetail.data_relative_Donhang.TEN}</span>  
                        <span>SDT: {infoOrderDetail.data_relative_Donhang.SDT}</span> 
                        <span>DIACHI: {infoOrderDetail.data_relative_Donhang.DIACHI}</span> 
                        <span>TINH_TP: {infoOrderDetail.data_relative_Donhang.TINH_TP}</span> 
                        <span>QUAN_HUYEN: {infoOrderDetail.data_relative_Donhang.QUAN_HUYEN}</span> 
                        <span>PHUONG_XA: {infoOrderDetail.data_relative_Donhang.PHUONG_XA}</span> 
                        <span>Tên: {infoOrderDetail.data_relative_Donhang.TEN}</span> 
                        <span>Tên: {infoOrderDetail.data_relative_Donhang.TEN}</span> 
                    </div>
                    <div className="div_thongTinGiaoHang">
                        <span className="thongTinGiaoHang">Thông tin Đơn hàng</span>  
                        <span>Tổng tiền phải trả: {infoOrderDetail.data_relative_Donhang.TONGTIEN}</span>  
                        <span>Tổng tiền sản phẩm: {infoOrderDetail.data_relative_Donhang.TONGTIEN_SP}</span> 
                        <span>Mã voucher giảm: {infoOrderDetail.data_relative_Donhang.VOUCHERGIAM}</span> 
                        <span>Tổng tiền đơn hàng: {infoOrderDetail.data_relative_Donhang.TONGTIENDONHANG}</span> 
                        <span>Hình thức thanh toán: {infoOrderDetail.data_relative_Donhang.HINHTHUC_THANHTOAN}</span> 
                        <span>Trạng thái thanh toán: {infoOrderDetail.data_relative_Donhang.TRANGTHAI_THANHTOAN}</span> 
                        <span>Ghi chú:</span> 
                        <textarea 
                            name="note"
                            value={note}
                            onChange={handleInputNote}
                        >
                        </textarea> 
                        <button onClick={() => saveNote(infoOrderDetail.data_relative_Donhang.MADH, note)}>save</button>
                    </div>
                    <div className="div_thongTinGiaoHang">
                        <span className="thongTinGiaoHang">Thông tin các sản phẩm</span>  
                        {renderInfoProduct}
                        
                    </div> 
                </div>  
            )
        }
    }
 
    const renderShowProductEveryState = orderStatus_Array.map((item, index) =>   
        {  
            // console.log(item)
            if(orderStatusPointer === item.value.nameState){ 
                return(
                    <div 
                        class={`row justify-content-center ${orderStatusPointer === item.value.nameState ? "" : 'hiddenEachState'}`}
                        key={index} 
                    > 
                    {
                        renderOrderDetail()
                    }
                    <div class={`content_list_order  ${watchOrderDetail ? "display_hidden" : ""}`}>
                        <div className={`${orderStatus_Array.length !== index + 1 ? '' : 'display_hidden'}`}>
                            Cập nhật trạng thái sang 
                            <span className="StateWillTranfer">
                                {orderStatus_Array.length !== index + 1 ? orderStatus_Array[index + 1].value.nameState : ''}
                            </span>
                            <button className="buttonUpdate" onClick={() => handleUpdateState(orderStatus_Array[index + 1].value.nameState)}>Update</button>
                        </div>
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col">                        
                                    <input 
                                        type="checkbox" 
                                        name="checkboxProductInCart" id=""  
                                        checked = {isCheckedAll} 
                                        onChange={() => handleClickCheckboxAll(item)}
                                    />
                                </th>
                                <th scope="col" >Mã đơn hàng</th>
                                <th scope="col">Tên khách hàng</th>
                                <th scope="col">SĐT</th>
                                <th scope="col">Địa chỉ</th>
                                <th scope="col" >Ngày hoá đơn</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Thanh toán</th>
                                <th scope="col">Tổng tiền</th>
                                <th scope="col"></th>

                            </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                { renderEachProduct(item, index) } 
                            </tbody>
                        </table>
                    </div>
                    { renderPagination(item) }
                    </div> 
                ) 
            }
        }
    )

    return(
        <div class="order_info_body container">
            <div class="heading text-uppercase text-center">
                <h1>Đơn hàng</h1>
            </div>
            <div className="div_search">
                <div>
                    Tìm kiếm: 
                </div>
                <div>
                    <input 
                        name="keySearch"
                        onChange={handleSearchInput}
                    ></input> 
                </div>
                <div class="col-2"> 
                    <select class="form-select" required
                        onChange={handleInputInfoTypeSearch}
                        name="typeSearch"
                        value={typeSearch} 
                    > 
                    <option selected value="MADH">Mã hoá đơn</option>
                    <option value="TEN">Tên khách hàng</option>
                    <option value="SDT">Số điện thoại</option>
                    </select>
                </div> 
                <button onClick={handleSearch}>Search</button>
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

export default ManageOrder;