import "./manageOrder.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print'
import request from "../../../../utils/request";  
import { useEffect, useState } from "react";
import { renderMatches, unstable_useBlocker, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faCircleChevronLeft, faEye, faFloppyDisk, faL, faLeftLong, faMagnifyingGlass, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";

import SelectLimit from "./selectLimit";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Popup from "../../ComponentUseInManyPage/Popup/Popup";
import SearhInPageManage from "../../ComponentUseInManyPage/SearchInPageManage/SearchInPageManage";
import NavigationInPageManage from "../../ComponentUseInManyPage/NavigationInPageManage/NavigationInPageManage";
import WatchDetailOrder from "./WatchDetailOrder"; 

import useAuthCheck from "../../AuthCheckLogin/AuthCheckLogin";


function ManageOrder(){ 
    useAuthCheck()
    useEffect(() => {
        document.title = "Admin | Quản lý đơn hàng"
     }, []); 
    const componentRef = useRef();
    const handlePrint_A4 = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'emp-data',
        onAfterPrint: () => {
            
            setInfoOrderDetail_many([])
            alert('Print success') 
        }
    }); 
    let i = 0;

    const {formatPrice, contentPopup, setContentPopup, openPopup} = useGlobalVariableContext();
    const [numberOrderEachPage,setLimit] = useState(20);
    const [beforeNullOrHaveMadh, setBeforeNullOrHaveMadh] = useState(null);
    const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0); 
    const [watchOrderDetail, setWatchOrderDetail] = useState(false);
    const [infoOrderDetail, setInfoOrderDetail] = useState({
        data_relative_Donhang: [],
        data_sanPham_relative_CTDH: [],
    })
    const [infoOrderDetail_many, setInfoOrderDetail_many] = useState([])
    const [note, setNote] = useState('');
    
    const [listMASPTranferState, setListMASPTranferState] = useState([]);
    const [isCheckedAll, setIsCheckedAll] = useState(false); 
    const Navigate = useNavigate();
    const searchParams  = new URLSearchParams(window.location.search);
    var keySearchParams = searchParams.get('keySearch');
    const typeSearchParams = searchParams.get('typeSearch'); 
    const [isPopupUpdate, setIsPopupUpdate] = useState(false);
    const infoSearchOption = [
        {
            value: 'MADH',
            show: 'Mã hoá đơn',
        },
        {
            value: 'TEN',
            show: 'Tên khách hàng',
        },
        {
            value: 'SDT',
            show: 'Số điện thoại',
        },
    ]
    const [dataToUpdateState, setDataToUpdateState] = useState({
        itemWillUpdate: null,
        itemCurent: null,
        data: {
            nameStatusWillUpdate: null,
            listMASPTranferState: null
        }
    })
    
    const confirmUpdate = () => {
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

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };
    const [orderStatusPointer, setOrderStatusPointer] = useState(
        orderStatus.chuanbihang.nameState
    ); 
    const handleClickNavState = (item_status, item_pagina) => { 
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
                [item_status.key] : {
                    ...prevOrderStatus[item_status.key],  
                    openingPage:  item_pagina
                }
            }
        );
        setOrderStatus(updateOpeningPage)  
        getInfoOrderForUsers(item_status, item_pagina);
        handleScrollToTop(); 
    }

    const handleTurnBack = () => {
        setWatchOrderDetail(false);
        // Navigate(`/admin/manageOrder`)
        window.history.back();
    }

    const handleWatchOrderDetail = (madh) => {
        getInforOrderDetail(madh);
        Navigate(`/admin/manageOrder?madh=${madh}`)
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
                .then(res=>{     
                    console.log(res.data, 'okk') ;
                    console.log(itemInOrderStatus_Array, '8shd8', ++i)
                    setOrderStatus(prevOrderStatus => { 
                        return {
                            ...prevOrderStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                            [itemInOrderStatus_Array.key] : {   
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
                    })  
                }) 
            }
            catch(err){
                console.log(err)
            }
        }
        else{
            try{ 
                request.get(`/api/getInfoSearchOrder`, {params: queryForGetInfoOrderForUsers}) 
                .then(res=>{  
                    console.log(res.data, 'cáuh3')     
                    setOrderStatus(prevOrderStatus => { 
                            return {
                                ...prevOrderStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                                [itemInOrderStatus_Array.key] : {   
                                    ...prevOrderStatus[itemInOrderStatus_Array.key], 
                                    orderList: [
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
                    )    
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
                console.log(res.data, 'cíni2')
                orderStatus_Array.forEach(itemStatus => {
                    let found = false;
                    res.data.quantity.forEach(itemStatusFromDB => {
                        if(itemStatusFromDB.TRANGTHAI_DONHANG === itemStatus.value.nameState)
                        {
                            found = true 
                            const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MADH / numberOrderEachPage)

                            console.log((itemStatusFromDB.SL_MADH), 'ákjdksdjks')

                            let arrAddToPaginationList = [];
                            for(let i = 1; i <= pageQuantityShow; i++)
                                arrAddToPaginationList.push(i); 

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

    const getInforOrderDetail__many = (listMASPTranferState) => {
        const data = {
            listMASPTranferState: listMASPTranferState
        }

        request.get(`/api/infoOrderDetail_Many`, {params: data})
        .then(res => {   
                let newInfoDetail_update = [];
                res.data.data_relative_Donhang.forEach((item, index) => {
                    newInfoDetail_update.push({
                        data_relative_Donhang: item[0],
                        data_sanPham_relative_CTDH: res.data.data_sanPham_relative_CTDH[index],
                    })
                    console.log('aksjdkkkjkj ', item, res.data.data_sanPham_relative_CTDH[index]);
                }) 
        
                setInfoOrderDetail_many(prevInfo => [...prevInfo, ...newInfoDetail_update]); 
            console.log(res.data, 'okcoas', listMASPTranferState)
        })
    };
 
 
    const handleSearch = (infoSearchSendRequest) => {   
         
        Navigate(`/admin/manageOrder?keySearch=${infoSearchSendRequest.keySearchSendRequest}&typeSearch=${infoSearchSendRequest.typeSearchSendRequest}`)
        setPaginationNumberRunFirst(0); 
    }  
    useEffect(() => {   
        if(infoOrderDetail_many.length > 0){ 
            handlePrint_A4()
        } 
    }, [infoOrderDetail_many])
 
    useEffect(() => {   
        const madh = searchParams.get('madh'); 
        if(madh === null){  
            setBeforeNullOrHaveMadh(null);
        }
        else{ 
            getInforOrderDetail(madh)
            setBeforeNullOrHaveMadh(madh);
        }

        if(keySearchParams !== null && typeSearchParams !== null){   
            orderStatus_Array.map(item => getInfoOrderForUsers(item, 1)) 
            getQuantityOrderToDevidePage()
        }
        else if(keySearchParams === null && typeSearchParams === null && beforeNullOrHaveMadh === null && madh === null){
            orderStatus_Array.map(item => getInfoOrderForUsers(item, 1)) 
            getQuantityOrderToDevidePage() 
        } 
        
        if(beforeNullOrHaveMadh === null && madh === null){   
            orderStatus_Array.reverse().forEach(item_status => {
                setOrderStatusPointer(item_status.value.nameState) 
                const updateOpeningPage = prevOrderStatus => (
                    {
                        ...prevOrderStatus, 
                        [item_status.key] : {
                            ...prevOrderStatus[item_status.key],  
                            openingPage:  1,  
                            hasLoadFirtTime: 1,
                            hasChangeFromPreState: 0, 
                        }
                    }
                );
                setOrderStatus(updateOpeningPage)    
            }) 
            
            console.log('kác77', beforeNullOrHaveMadh) 
        }
        else if(beforeNullOrHaveMadh !== null && watchOrderDetail === true){
            setWatchOrderDetail(false)
        }
        console.log('i: ', ++i)
        i++;
    }, [window.location.search]);
 
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
    
    const handleUpdateState = (orderStatus_Array, index) => { 
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
    }

    const handleClickCheckboxAll = (item) => {  
        if(!isCheckedAll){  
            if(orderStatusPointer === item.value.nameState){
                let start = 0;
                let end = 0;
                item.value.spaceGetDataFromOrderList.map(item2 => {
                    if(item2.paginationNumber === item.value.openingPage){
                        start = item2.startIndex;
                        end = item2.endIndex;
                    }
                })
                const allItems = item.value.orderList.map((orderItem, index) => { 
                    if(orderItem !== null && index >= start && index < end)
                        return  orderItem.MADH; 
                }).filter(item => item !== undefined);

                console.log(item.value.orderList, 'jasdhjh', allItems)
                setListMASPTranferState(allItems);
            }
            // Thêm tất cả các phần tử đã được chọn vào listMASPTranferState

        }
        else if(isCheckedAll){
            listMASPTranferState.splice(0, listMASPTranferState.length);
        }  
        setIsCheckedAll(!isCheckedAll); 
    }
  
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
        return ( 
            item.value.orderList.slice(index.start, index.end).map((product, index) => 
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
 
    const renderOrderDetail = () => { 
        console.log(watchOrderDetail, 'rend333er')
        if(watchOrderDetail === true) {
            return(  
                <div>
                    <div class="icon-update icon-update__margin">
                        <span onClick={handleTurnBack}  className="faCircleChevronLeft">
                            <FontAwesomeIcon class={`fa-solid faCircleChevronLeft`} icon={faCircleChevronLeft} ></FontAwesomeIcon>
                        </span>  
                    </div> 
                    <WatchDetailOrder
                        note = {note}
                        setNote = {setNote}
                        infoOrderDetail = {infoOrderDetail}
                    />
                </div>  
            )
        }
    }

    const renderOrderDetail_many = () => {
        return infoOrderDetail_many.map(item =>   (  
                <div className="print-container"> 
                    <h1>Đơn hàng {item.data_relative_Donhang.MADH}</h1> 
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
                                    <th scope="col">Tiền sản phẩm</th>
                                    <th scope="col">Phí vận chuyển</th>
                                    <th scope="col">Tổng tiền hoá đơn</th>
                                    <th scope="col">Số tiền Voucher giảm</th> 
    
                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                            <tr> 
                                <td data-label="Order-code">{item.data_relative_Donhang.MADH}</td>
                                <td data-label="Name">{item.data_relative_Donhang.NGAYORDER}</td> 
                                <td data-label="Phone-number">  {item.data_relative_Donhang.TONGTIEN_SP}   </td>
                                <td data-label="Phone-number">  {item.data_relative_Donhang.PHIVANCHUYEN}   </td>
                                <td data-label="Phone-number">  {item.data_relative_Donhang.TONGTIENDONHANG}   </td> 
                                <td data-label="Phone-number">  {item.data_relative_Donhang.VOUCHERGIAM === 0 ? 0 : item.data_relative_Donhang.MAVOUCHER}   </td>
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
        console.log(listMASPTranferState, 'oaksdo82') 
        getInforOrderDetail__many(listMASPTranferState)
    }
 
    const renderShowProductEveryState = orderStatus_Array.map((item, index) =>   
        {  
            console.log(item, 'ikjaciu2')
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
                        <div className={`${watchOrderDetail ? 'display_hidden' : ''} pagination-container margin__bottom`}> 
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
                <h1>Đơn hàng</h1>
            </div> 
            <Popup
                contentPopup = {contentPopup}
                confirm = {isPopupUpdate && listMASPTranferState.length > 0 ? confirmUpdate : 'no use'}
            />
            <SearhInPageManage 
                infoSearchOption = {infoSearchOption}
                handleSearch = {handleSearch}
            />
            <div className={`${watchOrderDetail ? 'display_hidden' : ''}`}> 
                <NavigationInPageManage
                    orderStatus_Array = {orderStatus_Array}
                    orderStatusPointer = {orderStatusPointer}
                    handleClickNavState = {handleClickNavState}
                />
            </div> 
            {renderShowProductEveryState}    

            <div ref={componentRef} className={`print-container ${infoOrderDetail_many.length > 0 ? 'display_hidden' : ''}}`}>
                { renderOrderDetail_many() }
            </div>
    </div>
    ) 
}

export default ManageOrder;