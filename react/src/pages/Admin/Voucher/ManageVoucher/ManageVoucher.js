import "./ManageVoucher.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';

import request from "../../../../utils/request";
  
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {  faCircleChevronLeft, faEye, faFloppyDisk, faL, faMagnifyingGlass, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import useAuthCheck from "../../AuthCheckLogin/AuthCheckLogin";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack'; 
import UpdateVoucher from "../UpdateVoucher/UpdateVoucher";
import SearhInPageManage from "../../ComponentUseInManyPage/SearchInPageManage/SearchInPageManage";
import NavigationInPageManage from "../../ComponentUseInManyPage/NavigationInPageManage/NavigationInPageManage";

function ManageVoucher()
{
    useAuthCheck()
    useEffect(() => {
        document.title = "Admin | Quản lý voucher"
     }, []); 
    const numberOrderEachPage = 20;  
    const [watchVoucherDetail, setWatchVoucherDetail] = useState(false); 
    const [beforeNullOrHaveMavoucher, setBeforeNullOrHaveMavoucher] = useState(null);
    const infoSearchOption = [
        {
            value: 'MAVOUCHER',
            show: 'Mã Voucher',
        }, 
    ]
    const searchParams  = new URLSearchParams(window.location.search); 
    const nameStatusParam = searchParams.get('nameStatus');
    
    var keySearchParams = searchParams.get('keySearch');
    var typeSearchParams = searchParams.get('typeSearch');
    const {formatPrice, contentPopup, setContentPopup, openPopup} = useGlobalVariableContext(); 
 
    const Navigate = useNavigate();  
    const [orderStatus, setOrderStatus] = useState({
        chuaApDung:{
            nameState: 'Chưa áp dụng',
            orderList: [],
            pageQuantity: null,
            paginationList: [],
            openingPage: 1,
            indexOfOderListHelpDelete: 0,
            spaceGetDataFromOrderList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberOrderEachPage,
            }]
        },
        dangApDung: {
            nameState: 'Đang áp dụng',
            orderList: [],
            pageQuantity: null,
            paginationList: [],
            openingPage: 1, 
            indexOfOderListHelpDelete: 0,
            spaceGetDataFromOrderList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberOrderEachPage,
            }]
        },
        daApDung: {
            nameState: 'Đã qua sử dụng',
            orderList: [],
            pageQuantity: null,
            paginationList: [],
            openingPage: 1, 
            indexOfOderListHelpDelete: 0,
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
        nameStatusParam ? orderStatus[nameStatusParam]?.nameState : orderStatus.chuaApDung.nameState
    ); 
 
 
    useEffect(() => {   
        const mavoucher = searchParams.get('mavoucher'); 
        if(mavoucher === null){ 
            setWatchVoucherDetail(false);
            setBeforeNullOrHaveMavoucher(null)
        }
        else{
            setWatchVoucherDetail(true); 
            setBeforeNullOrHaveMavoucher(mavoucher)
        }

        if(keySearchParams !== null && typeSearchParams !== null){ 
            orderStatus_Array.map(item => getInfoOrderForUsers(item, 1) ) 
            getQuantityOrderToDevidePage()
        }
        else if(keySearchParams === null && typeSearchParams === null && beforeNullOrHaveMavoucher === null && mavoucher === null){
            orderStatus_Array.map(item => getInfoOrderForUsers(item, 1) ) 
            getQuantityOrderToDevidePage()
        }

        if(beforeNullOrHaveMavoucher === null && mavoucher === null){ 
            orderStatus_Array.reverse().forEach(item_status => {
                setOrderStatusPointer(item_status.value.nameState)  
                const updateOpeningPage = prevOrderStatus => (
                    {
                        ...prevOrderStatus, 
                        [item_status.key] : {
                            ...prevOrderStatus[item_status.key],  
                            openingPage:  1
                        }
                    }
                );
                setOrderStatus(updateOpeningPage)    
            })  
        }

    }, [window.location.search]);
  

    //manageVoucher
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

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
        // console.log(item_status, 'test', item_pagina);
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
 

    const handleWatchVoucherDetail = (item, mavoucher) => { 
        Navigate(`/admin/manageVoucher?mavoucher=${mavoucher}`);
    }

    const handleDeleteVoucher = (mavoucher, item_ofOrderStatusArray) => {  
        
        setOrderStatus(prevOrderStatus => ({
            ...prevOrderStatus, 
            [item_ofOrderStatusArray.key] : 
                {...prevOrderStatus[item_ofOrderStatusArray.key],  
                orderList: prevOrderStatus[item_ofOrderStatusArray.key].orderList.map(item => {
                    if(item !== null){
                        if(item.MAVOUCHER === mavoucher){
                            return null;
                        }
                        else{
                            return item;
                        }
                    }
                    else{
                        return item;
                    }
                })}
        }))  

        request.post(`api/deleteVoucher?mavoucher=${mavoucher}`)
        .then(res => {
            console.log(res)
            let index = {
                start: 0,
                end: 0,
            } 
            item_ofOrderStatusArray.value.spaceGetDataFromOrderList.forEach(item => {
                if(item_ofOrderStatusArray.value.openingPage === item.paginationNumber){ 
                    index.start = item.startIndex;
                    index.end = item.endIndex;
                }
            })
            // index.end = item_ofOrderStatusArray.value.openingPage * numberOrderEachPage - 1;
            console.log(index.start, ' ', index.end, 'orderlist: ', item_ofOrderStatusArray.value.orderList)
            // nếu toàn bộ item_ofOrderStatusArray từ start đến end thì reload trang
            let i = 0;
            item_ofOrderStatusArray.value.orderList.slice(index.start, index.end).forEach(item => {
                if(item === null){
                    i++;
                }
            }) 
            if(i + 1 === index.end) 
                window.location.reload(); 
        })
        
    }

    const getInfoOrderForUsers =  (itemInOrderStatus_Array, openingPage) => {   
          
        console.log(typeSearchParams, keySearchParams, 'cmaisnu3') 
        const queryForGetInfoOrderForUsers = { 
            start: numberOrderEachPage * ( openingPage - 1),
            tenDanhMuc: itemInOrderStatus_Array.value.nameState,
            numberOrderEachPage: numberOrderEachPage,
            keySearch: keySearchParams,
            typeSearch: typeSearchParams,
        }  
        if(typeSearchParams === null && keySearchParams === null){
            request.get(`/api/getInfoManageVoucher`, {params: queryForGetInfoOrderForUsers}) 
            .then(res=>{  
                console.log(res.data)
                if(res.data.data_thongtin_sanpham.length == 0 && openingPage !== 1){
                    window.location.reload();
                }
                else{ 
                    setOrderStatus(prevOrderStatus => { 
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
                    )   
                }
            })   
        }
        else{  
            try{
                request.get(`/api/getInfoSearchVoucher`, {params: queryForGetInfoOrderForUsers})
                .then(res=>{       
                    setOrderStatus(prevOrderStatus => { 
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
                    )   
                }) 
            }
            catch(err){
                console.log(err)
            }
        }
         
    } 

    const getQuantityOrderToDevidePage = () => {
        if(typeSearchParams === null && keySearchParams === null){ 
            request.get('/api/getQuantityVoucherToDevidePage')
            .then(res=> { 
                res.data.quantity.forEach(itemStatusFromDB => {
                    orderStatus_Array.forEach(itemStatus => {
                        if(itemStatusFromDB.TEN_TRANGTHAI === itemStatus.value.nameState){
                            const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MAVOUCHER / numberOrderEachPage) 
                            
                            let arrAddToPaginationList = [];
                            for(let i = 1; i <= pageQuantityShow; i++){
                                arrAddToPaginationList.push(i); 
                            }

                            setOrderStatus(prevOrderStatus => ({
                                ...prevOrderStatus, 
                                [itemStatus.key] : 
                                {...prevOrderStatus[itemStatus.key],  
                                pageQuantity: itemStatusFromDB.SL_MAVOUCHER, 
                                paginationList: arrAddToPaginationList}
                            }))
                        }
                    })
                }); 
            }) 
        }
        else{
            const data = {
                keySearch: keySearchParams,
                typeSearch: typeSearchParams
            }
            request.get('/api/getQuantityVoucherToDevidePageSearch', {params: data})
            .then(res=> { 
                console.log(res, 'cschj')
                res.data.quantity.forEach(itemStatusFromDB => {
                    orderStatus_Array.forEach(itemStatus => {
                        if(itemStatusFromDB.TEN_TRANGTHAI === itemStatus.value.nameState)
                        {
                            const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MAVOUCHER / numberOrderEachPage) 
                            
                            let arrAddToPaginationList = [];
                            for(let i = 1; i <= pageQuantityShow; i++){
                                arrAddToPaginationList.push(i); 
                            }

                            setOrderStatus(prevOrderStatus => ({
                                ...prevOrderStatus, 
                                [itemStatus.key] : 
                                    {...prevOrderStatus[itemStatus.key],  
                                    pageQuantity: itemStatusFromDB.SL_MAVOUCHER, 
                                    paginationList: arrAddToPaginationList}
                            }))
                        }
                    })
                }); 
            }) 
        }
    }   

    const handleSearch = (infoSearchSendRequest) => { 
        Navigate(`/admin/manageVoucher?keySearch=${infoSearchSendRequest.keySearchSendRequest}&typeSearch=${infoSearchSendRequest.typeSearchSendRequest}`)
    }
  
      
    const renderEachVoucher = (item, indexOrder) => {
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
        return ( 
            item.value.orderList.slice(index.start, index.end).map((voucher, index) =>  
                {
                    if(voucher === null){ 
                        console.log(voucher, 'đây null ', index)
                        return null;
                    }
                    else{
                        return (
                            <tr key={index}  id={`voucher_${voucher.MAVOUCHER}`}>
                                <td data-label="Order-code">{voucher.MAVOUCHER}</td> 
                                <td data-label="Order-code">{voucher.PHANLOAI_VOUCHER}</td>
                                <td data-label="Name">{voucher.GIATRIGIAM}</td>
                                <td data-label="Phone-number">{voucher.THOIGIANBD}</td>
                                <td data-label="Address">{voucher.THOIGIANKT}</td>
                                <td data-label="Day">{voucher.SOLUONG}</td>
                                <td data-label="Day">{formatPrice(voucher.GIATRI_DH_MIN)}</td>
                                <td data-label="Day">{formatPrice(voucher.GIATRI_GIAM_MAX)}</td> 
                                <td data-label="update">
                                    <div class="icon-update">
                                        {/* <FontAwesomeIcon  class="fa-solid fa-pen-to-square" icon={faPenToSquare} ></FontAwesomeIcon> */}
                                        <span 
                                            onClick={()=>handleWatchVoucherDetail(item, voucher.MAVOUCHER, voucher)} 
                                            className={`${item.value.nameState === 'Chưa áp dụng' ? '' : ''}`}
                                        >
                                            <FontAwesomeIcon icon={faEye} class="fa-solid fa-eye"  ></FontAwesomeIcon>
                                        </span>
                                        <span onClick={() =>handleDeleteVoucher(voucher.MAVOUCHER, item)}>
                                            <FontAwesomeIcon 
                                                icon={faTrashAlt} 
                                                className={`faTrashAlt ${item.value.nameState === 'Chưa áp dụng' ? '' : 'display_hidden'}`}
                                            ></FontAwesomeIcon>
                                        </span>
                                    </div>
                                    
                                </td>
                            </tr>   
                        )
                    }
                } 
            )  
        )
    }
 
    const handlePageChange = (item_status, event, page) => {
        handleClickItemPagination(item_status, page);
    };
    
    const renderShowVoucherEveryState = orderStatus_Array.map((item, index) =>   
        {  
            // console.log(item)
            if(orderStatusPointer === item.value.nameState){
                 
                return(
                    <div 
                        class={`row justify-content-center ${orderStatusPointer === item.value.nameState ? "" : 'hiddenEachState'}`}
                        key={index} 
                    >  
                    <div class={`content_list_order  ${watchVoucherDetail ? "display_hidden" : ""}`}>
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col" >Mã Voucher</th>
                                <th scope="col">Loại Voucher</th>
                                <th scope="col">Giá trị giảm</th>
                                <th scope="col">Thời gian bắt đầu</th>
                                <th scope="col" >Thời gian kết thúc</th> 
                                <th scope="col" >Số lượng</th> 
                                <th scope="col" >Giá trị đơn hàng tối thiểu</th> 
                                <th scope="col" >Giá giảm tối đa</th> 
                                <th scope="col"></th>

                            </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                { renderEachVoucher(item, index) } 
                            </tbody>
                        </table>
                    </div> 
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
                <h1>Voucher</h1>
            </div>
            <SearhInPageManage 
                infoSearchOption = {infoSearchOption}
                handleSearch = {handleSearch}
            />
            {/* <!-- nav bar trạng thái đơn hàng --> */}
            <div className={`${watchVoucherDetail ? 'display_hidden' : ''}`}>
                <NavigationInPageManage
                    orderStatus_Array = {orderStatus_Array}
                    orderStatusPointer = {orderStatusPointer}
                    handleClickNavState = {handleClickNavState}
                />
                {/* <!--1 đơn hàng đang giao --> */} 
                {renderShowVoucherEveryState}    
            </div>  
            <div  className={`${watchVoucherDetail ? '' : 'display_hidden'}`}> 
                <UpdateVoucher
                    orderStatusPointer = {orderStatusPointer}
                    orderStatus = {orderStatus} 
                />
            </div>
    </div>
    )
}

export default ManageVoucher;