import "./ManageAccountCustomer.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';

import request from "../../../../utils/request";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
  
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faClock, faFaceAngry, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {  faCheck, faEye, faL, faMagnifyingGlass, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import SearhInPageManage from "../../ComponentUseInManyPage/SearchInPageManage/SearchInPageManage";
import NavigationInPageManage from "../../ComponentUseInManyPage/NavigationInPageManage/NavigationInPageManage";

function ManageAccountCustomer()
{
    useEffect(() => {
        document.title = "Admin | Quản lý khách hàng"
    }, []);
    const numberOrderEachPage = 20; 
    const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0);  
    //update
    const searchParams  = new URLSearchParams(window.location.search); 
    const nameStatusParam = searchParams.get('nameStatus');

    const keySearchParams = searchParams.get('keySearch');
    const typeSearchParams = searchParams.get('typeSearch');
    
    
    const Navigate = useNavigate();  
    const infoSearchOption = [
        {
            value: 'TEN',
            show: 'Tên khách hàng',
        },
        {
            value: 'EMAIL',
            show: 'Email',
        },
        {
            value: 'SDT',
            show: 'Số điện thoại',
        }
    ]

    const [orderStatus, setOrderStatus] = useState({
        khachHang:{
            nameState: 'Khách hàng',
            orderList: [],
            pageQuantity: 0,
            paginationList: [],
            openingPage: 1,
            indexOfOderListHelpDelete: 0,
            hasChangeFromPreState: 0,
            spaceGetDataFromOrderList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberOrderEachPage,
            }]
        }, 
    })  
    const orderStatus_Array = Object.entries(orderStatus).map(([key, value]) => (
        {
            key: key,
            value: value
        }
    )) 
    const [orderStatusPointer, setOrderStatusPointer] = useState(
        nameStatusParam ? orderStatus[nameStatusParam]?.nameState : orderStatus.khachHang.nameState
    );
 
    const handleClickItemPagination = (item_status, item_pagina) => {
        const updateOpeningPage = prevOrderStatus => (
            {
                ...prevOrderStatus, 
                [item_status.key] : {...prevOrderStatus[item_status.key],  openingPage:  item_pagina}
            }
        );
        setOrderStatus(updateOpeningPage)  
        getInfoOrderForUsers(item_status, item_pagina); 
    }
 

    const getInfoOrderForUsers =  (itemInOrderStatus_Array, openingPage) => {   
        const queryForGetInfoOrderForUsers = { 
            start: numberOrderEachPage * ( openingPage - 1),
            AdminVerify: itemInOrderStatus_Array.value.nameState,
            numberOrderEachPage: numberOrderEachPage,
            keySearch: keySearchParams,
            typeSearch: typeSearchParams
        }  
        if(keySearchParams === null && typeSearchParams === null){
            request.get(`/api/getInfoManageAccountCustomer`, {params: queryForGetInfoOrderForUsers}) 
            .then(res=>{  
                console.log(res.data)
                if(res.data.data_thongtin_sanpham.length == 0 && openingPage !== 1){
                    window.location.reload();
                }
                else{
                    const startIndexOfOderListHelpDelete = itemInOrderStatus_Array.value.indexOfOderListHelpDelete;
                    setOrderStatus(prevOrderStatus => {
                        const itemIndex = prevOrderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList.findIndex(
                            item => item.paginationNumber === openingPage
                        ); 
                        if(itemIndex === -1 || (openingPage === 1 && paginationNumberRunFirst === 0)){
                            setPaginationNumberRunFirst(1);
                            console.log(res.data.data_thongtin_sanpham, 'đ', openingPage)
                            return {
                                ...prevOrderStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                                [itemInOrderStatus_Array.key] : 
                                {   
                                    ...prevOrderStatus[itemInOrderStatus_Array.key], 
                                    orderList:  [
                                        ...prevOrderStatus[itemInOrderStatus_Array.key].orderList.filter(item => item),
                                        ...res.data.data_thongtin_sanpham.filter(item =>  item)
                                    ],  
                                    spaceGetDataFromOrderList: [
                                        ...orderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList,
                                        {
                                            paginationNumber: openingPage,
                                            ordinalNumber: orderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList.length + 1,
                                            startIndex: orderStatus[itemInOrderStatus_Array.key].orderList.length,
                                            endIndex: res.data.data_thongtin_sanpham.length + orderStatus[itemInOrderStatus_Array.key].orderList.length,
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
                }
            })  
        }
        else{
            request.get(`/api/searchAccountCustomer`, {params: queryForGetInfoOrderForUsers}) 
            .then(res=>{  
                console.log(res.data)
                if(res.data.data_thongtin_sanpham.length == 0 && openingPage !== 1){
                    window.location.reload();
                }
                else{
                    const startIndexOfOderListHelpDelete = itemInOrderStatus_Array.value.indexOfOderListHelpDelete;
                    setOrderStatus(prevOrderStatus => {
                        const itemIndex = prevOrderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList.findIndex(
                            item => item.paginationNumber === openingPage
                        ); 
                        if(itemIndex === -1 || (openingPage === 1 && paginationNumberRunFirst === 0)){
                            setPaginationNumberRunFirst(1);
                            console.log(res.data.data_thongtin_sanpham, 'đ', openingPage)
                            return {
                                ...prevOrderStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                                [itemInOrderStatus_Array.key] : 
                                {   
                                    ...prevOrderStatus[itemInOrderStatus_Array.key], 
                                    orderList:  [
                                        ...prevOrderStatus[itemInOrderStatus_Array.key].orderList.filter(item => item),
                                        ...res.data.data_thongtin_sanpham.filter(item =>  item)
                                    ],  
                                    spaceGetDataFromOrderList: [
                                        ...orderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList,
                                        {
                                            paginationNumber: openingPage,
                                            ordinalNumber: orderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList.length + 1,
                                            startIndex: orderStatus[itemInOrderStatus_Array.key].orderList.length,
                                            endIndex: res.data.data_thongtin_sanpham.length + orderStatus[itemInOrderStatus_Array.key].orderList.length,
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
                }
            })
        }
         
    }

    const getQuantityOrderToDevidePage = () => {
        request.get('/api/getQuantityAccountCustomerToDevidePage')
        .then(res=> {
            console.log(res.data.quantity, 'jnsjdjsbjn')
            res.data.quantity.forEach(itemStatusFromDB => {
                orderStatus_Array.forEach(itemStatus => {
                    if(itemStatusFromDB.ROLE === itemStatus.value.nameState)
                    {
                        const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MATK / numberOrderEachPage)  
                        console.log(itemStatusFromDB.SL_MATK, 'eee')
                        let arrAddToPaginationList = [];
                        for(let i = 1; i <= pageQuantityShow; i++){
                            arrAddToPaginationList.push(i);
                        console.log(pageQuantityShow, 'ffff', i);
                        }
                        setOrderStatus(prevOrderStatus => ({
                            ...prevOrderStatus, 
                            [itemStatus.key] : 
                                {...prevOrderStatus[itemStatus.key],  
                                pageQuantity: itemStatusFromDB.SL_MATK, 
                                paginationList: arrAddToPaginationList}
                        }))
                    }
                })
            });
            // console.log(orderStatus) 
         }) 
    }   
    const handleSearch = (infoSearchSendRequest) => { 
         
        Navigate(`/admin/manageAccountCustomer?keySearch=${infoSearchSendRequest.keySearchSendRequest}&typeSearch=${infoSearchSendRequest.typeSearchSendRequest}`)
        setPaginationNumberRunFirst(0);
         
    } 
    useEffect(() => {   
        orderStatus_Array.map(item => getInfoOrderForUsers(item, 1))
        getQuantityOrderToDevidePage() 
        // getInforOrderDetail(1); 
    }, [paginationNumberRunFirst === 0 && keySearchParams !== null && typeSearchParams !== null])
 
 
    useEffect(() => {   
        orderStatus_Array.map(item => getInfoOrderForUsers(item, 1) ) 
        getQuantityOrderToDevidePage()   
        console.log(orderStatus.khachHang.orderList)
    }, [])  
  
    const renderEachProduct = (orderStatus_Array, item, indexOrder) => {
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
                // <div class="order_status_cover " key={index}> {
                {
                    if(product === null){ 
                        console.log(product, 'đây null ', index)
                        return null;
                    }
                    else{
                        return (
                            <tr key={index}  id={`product_${product.MATK}`}>
                                <td data-label="Order-code">{product.TEN}</td>
                                <td data-label="Name">{product.EMAIL}</td>
                                <td data-label="Phone-number">{product.GIOITINH}</td>
                                <td data-label="Address">{product.SDT}</td> 
                                <td data-label="Address">{product.DOANHTHU}</td> 
                                <td data-label="Address">{product.SOLUONGDONHANG}</td>  
                                {/* <td data-label="update">
                                    <div class="icon-update">
                                        <FontAwesomeIcon icon={faEye} class="fa-solid fa-eye" ></FontAwesomeIcon>
                                        <span onClick={()=>handleDeleteAccountStaff(product.MATK, item)}>
                                            <FontAwesomeIcon class="fa-solid faCircleXmark" icon={faCircleXmark} ></FontAwesomeIcon>
                                        </span>
                                        <span 
                                            onClick={() =>handleUpdateState(orderStatus_Array, product.MATK, 0)} 
                                            className={`${item.value.nameState === 'Đã xác nhận' ? 'display_hidden' : ''}`}
                                        >
                                            <FontAwesomeIcon icon={faCheck} className="fa-solid faCheck"></FontAwesomeIcon>
                                        </span>
                                    </div>
                                    
                                </td> */}
                            </tr>   
                        )
                    }
                }
                // </div>  
            )  
        )
    }
    const renderPagination = (item_status) => {
        return item_status.value.paginationList.map((item_pagina) => 
            <button key={item_pagina} className="btn_pagination" onClick={() => handleClickItemPagination(item_status, item_pagina)}>{item_pagina}</button>
        )
    }
    const handlePageChange = (item_status, event, page) => {
        handleClickItemPagination(item_status, page);
    }; 

 
    const renderShowProductEveryState = orderStatus_Array.map((item, index) =>   
        {  
            // console.log(item)
            if(orderStatusPointer === item.value.nameState){
                 
                return(
                    <div 
                        class={`row justify-content-center ${orderStatusPointer === item.value.nameState ? "" : 'hiddenEachState'}`}
                        key={index} 
                    >  
                    <div class={`content_list_order`}>
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col" >Tên</th>
                                <th scope="col">EMAIL</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">Số điện thoại</th> 
                                <th scope="col">Doanh thu</th> 
                                <th scope="col">Số lượng đơn hàng</th> 
                                {/* <th scope="col"></th> */}

                            </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                { renderEachProduct(orderStatus_Array, item, index) } 
                            </tbody>
                        </table>
                    </div >
                    {/* <div className={` pagination-container`}>
                        { renderPagination(item) }
                    </div> */}
                    <div className={` pagination-container margin__bottom`}>
                        <Stack spacing={2}>
                            <Pagination 
                                count={item.value.paginationList.length} 
                                onChange={(event, page) => handlePageChange(item, event, page)}  
                                color="primary"
                            /> 
                        </Stack> 
                    </div>
                    </div> 
                ) 
            }
        }
    )

    return(
        <div class="order_info_body container">
            <div class="heading text-uppercase text-center">
                <h1>Khách hàng</h1>
            </div>
            <SearhInPageManage 
                infoSearchOption = {infoSearchOption}
                handleSearch = {handleSearch}
            />
            {/* <!-- nav bar trạng thái đơn hàng --> */}
            <div>
                <NavigationInPageManage
                    orderStatus_Array = {orderStatus_Array}
                    orderStatusPointer = {orderStatusPointer}
                    handleClickNavState = {'no use'}
                />
                {/* <!--1 đơn hàng đang giao --> */} 
                {renderShowProductEveryState}    
            </div>  
    </div>
    )
}

export default ManageAccountCustomer;