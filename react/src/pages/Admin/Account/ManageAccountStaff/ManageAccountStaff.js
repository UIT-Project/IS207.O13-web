import "./ManageAccountStaff.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';

import request from "../../../../utils/request";
  
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faClock, faFaceAngry, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {  faCheck, faEye, faL, faMagnifyingGlass, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useAuthCheck from "../../AuthCheckLogin/AuthCheckLogin";
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import SearhInPageManage from "../../ComponentUseInManyPage/SearchInPageManage/SearchInPageManage";
import NavigationInPageManage from "../../ComponentUseInManyPage/NavigationInPageManage/NavigationInPageManage";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Popup from "../../ComponentUseInManyPage/Popup/Popup";


function ManageAccountStaff()
{
    useAuthCheck()
    useEffect(() => {
        document.title = "Admin | Quản lý nhân viên"
    }, []);
    const {contentPopup, setContentPopup, openPopup} = useGlobalVariableContext();

    const numberOrderEachPage = 20; 
    const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0); 
    const [watchProductDetail, setWatchProductDetail] = useState(false); 

    //update
    const searchParams  = new URLSearchParams(window.location.search);
    
    const nameStatusParam = searchParams.get('nameStatus');
    const keySearchParams = searchParams.get('keySearch');
    const typeSearchParams = searchParams.get('typeSearch');
    
    const infoSearchOption = [
        {
            value: 'TEN',
            show: 'Tên nhân viên',
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
    let i = 0; 
    const [listMASPTranferState, setListMASPTranferState] = useState([]); 
    const Navigate = useNavigate(); 
     
    const [orderStatus, setOrderStatus] = useState({
        choXacNhan:{
            nameState: 'Chờ xác nhận',
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
        daXacNhan: {
            nameState: 'Đã xác nhận',
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
        nameStatusParam ? orderStatus[nameStatusParam]?.nameState : orderStatus.choXacNhan.nameState
    );
    
    const [approveDelete, setApproveDelete] = useState(false)
    const [itemToDelete, setItemToDelete] = useState({
        matk: null,
        item_ofOrderStatusArray: null,
    });
  
    const confirmDelete = () => {
        const popupContainer = document.querySelector(".popup-container");
        popupContainer.style.opacity = "0";
        popupContainer.style.transform = "scale(0.8)";

        let item_ofOrderStatusArray = itemToDelete.item_ofOrderStatusArray;
        let matk = itemToDelete.matk;

        setOrderStatus(prevOrderStatus => ({
            ...prevOrderStatus, 
            [item_ofOrderStatusArray.key] : 
                {...prevOrderStatus[item_ofOrderStatusArray.key],  
                orderList: prevOrderStatus[item_ofOrderStatusArray.key].orderList.map(item => {
                    if(item !== null){
                        if(item.MATK === matk){
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
        console.log(matk)
        request.post(`api/deleteAccountStaff?matk=${matk}`)
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
        setTimeout(() => {
            const popupOverlay = document.querySelector(".popup-overlay");
            popupOverlay.style.display = "none";
        }, 300);
    };

  

    //manageProduct
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const handleClickNavState = (item_status, item_pagina) => {
        // console.log(e.target.value) 
        console.log(item_status.value.hasChangeFromPreState, 'ksdnksdkns')
        setOrderStatusPointer(item_status.value.nameState) 
        if( item_status.value.hasChangeFromPreState === 1){ 
            const updateOpeningPage = prevOrderStatus => (
                {
                    ...prevOrderStatus, 
                    [item_status.key] : {
                        ...prevOrderStatus[item_status.key],  
                        openingPage:  item_pagina,
                        hasChangeFromPreState: 0,
                    }
                }
            );
            setOrderStatus(updateOpeningPage) 
            getInfoOrderForUsers(item_status, item_pagina); 
        } 
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
 

    const handleUpdateState = (orderStatus_Array, matk, index) => {
        console.log(listMASPTranferState);
        const itemWillUpdate = orderStatus_Array[index+1];
        const itemCurent = orderStatus_Array[index];
        const data = {
            nameStatusWillUpdate: itemWillUpdate.value.nameState,
            matk: matk
        }
        
        setOrderStatus({
            ...orderStatus, 
            [itemWillUpdate.key]: {
                ...orderStatus[itemWillUpdate.key],
                hasChangeFromPreState: 1,
            },
            [itemCurent.key]: {
                ...orderStatus[itemCurent.key], 
                orderList: orderStatus[itemCurent.key].orderList.map(item =>{
                    if(item !== null){
                        if(item.MATK == matk) 
                            return null; 
                        else{
                            return item;
                        }
                    }
                    else{
                        return item;
                    } 
                })
            }
        })
        try{ 
            request.post(
                `api/updateStatusOfAccountStaff`, data
            )
            .then(res => {
                        
                let indexNull = {
                    start: 0,
                    end: 0,
                } 
                itemCurent.value.spaceGetDataFromOrderList.forEach(item => {
                    if(itemCurent.value.openingPage === item.paginationNumber){ 
                        indexNull.start = item.startIndex;
                        indexNull.end = item.endIndex;
                    }
                })
                // index.end = item_ofOrderStatusArray.value.openingPage * numberOrderEachPage - 1;
                console.log(indexNull.start, ' ', indexNull.end, 'orderlist: ', itemCurent.value.orderList)
                // nếu toàn bộ item_ofOrderStatusArray từ start đến end thì reload trang
                let i = 0; 
                itemCurent.value.orderList.slice(indexNull.start, indexNull.end).forEach(item => {
                    if(item === null){
                        i++;
                    }
                })
                console.log(i + 1 , ' ', indexNull.end)

                if(i + 1 === indexNull.end)  
                    window.location.reload(); 
            }) 
        }
        catch(err){
            console.log(err)
        }
        setListMASPTranferState([]);
    }

    const handleDeleteAccountStaff = (matk, item_ofOrderStatusArray) => {  
        setContentPopup({
            title: 'Xoá tài khoản',
            content: 'Bạn có chắc muốn xoá tài khoản này không'
        })
        // setApproveDelete(true)
        openPopup()
        setItemToDelete({matk, item_ofOrderStatusArray}) 
    }

    const getInfoOrderForUsers =  (itemInOrderStatus_Array, openingPage) => {   
        const queryForGetInfoOrderForUsers = { 
            start: numberOrderEachPage * ( openingPage - 1),
            AdminVerify: itemInOrderStatus_Array.value.nameState,
            numberOrderEachPage: numberOrderEachPage,
            keySearch: keySearchParams,
            typeSearch: typeSearchParams
        }  
        if(keySearchParams === null && typeSearchParams === null)
            request.get(`/api/getInfoManageAccountStaff`, {params: queryForGetInfoOrderForUsers}) 
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
        else{
            request.get(`/api/searchAccountStaff`, {params: queryForGetInfoOrderForUsers}) 
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
        request.get('/api/getQuantityAccountStaffToDevidePage')
        .then(res=> {
            console.log(res.data.quantity, 'jnsjdjsbjn')
            res.data.quantity.forEach(itemStatusFromDB => {
                orderStatus_Array.forEach(itemStatus => {
                    if(itemStatusFromDB.AdminVerify === itemStatus.value.nameState)
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
 
    const handlePageChange = (item_status, event, page) => {
        handleClickItemPagination(item_status, page);
    };
    const handleSearch = (infoSearchSendRequest) => { 
         
        Navigate(`/admin/manageAccountStaff?keySearch=${infoSearchSendRequest.keySearchSendRequest}&typeSearch=${infoSearchSendRequest.typeSearchSendRequest}`)
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
        console.log(orderStatus.choXacNhan.orderList)
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
                                <td data-label="update">
                                    <div class="icon-update">
                                        {/* <FontAwesomeIcon icon={faEye} class="fa-solid fa-eye" ></FontAwesomeIcon> */}
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
                                    
                                </td>
                            </tr>   
                        )
                    }
                }
                // </div>  
            )  
        )
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
                    <div class={`content_list_order  ${watchProductDetail ? "display_hidden" : ""}`}>
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col" >Tên</th>
                                <th scope="col">EMAIL</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">Số điện thoại</th> 
                                <th scope="col"></th>

                            </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                { renderEachProduct(orderStatus_Array, item, index) } 
                            </tbody>
                        </table>
                    </div>
                        {/* { renderPagination(item) } */}
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
                <h1>Nhân viên</h1>
            </div>
            <Popup
                contentPopup = {contentPopup}
                confirm = {confirmDelete}
            />
            <SearhInPageManage 
                infoSearchOption = {infoSearchOption}
                handleSearch = {handleSearch}
            />
            {/* <!-- nav bar trạng thái đơn hàng --> */}
            <div className={`${watchProductDetail ? 'display_hidden' : ''}`}>
                <NavigationInPageManage
                    orderStatus_Array = {orderStatus_Array}
                    orderStatusPointer = {orderStatusPointer}
                    handleClickNavState = {handleClickNavState}
                />
                {/* <!--1 đơn hàng đang giao --> */} 
                {renderShowProductEveryState}    
            </div>  
    </div>
    )
}

export default ManageAccountStaff;