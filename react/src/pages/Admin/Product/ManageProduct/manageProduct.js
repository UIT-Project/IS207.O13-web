import "./manageProduct.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';
import request from "../../../../utils/request";
import { useEffect, useState } from "react";
import {   Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry, faFloppyDisk, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {  faCircleChevronLeft, faEye, faL, faLeftLong, faMagnifyingGlass, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import useAuthCheck from "../../AuthCheckLogin/AuthCheckLogin";
import ReactPaginate from 'react-paginate';
import CurrencyInput from 'react-currency-input-field';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SearhInPageManage from "../../ComponentUseInManyPage/SearchInPageManage/SearchInPageManage";
import NavigationInPageManage from "../../ComponentUseInManyPage/NavigationInPageManage/NavigationInPageManage";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import UpdateProduct from "../UpdateProduct/UpdateProduct";
import Popup from '../../ComponentUseInManyPage/Popup/Popup';

function ManageProduct()
{
    const {formatPrice, contentPopup, setContentPopup, openPopup} = useGlobalVariableContext(); 
    useAuthCheck()
    useEffect(() => {
        document.title = "Admin | Quản lý sản phẩm"
    }, []);
    const numberProductEachPage = 20;  
    const [watchProductDetail, setWatchProductDetail] = useState(false); 
    const [beforeNullOrHaveMasp, setBeforeNullOrHaveMasp] = useState(null);
    //update
    const searchParams  = new URLSearchParams(window.location.search);
    
    var keySearchParams = searchParams.get('keySearch');
    var typeSearchParams = searchParams.get('typeSearch');
    const nameStatusParam = searchParams.get('nameStatus'); 

    useEffect(() => {   
        const masp = searchParams.get('masp');
        console.log("thay đổi masp", masp)
        if(masp === null){ 
            setWatchProductDetail(false);
            setBeforeNullOrHaveMasp(null); 
        }
        else{
            setWatchProductDetail(true);
            setBeforeNullOrHaveMasp(masp);
        }

        if(keySearchParams !== null && typeSearchParams !== null){ 
            productStatus_Array.map(item => getInfoProductForUsers(item, 1) ) 
            getQuantityProductToDevidePage()
        }
        else if(keySearchParams === null && typeSearchParams === null && beforeNullOrHaveMasp === null && masp === null){
            productStatus_Array.map(item => getInfoProductForUsers(item, 1) ) 
            getQuantityProductToDevidePage()
        }

        if(beforeNullOrHaveMasp === null && masp === null){ 
            productStatus_Array.reverse().forEach(item_status => {
                setProductStatusPointer(item_status.value.nameState)  
                const updateOpeningPage = prevProductStatus => (
                    {
                        ...prevProductStatus, 
                        [item_status.key] : {
                            ...prevProductStatus[item_status.key],  
                            openingPage:  1
                        }
                    }
                );
                setProductStatus(updateOpeningPage)    
            })  
        }
    }, [window.location.search]);
  
    const Navigate = useNavigate(); 
  
    const infoSearchOption = [
        {
            value: 'MASP',
            show: 'Mã Sản phẩm',
        },
        {
            value: 'TENSP',
            show: 'Tên Sản Phẩm',
        } 
    ]
  
    
    // manageProduct 
    const [productStatus, setProductStatus] = useState({
        nam:{
            nameState: 'Nam',
            productList: [],
            pageQuantity: null,
            paginationList: [],
            openingPage: 1,
            indexOfOderListHelpDelete: 0,
            spaceGetDataFromProductList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberProductEachPage,
            }]
        },
        nu: {
            nameState: 'Nữ',
            productList: [],
            pageQuantity: null,
            paginationList: [],
            openingPage: 1, 
            indexOfOderListHelpDelete: 0,
            spaceGetDataFromProductList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberProductEachPage,
            }]
        },
        treEm: {
            nameState: 'Trẻ em',
            productList: [],
            pageQuantity: null,
            paginationList: [],
            openingPage: 1, 
            indexOfOderListHelpDelete: 0,
            spaceGetDataFromProductList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberProductEachPage,
            }]
        }, 
    })  
    const productStatus_Array = Object.entries(productStatus).map(([key, value]) => (
        {
            key: key,
            value: value
        }
    )) 
    const [productStatusPointer, setProductStatusPointer] = useState(
        nameStatusParam ? productStatus[nameStatusParam]?.nameState : productStatus.nam.nameState
    ); 
 
 
    //manageProduct
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const handleClickNavState = (item_status, item_pagina) => { 
        setProductStatusPointer(item_status.value.nameState) 
        const updateOpeningPage = prevProductStatus => (
            {
                ...prevProductStatus, 
                [item_status.key] : {
                    ...prevProductStatus[item_status.key],  
                    openingPage:  item_pagina
                }
            }
        );
        setProductStatus(updateOpeningPage)  
        getInfoProductForUsers(item_status, item_pagina);  
    }

    const handleClickItemPagination = (item_status, item_pagina) => {
        const updateOpeningPage = prevProductStatus => (
            {
                ...prevProductStatus, 
                [item_status.key] : {...prevProductStatus[item_status.key],  openingPage:  item_pagina}
            }
        );
        setProductStatus(updateOpeningPage)  
        getInfoProductForUsers(item_status, item_pagina);
        handleScrollToTop();
    } 

    const handleDeleteProduct = (masp, item_ofProductStatusArray) => {  
        
        request.post(`api/deleteProduct?masp=${masp}`)
        .then(res => {
            if(res.data.massage === "xoa khong thanh cong"){
                console.log(res.data.massage)
                setContentPopup({
                    title: 'XOÁ SẢN PHẨM',
                    content: 'Không thể xoá sản phẩm này'
                })
                openPopup();
            }
            else{
                setProductStatus(prevProductStatus => ({
                    ...prevProductStatus, 
                    [item_ofProductStatusArray.key] : 
                        {...prevProductStatus[item_ofProductStatusArray.key],  
                            productList: prevProductStatus[item_ofProductStatusArray.key].productList.map(item => {
                            if(item !== null){
                                if(item.MASP === masp){
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

                setContentPopup({
                    title: 'XOÁ SẢN PHẨM',
                    content: 'Xoá thành công'
                })
                openPopup();

                console.log(res)
                let index = {
                    start: 0,
                    end: 0,
                } 
                item_ofProductStatusArray.value.spaceGetDataFromProductList.forEach(item => {
                    if(item_ofProductStatusArray.value.openingPage === item.paginationNumber){ 
                        index.start = item.startIndex;
                        index.end = item.endIndex;
                    }
                })
                // index.end = item_ofProductStatusArray.value.openingPage * numberProductEachPage - 1;
                console.log(index.start, ' ', index.end, 'productList: ', item_ofProductStatusArray.value.productList)
                // nếu toàn bộ item_ofProductStatusArray từ start đến end thì reload trang
                let i = 0;
                item_ofProductStatusArray.value.productList.slice(index.start, index.end).forEach(item => {
                    if(item === null){
                        i++;
                    }
                }) 
                if(i + 1 === index.end) 
                    window.location.reload(); 
            }
        })
        
    }

    const getInfoProductForUsers =  (itemInProductStatus_Array, openingPage) => {
        const queryForGetInfoProductForUsers = { 
            start: numberProductEachPage * ( openingPage - 1),
            tenDanhMuc: itemInProductStatus_Array.value.nameState,
            numberProductEachPage: numberProductEachPage, 
            typeSearch: typeSearchParams,
            keySearch:  keySearchParams,
        }  
        if(typeSearchParams === null && keySearchParams === null){
            request.get(`/api/getInfoManageProduct`, {params: queryForGetInfoProductForUsers}) 
            .then(res=>{   
                console.log(res.data, 'jkasnd2', productStatus)
                if(res.data.data_thongtin_sanpham.length == 0 && openingPage !== 1){
                    window.location.reload();
                }
                else{ 
                    setProductStatus(prevProductStatus => {  
                        return {
                            ...prevProductStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                            [itemInProductStatus_Array.key] : 
                            {   
                                ...prevProductStatus[itemInProductStatus_Array.key], 
                                productList:  [
                                    ...prevProductStatus[itemInProductStatus_Array.key].productList.filter(item => item),
                                    ...res.data.data_thongtin_sanpham.filter(item =>  item)
                                ],  
                                spaceGetDataFromProductList: [
                                    ...productStatus[itemInProductStatus_Array.key].spaceGetDataFromProductList,
                                    {
                                        paginationNumber: openingPage,
                                        ordinalNumber: productStatus[itemInProductStatus_Array.key].spaceGetDataFromProductList.length + 1,
                                        startIndex: productStatus[itemInProductStatus_Array.key].productList.length,
                                        endIndex: res.data.data_thongtin_sanpham.length + productStatus[itemInProductStatus_Array.key].productList.length,
                                    },
                                ] 
                            }
                        }  
                    })   
                }
            })  
        }
        else{
            if(typeSearchParams === 'MASP'){
                queryForGetInfoProductForUsers.keySearch = parseInt(queryForGetInfoProductForUsers.keySearch);
            }
            console.log('aklsjdksdk', queryForGetInfoProductForUsers.typeSearch, queryForGetInfoProductForUsers.keySearch)
            try{
                request.get(`/api/getInfoSearchProductAdmin`, {params: queryForGetInfoProductForUsers})
                .then(res=>{       
                    setProductStatus(prevProductStatus => { 
                        return {
                            ...prevProductStatus,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                            [itemInProductStatus_Array.key] : 
                            {   
                                ...prevProductStatus[itemInProductStatus_Array.key], 
                                productList:  [
                                    ...prevProductStatus[itemInProductStatus_Array.key].productList.filter(item => item),
                                    ...res.data.data_thongtin_sanpham.filter(item =>  item)
                                ],  
                                spaceGetDataFromProductList: [
                                    ...productStatus[itemInProductStatus_Array.key].spaceGetDataFromProductList,
                                        {
                                        paginationNumber: openingPage,
                                        ordinalNumber: productStatus[itemInProductStatus_Array.key].spaceGetDataFromProductList.length + 1,
                                        startIndex: productStatus[itemInProductStatus_Array.key].productList.length,
                                        endIndex: res.data.data_thongtin_sanpham.length + productStatus[itemInProductStatus_Array.key].productList.length,
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

    const getQuantityProductToDevidePage = () => {
        if(typeSearchParams === null && keySearchParams === null){
            request.get('/api/getQuantityProductToDevidePage')
            .then(res=> { 
            productStatus_Array.forEach(itemStatus => {
                let found = false;
                res.data.quantity.forEach(itemStatusFromDB => {
                    if(itemStatusFromDB.TENPL === itemStatus.value.nameState)
                    {
                        found = true
                        const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MASP / numberProductEachPage) 
                        let arrAddToPaginationList = [];
                        for(let i = 1; i <= pageQuantityShow; i++){
                            arrAddToPaginationList.push(i); 
                        }
                        if(itemStatusFromDB.SL_MASP > 0){
                            setProductStatus(prevProductStatus => ({
                                ...prevProductStatus, 
                                [itemStatus.key] : 
                                    {...prevProductStatus[itemStatus.key],  
                                    pageQuantity: itemStatusFromDB.SL_MASP, 
                                    paginationList: arrAddToPaginationList}
                            }))
                        }
                        
                    } 
                })
                if(found === false){
                    setProductStatus(prevProductStatus => ({
                        ...prevProductStatus, 
                        [itemStatus.key] : 
                            {...prevProductStatus[itemStatus.key],  
                            pageQuantity: 0, 
                            paginationList: []}
                    }))
                }
                });
                // console.log(productStatus) 
             }) 
        }
        else{
            const data = {
                keySearch: keySearchParams,
                typeSearch: typeSearchParams
            }
            request.get('/api/getQuantityProductToDevidePage_SearchProductAdmin', {params: data})
            .then(res=> {
                console.log(res.data.quantity, 'jnsjdjsbjn')
                productStatus_Array.forEach(itemStatus => {
                    let found = false;
                    
                    res.data.quantity.forEach(itemStatusFromDB => {
                        if(itemStatusFromDB.TENPL === itemStatus.value.nameState)
                        {
                            found = true;

                            const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MASP / numberProductEachPage)  
                            console.log(itemStatusFromDB.SL_MASP, 'eee')
                            let arrAddToPaginationList = [];
                            for(let i = 1; i <= pageQuantityShow; i++){
                                arrAddToPaginationList.push(i);
                            console.log(pageQuantityShow, 'ffff', i);
                            }
                            setProductStatus(prevProductStatus => ({
                                ...prevProductStatus, 
                                [itemStatus.key] : 
                                    {...prevProductStatus[itemStatus.key],  
                                    pageQuantity: itemStatusFromDB.SL_MASP, 
                                    paginationList: arrAddToPaginationList}
                            }))
                        } 
                    })

                    if(found === false){
                        setProductStatus(prevProductStatus => ({
                            ...prevProductStatus, 
                            [itemStatus.key] : 
                                {...prevProductStatus[itemStatus.key],  
                                pageQuantity: 0, 
                                paginationList: []}
                        }))
                    }
                });
                // console.log(productStatus) 
             }) 
        }
    }   
    const handleSearch = async ( infoSearchSendRequest ) => {  
        Navigate(`/admin/manageProduct?keySearch=${infoSearchSendRequest.keySearchSendRequest}&typeSearch=${infoSearchSendRequest.typeSearchSendRequest}`);  
    }

    const handlePageChange = (item_status, event, page) => {
        handleClickItemPagination(item_status, page);
        console.log(event, 'event12')
    }; 
  
    const returnManageProduct = () => { 
        Navigate(`/admin/manageProduct`); 
    }  

    const renderEachProduct = (item, indexProduct) => {
        let index = {
            start: 0,
            end: 0,
        } 
        item.value.spaceGetDataFromProductList.filter(item_pagination => {  
            if (item_pagination.paginationNumber ===  item.value.openingPage) {
                index.start = item_pagination.startIndex;
                index.end = item_pagination.endIndex;
            }   
        })
        // console.log(index)
        return ( 
            item.value.productList.slice(index.start, index.end).map((product, index) =>   
                {
                    if(product === null){ 
                        console.log(product, 'đây null ', index)
                        return null;
                    }
                    else{
                        return (
                            <tr key={index}  id={`product_${product.MASP}`}>
                                <td data-label="Order-code">{product.MASP}</td>
                                <td data-label="Name">{product.TENSP}</td>
                                <td data-label="Phone-number">{formatPrice(product.GIABAN)}</td>
                                <td data-label="Address">{formatPrice(product.GIAGOC)}</td>
                                <td data-label="Day">{product.SOLUONGCONLAI}</td>
                                {/* <td>{product.SOLUONGDABAN}</td>   */}
                                <td>{product.TENPL2}</td>  
                                <td data-label="update">
                                    <div class="icon-update">
                                        <span onClick={()=>{Navigate(`/admin/manageProduct?masp=${product.MASP}`)}}>
                                            {/* <FontAwesomeIcon class="fa-solid fa-pen-to-square" icon={faPenToSquare} ></FontAwesomeIcon> */}
                                            <FontAwesomeIcon icon={faEye} class="fa-solid fa-eye" ></FontAwesomeIcon>
                                        </span> 
                                        <span onClick={() =>handleDeleteProduct(product.MASP, item)}>
                                            <FontAwesomeIcon icon={faTrashAlt} className="faTrashAlt"></FontAwesomeIcon>
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
  
    const renderShowProductEveryState = productStatus_Array.map((item, index) =>   
        {  
            // console.log(item)
            if(productStatusPointer === item.value.nameState){
                 
                return(
                    <div 
                        class={`row_xoan_manage justify-content-center ${productStatusPointer === item.value.nameState ? "" : 'hiddenEachState'}`}
                        key={index} 
                    >  
                    <div class={`content_list_order  ${watchProductDetail ? "display_hidden" : ""}`}>
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col" >Mã sản phẩm</th>
                                <th scope="col">Tên sản phẩm</th>
                                <th scope="col">Giá bán</th>
                                <th scope="col">Giá gốc</th>
                                <th scope="col" >Số lượng còn lại</th> 
                                {/* <th scope="col" >Số lượng đã bán</th>  */}
                                <th scope="col" >Danh mục</th> 
                                <th scope="col"></th>

                            </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                { renderEachProduct(item, index) } 
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
            <Popup
                contentPopup = {contentPopup}
                confirm = {'no use'}
            />
            <div class="heading text-uppercase text-center">
                <h1>Sản phẩm</h1>
            </div> 
            <SearhInPageManage 
                infoSearchOption = {infoSearchOption}
                handleSearch = {handleSearch}
            />
            <div className="returnManageProduct">
                <button 
                    onClick={returnManageProduct} 
                    className={`${typeSearchParams !== null && keySearchParams !== null ? '' : 'display_hidden'}`}
                >
                    <FontAwesomeIcon icon={faLeftLong} className="faLeftLong"></FontAwesomeIcon>
                    Danh sách sản phẩm
                </button>
            </div>
            {/* <!-- nav bar trạng thái đơn hàng --> */}
            <div className={`${watchProductDetail ? 'display_hidden' : ''}`}> 
                <NavigationInPageManage
                    orderStatus_Array = {productStatus_Array}
                    orderStatusPointer = {productStatusPointer}
                    handleClickNavState = {handleClickNavState}
                />
                {/* <!--1 đơn hàng đang giao --> */} 
                {renderShowProductEveryState}    
            </div> 
            <div className={`${watchProductDetail ? '' : 'display_hidden'}`}>
                {/* {renderUpdateProduct()}  */}
                <UpdateProduct/>
            </div>
    </div>
    )
}

export default ManageProduct;