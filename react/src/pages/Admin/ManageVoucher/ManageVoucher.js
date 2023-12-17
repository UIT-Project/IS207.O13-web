import "./ManageVoucher.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';

import request from "../../../utils/request";
  
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {  faCircleChevronLeft, faEye, faFloppyDisk, faL, faMagnifyingGlass, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";


function ManageVoucher()
{
    const {formatPrice} = useGlobalVariableContext(); 

    const numberOrderEachPage = 20; 
    const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0); 
    const [watchVoucherDetail, setWatchVoucherDetail] = useState(false);
    var quantityDeleteVoucherInOnePage = 0;
    //update
    const [statusPressAddVoucher, setStatusPressAddVoucher] = useState(true);

    const searchParams  = new URLSearchParams(window.location.search);
    const maspParam = searchParams.get('maspParam');  
    const numberPagination = searchParams.get('numberPagination');  
    const nameStatusParam = searchParams.get('nameStatus');

    const [isUpdating, setIsUpdating] = useState(false);
    let i = 0; 
    const [statusPressUpdateVoucher, setStatusPressUpdateVoucher] = useState(true);
    const Navigate = useNavigate();
    const [listQuantity, setListQuantity] = useState([{
        id: 1,
        soluong: 0,
    }]); 
    const [listColor, setListColor] = useState([]); 
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [checkBoxSizeDefault, setCheckBoxSizeDefault] = useState(["S", "M", "L", "XL", "XXL", "3XL"]);

    
    // manageVoucher
    const [infoUpdateVoucher, setInfoUpdateVoucher] = useState({
        showNameVoucher: '',
        minOrderValue: 0,
        maxDecreaseMoney: 50000,
        typeVoucher: '',
        desctiption: '', 
        quantityUse: 0, 
        startDate: '',
        endDate: '',
        decreasePersent: 0,
    }); 
    const [keySearch, setKeySearch] = useState('');
    const [typeSearch, setTypeSearch] = useState('MAVOUCHER');
    
    const [isEmpty, setIsEmpty] = useState(false);
    const [contentPopup, setContentPopup] = useState({
        title: '',
        content: '',
    })
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

    //update
    // const handleInputInfoUpdateVoucher = (e) => {
    //     e.persist();
    //     setInfoUpdateVoucher({...infoUpdateVoucher, [e.target.name]: e.target.value});
    //     // console.log(e.target.name + " " + e.target.value);
    // }

    //hiển thị các ô nhập số lượng sau khi nhấn button thêm sản phẩm
     

    //xử lý nhập tt sp với các checkboxnm

    //xử lý nhập ảnh, chọn ảnh từ máy client
    //xử lý theo async, chờ upload hết ảnh mới hiển thị, không thì sẽ hiển thị sai
    const handleClickUploadImage = async (e) => {
        const fileImages = e.target.files;
        setImages([...images, ...fileImages])

        const containFileImagesToRead = [...previewImages] 

        //khối lệnh xử lý mã hoá để hiển thị preview ảnh
        const readAsDataURL = (file) => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            });
        };
        let i = 0;
        for (const file of fileImages) {
            const imageURL = await readAsDataURL(file); 
            containFileImagesToRead.push({id: i, src: imageURL});
            i++;
        }
 
        setPreviewImages(containFileImagesToRead); 
    }

    //xử lý lưu tt sp, hình ảnh sp xuống db khi click vào thêm sản phẩm
    const handleClickUpdateVoucher = () => {
        if(
            infoUpdateVoucher.showNameVoucher === '' ||
            // infoUpdateVoucher.minOrderValue === '' ||
            // infoUpdateVoucher.maxDecreaseMoney === '' ||
            infoUpdateVoucher.typeVoucher === '' ||
            infoUpdateVoucher.desctiption === '' ||
            infoUpdateVoucher.quantityUse === 0 ||
            infoUpdateVoucher.startDate === '' ||
            infoUpdateVoucher.endDate === '' ||
            infoUpdateVoucher.decreasePersent === 0 
            // infoUpdateVoucher.decreasePersent === ""
        ){
            setIsEmpty(true)
            setContentPopup({
                title: 'Thêm voucher không thành công',
                content: 'Hãy nhập đầy đủ thông tin trước khi thêm voucher'
            })
            openPopup();   
        }
        else{
            const formData = new FormData();
            // for(const img of images){
            //     //images[] phải đặt tên như v thì laravel mới nhận ra đây là array với tên là images
            //     //xuống laravel dùng $images = $request->file('images');
            //     formData.append('images[]', img);//thêm image vào formdata
            // }
            //thêm thông tin infoUpdateVoucher vào form data, vì đây là một đối tượng nên cần stringify
            formData.append('infoUpdateVoucher', JSON.stringify(infoUpdateVoucher)); 
             // setStatusPressAddVoucher(!statusPressAddVoucher);
            // call api để lưu thông tin, dùng để lưu 'Content-Type': 'multipart/form-data' vì có dùng thêm hình ảnh
            request.post(`api/updateVoucher`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }) 
            .then(res => {  
                console.log('ok');
                setContentPopup({
                    title: 'Thêm voucher thành công',
                    content: 'Trang sẽ được reload sau 3s'
                })
                openPopup();   
                setTimeout(() => {
                    window.location.reload();
                  }, 2000); 
            })
            .catch(error => { 
                console.log(error);
            }) 
        }
    }

    const getInfoForUpdateVoucher = () => {
        request.get(`/api/getInfoForAddVoucher`)
        .then(res => {
            setListColor(res.data.listColor);
            // console.log(res.data.listColor, 'color      lll');
        })
        .catch(error =>{
            console.log(error)
        })
    }

    //chọn một ảnh làm thumnail
    const handleChooseThumnail = (e) =>{
        setInfoUpdateVoucher({...infoUpdateVoucher, [e.target.name]: parseInt(e.target.value)});  
    }

    const handleDeletePreviewImage = (type, index) => {
        if(type === 'imageFromClient'){
            const updatedImages = [...images];
            const updatedPreviewImages = [...previewImages];
        
            // // Xoá hình ảnh tại vị trí index
            updatedImages.splice(index, 1);
            updatedPreviewImages.splice(index, 1);
        
            // // Cập nhật state với các mảng đã cập nhật
            setImages(updatedImages);
            setPreviewImages(updatedPreviewImages);
            if(index === infoUpdateVoucher.indexThumnail){
                setInfoUpdateVoucher({
                    ...infoUpdateVoucher,  
                    indexThumnail: 0
                })
            }
            else if(index < infoUpdateVoucher.indexThumnail && index != 0){
                const newIndexThumnail = infoUpdateVoucher.indexThumnail - 1;
                setInfoUpdateVoucher({ 
                    indexThumnail: newIndexThumnail
                })
            }
            else if(index < infoUpdateVoucher.indexThumnail && index == 0){
                const newIndexThumnail = infoUpdateVoucher.indexThumnail - 1;
                setInfoUpdateVoucher({
                    ...infoUpdateVoucher,   
                    indexThumnail: newIndexThumnail
                })
            } 
        }
        else if(type === 'imageFromServe'){ 
            const listDeleted = infoUpdateVoucher.mahinhanh.filter((item, indexMAHINHANH) => {
                // console.log(item, "okokok", index, '  ', indexMAHINHANH)
                if(indexMAHINHANH === index){
                    console.log(item, "ok in ra")
                    return item
                }
            });
            
            infoUpdateVoucher.mahinhanh.splice(index, 1);
            infoUpdateVoucher.imgurl.splice(index, 1);

            // console.log(listDeleted, 'xoá nào');
            if(index === infoUpdateVoucher.indexThumnail){
                setInfoUpdateVoucher({
                    ...infoUpdateVoucher, 
                    maHinhAnhDeleted: [
                        ...infoUpdateVoucher.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoUpdateVoucher.mahinhanh.length,
                    indexThumnail: 0
                })
            }
            else if(index < infoUpdateVoucher.indexThumnail && index != 0){
                const newIndexThumnail = infoUpdateVoucher.indexThumnail - 1;
                setInfoUpdateVoucher({
                    ...infoUpdateVoucher, 
                    maHinhAnhDeleted: [
                        ...infoUpdateVoucher.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoUpdateVoucher.mahinhanh.length,
                    indexThumnail: newIndexThumnail
                })
            }
            else if(index < infoUpdateVoucher.indexThumnail && index == 0){
                const newIndexThumnail = infoUpdateVoucher.indexThumnail - 1;
                setInfoUpdateVoucher({
                    ...infoUpdateVoucher, 
                    maHinhAnhDeleted: [
                        ...infoUpdateVoucher.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoUpdateVoucher.mahinhanh.length,
                    indexThumnail: newIndexThumnail
                })
            }
            else{
                setInfoUpdateVoucher({
                    ...infoUpdateVoucher, 
                    maHinhAnhDeleted: [
                        ...infoUpdateVoucher.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoUpdateVoucher.mahinhanh.length, 
                })
            }
  
        } 
        console.log("mã hình ảnh ", infoUpdateVoucher.indexThumnail, ' ', index) 
        
    }

    const getInforVoucherDetail = (mavoucher) => {
        const data = {
            mavoucher: mavoucher,
        } 
        request.get(`/api/infoVoucherDetail`, {params: data})
        .then(res => {    
            setInfoUpdateVoucher({
                showNameVoucher: res.data.dataVoucherDetail_sanphams[0].MAVOUCHER,
                minOrderValue: res.data.dataVoucherDetail_sanphams[0].GIATRI_DH_MIN,
                maxDecreaseMoney: res.data.dataVoucherDetail_sanphams[0].GIATRI_GIAM_MAX,
                typeVoucher: res.data.dataVoucherDetail_sanphams[0].PHANLOAI_VOUCHER,
                desctiption: res.data.dataVoucherDetail_sanphams[0].MOTA, 
                quantityUse: res.data.dataVoucherDetail_sanphams[0].SOLUONG, 
                startDate: res.data.dataVoucherDetail_sanphams[0].THOIGIANBD,
                endDate: res.data.dataVoucherDetail_sanphams[0].THOIGIANKT,
                decreasePersent: res.data.dataVoucherDetail_sanphams[0].GIATRIGIAM,
            })
            console.log(res.data)
            setWatchVoucherDetail(true); 

        })
    };

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
        quantityDeleteVoucherInOnePage = 0;
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
        setWatchVoucherDetail(false);
        setIsUpdating(false)
    }

    const handleWatchVoucherDetail = (item, mavoucher) => {
        getInforVoucherDetail(mavoucher);
        getInfoForUpdateVoucher();
        console.log(item)
        // Navigate(`/admin/updateVoucher?nameStatus=${[item.key]}&numberPagination=${[item.value.openingPage]}&masp=${masp}`);
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
        const queryForGetInfoOrderForUsers = { 
            start: numberOrderEachPage * ( openingPage - 1),
            tenDanhMuc: itemInOrderStatus_Array.value.nameState,
            numberOrderEachPage: numberOrderEachPage,
            keySearch: keySearch,
            typeSearch: typeSearch,
        }  
        request.get(`/api/getInfoManageVoucher`, {params: queryForGetInfoOrderForUsers}) 
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
    const getInfoSearchVoucher =  (itemInOrderStatus_Array, openingPage) => {   
        const queryForGetInfoOrderForUsers = { 
            start: numberOrderEachPage * ( openingPage - 1),
            tenDanhMuc: itemInOrderStatus_Array.value.nameState,
            numberOrderEachPage: numberOrderEachPage,
            keySearch: keySearch,
            typeSearch: typeSearch,
        }  
        request.get(`/api/getInfoSearchVoucher`, {params: queryForGetInfoOrderForUsers}) 
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

    const getQuantityOrderToDevidePage = () => {
        request.get('/api/getQuantityVoucherToDevidePage')
        .then(res=> {
            console.log(res.data.quantity, 'jnsjdjsbjn')
            res.data.quantity.forEach(itemStatusFromDB => {
                orderStatus_Array.forEach(itemStatus => {
                    if(itemStatusFromDB.TEN_TRANGTHAI === itemStatus.value.nameState)
                    {
                        const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MAVOUCHER / numberOrderEachPage)  
                        console.log(itemStatusFromDB.SL_MAVOUCHER, 'eee')
                        let arrAddToPaginationList = [];
                        for(let i = 1; i <= pageQuantityShow; i++){
                            arrAddToPaginationList.push(i);
                        console.log(pageQuantityShow, 'ffff', i);
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
            // console.log(orderStatus) 
         }) 
    }  
    const handleSearchInput = (e) => {
        setKeySearch(e.target.value)
    }

    const handleSearch = () => { 
        Navigate(`/admin/searchVoucher?keySearch=${keySearch}&typeSearch=${typeSearch}`)
    }

    const handleInputInfoTypeSearch = (e) => {
        setTypeSearch(e.target.value)
        console.log(typeSearch)
    }

    useEffect(() => {   
        orderStatus_Array.map(item => getInfoOrderForUsers(item, 1) ) 
        getQuantityOrderToDevidePage()  
        getInfoForUpdateVoucher();
        console.log(orderStatus.chuaApDung.orderList)
    }, [])  

    //update

    const handleInputQuantity = (e, i) => {  
        let value = e.target.value
        
        const updatedList = listQuantity.filter(item => item.id !== i);
        updatedList.push({ id: i, soluong: value });
         
        setListQuantity(updatedList)  
        console.log(listQuantity, "nhập số lượng")
    }

    const handleInputInfoUpdateVoucher = (e) => {
        e.persist();
        let {value, name} = e.target; 

        const regex_showNameVoucher = /^[a-zA-Z0-9]*$/;
        const regex_ChiNhapSo = /^\d*$/;
 
        if(name === 'showNameVoucher' && regex_showNameVoucher.test(value)){
            setInfoUpdateVoucher({...infoUpdateVoucher, [name]: value}); 
        } 
        else if((name === 'minOrderValue' || name === 'quantityUse'  || name === 'maxDecreaseMoney') && regex_ChiNhapSo.test(value)){
            setInfoUpdateVoucher({...infoUpdateVoucher, [name]: value}); 
        } 
        
        else if(name === 'typeVoucher' || name === 'decreasePersent' || name === 'startDate' || name === 'desctiption' || name === 'endDate'){
            if(name === 'decreasePersent') value = parseFloat(value)
            console.log(typeof(value))
            setInfoUpdateVoucher({...infoUpdateVoucher, [name]: value}); 


            console.log(name + "fff " + typeof(value));
        }
    }

    const handleClickUpdate= () => {
        setIsUpdating(true)
    }

    const renderInputQuantity = (i) => {  
        return(
            <input 
                type="text" class="form-control" 
                placeholder="Nhập số lượng"
                name="listQuantity"
                onChange={(e) => handleInputQuantity(e, i)}
            />
        )
    }
 
 

    //hiển thị ảnh preview
    const renderPreViewImage = previewImages.map((image, index) =>{ 
        return ( 
            <div className="prview_image" key={image.id}>
                <img src={image.src} key={image.id} width={250} height={350}></img> 
                <input 
                    type="radio" name="indexThumnail" 
                    value={infoUpdateVoucher.mahinhanh.length + index} 
                    checked={(infoUpdateVoucher.mahinhanh.length + index) === (infoUpdateVoucher.indexThumnail)}
                    onChange={handleChooseThumnail}
                ></input>
                <div className="delete_prview_image">
                    <button onClick={() => handleDeletePreviewImage('imageFromClient', image.id)}>
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>lll
                    </button>
                </div>
            </div>
        )
    })
 
    
    const renderUpdateVoucher = () => { 
        return(
            <div  className={`${watchVoucherDetail ? '' : 'display_hidden'}`}>
                <div> 
                    <div className="popup-overlay">
                        <div className="popup-container">
                            <div className="popup-card">
                            <h2>{contentPopup.title}</h2>
                            <p>{contentPopup.content}</p>
                            <button id="close-popup" onClick={closePopup}>Close</button>
                            </div>
                        </div>
                    </div>
                    <div class="icon-update icon-update__margin">
                        <span onClick={handleTurnBack}  className="faCircleChevronLeft">
                            <FontAwesomeIcon class={`fa-solid faCircleChevronLeft ${orderStatusPointer === orderStatus.chuaApDung.nameState ? '' : ''}`} icon={faCircleChevronLeft} ></FontAwesomeIcon>
                        </span>
                        <span onClick={handleClickUpdate}>
                            <FontAwesomeIcon class={`fa-solid fa-pen-to-square ${orderStatusPointer === orderStatus.chuaApDung.nameState ? '' : 'display_hidden'}`} icon={faPenToSquare} ></FontAwesomeIcon>
                        </span>
                    </div>
                    <h2>Cập nhật Voucher</h2>
                    <div class="col-auto"></div>
                    <div class="body_box container col-lg-7">
                        
                    <div class="address_update" id="address_update">
                        <div class="row mb-2">
                            <div class="input_ten_div">
                                {/* <label for="#" class="form-label">Tên sản phẩm</label> */}
                                <input 
                                    type="text" class="form-control " placeholder="Mã voucher" 
                                    onChange={handleInputInfoUpdateVoucher} 
                                    name="showNameVoucher" 
                                    value={infoUpdateVoucher.showNameVoucher}
                                    disabled={isUpdating ? true : true}
                                />
                                <span className={`red_color ${isEmpty && infoUpdateVoucher.showNameVoucher === '' ? '' : 'display_hidden'}`}>Nhập Mã voucher trước khi lưu</span>

                            </div>
                        </div>
                        
                        <div class="row mb-3 phanLoai_chooseGiaTriGiam">
                            <div class="col-4">
                                <label for="#" class="form-label">Phân loại</label>
                                <select class="form-select" required
                                    onChange={handleInputInfoUpdateVoucher}
                                    name="typeVoucher"
                                    value={infoUpdateVoucher.typeVoucher} 
                                    disabled={isUpdating ? false : true}
                                >
                                <option selected value=""></option>
                                <option value="Đơn hàng">Đơn hàng</option>
                                <option value="Vận chuyển">Vận chuyển</option> 
                                </select>
                                <span className={`red_color ${isEmpty && infoUpdateVoucher.typeVoucher === '' ? '' : 'display_hidden'}`}>Chọn phân loại trước khi lưu</span>

                            </div> 
                            <div class="col-4">
                                <label for="#" class="form-label">Phần trăm giảm</label>
                                <select class="form-select" required
                                    onChange={handleInputInfoUpdateVoucher}
                                    name="decreasePersent"
                                    value={infoUpdateVoucher.decreasePersent} 
                                    disabled={isUpdating ? false : true}
                                >
                                    <option selected value="0"></option>
                                    <option value="0.05">5%</option>
                                    <option value="0.10">10%</option> 
                                </select>
                                <span className={`red_color ${isEmpty && infoUpdateVoucher.decreasePersent === 0 ? '' : 'display_hidden'}`}>Chọn phần trăm giảm trước khi lưu</span>

                            </div> 
                        </div>
                        <div className="row mb-3 phanLoai_chooseGiaTriGiam">
                            <div class="col-4 inputDate">
                                <label className="form-label">Ngày bắt đầu</label> 
                                <input 
                                    type="date" 
                                    name="startDate" 
                                    className="form-control widthInputDate"
                                    onChange={handleInputInfoUpdateVoucher}
                                    value={infoUpdateVoucher.startDate}  
                                    disabled={isUpdating ? false : true}
                                ></input>
                                <span className={`red_color ${isEmpty && infoUpdateVoucher.startDate === '' ? '' : 'display_hidden'}`}>Chọn ngày bắt đầu trước khi lưu</span>
                                <span className={`red_color ${infoUpdateVoucher.startDate !== '' &&  new Date(infoUpdateVoucher.startDate)  <= new Date() && isUpdating === true ? '' : 'display_hidden'}`}>Ngày bắt đầu phải sau ngày hiện tại</span>

                            </div>
                            <div class="col-4 inputDate">
                                <label className="form-label">Ngày hết hạn</label>
                                <input 
                                    type="date" 
                                    name="endDate" 
                                    className="form-control widthInputDate"
                                    onChange={handleInputInfoUpdateVoucher}
                                    value={infoUpdateVoucher.endDate}
                                    disabled={isUpdating ? false : true}
                                ></input>
                                <span className={`red_color ${isEmpty && infoUpdateVoucher.endDate === '' ? '' : 'display_hidden'}`}>Chọn ngày hết hạn trước khi lưu</span>
                                <span className={`red_color ${infoUpdateVoucher.startDate !== '' && infoUpdateVoucher.startDate !== '' &&  new Date(infoUpdateVoucher.startDate)   >= new Date(infoUpdateVoucher.endDate) && isUpdating === true ? '' : 'display_hidden'}`}>Ngày hết hạn phải sau ngày bắt đầu</span>

                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-12 input_gia">
                                <div class="col-4 inputDate">
                                    <label for="#" class="form-label">Giá trị đơn hàng tối thiểu</label>
                                    <input 
                                        type="text" class="form-control widthInputDate" placeholder="Giá trị đơn hàng tối thiểu" 
                                        onChange={handleInputInfoUpdateVoucher}
                                        name="minOrderValue"  
                                        value={formatPrice(infoUpdateVoucher.minOrderValue)}
                                        disabled={isUpdating ? false : true}
                                    />
                                    <span className={`red_color ${isEmpty && infoUpdateVoucher.minOrderValue === '' ? '' : 'display_hidden'}`}>Nhập giá trị hoá đơn tối thiểu</span>

                                </div>
                                <div class="col-4 inputDate">
                                    <label for="#" class="form-label">Giá trị giảm tối đa</label>
                                    <input 
                                        type="text" class="form-control widthInputDate" placeholder="Tiền giảm tối đa" 
                                        onChange={handleInputInfoUpdateVoucher}
                                        name="maxDecreaseMoney"   
                                        value={formatPrice(infoUpdateVoucher.maxDecreaseMoney)}
                                        disabled={isUpdating ? false : true}
                                    />
                                    <span className={`red_color ${isEmpty && infoUpdateVoucher.maxDecreaseMoney === '' ? '' : 'display_hidden'}`}>Nhập giá trị giảm tối đa</span>

                                </div>
                            </div> 
                        </div>
                        <div className="row mb-3 phanLoai_chooseGiaTriGiam">
                                <label className="form-label">Số lần sử dụng</label>
                            <div class="col-6 soLanSuDungDiv">
                                <input 
                                    type="text" class="form-control" placeholder="Số lần sử dụng" 
                                    onChange={handleInputInfoUpdateVoucher}
                                    name="quantityUse"  
                                    value={infoUpdateVoucher.quantityUse}
                                    disabled={isUpdating ? false : true}
                                />
                            </div> 
                            <span className={`red_color ${isEmpty && infoUpdateVoucher.quantityUse === '' ? '' : 'display_hidden'}`}>Nhập số lần sử dụng</span>

                        </div>
 
                        <div>
                            <input type="file" multiple name="image" accept="image/*" onChange={handleClickUploadImage}></input>
                            <div>
                                { renderPreViewImage }
                            </div>
                        </div>

                        <textarea 
                            id="w3review" name="desctiption" rows="4" cols="80"
                            className="w3review" placeholder="Nhập mô tả sản phẩm"
                            value={infoUpdateVoucher.desctiption} 
                            onChange={handleInputInfoUpdateVoucher}
                            disabled={isUpdating ? false : true}

                        > 
                        </textarea>

                        <span className={`red_color ${isEmpty && infoUpdateVoucher.desctiption === '' ? '' : 'display_hidden'}`}>Nhập mô tả trước khi lưu</span>

                    </div> 
                        
                    </div>
                    <div class="col-auto"></div>
                    <div class="address_update_button_contain">
                        <div class={`${statusPressAddVoucher ? '' : ''}`}>
                            <button 
                                class={`address_confirm_button btn btn-dark bg_color_green`} 
                                onClick={handleClickUpdateVoucher}
                                disabled={isUpdating ? false : true}
                            > 
                                Lưu
                                <FontAwesomeIcon className="faFloppyDisk" icon={faFloppyDisk}></FontAwesomeIcon>
                            </button>
                            <button 
                                class="address_cancel_button btn btn-outline-secondary bg_color_red"  
                                onClick={handleTurnBack}    
                                disabled={isUpdating ? false : true}
                            >
                                Hủy
                                <FontAwesomeIcon className="faXmark" icon={faXmark}></FontAwesomeIcon>
                            </button>
                        </div> 
                    </div>
                </div> 
            </div>
        ) 
    }
    
    //manageVoucher
    const renderNavState = orderStatus_Array.map((item, index) =>  
        <li class="nav-item col-auto p-2" key={index}>
            <button 
                class={`nav-link ${orderStatusPointer === item.value.nameState ? 'active' : ''}`} 
                aria-current="page"  
                onClick={()=>handleClickNavState(item, 1)}
            >
                {item.value.nameState}
            </button>
                {item.value.pageQuantity}
        </li> 
    )
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
        // console.log(index)
        return ( 
            item.value.orderList.slice(index.start, index.end).map((voucher, index) =>  
                // <div class="order_status_cover " key={index}> {
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
                // </div>  
            )  
        )
    }

    const renderPagination = (item_status) => {
        return item_status.value.paginationList.map((item_pagina) => 
            <button key={item_pagina} onClick={() => handleClickItemPagination(item_status, item_pagina)}>{item_pagina}</button>
        )
    }
 
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
                    { renderPagination(item) }
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
                    <select class="form-select " required
                        onChange={handleInputInfoTypeSearch}
                        name="typeSearch"
                        value={typeSearch} 
                    > 
                    <option selected value="MAVOUCHER">Mã Voucher</option> 
                    {/* <option value="GIABAN">Giá bán</option>
                    <option value="GIAGOC">Giá gốc</option>  */}
                    </select>
                </div> 
                <button onClick={handleSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                </button>
            </div>
            {/* <!-- nav bar trạng thái đơn hàng --> */}
            <div className={`${watchVoucherDetail ? 'display_hidden' : ''}`}>
                <ul class="nav nav-underline justify-content-center"> 
                    {renderNavState}
                </ul>
                {/* <!--1 đơn hàng đang giao --> */} 
                {renderShowVoucherEveryState}    
            </div> 
            {renderUpdateVoucher()}
    </div>
    )
}

export default ManageVoucher;