import "./manageOrder.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print'
import request from "../../../utils/request";  
import { useEffect, useState } from "react";
import { renderMatches, unstable_useBlocker, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faCircleChevronLeft, faEye, faFloppyDisk, faL, faLeftLong, faMagnifyingGlass, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";

import SelectLimit from "./selectLimit";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import useAuthCheck from "../AuthCheckLogin/AuthCheckLogin";


function ManageOrder(){
    // function handlePageChange(value, item_state){
    //     if(value === "&laquo;" || value==="..."){
    //         setOrderStatus(prevOrderStatus => { 
    //             return {
    //                 ...prevOrderStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    //                 [item_state.key] : 
    //                 {   
    //                     ...prevOrderStatus[item_state.key],  
    //                     openingPage: 1
    //                 }
    //             }  
    //         })
    //         getInfoOrderForUsers(item_state, 1);

    //         handleScrollToTop();
    //     } else if(value === "&lsaquo;"){
    //         if(item_state.value.openingPage!==1){
    //             setOrderStatus(prevOrderStatus => { 
    //                 return {
    //                     ...prevOrderStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    //                     [item_state.key] : 
    //                     {   
    //                         ...prevOrderStatus[item_state.key],  
    //                         openingPage: item_state.value.openingPage-1
    //                     }
    //                 }  
    //             })
    //         }
    //         getInfoOrderForUsers(item_state, item_state.value.openingPage-1);
    //         handleScrollToTop();
    //     } else if(value === "&rsaquo;"){
    //         if(item_state.value.openingPage!==item_state.value.paginationList.length){
    //             setOrderStatus(prevOrderStatus => { 
    //                 return {
    //                     ...prevOrderStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    //                     [item_state.key] : 
    //                     {   
    //                         ...prevOrderStatus[item_state.key],  
    //                         openingPage: item_state.value.openingPage+1
    //                     }
    //                 }  
    //             })
                
    //         }
    //         getInfoOrderForUsers(item_state, item_state.value.openingPage+1);
    //         handleScrollToTop();
    //     } else if(value === "&raquo;" ){
    //         setOrderStatus(prevOrderStatus => { 
    //             return {
    //                 ...prevOrderStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    //                 [item_state.key] : 
    //                 {   
    //                     ...prevOrderStatus[item_state.key],  
    //                     openingPage: item_state.value.paginationList.length
    //                 }
    //             }  
    //         })
    //         getInfoOrderForUsers(item_state, item_state.value.paginationList.length);
    //         handleScrollToTop();
    //     } else{
    //         setOrderStatus(prevOrderStatus => { 
    //             return {
    //                 ...prevOrderStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    //                 [item_state.key] : 
    //                 {   
    //                     ...prevOrderStatus[item_state.key],  
    //                     openingPage: value
    //                 }
    //             }  
    //         })
    //         getInfoOrderForUsers(item_state, value);
    //         handleScrollToTop();
    //     }
    // }
    useAuthCheck()
    useEffect(() => {
        document.title = "Admin | Quản lý đơn hàng"
     }, []);
    const {formatPrice} = useGlobalVariableContext(); 
    const componentRef = useRef();
    const handlePrint_A4 = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'emp-data',
        onAfterPrint: () => {
            
            setInfoOrderDetail_many([])
            alert('Print success')
        }
    });
    
    const [numberOrderEachPage,setLimit] = useState(20);
    const [xoadau, setXoaDau] = useState(0);
    const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0); 
    const [watchOrderDetail, setWatchOrderDetail] = useState(false);
    const [infoOrderDetail, setInfoOrderDetail] = useState({
        data_relative_Donhang: [],
        data_sanPham_relative_CTDH: [],
    })
    const [infoOrderDetail_many, setInfoOrderDetail_many] = useState([])
    const [note, setNote] = useState('');
    const [keySearchSendRequest, setKeySearchSendRequest] = useState('');
    const [typeSearchSendRequest, setTypeSearchSendRequest] = useState('MADH');
    const [listMASPTranferState, setListMASPTranferState] = useState([]);
    const [isCheckedAll, setIsCheckedAll] = useState(false); 
    const Navigate = useNavigate();
    const searchParams  = new URLSearchParams(window.location.search);
    var keySearchParams = searchParams.get('keySearch');
    const typeSearchParams = searchParams.get('typeSearch');
    const [contentPopup, setContentPopup] = useState({
        title: '',
        content: '',
    })
    const [approveUpdate, setApproveUpdate] = useState(false);
    const [isPopupUpdate, setIsPopupUpdate] = useState(false);
    const openPopup = () => {
        const popupOverlay = document.querySelector(".popup-overlay");
        const popupContainer = document.querySelector(".popup-container");
    
        popupOverlay.style.display = "flex";
        setTimeout(() => {
          popupContainer.style.opacity = "1";
          popupContainer.style.transform = "scale(1)";
        }, 100);
    };
 
    const closePopup = () => {
        const popupContainer = document.querySelector(".popup-container");
        popupContainer.style.opacity = "0";
        popupContainer.style.transform = "scale(0.8)";
        setTimeout(() => {
            const popupOverlay = document.querySelector(".popup-overlay");
            popupOverlay.style.display = "none";
        }, 300);
    }; 
    const closePopup_Update = () => {
        const popupContainer = document.querySelector(".popup-container");
        popupContainer.style.opacity = "0";
        popupContainer.style.transform = "scale(0.8)";
        setTimeout(() => {
            const popupOverlay = document.querySelector(".popup-overlay");
            popupOverlay.style.display = "none";
        }, 300);

        
        setOrderStatus({
            ...orderStatus, 
            [dataToUpdateState.itemWillUpdate.key]: {
                ...orderStatus[dataToUpdateState.itemWillUpdate.key],
                hasChangeFromPreState: 1,
            },
            [dataToUpdateState.itemCurent.key]: {
                ...orderStatus[dataToUpdateState.itemCurent.key], 
                orderList: orderStatus[dataToUpdateState.itemCurent.key].orderList.map(item =>{
                    if(item !== null){
                        if(listMASPTranferState.includes(item.MADH)) 
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
                `api/updateOrderStatus`, dataToUpdateState.data
            )
            .then(res => {
                        
                let indexNull = {
                    start: 0,
                    end: 0,
                } 
                dataToUpdateState.itemCurent.value.spaceGetDataFromOrderList.forEach(item => {
                    if(dataToUpdateState.itemCurent.value.openingPage === item.paginationNumber){ 
                        indexNull.start = item.startIndex;
                        indexNull.end = item.endIndex;
                    }
                })
                // index.end = item_ofOrderStatusArray.value.openingPage * numberOrderEachPage - 1;
                // console.log(indexNull.start, ' ', indexNull.end, 'orderlist: ', itemCurent.value.orderList)
                // nếu toàn bộ item_ofOrderStatusArray từ start đến end thì reload trang
                let i = 0; 
                dataToUpdateState.itemCurent.value.orderList.slice(indexNull.start, indexNull.end).forEach(item => {
                    if(item === null){
                        i++;
                    }
                })
                // console.log(i + listMASPTranferState.length , ' ', indexNull.end)

                // if(i + listMASPTranferState.length === indexNull.end)  
                setTimeout(() => {
                    window.location.reload(); 
                }, 1500);  
            }) 
        }
        catch(err){
            console.log(err)
        }
        setListMASPTranferState([]);
        if(isCheckedAll) 
            setTimeout(() => {
                window.location.reload(); 
            }, 1500);
        setIsPopupUpdate(false)
        // const interval = setInterval(() => { 
        //     if (listMASPTranferState) {
        //         // Thực hiện hành động cần thiết
        //     }
        // }, 1000); 
     
        // return () => clearInterval(interval);
    }; 

    const [orderStatus, setOrderStatus] = useState({
        chuanbihang:{
            nameState: 'Chuẩn bị hàng',
            orderList: [],
            pageQuantity: null,
            paginationList: [],
            openingPage: 1,
            hasLoadFirtTime: 0,
            hasChangeFromPreState: 0,
            itemQuantity: 0,
            spaceGetDataFromOrderList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberOrderEachPage,
            }]
        },
        danggiao: {
            nameState: 'Đang giao',
            orderList: [],
            pageQuantity: null,
            paginationList: [],
            openingPage: 1, 
            hasLoadFirtTime: 0,
            hasChangeFromPreState: 0,
            itemQuantity: 0,
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
            pageQuantity: null,
            paginationList: [],
            openingPage: 1, 
            hasLoadFirtTime: 0,
            hasChangeFromPreState: 0,
            itemQuantity: 0,
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
            pageQuantity: null,
            paginationList: [],
            openingPage: 1, 
            hasLoadFirtTime: 0,
            hasChangeFromPreState: 0,
            itemQuantity: 0,
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
    const [prepareSearching, setPrepareSearching] = useState(0);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };
    const [orderStatusPointer, setOrderStatusPointer] = useState(
        orderStatus.chuanbihang.nameState
    );
    const handleSaveEditNote = (madh) => {
        saveNote(madh, note)
        
    }
    const handleClickNavState = (item_status, item_pagina) => {
        // console.log(e.target.value) 
        
        setOrderStatusPointer(item_status.value.nameState) 
        if(item_status.value.hasLoadFirtTime === 0 || item_status.value.hasChangeFromPreState === 1){
            const updateOpeningPage = prevOrderStatus => (
                {
                    ...prevOrderStatus, 
                    [item_status.key] : {
                        ...prevOrderStatus[item_status.key], 
                            openingPage:  item_pagina,
                            hasLoadFirtTime: 1,
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

    const handleTurnBack = () => {
        setWatchOrderDetail(false);
    }

    const handleWatchOrderDetail = (madh) => {
        getInforOrderDetail(madh);
        // setWatchOrderDetail(true); 
    }

    const handleInputNote = (e) => {
        setNote(e.target.value)
        console.log(note)
    }

    const getInfoOrderForUsers =  (itemInOrderStatus_Array, openingPage) => {    
        if(typeSearchParams === 'MADH'){
            keySearchParams = parseInt(keySearchParams);
        }
        const queryForGetInfoOrderForUsers = { 
            start: numberOrderEachPage * ( openingPage - 1),
            tenTrangThai: itemInOrderStatus_Array.value.nameState,
            numberOrderEachPage: numberOrderEachPage,
            keySearch: keySearchParams,
            typeSearch: typeSearchParams,
        }  

        
        if(keySearchParams === null && typeSearchParams === null){
            try{
                request.get(`/api/getInfoManageOrder`, {params: queryForGetInfoOrderForUsers})
                    // request.get('api/getInfoManageOrder', queryForGetInfoOrderForUsers)
                .then(res=>{      
        
                    setOrderStatus(prevOrderStatus => {
                        const itemIndex = prevOrderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList.findIndex(
                            item => item.paginationNumber === openingPage
                        );
                        if(itemIndex === -1 || (openingPage === 1 && paginationNumberRunFirst === 0)){
                            setPaginationNumberRunFirst(1);
                            // console.log(res.data.orderList_DB.length)
                            console.log(res.data, 'okk') ;

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
        else{
            try{ 
                request.get(`/api/getInfoSearchOrder`, {params: queryForGetInfoOrderForUsers})
                    // request.get('api/getInfoManageOrder', queryForGetInfoOrderForUsers)
                .then(res=>{       
                    setOrderStatus(prevOrderStatus => {
                            const itemIndex = prevOrderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList.findIndex(
                                item => item.paginationNumber === openingPage
                            );
                            if(itemIndex === -1 || (openingPage === 1 && paginationNumberRunFirst === 0)){
                                setPaginationNumberRunFirst(1);
                                console.log(res.data.orderList_DB, 'okk2') ;
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
         
    }

    const getQuantityOrderToDevidePage = () => {
        if(keySearchParams === null && typeSearchParams === null){
            request.get('/api/getQuantityOrderToDevidePage')
            .then(res=> {
                orderStatus_Array.forEach(itemStatus => {
                    let found = false;
                    res.data.quantity.forEach(itemStatusFromDB => {
                        if(itemStatusFromDB.TRANGTHAI_DONHANG === itemStatus.value.nameState)
                        {
                            found = true

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
                    if(found === false){
                        setOrderStatus(prevOrderStatus => ({
                            ...prevOrderStatus, 
                            [itemStatus.key] : 
                                {...prevOrderStatus[itemStatus.key],  
                                pageQuantity: 0, 
                                paginationList: []}
                        }))
                    } 
                });
                
                // console.log(orderStatus) 
             }) 
        }
        else{
            if(typeSearchParams === 'MADH'){
                keySearchParams = parseInt(keySearchParams);
            }
            const data = {
                keySearch: keySearchParams,
                typeSearch: typeSearchParams,
            }
            request.get(`/api/getQuantityOrderToDevidePage_Search`, {params: data})
            .then(res => {
                orderStatus_Array.forEach(itemStatus => {
                    let found = false;
                    res.data.quantity.forEach(itemStatusFromDB => {
                        if(itemStatusFromDB.TRANGTHAI_DONHANG === itemStatus.value.nameState)
                        {
                            found = true

                            const pageQuantityShow = parseInt(itemStatusFromDB.SL_MADH / numberOrderEachPage) + ((itemStatusFromDB.SL_MADH % numberOrderEachPage) > 0 ? 1 : 0)
                            console.log((itemStatusFromDB.SL_MADH), 'ákjdksdjks')
                            let arrAddToPaginationList = [];
                            for(let i = 1; i <= pageQuantityShow; i++)
                                arrAddToPaginationList.push(i);
                            // console.log(pageQuantityShow);
                            setOrderStatus(prevOrderStatus => ({
                                ...prevOrderStatus, 
                                [itemStatus.key] : {
                                    ...prevOrderStatus[itemStatus.key],  
                                    pageQuantity: itemStatusFromDB.SL_MADH, 
                                    paginationList: arrAddToPaginationList,  
                                }
                            }))
                        }
                        if(found === false){
                            setOrderStatus(prevOrderStatus => ({
                                ...prevOrderStatus, 
                                [itemStatus.key] : 
                                    {...prevOrderStatus[itemStatus.key],  
                                    pageQuantity: 0, 
                                    paginationList: []}
                            }))
                        } 
                    })
                });
                // console.log(orderStatus) 
             }) 
        }
    }
    
    const getInforOrderDetail = (madh) => {
        const data = {
            madh: madh
        }
        console.log(typeof(data.madh))
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
            console.log('aksjdkkkjkj ', res.data.data_sanPham_relative_CTDH, '09090', res.data.data_relative_Donhang);
            setNote(res.data.data_relative_Donhang[0].GHICHU === null ? '' : res.data.data_relative_Donhang[0].GHICHU);
            setWatchOrderDetail(true); 
        })
    };

    const getInforOrderDetail__many = (madh) => {
        const data = {
            madh: madh
        }

        request.get(`/api/infoOrderDetail`, {params: data})
        .then(res => {  
            // if(typeof res.data.data_relative_Donhang !== 'object')
                // setInfoOrderDetail_many([
                //     ...infoOrderDetail_many,
                //     {
                //         data_relative_Donhang: res.data.data_relative_Donhang[0],
                //         data_sanPham_relative_CTDH: res.data.data_sanPham_relative_CTDH,
                //     }
                // ])  
                const newInfoDetail = {
                    data_relative_Donhang: res.data.data_relative_Donhang[0],
                    data_sanPham_relative_CTDH: res.data.data_sanPham_relative_CTDH,
                };
        
                setInfoOrderDetail_many(prevInfo => [...prevInfo, newInfoDetail]);
                
            // else
            // setInfoOrderDetail({
            //     data_relative_Donhang: res.data.data_relative_Donhang,
            //     data_sanPham_relative_CTDH: res.data.data_sanPham_relative_CTDH,
            // })
            setNote(res.data.data_relative_Donhang[0].GHICHU);
            console.log('aksjdkkkjkj ', infoOrderDetail_many);
            // setWatchOrderDetail(true); 
            // console.log(infoOrderDetail_many)
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
                setContentPopup({
                    title: 'Lưu ghi chú',
                    content: 'Lưu ghi chú thành công'
                })
                openPopup()
            })
        }
        catch(err){
            setContentPopup({
                title: 'Lưu ghi chú',
                content: 'Lưu ghi chú thất bại'
            })
            openPopup()
        }
    }

    const handleSearchInput = (e) => {
        setKeySearchSendRequest(e.target.value)
    }

    const handleSearch = () => { 
        
        setOrderStatus({
            chuanbihang:{
                nameState: 'Chuẩn bị hàng',
                orderList: [],
                pageQuantity: null,
                paginationList: [],
                openingPage: 1,
                hasLoadFirtTime: 0,
                hasChangeFromPreState: 0,
                itemQuantity: 0,
                spaceGetDataFromOrderList: [{
                    paginationNumber: 1,
                    ordinalNumber: 1,
                    startIndex: 0,
                    endIndex: numberOrderEachPage,
                }]
            },
            danggiao: {
                nameState: 'Đang giao',
                orderList: [],
                pageQuantity: null,
                paginationList: [],
                openingPage: 1, 
                hasLoadFirtTime: 0,
                hasChangeFromPreState: 0,
                itemQuantity: 0,
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
                pageQuantity: null,
                paginationList: [],
                openingPage: 1, 
                hasLoadFirtTime: 0,
                hasChangeFromPreState: 0,
                itemQuantity: 0,
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
                pageQuantity: null,
                paginationList: [],
                openingPage: 1, 
                hasLoadFirtTime: 0,
                hasChangeFromPreState: 0,
                itemQuantity: 0,
                spaceGetDataFromOrderList: [{
                    paginationNumber: 1,
                    ordinalNumber: 1,
                    startIndex: 0,
                    endIndex: numberOrderEachPage,
                }]
            }  
        }) 
        Navigate(`/admin/manageOrder?keySearch=${keySearchSendRequest}&typeSearch=${typeSearchSendRequest}`)
        setPaginationNumberRunFirst(0);
        
        // console.log(orderStatus)
        // orderStatus_Array.map(item => getInfoOrderForUsers(item, 1))
    } 
    useEffect(() => {   
        if(paginationNumberRunFirst === 0 && keySearchParams !== null && typeSearchParams !== null){
            orderStatus_Array.map(item => getInfoOrderForUsers(item, 1))
            getQuantityOrderToDevidePage() 
        }
        // getInforOrderDetail(1);  
    }, [paginationNumberRunFirst === 0 && keySearchParams !== null && typeSearchParams !== null])
 
    useEffect(() => {   
        if(infoOrderDetail_many.length > 0){ 
            handlePrint_A4()
        }
        // getInforOrderDetail(1);  
    }, [infoOrderDetail_many])
 

    const handleInputInfoTypeSearch = (e) => {
        setTypeSearchSendRequest(e.target.value)
        console.log(typeSearchSendRequest)
    }

    const handleClickCheckbox = (product, item) => {
 
 
        if(listMASPTranferState.includes(product.MADH)){
            setListMASPTranferState(listMASPTranferState.filter(item => item !== product.MADH)) 
            setIsCheckedAll(false)
        }
        else{
            setListMASPTranferState([...listMASPTranferState, product.MADH]);
            console.log(listMASPTranferState.length, 'length');
            if(listMASPTranferState.length + 1 === numberOrderEachPage)
                setIsCheckedAll(!isCheckedAll); 
            orderStatus_Array.forEach(item => { 
                if(item.value.nameState === orderStatusPointer){ 
                    if(listMASPTranferState.length + 1 === item.value.orderList.length)
                        setIsCheckedAll(true) 
                }
            })
        }  
    }
    const [dataToUpdateState, setDataToUpdateState] = useState({
        itemWillUpdate: null,
        itemCurent: null,
        data: {
            nameStatusWillUpdate: null,
            listMASPTranferState: null
        }
    })
    const handleUpdateState = (orderStatus_Array, index) => {
        // console.log(listMASPTranferState);
        // const itemWillUpdate = orderStatus_Array[index+1];
        // const itemCurent = orderStatus_Array[index];
        // const data = {
        //     nameStatusWillUpdate: itemWillUpdate.value.nameState,
        //     listMASPTranferState: listMASPTranferState
        // }
        setDataToUpdateState({
            itemWillUpdate: orderStatus_Array[index+1],
            itemCurent: orderStatus_Array[index],
            data: {
                nameStatusWillUpdate: orderStatus_Array[index+1].value.nameState,
                listMASPTranferState: listMASPTranferState
            }
        })
        setIsPopupUpdate(true);
        setContentPopup({
            title: 'Chuyển đổi trạng thái',
            content: 'Hãy xác nhận chuyển đổi những đơn hàng này sang trạng thái khác'
        })
        openPopup()
        
        // setOrderStatus({
        //     ...orderStatus, 
        //     [itemWillUpdate.key]: {
        //         ...orderStatus[itemWillUpdate.key],
        //         hasChangeFromPreState: 1,
        //     },
        //     [itemCurent.key]: {
        //         ...orderStatus[itemCurent.key], 
        //         orderList: orderStatus[itemCurent.key].orderList.map(item =>{
        //             if(item !== null){
        //                 if(listMASPTranferState.includes(item.MADH)) 
        //                     return null; 
        //                 else{
        //                     return item;
        //                 }
        //             }
        //             else{
        //                 return item;
        //             } 
        //         })
        //     }
        // })
        // try{ 
        //     request.post(
        //         `api/updateOrderStatus`, data
        //     )
        //     .then(res => {
                        
        //         let indexNull = {
        //             start: 0,
        //             end: 0,
        //         } 
        //         itemCurent.value.spaceGetDataFromOrderList.forEach(item => {
        //             if(itemCurent.value.openingPage === item.paginationNumber){ 
        //                 indexNull.start = item.startIndex;
        //                 indexNull.end = item.endIndex;
        //             }
        //         })
        //         // index.end = item_ofOrderStatusArray.value.openingPage * numberOrderEachPage - 1;
        //         console.log(indexNull.start, ' ', indexNull.end, 'orderlist: ', itemCurent.value.orderList)
        //         // nếu toàn bộ item_ofOrderStatusArray từ start đến end thì reload trang
        //         let i = 0; 
        //         itemCurent.value.orderList.slice(indexNull.start, indexNull.end).forEach(item => {
        //             if(item === null){
        //                 i++;
        //             }
        //         })
        //         console.log(i + listMASPTranferState.length , ' ', indexNull.end)

        //         if(i + listMASPTranferState.length === indexNull.end)  
        //             window.location.reload(); 
        //     }) 
        // }
        // catch(err){
        //     console.log(err)
        // }
        // setListMASPTranferState([]);

        // const interval = setInterval(() => { 
        //     if (listMASPTranferState) {
        //         // Thực hiện hành động cần thiết
        //     }
        // }, 1000); 
     
        // return () => clearInterval(interval);
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

                const allItems = item.value.orderList.map(orderItem => {
                    if(orderItem !== null)
                        return  orderItem.MADH;
                });
                // Thêm tất cả các phần tử đã được chọn vào listMASPTranferState
                console.log(allItems, 'jasdhjh')
                setListMASPTranferState(allItems);

            }
            else if(isCheckedAll){
                listMASPTranferState.splice(0, listMASPTranferState.length);
            }  
        setIsCheckedAll(!isCheckedAll); 
    }

    const handlePrint = async (madh) => {
        // handleWatchOrderDetail(madh) 
        window.print(); 
    };

    useEffect(() => {   
        orderStatus_Array.map(item => getInfoOrderForUsers(item, 1))
        getQuantityOrderToDevidePage() 
        // getInforOrderDetail(1);
    }, []) 

    const renderLoading = (item) => {
        return (
          <div class={`donut multi size__donut ${item.value.pageQuantity === null ? '' : 'display_hidden'}`}></div> 
        )
      }
    const renderNavState = orderStatus_Array.map((item, index) =>  
        <li class="nav-item col-auto p-2" key={index}>
            <button 
                class={`nav-link button_nav ${orderStatusPointer === item.value.nameState ? 'active' : ''}`} 
                aria-current="page"  
                onClick={()=>handleClickNavState(item, 1)}
            >
                {item.value.nameState}
                <span className={`itemQuantityFound ${item.value.pageQuantity === null ? 'display_hidden' : ''}`}>
                    {item.value.pageQuantity}
                </span>
                {renderLoading(item)}
            </button>
            {/* <span>{item.value.pageQuantity}</span> */}
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
                {
                    if(product === null){ 
                        console.log(product, 'đây null ', index)
                        return null;
                    }
                    else{
                        return(
                            <tr key={index} className="">
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
                                <td data-label="Address">
                                    {product.DIACHI}, {product.PHUONG_XA}, {product.QUAN_HUYEN}, {product.TINH_TP}
                                </td>
                                <td data-label="Day">{product.NGAYORDER}</td> 
                                <td> {product.HINHTHUC_THANHTOAN}  </td>
                                <td data-label="Subtotal">{formatPrice(product.TONGTIENDONHANG)}</td>
                                <td data-label="update">
                                    <div class="icon-update">
                                        <span onClick={()=>handleWatchOrderDetail(product.MADH)} >
                                            <FontAwesomeIcon icon={faEye} class="fa-solid fa-eye" ></FontAwesomeIcon>
                                        </span>
                                        {/* <span onClick={()=>handlePrint(product.MADH)}>
                                            <FontAwesomeIcon class="fa-solid fa-print" icon={faPrint}></FontAwesomeIcon>
                                        </span> */}
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

    // const renderPagination = (item_status) => {
    //     console.log(item_status, 'item_status')
    //     return item_status.value.paginationList.map((item_pagina) => 
    //         <button key={item_pagina} className="btn_pagination" onClick={() => handleClickItemPagination(item_status, item_pagina)}>{item_pagina}</button>
    //     )
    // }
    const handlePageChange = (item_status, event, page) => {
        handleClickItemPagination(item_status, page);
    }; 

    const renderInfoProduct = infoOrderDetail.data_sanPham_relative_CTDH.map((item, index) => 
              
            <tr  className="" key={index}> 
                <td data-label="Phone-number">{item.MASP}</td>
                <td data-label="Order-code">{item.TENSP}</td>
                <td data-label="Name">{item.TENMAU}</td>
                <td data-label="Phone-number"> {item.MASIZE} </td>
                <td data-label="Phone-number">{formatPrice(item.TONGTIEN / item.SOLUONG)}  </td>
                <td data-label="Phone-number">  {item.SOLUONG}   </td> 
                    {/* <td data-label="Address">
                    {infoOrderDetail.data_relative_Donhang.TINH_TP}
                </td>
                <td data-label="Day">{infoOrderDetail.data_relative_Donhang.TINH_TP}</td>
                <td><button type="button" id="btn-status-deliveried">{infoOrderDetail.data_relative_Donhang.TINH_TP}</button>
                </td>
                <td><button type="button" id="btn-payment-after">{infoOrderDetail.data_relative_Donhang.TINH_TP}</button>
                </td>
                <td data-label="Subtotal">{infoOrderDetail.data_relative_Donhang.TINH_TP}</td> */}
                    
            </tr>  
        ) 

    const renderOrderDetail = () => {
        // console.log("ok");
        // getInforOrderDetail()   
        // console.log(infoOrderDetail, 'render')
        if(watchOrderDetail === true) {
            return(  
                <div>
                    <div class="icon-update icon-update__margin">
                        <span onClick={handleTurnBack}  className="faCircleChevronLeft">
                            <FontAwesomeIcon class={`fa-solid faCircleChevronLeft`} icon={faCircleChevronLeft} ></FontAwesomeIcon>
                        </span> 
                        {/* <span onClick={()=>getInforOrderDetail__many()}>
                            <FontAwesomeIcon class="fa-solid fa-print" icon={faPrint}></FontAwesomeIcon>
                        </span> */}
                    </div>
                    <h1>Chi tiết đơn hàng</h1>
                    {/* <button onClick={handleTurnBack}>turn back</button> */}
                    {/* <div class="icon-update">
                        <span>
                            <FontAwesomeIcon class="fa-solid fa-pen-to-square" icon={faPenToSquare} ></FontAwesomeIcon>
                        </span>
                    </div> */}
                    <div className="div_thongTinGiaoHang" id="thongtin_giao_hang_1">
                        <h3 className="thongTinGiaoHang">Thông tin giao hàng</h3>   
                        <table class="table">
                            <thead>
                                <tr>  
                                    <th scope="col">Tên khách hàng</th>
                                    <th scope="col">SĐT</th>
                                    <th scope="col">Địa chỉ</th> 

                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                            <tr> 
                                <td data-label="Order-code">{infoOrderDetail.data_relative_Donhang.TEN !== null ? infoOrderDetail.data_relative_Donhang.TEN : ''}</td>
                                <td data-label="Name">{infoOrderDetail.data_relative_Donhang.SDT}</td>
                                <td data-label="Phone-number">
                                    {infoOrderDetail.data_relative_Donhang.DIACHI ? infoOrderDetail.data_relative_Donhang.DIACHI + ', ' : ''}
                                    {infoOrderDetail.data_relative_Donhang.PHUONG_XA ? infoOrderDetail.data_relative_Donhang.PHUONG_XA + ', ' : ''}
                                    {infoOrderDetail.data_relative_Donhang.QUAN_HUYEN ? infoOrderDetail.data_relative_Donhang.QUAN_HUYEN + ', ' : ''}
                                    {infoOrderDetail.data_relative_Donhang.TINH_TP ? infoOrderDetail.data_relative_Donhang.TINH_TP : ''}
                                </td>
                                {/* <td data-label="Address">
                                    {infoOrderDetail.data_relative_Donhang.TINH_TP}
                                </td>
                                <td data-label="Day">{infoOrderDetail.data_relative_Donhang.TINH_TP}</td>
                                <td><button type="button" id="btn-status-deliveried">{infoOrderDetail.data_relative_Donhang.TINH_TP}</button>
                                </td>
                                <td><button type="button" id="btn-payment-after">{infoOrderDetail.data_relative_Donhang.TINH_TP}</button>
                                </td>
                                <td data-label="Subtotal">{infoOrderDetail.data_relative_Donhang.TINH_TP}</td> */}
                                 
                            </tr> 
                            </tbody>
                        </table>
                    </div>
                    <div className="div_thongTinGiaoHang" id="thongtin_giao_hang_1">
                        <h3 className="thongTinGiaoHang">Thông tin Đơn hàng</h3>   
                        <table class="table">
                            <thead>
                                <tr>  
                                    <th scope="col">Mã đơn hàng</th>
                                    <th scope="col">Ngày đặt hàng</th>
                                    <th scope="col">Trạng thái đơn hàng</th>
                                    <th scope="col">Trạng thái thanh toán</th>
                                    <th scope="col" >Hình thức thanh toán</th>
                                    <th scope="col">Tiền sản phẩm</th>
                                    <th scope="col">Phí vận chuyển</th>
                                    <th scope="col">Tổng tiền hoá đơn</th>
                                    <th scope="col">Số tiền Voucher giảm</th>
                                    {/* <th scope="col">Số tiền hoá đơn giảm</th> */}

                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                            <tr> 
                                <td data-label="Order-code">{infoOrderDetail.data_relative_Donhang.MADH}</td>
                                <td data-label="Name">{infoOrderDetail.data_relative_Donhang.NGAYORDER}</td>
                                <td data-label="Phone-number">  {infoOrderDetail.data_relative_Donhang.TRANGTHAI_DONHANG}   </td>
                                <td data-label="Phone-number">  {infoOrderDetail.data_relative_Donhang.TRANGTHAI_THANHTOAN}   </td>
                                <td data-label="Phone-number">  {infoOrderDetail.data_relative_Donhang.HINHTHUC_THANHTOAN}   </td>
                                <td data-label="Phone-number">  {formatPrice(infoOrderDetail.data_relative_Donhang.TONGTIEN_SP)}   </td>
                                <td data-label="Phone-number">  {formatPrice(infoOrderDetail.data_relative_Donhang.PHIVANCHUYEN)}   </td>
                                <td data-label="Phone-number">  {formatPrice(infoOrderDetail.data_relative_Donhang.TONGTIENDONHANG)}   </td>
                                <td data-label="Phone-number">  {infoOrderDetail.data_relative_Donhang.VOUCHERGIAM === 0 ? 0 : formatPrice(infoOrderDetail.data_relative_Donhang.VOUCHERGIAM)}   </td>
                                 {/* <td data-label="Address">
                                    {infoOrderDetail.data_relative_Donhang.TINH_TP}
                                </td>
                                <td data-label="Day">{infoOrderDetail.data_relative_Donhang.TINH_TP}</td>
                                <td><button type="button" id="btn-status-deliveried">{infoOrderDetail.data_relative_Donhang.TINH_TP}</button>
                                </td>
                                <td><button type="button" id="btn-payment-after">{infoOrderDetail.data_relative_Donhang.TINH_TP}</button>
                                </td>
                                <td data-label="Subtotal">{infoOrderDetail.data_relative_Donhang.TINH_TP}</td> */}
                                 
                            </tr> 
                            </tbody>
                        </table>
                        
                    </div>
                    <div className="div_thongTinGiaoHang" id="thongtin_giao_hang_1">
                        <h3 className="thongTinGiaoHang">Thông tin các sản phẩm</h3> 
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Mã sản phẩm</th>  
                                    <th scope="col">Tên sản phẩm</th>
                                    <th scope="col">Tên màu</th>
                                    <th scope="col">Size</th>
                                    <th scope="col">Giá bán</th>
                                    <th scope="col" >Số lượng</th> 
                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                {renderInfoProduct}
                            </tbody>      
                        </table>
                    </div> 
                    <h3>Ghi chú:</h3> 
                    <textarea 
                        name="note"
                        value={note}
                        onChange={handleInputNote}
                        placeholder="Nhập ghi chú"
                        className="note__css"
                    >
                    </textarea> 
                    <div>
                        <button className="btn__saveNote" onClick={() => handleSaveEditNote(infoOrderDetail.data_relative_Donhang.MADH)}>
                            <FontAwesomeIcon icon={faFloppyDisk}></FontAwesomeIcon>
                        </button>
                    </div>

                </div>  
            )
        }
    }

    const renderOrderDetail_many = () => {
        return infoOrderDetail_many.map(item =>   (  
                <div className="print-container">
                    {/* <div class="icon-update icon-update__margin">
                        <span onClick={handleTurnBack}  className="faCircleChevronLeft">
                            <FontAwesomeIcon class={`fa-solid faCircleChevronLeft`} icon={faCircleChevronLeft} ></FontAwesomeIcon>
                        </span> 
                        <span onClick={()=>getInforOrderDetail__many()}>
                            <FontAwesomeIcon class="fa-solid fa-print" icon={faPrint}></FontAwesomeIcon>
                        </span>
                    </div> */}
                    <h1>Đơn hàng {item.data_relative_Donhang.MADH}</h1>
                    {/* <button onClick={handleTurnBack}>turn back</button> */}
                    {/* <div class="icon-update">
                        <span>
                            <FontAwesomeIcon class="fa-solid fa-pen-to-square" icon={faPenToSquare} ></FontAwesomeIcon>
                        </span>
                    </div> */}
                    <div className="div_thongTinGiaoHang">
                        <h3 className="thongTinGiaoHang">Thông tin giao hàng</h3>   
                        <table class="table">
                            <thead>
                                <tr>  
                                    <th scope="col">Tên khách hàng</th>
                                    <th scope="col">SĐT</th>
                                    <th scope="col">Địa chỉ</th> 
    
                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                            <tr> 
                                <td data-label="Order-code">{item.data_relative_Donhang.TEN !== null ? item.data_relative_Donhang.TEN : ''}</td>
                                <td data-label="Name">{item.data_relative_Donhang.SDT}</td>
                                <td data-label="Phone-number">
                                    {item.data_relative_Donhang.DIACHI ? item.data_relative_Donhang.DIACHI + ', ' : ''}
                                    {item.data_relative_Donhang.PHUONG_XA ? item.data_relative_Donhang.PHUONG_XA + ', ' : ''}
                                    {item.data_relative_Donhang.QUAN_HUYEN ? item.data_relative_Donhang.QUAN_HUYEN + ', ' : ''}
                                    {item.data_relative_Donhang.TINH_TP ? item.data_relative_Donhang.TINH_TP : ''}
                                </td>
                                {/* <td data-label="Address">
                                    {item.data_relative_Donhang.TINH_TP}
                                </td>
                                <td data-label="Day">{item.data_relative_Donhang.TINH_TP}</td>
                                <td><button type="button" id="btn-status-deliveried">{item.data_relative_Donhang.TINH_TP}</button>
                                </td>
                                <td><button type="button" id="btn-payment-after">{item.data_relative_Donhang.TINH_TP}</button>
                                </td>
                                <td data-label="Subtotal">{item.data_relative_Donhang.TINH_TP}</td> */}
                                    
                            </tr> 
                            </tbody>
                        </table>
                    </div>
                    <div className="div_thongTinGiaoHang">
                        <h3 className="thongTinGiaoHang">Thông tin Đơn hàng</h3>   
                        <table class="table">
                            <thead>
                                <tr>  
                                    <th scope="col">Mã đơn hàng</th>
                                    <th scope="col">Ngày đặt hàng</th>
                                    {/* <th scope="col">Trạng thái đơn hàng</th>
                                    <th scope="col">Trạng thái thanh toán</th>
                                    <th scope="col" >Hình thức thanh toán</th> */}
                                    <th scope="col">Tiền sản phẩm</th>
                                    <th scope="col">Phí vận chuyển</th>
                                    <th scope="col">Tổng tiền hoá đơn</th>
                                    <th scope="col">Số tiền Voucher giảm</th>
                                    {/* <th scope="col">Số tiền hoá đơn giảm</th> */}
    
                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                            <tr> 
                                <td data-label="Order-code">{item.data_relative_Donhang.MADH}</td>
                                <td data-label="Name">{item.data_relative_Donhang.NGAYORDER}</td>
                                {/* <td data-label="Phone-number">  {item.data_relative_Donhang.TRANGTHAI_DONHANG}   </td>
                                <td data-label="Phone-number">  {item.data_relative_Donhang.TRANGTHAI_THANHTOAN}   </td>
                                <td data-label="Phone-number">  {item.data_relative_Donhang.HINHTHUC_THANHTOAN}   </td> */}
                                <td data-label="Phone-number">  {item.data_relative_Donhang.TONGTIEN_SP}   </td>
                                <td data-label="Phone-number">  {item.data_relative_Donhang.PHIVANCHUYEN}   </td>
                                <td data-label="Phone-number">  {item.data_relative_Donhang.TONGTIENDONHANG}   </td> 
                                <td data-label="Phone-number">  {item.data_relative_Donhang.VOUCHERGIAM === 0 ? 0 : item.data_relative_Donhang.MAVOUCHER}   </td>

                                    {/* <td data-label="Address">
                                    {item.data_relative_Donhang.TINH_TP}
                                </td>
                                <td data-label="Day">{item.data_relative_Donhang.TINH_TP}</td>
                                <td><button type="button" id="btn-status-deliveried">{item.data_relative_Donhang.TINH_TP}</button>
                                </td>
                                <td><button type="button" id="btn-payment-after">{item.data_relative_Donhang.TINH_TP}</button>
                                </td>
                                <td data-label="Subtotal">{item.data_relative_Donhang.TINH_TP}</td> */}
                                    
                            </tr> 
                            </tbody>
                        </table>
                        
                    </div>
                    <div className="div_thongTinGiaoHang">
                        <h3 className="thongTinGiaoHang">Thông tin các sản phẩm</h3> 
                        <table class="table">
                            <thead>
                                <tr>  
                                    <th scope="col">Tên sản phẩm</th>
                                    <th scope="col">Tên màu</th>
                                    <th scope="col">Size</th>
                                    <th scope="col">Giá bán</th>
                                    <th scope="col" >Số lượng</th> 
                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                {
                                    item.data_sanPham_relative_CTDH.map((item, index) =>  
                                        <tr  className="" key={index}> 
                                            <td data-label="Order-code">{item.TENSP}</td>
                                            <td data-label="Name">{item.TENMAU}</td>
                                            <td data-label="Phone-number"> {item.MASIZE} </td>
                                            <td data-label="Phone-number">{item.GIABAN}  </td>
                                            <td data-label="Phone-number">  {item.SOLUONG}   </td> 
                                                {/* <td data-label="Address">
                                                {infoOrderDetail.data_relative_Donhang.TINH_TP}
                                            </td>
                                            <td data-label="Day">{infoOrderDetail.data_relative_Donhang.TINH_TP}</td>
                                            <td><button type="button" id="btn-status-deliveried">{infoOrderDetail.data_relative_Donhang.TINH_TP}</button>
                                            </td>
                                            <td><button type="button" id="btn-payment-after">{infoOrderDetail.data_relative_Donhang.TINH_TP}</button>
                                            </td>
                                            <td data-label="Subtotal">{infoOrderDetail.data_relative_Donhang.TINH_TP}</td> */}
                                                
                                        </tr>  
                                    ) 
                                }
                            </tbody>      
                        </table>
                    </div> 
                    <div className="div_thongTinGiaoHang">
                        <h3 className="thongTinGiaoHang">Ghi chú</h3> 
                        <div>{item.data_relative_Donhang.GHICHU}</div>
                    </div> 
                      
                </div>  
            ) 
        )
    } 

    const handleGetInfoDetail_Many = () => {
        listMASPTranferState.map(item => 
            getInforOrderDetail__many(item)
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
                        {
                            renderOrderDetail()
                        }
                        <div class={`content_list_order  ${watchOrderDetail ? "display_hidden" : ""}`}>
                            <div className="lkljalsjd"> 
                                <div className={`lkljalsjd111
                                    ${
                                        orderStatus_Array.length !== index + 1  &&
                                        ( orderStatus_Array[index].value.nameState === 'Đang giao' ||
                                        orderStatus_Array[index].value.nameState === 'Chuẩn bị hàng' )
                                        ? '' 
                                        : 'display_hidden'
                                    }`}
                                >
                                    Cập nhật trạng thái đơn hàng thành: 
                                    <span className="StateWillTranfer">
                                        <button className="btn" onClick={() => handleUpdateState(orderStatus_Array, index)}>
                                            {orderStatus_Array.length !== index + 1 ? orderStatus_Array[index + 1].value.nameState : ''}
                                        </button>
                                    </span>
                                    <span className={`StateWillTranfer ${orderStatus_Array[index].value.nameState === 'Đang giao' ? '' : 'display_hidden'}`}>
                                        <button className="btn" onClick={() => handleUpdateState(orderStatus_Array, index + 1)}>
                                            {orderStatus_Array.length === index + 3 ? orderStatus_Array[index + 2].value.nameState : ''}
                                            {/* {orderStatus_Array.length !== index + 1 ? orderStatus_Array[index + 1].value.nameState : ''} */}
                                        </button>
                                    </span>
                                    {/* <button className="buttonUpdate" >Update</button> */}
                                </div>
                                <div className="lkljalsjd2">
                                    In hoá đơn
                                    <span onClick={handleGetInfoDetail_Many}>
                                        <FontAwesomeIcon class="fa-solid fa-print faPrint_nearUpdate" icon={faPrint}></FontAwesomeIcon>
                                    </span>
                                </div>
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
                                    <th scope="col ">Hình thức Thanh toán</th>
                                    <th scope="col">Tổng tiền</th>
                                    <th scope="col"></th>

                                </tr>
                                </thead>
                                <tbody class="table-group-divider">
                                    { renderEachProduct(item, index) } 
                                </tbody>
                            </table>
                        </div>
                        <div className={`${watchOrderDetail ? 'display_hidden' : ''} pagination-container`}>
                            {/* { renderPagination(item) } */}
                            {/* <SelectLimit onLimitChange={setLimit}/> */}
                            {/* <Pagination totalPage={item.value.paginationList.length} page={item.value.openingPage} limit={numberOrderEachPage} siblings={1} onPageChange={handlePageChange} item_status={item}/> */}
                        </div>
                        <div className={`${watchOrderDetail ? 'display_hidden' : ''} pagination-container margin__bottom`}> 
                            <Stack spacing={2}>
                                <Pagination 
                                    count={item.value.paginationList.length} 
                                    onChange={(event, page) => handlePageChange(item, event, page)}  
                                    color="primary"
                                /> 
                            </Stack> 
                        </div>
                        {/* <span onClick={handlePrint_A4}>
                            <FontAwesomeIcon class="fa-solid fa-print faPrint_nearUpdate" icon={faPrint}></FontAwesomeIcon>
                        </span> */}
                        
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
            <div className="popup-overlay">
                <div className="popup-container">
                    <div className="popup-card">
                    <h2>{contentPopup.title}</h2>
                    <p>{contentPopup.content}</p>
                    <button id="close-popup" onClick={closePopup}>Đóng</button>
                    <button id="close-popup" onClick={closePopup_Update} className={`${isPopupUpdate && listMASPTranferState.length > 0 ? '' : 'display_hidden'}`}>Xác nhận</button>
                    </div>
                </div>
            </div>
            <div className="div_search">
                <div>
                    Tìm kiếm: 
                </div>
                <div>
                    <input 
                        name="keySearch"
                        onChange={handleSearchInput}
                        className="keySearch"
                        placeholder="Nhập nội dung tìm kiếm"
                    ></input> 
                </div>
                <div class="col-2 width_search"> 
                    <select class="form-select width_manageOrder_dropdown_search" required
                        onChange={handleInputInfoTypeSearch}
                        name="typeSearch"
                        value={typeSearchSendRequest} 
                    > 
                    <option selected value="MADH">Mã hoá đơn</option>
                    <option value="TEN">Tên khách hàng</option>
                    <option value="SDT">Số điện thoại</option>
                    </select>
                </div> 
                <button onClick={handleSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon> 
                </button> 
            </div>
            {/* <button 
                    onClick={returnManageProduct}  
                    className={`${typeSearchParams !== null && keySearchParams !== null ? '' : 'display_hidden'}`}

                >
                    <FontAwesomeIcon icon={faLeftLong} className="faLeftLong"></FontAwesomeIcon>
                    Danh sách Voucher
                </button> */}
            {/* <!-- nav bar trạng thái đơn hàng --> */}
            <ul  className={`nav nav-underline justify-content-center ${watchOrderDetail ? 'display_hidden' : ''}`}> 
                {renderNavState}
            </ul>
        
        {/* <!--1 đơn hàng đang giao --> */} 
        {renderShowProductEveryState}  
        <div ref={componentRef} className="print-container">
            { renderOrderDetail_many() }
        </div>
    </div>
    )

          
}

export default ManageOrder;