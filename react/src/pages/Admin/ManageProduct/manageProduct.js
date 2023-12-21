import "./manageProduct.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';
import request from "../../../utils/request";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry, faFloppyDisk, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {  faCircleChevronLeft, faEye, faL, faLeftLong, faMagnifyingGlass, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";
import useAuthCheck from "../AuthCheckLogin/AuthCheckLogin";
import ReactPaginate from 'react-paginate';
import CurrencyInput from 'react-currency-input-field';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function ManageProduct()
{
    const {formatPrice} = useGlobalVariableContext(); 
    useAuthCheck()
    useEffect(() => {
        document.title = "Admin | Quản lý tài khoản khách hàng"
    }, []);
    const numberOrderEachPage = 20; 
    const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0); 
    const [watchProductDetail, setWatchProductDetail] = useState(false);
    var quantityDeleteProductInOnePage = 0;

    const [listDetailCategory2, setListDetailCategory2] = useState([])

    //update
    const searchParams  = new URLSearchParams(window.location.search);
    
    var keySearchParams = searchParams.get('keySearch');
    var typeSearchParams = searchParams.get('typeSearch');
    const nameStatusParam = searchParams.get('nameStatus');

    let i = 0; 
    const [statusPressUpdateProduct, setStatusPressUpdateProduct] = useState(true);
    const Navigate = useNavigate();
    const [listQuantity, setListQuantity] = useState([
        // {
        //     id: 1,
        //     soluong: 0,
        // }
    ]);
    const [contentPopup, setContentPopup] = useState({
        title: '',
        content: '',
    })
    const [isEmpty, setIsEmpty] = useState(false);

    const [infoProductDetail, setInfoProductDetail] = useState({
        dataProductDetail_sanphams: [],
        dataProductDetail_sanpham_mausac_sizes__sizes: [],
        dataProductDetail_sanpham_mausac_sizes__colors: [], 
        dataProductDetail_sanpham_mausac_sizes__hinhanhs: [],
    })
    const [infoUpdateProduct, setInfoUpdateProduct] = useState({
        nameProduct: '',
        originPrice: '',
        sellPrice: '',
        typeProduct: '',
        typeProduct2: '',
        desctiption: '',
        checkboxColor: [],
        checkboxSize: [],
        imgurl: [], 
        listHEX: [],
        quantity: [],
        maHinhAnhDeleted: [],
        mahinhanh: [],
        masp: 1,
        quantityImgurl: 0,
        indexThumnail: 0,
    });
    const [listColor, setListColor] = useState([]); 
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [checkBoxSizeDefault, setCheckBoxSizeDefault] = useState(["S", "M", "L", "XL", "XXL", "3XL"]);

    
    // manageProduct
    const [keySearchSendRequest, setKeySearchSendRequest] = useState('');
    const [typeSearchSendRequest, setTypeSearchSendRequest] = useState('MASP');
    const [orderStatus, setOrderStatus] = useState({
        nam:{
            nameState: 'Nam',
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
        nu: {
            nameState: 'Nữ',
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
        treEm: {
            nameState: 'Trẻ em',
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
        nameStatusParam ? orderStatus[nameStatusParam]?.nameState : orderStatus.nam.nameState
    );
    const [isUpdating, setIsUpdating] = useState(false);


    //update
    const handleInputInfoUpdateProduct = (e) => {
        e.persist();
        // console.log(e.target.name + " " + e.target.value);

        let {value, name} = e.target; 
        const regex_ChiNhapSo = /^\d*$/;
        if((name === 'originPrice' || name === 'sellPrice') && regex_ChiNhapSo.test(value)){
            setInfoUpdateProduct({...infoUpdateProduct, [e.target.name]: e.target.value});
        } 
        else if(
            name === 'nameProduct' || 
            name === 'typeProduct' || 
            name === 'typeProduct2' || 
            name === 'desctiption' || 
            name === 'checkboxColor' ||
            name === 'checkboxSize' ||
            name === 'indexThumnail'
        ){
            setInfoUpdateProduct({...infoUpdateProduct, [e.target.name]: e.target.value});
            console.log(e.target.name + " " + e.target.value);
        }
    }

    //hiển thị các ô nhập số lượng sau khi nhấn button thêm sản phẩm
     

    //xử lý nhập tt sp với các checkbox
    const handleInputInfoUpdateProduct_checkbox = (e) => {
        e.persist();
        var name = e.target.name;
        var value = e.target.value;
        
        let update = [...listQuantity] 
        if(name === 'checkboxColor'){
            value = parseInt(value)
            infoUpdateProduct.checkboxSize.forEach(itemSize => {
                update = [
                    ...update,
                    { mamau: value, maSize: itemSize, soluong: 0}
                ]  
            })   
        }
        else if(name === 'checkboxSize'){ 
            infoUpdateProduct.checkboxColor.forEach(itemColor => {
                update = [
                    ...update,
                    { mamau: itemColor, maSize: value, soluong: 0}
                ]  
            })  
        }
        setListQuantity(update)
        console.log(update, 'update2222222222', name)
        if(infoUpdateProduct[name].includes(value)){
            setInfoUpdateProduct({...infoUpdateProduct, [name]: infoUpdateProduct[name].filter(item => item !== value)}); 
        }
        else{
            setInfoUpdateProduct({...infoUpdateProduct, [name]: [...infoUpdateProduct[name], value]})
        }   
    }

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


    //xử lý lưu tt sp, hình ảnh sp xuống db khi click vào thêm sản phẩm
    const handleClickUpdateProduct = () => {
        // console.log(infoUpdateProduct, 'lklklklkl', infoUpdateProduct.quantityImgurl)
        //sử dụng formData để nhét hình ảnh và thông tin vào một cục rồi đẩy xuống db
        if(
            infoUpdateProduct.nameProduct === '' ||
            infoUpdateProduct.originPrice === '' ||
            infoUpdateProduct.sellPrice === '' ||
            infoUpdateProduct.typeProduct === '' ||
            infoUpdateProduct.desctiption === '' 
            ||
            infoUpdateProduct.checkboxColor.length === 0 ||
            infoUpdateProduct.checkboxSize.length === 0 ||
            // listQuantity.length !== infoUpdateProduct.checkboxColor.length * infoUpdateProduct.checkboxSize.length ||
            (previewImages.length === 0 && infoUpdateProduct.imgurl.length === 0)
        ){
            setIsEmpty(true)
            setContentPopup({
                title: 'Cập nhật sản phẩm không thành công',
                content: 'Hãy nhập đầy đủ thông tin trước khi Cập nhật sản phẩm'
            })
            openPopup();   
        }
        else{ 
            const formData = new FormData();
            for(const img of images){
                //images[] phải đặt tên như v thì laravel mới nhận ra đây là array với tên là images
                //xuống laravel dùng $images = $request->file('images');
                formData.append('images[]', img);//thêm image vào formdata
            }
            //thêm thông tin infoUpdateProduct vào form data, vì đây là một đối tượng nên cần stringify
            formData.append('infoUpdateProduct', JSON.stringify(infoUpdateProduct));
            // listQuantity.shift();
            console.log(listQuantity, 'jkashdjkashdkasdhk');
            formData.append('listQuantity', JSON.stringify(listQuantity));
            // console.log(listQuantity, 'ffff', infoUpdateProduct.checkboxColor, 'áldkalsd', infoUpdateProduct.checkboxSize);


            // setStatusPressUpdateProduct(!statusPressUpdateProduct);
            // call api để lưu thông tin, dùng để lưu 'Content-Type': 'multipart/form-data' vì có dùng thêm hình ảnh
            request.post(`api/updateProduct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            // request.post(`api/UpdateProduct`, infoUpdateProduct)
            .then(res => { 
                // console.log(res.data);
                setContentPopup({
                    title: 'Cập nhật sản phẩm thành công',
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

    const getInfoForUpdateProduct = () => {
        request.get(`/api/getInfoForAddProduct`)
        .then(res => {
            setListColor(res.data.listColor);
            console.log(res.data.listColor, 'color      lll');
        })
        .catch(error =>{
            console.log(error)
        })
    }

    //chọn một ảnh làm thumnail
    const handleChooseThumnail = (e) =>{
        setInfoUpdateProduct({...infoUpdateProduct, [e.target.name]: parseInt(e.target.value)});  
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
            if(index === infoUpdateProduct.indexThumnail){
                setInfoUpdateProduct({
                    ...infoUpdateProduct,  
                    indexThumnail: 0
                })
            }
            else if(index < infoUpdateProduct.indexThumnail && index != 0){
                const newIndexThumnail = infoUpdateProduct.indexThumnail - 1;
                setInfoUpdateProduct({ 
                    indexThumnail: newIndexThumnail
                })
            }
            else if(index < infoUpdateProduct.indexThumnail && index == 0){
                const newIndexThumnail = infoUpdateProduct.indexThumnail - 1;
                setInfoUpdateProduct({
                    ...infoUpdateProduct,   
                    indexThumnail: newIndexThumnail
                })
            } 
        }
        else if(type === 'imageFromServe'){ 
            const listDeleted = infoUpdateProduct.mahinhanh.filter((item, indexMAHINHANH) => {
                // console.log(item, "okokok", index, '  ', indexMAHINHANH)
                if(indexMAHINHANH === index){
                    console.log(item, "ok in ra")
                    return item
                }
            });
            
            infoUpdateProduct.mahinhanh.splice(index, 1);
            infoUpdateProduct.imgurl.splice(index, 1);

            // console.log(listDeleted, 'xoá nào');
            if(index === infoUpdateProduct.indexThumnail){
                setInfoUpdateProduct({
                    ...infoUpdateProduct, 
                    maHinhAnhDeleted: [
                        ...infoUpdateProduct.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoUpdateProduct.mahinhanh.length,
                    indexThumnail: 0
                })
            }
            else if(index < infoUpdateProduct.indexThumnail && index != 0){
                const newIndexThumnail = infoUpdateProduct.indexThumnail - 1;
                setInfoUpdateProduct({
                    ...infoUpdateProduct, 
                    maHinhAnhDeleted: [
                        ...infoUpdateProduct.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoUpdateProduct.mahinhanh.length,
                    indexThumnail: newIndexThumnail
                })
            }
            else if(index < infoUpdateProduct.indexThumnail && index == 0){
                const newIndexThumnail = infoUpdateProduct.indexThumnail - 1;
                setInfoUpdateProduct({
                    ...infoUpdateProduct, 
                    maHinhAnhDeleted: [
                        ...infoUpdateProduct.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoUpdateProduct.mahinhanh.length,
                    indexThumnail: newIndexThumnail
                })
            }
            else{
                setInfoUpdateProduct({
                    ...infoUpdateProduct, 
                    maHinhAnhDeleted: [
                        ...infoUpdateProduct.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoUpdateProduct.mahinhanh.length, 
                })
            }
  
        } 
        console.log("mã hình ảnh ", infoUpdateProduct.indexThumnail, ' ', index) 
        
    }

    const getInforProductDetail = (masp) => {
        const data = {
            masp: masp,
        } 
        request.get(`/api/infoProductDetail`, {params: data})
        .then(res => {   
            console.log(res.data.dataProductDetail_sanphams[0].GIAGOC, 'ok')
            setInfoUpdateProduct({
                ...infoUpdateProduct,
                nameProduct: res.data.dataProductDetail_sanphams[0].TENSP,
                originPrice: res.data.dataProductDetail_sanphams[0].GIAGOC,
                sellPrice: res.data.dataProductDetail_sanphams[0].GIABAN,
                typeProduct: res.data.dataProductDetail_sanphams[0].MAPL_SP,
                typeProduct2: res.data.dataProductDetail_sanphams[0].MAPL_SP2,
                desctiption: res.data.dataProductDetail_sanphams[0].MOTA, 
                checkboxSize:  res.data.dataProductDetail_sanpham_mausac_sizes__sizes.map(item => item.MASIZE),
                imgurl:  res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs.map(item => item.imgURL),
                listHEX:  res.data.dataProductDetail_sanpham_mausac_sizes__colors.map(item => item.HEX),
                quantity: res.data.dataProductDetail_sanpham_mausac_sizes__soluongs,
                checkboxColor:  res.data.dataProductDetail_sanpham_mausac_sizes__colors.map(item => item.MAMAU),
                masp: masp,
                quantityImgurl: res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs.length,
                mahinhanh:  res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs.map(item => item.MAHINHANH),
                indexThumnail: parseInt(res.data.indexthumnail) - 1,
            }) 
 
            
            console.log(parseInt(res.data.indexthumnail), 'test 00000'); 
            setInfoProductDetail({
                dataProductDetail_sanphams: res.data.dataProductDetail_sanphams,
                dataProductDetail_sanpham_mausac_sizes__sizes: res.data.dataProductDetail_sanpham_mausac_sizes__sizes,
                dataProductDetail_sanpham_mausac_sizes__colors: res.data.dataProductDetail_sanpham_mausac_sizes__colors, 
                dataProductDetail_sanpham_mausac_sizes__hinhanhs: res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs,
            })
            

            var updatedList = []  
            res.data.dataProductDetail_sanpham_mausac_sizes__sizes.forEach(itemSize => {
                res.data.dataProductDetail_sanpham_mausac_sizes__colors.forEach(itemColor => {
                    res.data.dataProductDetail_sanpham_mausac_sizes__soluongs.forEach(itemSoluong => {
                        if(itemSoluong.HEX === itemColor.HEX && itemSoluong.MASIZE === itemSize.MASIZE){
                            updatedList = [
                                ...updatedList,
                                { 
                                    mamau: itemColor.MAMAU,
                                    maSize: itemSize.MASIZE,
                                    soluong: itemSoluong.SOLUONG 
                                }
                            ]  
                        }
                        console.log(itemSoluong.HEX, itemColor.HEX, itemSoluong.MASIZE, itemSize, '090909')
                    })
                })
            })
 
            console.log(
                updatedList, 
                res.data.dataProductDetail_sanpham_mausac_sizes__colors, 
                "nhập số lượng", 
                res.data.dataProductDetail_sanpham_mausac_sizes__soluongs, 
                res.data.dataProductDetail_sanpham_mausac_sizes__colors
            )
            setListQuantity(updatedList)  
        })
    };

    //manageProduct
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
        quantityDeleteProductInOnePage = 0;
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
        setWatchProductDetail(false);
        setIsUpdating(false)
    }

    const handleWatchProductDetail = (item, masp) => {
        getInforProductDetail(masp);
        setWatchProductDetail(true); 
        getInfoForUpdateProduct();//color
        console.log(item)
        // Navigate(`/admin/updateProduct?nameStatus=${[item.key]}&numberPagination=${[item.value.openingPage]}&masp=${masp}`);
    }

    const handleDeleteProduct = (masp, item_ofOrderStatusArray) => {  
        
          

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
                setOrderStatus(prevOrderStatus => ({
                    ...prevOrderStatus, 
                    [item_ofOrderStatusArray.key] : 
                        {...prevOrderStatus[item_ofOrderStatusArray.key],  
                        orderList: prevOrderStatus[item_ofOrderStatusArray.key].orderList.map(item => {
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
            }
        })
        
    }

    const getInfoOrderForUsers =  (itemInOrderStatus_Array, openingPage) => {   
        const queryForGetInfoOrderForUsers = { 
            start: numberOrderEachPage * ( openingPage - 1),
            tenDanhMuc: itemInOrderStatus_Array.value.nameState,
            numberOrderEachPage: numberOrderEachPage, 
            typeSearch: typeSearchParams,
            keySearch:  keySearchParams,
        }  
        if(typeSearchParams === null && keySearchParams === null){
            request.get(`/api/getInfoManageProduct`, {params: queryForGetInfoOrderForUsers}) 
            .then(res=>{  
                console.log(res.data, 'lllk')
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
            if(typeSearchParams === 'MASP'){
                queryForGetInfoOrderForUsers.keySearch = parseInt(queryForGetInfoOrderForUsers.keySearch);
            }
            console.log('aklsjdksdk', queryForGetInfoOrderForUsers.typeSearch, queryForGetInfoOrderForUsers.keySearch)
            try{
                request.get(`/api/getInfoSearchProductAdmin`, {params: queryForGetInfoOrderForUsers})
                .then(res=>{       
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
        if(typeSearchParams === null && keySearchParams === null){
            request.get('/api/getQuantityProductToDevidePage')
            .then(res=> {
                console.log(res.data.quantity, 'jnsjdjsbjn')
            orderStatus_Array.forEach(itemStatus => {
                let found = false;
                res.data.quantity.forEach(itemStatusFromDB => {
                    if(itemStatusFromDB.TENPL === itemStatus.value.nameState)
                    {
                        found = true
                        const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MASP / numberOrderEachPage)  
                        console.log(itemStatusFromDB.SL_MASP, 'eee')
                        let arrAddToPaginationList = [];
                        for(let i = 1; i <= pageQuantityShow; i++){
                            arrAddToPaginationList.push(i);
                        console.log(pageQuantityShow, 'ffff', i);
                        }
                        if(itemStatusFromDB.SL_MASP > 0){
                            setOrderStatus(prevOrderStatus => ({
                                ...prevOrderStatus, 
                                [itemStatus.key] : 
                                    {...prevOrderStatus[itemStatus.key],  
                                    pageQuantity: itemStatusFromDB.SL_MASP, 
                                    paginationList: arrAddToPaginationList}
                            }))
                        }
                        
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
            const data = {
                keySearch: keySearchParams,
                typeSearch: typeSearchParams
            }
            request.get('/api/getQuantityProductToDevidePage_SearchProductAdmin', {params: data})
            .then(res=> {
                console.log(res.data.quantity, 'jnsjdjsbjn')
                orderStatus_Array.forEach(itemStatus => {
                    let found = false;
                    
                    res.data.quantity.forEach(itemStatusFromDB => {
                        if(itemStatusFromDB.TENPL === itemStatus.value.nameState)
                        {
                            found = true;

                            const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MASP / numberOrderEachPage)  
                            console.log(itemStatusFromDB.SL_MASP, 'eee')
                            let arrAddToPaginationList = [];
                            for(let i = 1; i <= pageQuantityShow; i++){
                                arrAddToPaginationList.push(i);
                            console.log(pageQuantityShow, 'ffff', i);
                            }
                            setOrderStatus(prevOrderStatus => ({
                                ...prevOrderStatus, 
                                [itemStatus.key] : 
                                    {...prevOrderStatus[itemStatus.key],  
                                    pageQuantity: itemStatusFromDB.SL_MASP, 
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
    }  
    const handleSearchInput = (e) => {
        setKeySearchSendRequest(e.target.value)
    }

    const handleSearch = async () => {
        // setOrderStatus({
        //     nam:{
        //         nameState: 'Nam',
        //         orderList: [],
        //         pageQuantity: null,
        //         paginationList: [],
        //         openingPage: 1,
        //         indexOfOderListHelpDelete: 0,
        //         spaceGetDataFromOrderList: [{
        //             paginationNumber: 1,
        //             ordinalNumber: 1,
        //             startIndex: 0,
        //             endIndex: numberOrderEachPage,
        //         }]
        //     },
        //     nu: {
        //         nameState: 'Nữ',
        //         orderList: [],
        //         pageQuantity: null,
        //         paginationList: [],
        //         openingPage: 1, 
        //         indexOfOderListHelpDelete: 0,
        //         spaceGetDataFromOrderList: [{
        //             paginationNumber: 1,
        //             ordinalNumber: 1,
        //             startIndex: 0,
        //             endIndex: numberOrderEachPage,
        //         }]
        //     },
        //     treEm: {
        //         nameState: 'Trẻ em',
        //         orderList: [],
        //         pageQuantity: null,
        //         paginationList: [],
        //         openingPage: 1, 
        //         indexOfOderListHelpDelete: 0,
        //         spaceGetDataFromOrderList: [{
        //             paginationNumber: 1,
        //             ordinalNumber: 1,
        //             startIndex: 0,
        //             endIndex: numberOrderEachPage,
        //         }]
        //     }, 
        // })
        // Navigate(`/admin/manageProduct?keySearch=${keySearchSendRequest}&typeSearch=${typeSearchSendRequest}`)
        window.location.href = `/admin/manageProduct?keySearch=${keySearchSendRequest}&typeSearch=${typeSearchSendRequest}`;
        // window.location.reload();
    }

    const handleInputInfoTypeSearchSendRequest = (e) => {
        setTypeSearchSendRequest(e.target.value) 
    }
    const handlePageChange = (item_status, event, page) => {
        handleClickItemPagination(item_status, page);
    };

    useEffect(() => {   
        orderStatus_Array.map(item => getInfoOrderForUsers(item, 1) ) 
        getQuantityOrderToDevidePage()  
        getInfoForUpdateProduct();
        console.log(orderStatus.nam.orderList, 'okokokokokok')
    }, [])  

    const getDetailCategory2 = () => {
        // const data = {
        //     typeProduct_mapl: infoUpdateProduct.typeProduct
        // }
        request.get(`api/getDetailCategory2`, {params: {typeProduct_mapl: infoUpdateProduct.typeProduct}})
        .then(res => {
            console.log(res.data.listDetailCategory2)
            setListDetailCategory2(res.data.listDetailCategory2)
        })                                                                                      
        .catch(err => {
            console.log(infoUpdateProduct.typeProduct, err)
        })
    } 
    
    useEffect(() => {
        if(infoUpdateProduct.typeProduct !== 0 && infoUpdateProduct.typeProduct !== ''){
            console.log(infoUpdateProduct.typeProduct, 'phanloai2')
            getDetailCategory2();
        }
    }, [infoUpdateProduct.typeProduct])

    //update

    const handleClickUpdate= () => {
        setIsUpdating(true)
    }
    const handleInputQuantity = (e, foundIndex) => {  

        let value  = parseInt( e.target.value)
        const updatedList = listQuantity.map((item, index) => {
            if (index === foundIndex) {
                return { ...item, soluong: value }; // Cập nhật giá trị soluong cho phần tử cần chỉnh sửa
            }
            return item;
        });
        console.log(updatedList, "nhập số lượng", foundIndex, value)
        setListQuantity(updatedList)  
    }

    const returnManageProduct = () => { 
        window.location.href = `/admin/manageProduct`; 
    }
    const renderListDetailCategory2 = listDetailCategory2.map(item => 
        <option value={item.MAPL2}>{item.TENPL2}</option> 
    )

    const renderInputQuantity = (itemColor, itemSize) => {  
        console.log(listQuantity, 'llllkksdk8', i)
 
        const foundIndex = listQuantity.findIndex(item => item.mamau === itemColor && item.maSize === itemSize);
        console.log(foundIndex, listQuantity[foundIndex], 'foundindex')
        if(foundIndex !== -1){
            return(
                <input 
                    type="text" 
                    class="form-control" 
                    placeholder="Nhập số lượng"
                    name="listQuantity" 
                    value={listQuantity.length > 0 ? listQuantity[foundIndex].soluong : ''} // Đảm bảo giá trị null hoặc undefined không gây lỗi
                    onChange={(e) => handleInputQuantity(e, foundIndex)}
                    disabled={isUpdating ? false : true} 
                />
            )
        }
    }

    const renderListColor = listColor.map((item) => {
        return (
            <div className="list_checbox_color_item">
                <input 
                    type="checkbox" id={item.MAMAU} className="checkbox_sizes" 
                    name="checkboxColor"
                    value={item.MAMAU}
                    checked={infoUpdateProduct.checkboxColor.includes(item.MAMAU)}
                    onChange={handleInputInfoUpdateProduct_checkbox}
                    disabled={isUpdating ? false : true}

                ></input>
                <label 
                    for={item.MAMAU}
                    className={
                        ` 
                            size_icon1 size_icon_color
                            ${infoUpdateProduct.checkboxColor.find(itemChecked => itemChecked === item.MAMAU) 
                                ? 'border_size_color' 
                                : ''
                            }
                        `
                    }
                >
                    <div className="checkbox_color" style={{backgroundColor: `${item.HEX}`}}></div>
                </label>
            </div>
        )   
    })

    const renderInputQuantity_0 = (itemColor, itemSize) => {
        const foundItem_size = infoUpdateProduct.quantity.some(item => item.MASIZE === itemSize);
        const foundItem_color = infoUpdateProduct.quantity.some(item => item.HEX === `${listColor[itemColor - 1].HEX}`);
        console.log(foundItem_size, foundItem_color, 'AKSJDKJSDSK')
        if(foundItem_size === false || foundItem_color === false){ 
            return ( 
                <div className="display_flex_ee">
                    <div className="input_quantity__quantity_haved_div_width">
                        <span className="input_quantity__quantity_haved1">0</span> 
                    </div>

                    <div>
                        {/* <label for="#" class="form-label">Giá niêm yết</label> */} 
                        {renderInputQuantity(itemColor, itemSize)}                                                                
                    </div>
                </div> 
            )
        }
    }
    //hiển thị các ô nhập số lượng sau khi nhấn button thêm sản phẩm
    const renderInputSoLuong =  infoUpdateProduct.checkboxSize.map((itemSize, indexSize) => {
        return (
            
            <div class = "info"> 
                <h6 className="input_quantity__size_name" key={indexSize}><span className="input_quantity__size_name_text">Size {itemSize}</span></h6> 
                {
                    infoUpdateProduct.checkboxColor.map((itemColor, indexColor) => {
                        console.log(itemColor, 'item')
                        return(
                            <div className="input_quantity__quantity" key={indexColor}>
                                <div 
                                    className="input_quantity__product_color" 
                                    style={{
                                        backgroundColor: `${listColor.find(item => item.MAMAU === itemColor).HEX}`
                                    }}
                                ></div>
                                <div> 
                                    {/* {renderInputQuantity_0(itemColor, itemSize) }  */}
                                    {

                                        infoUpdateProduct.quantity.map((item, indexQuantity) => { 
                                            // console.log(item.HEX, item.MASIZE, 'lk12', listColor[indexQuantity].HEX, indexQuantity,  itemSize, 'oio', listColor, '0909')
                                            if(item.MAMAU === itemColor && item.MASIZE === itemSize){
                                                // handleInputQuantity(item.SOLUONG, i)
                                                return(
                                                    <div className="display_flex_ee">
                                                        <div className="input_quantity__quantity_haved_div_width">
                                                            <span className="input_quantity__quantity_haved1" key={indexQuantity}>{item.SOLUONG}</span> 
                                                        </div>
                                                        <div>
                                                                {/* <label for="#" class="form-label">Giá niêm yết</label> */} 
                                                            {renderInputQuantity(itemColor, itemSize)}                                                                
                                                        </div>
                                                    </div>
                                                ) 
                                            }  
                                        })
                                    }
                                </div>
                                {/* <div class="input_gia_div">
                                        <label for="#" class="form-label">Giá niêm yết</label>
                                        <input type="text" class="form-control" placeholder="Nhập số lượng"/>
                                </div> */} 
                                {renderInputQuantity_0(itemColor, itemSize) } 
                            </div> 

                        )
                    })
                }
                <span className={`red_color ${isEmpty && listQuantity.length !== infoUpdateProduct.checkboxColor.length * infoUpdateProduct.checkboxSize.length ? '' : 'display_hidden'}`}>Nhập số lượng trước khi lưu</span>

            </div>
        )
    })

    //hiển thị ảnh preview
    const renderPreViewImage = previewImages.map((image, index) =>{ 
        return ( 
            <div className="prview_image" key={image.id}>
                <div>
                {/* width={150} height={250} */}
                    <img src={image.src} key={image.id}  className="prview_image__img"></img> 
                </div>
                <input 
                    type="radio" name="indexThumnail" 
                    value={infoUpdateProduct.mahinhanh.length + index} 
                    checked={(infoUpdateProduct.mahinhanh.length + index) === (infoUpdateProduct.indexThumnail)}
                    onChange={handleChooseThumnail}
                ></input>
                <div className="delete_prview_image">
                    <button className="delete_prview_image__css" onClick={() => handleDeletePreviewImage('imageFromClient', image.id)}>
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                    </button>
                </div>
            </div>
        )
    })

    const renderPreViewImageFromImgUrl = infoUpdateProduct.imgurl.map((item, index) => {
        // console.log(item)
        return ( 
            <div key={index} className="prview_image">
                <div>
                    <img src={item} key={index} width={150} height={250} className="prview_image__img"></img> 
                    
                </div>
                <input 
                    type="radio" name="indexThumnail" value={index} 
                    onChange={handleChooseThumnail}
                    checked={(infoUpdateProduct.indexThumnail) === index}
                ></input>
                <div className="delete_prview_image">
                    <button  
                        className="delete_prview_image__css" 
                        onClick={() => handleDeletePreviewImage('imageFromServe', index)}
                        disabled={isUpdating ? false : true}
                    >
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                    </button>
                </div>
            </div>
        )
    })

    const renderCheckBoxSize = checkBoxSizeDefault.map((item, index) =>
        <div key={index} className="choose_size__div__item">
            <input 
                type="checkbox" id={`${item}`} 
                className="checkbox_sizes"  
                name="checkboxSize"
                value={`${item}`}
                checked={infoUpdateProduct.checkboxSize.includes(`${item}`)}
                onChange={handleInputInfoUpdateProduct_checkbox}
                disabled={isUpdating ? false : true}

            ></input>
            <label 
                for={`${item}`} 
                className={
                    `
                        size_icon1 
                        ${infoUpdateProduct.checkboxSize.find(itemChecked => itemChecked === item) 
                            ? 'border_size_color' 
                            : ''
                        }
                    `
                }
            >
                {item}
            </label> 
        </div> 
    )
 
    
    const renderUpdateProduct = () => { 
        return(
            <div  className={`${watchProductDetail ? '' : 'display_hidden'}`}>
                <div> 
                    <div class="icon-update icon-update__margin">
                        <span onClick={handleTurnBack}  className="faCircleChevronLeft">
                            <FontAwesomeIcon class={`fa-solid faCircleChevronLeft`} icon={faCircleChevronLeft} ></FontAwesomeIcon>
                        </span>
                        <span onClick={handleClickUpdate}>
                            <FontAwesomeIcon class={`fa-solid fa-pen-to-square `} icon={faPenToSquare} ></FontAwesomeIcon>
                        </span>
                    </div>
                    <h2>CẬP NHẬT SẢN PHẨM</h2>
                    <div class="col-auto"></div>
                    <div class="body_box container col-lg-7">
                        
                        <div class="address_update" id="address_update">
                            <div class="row_xoan_manage mb-2" id="roww">
                                <div class="col-12">
                                   
                                    <label for="#" class="form-label" id="item" >Tên sản phẩm</label>
                                    <input 
                                        type="text" class="form-control" placeholder="Nhập tên sản phẩm" 
                                        onChange={handleInputInfoUpdateProduct} 
                                        name="nameProduct" 
                                        value={infoUpdateProduct.nameProduct}
                                        disabled={isUpdating ? false : true}

                                    />
                                    <span className={`red_color ${isEmpty && infoUpdateProduct.nameProduct === '' ? '' : 'display_hidden'}`}>Nhập tên sản phẩm trước khi lưu</span>

                                </div>
                            </div>
                             
                            <div class="row_xoan_manage mb-2" id="roww">
                                <div class="col-12 div_kjkjk">
                                    <div className="col-4">
                                        <div class="">
                                         <label for="#" class="form-label">Giá niêm yết</label> 
                                            {/* <input 
                                                type="text" class="form-control  " placeholder="Giá niêm yết" 
                                                onChange={handleInputInfoUpdateProduct}
                                                name="originPrice"  
                                                value={infoUpdateProduct.originPrice}
                                                disabled={isUpdating ? false : true}

                                            /> */}
                                            <CurrencyInput
                                                className="form-control"
                                                placeholder="Giá niêm yết"
                                                onValueChange={(value, name) => handleInputInfoAddNewProduct_vnd(value, name)}
                                                name="originPrice"
                                                value={infoUpdateProduct.originPrice}
                                                allowNegativeValue={false} // Tùy chọn, để không cho phép giá trị âm
                                                decimalSeparator="," // Phân cách phần thập phân
                                                groupSeparator="." // Phân cách hàng nghìn
                                                suffix=" VND" // Đơn vị tiền tệ
                                                disabled={isUpdating ? false : true}

                                            />
                                            <span className={`red_color ${isEmpty && infoUpdateProduct.originPrice === '' ? '' : 'display_hidden'}`}>Nhập giá niêm yết trước khi lưu</span>

                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div class="">
                                            <label for="#" class="form-label">Giá bán</label>
                                            {/* <input 
                                                type="text" class="form-control  " placeholder="Giá bán" 
                                                onChange={handleInputInfoUpdateProduct}
                                                name="sellPrice"   
                                                value={infoUpdateProduct.sellPrice}
                                                disabled={isUpdating ? false : true}
                                            /> */}
                                            <CurrencyInput
                                                className="form-control"
                                                placeholder="Giá bán"
                                                onValueChange={(value, name) => handleInputInfoAddNewProduct_vnd(value, name)}
                                                name="sellPrice"
                                                value={infoUpdateProduct.sellPrice}
                                                allowNegativeValue={false} // Tùy chọn, để không cho phép giá trị âm
                                                decimalSeparator="," // Phân cách phần thập phân
                                                groupSeparator="." // Phân cách hàng nghìn
                                                suffix=" VND" // Đơn vị tiền tệ
                                                disabled={isUpdating ? false : true}

                                            />
                                            <span className={`red_color ${isEmpty && infoUpdateProduct.sellPrice === '' ? '' : 'display_hidden'}`}>Nhập giá bán trước khi lưu</span>

                                        </div>
                                    </div>

                                </div> 
                                    <span className={`red_color ${parseInt(infoUpdateProduct.originPrice) < parseInt(infoUpdateProduct.sellPrice) ? '' : 'display_hidden'}`}>Giá bán phải nhỏ hơn hoặc = giá niêm yết</span>
                            </div>
                            <div class="row_xoan_manage mb-3 div_kjkjk" id="roww">
                                <div class="col-4">
                                    <label for="#" class="form-label">Phân loại</label>
                                    <select class="form-select" required
                                        onChange={handleInputInfoUpdateProduct}
                                        name="typeProduct"
                                        value={infoUpdateProduct.typeProduct}
                                        disabled={isUpdating ? false : true}
                                    >
                                    <option selected value="1">Nam</option>
                                    <option value="2">Nữ</option>
                                    <option value="3">Trẻ em</option>
                                    </select>
                                    <span className={`red_color ${isEmpty && infoUpdateProduct.typeProduct === '' ? '' : 'display_hidden'}`}>Hãy chọn phân loại</span>

                                </div> 
                                <div class="col-4">
                                <label for="#" class="form-label">Phân loại chi tiết</label>
                                <select class="form-select" required
                                    onChange={handleInputInfoUpdateProduct}
                                    name="typeProduct2"
                                    value={infoUpdateProduct.typeProduct2} 
                                    disabled={isUpdating ? false : true}
                                >
                                    <option selected value="0">-- Chọn phân loại chi tiết --</option>
                                    {renderListDetailCategory2}
                                </select>
                                <span className={`red_color ${isEmpty && infoUpdateProduct.typeProduct2 === '' ? '' : 'display_hidden'}`}>Hãy chọn phân loại sản phẩm chi tiết</span>

                            </div> 
                            </div>

                            <div className="row row_xoan_manage" id="roww concent">
                                <div className="col-5 choose_size">
                                    <div >
                                        <label>Chọn các loại size</label>
                                    </div>
                                    <div className="choose_size__div">
                                        {renderCheckBoxSize} 
                                    </div>
                                </div>
                            </div>
                            <span className={`red_color ${isEmpty && infoUpdateProduct.checkboxSize.length === 0 ? '' : 'display_hidden'}`}>Hãy chọn size</span>

                            <div className="row row_xoan_manage" id="concent roww">
                                <div className="col-5 choose_size">
                                    <div>
                                        <label>Chọn các loại màu</label>
                                    </div>
                                    <div className="list_checbox_color">
                                        {renderListColor} 
                                    </div>
                                </div>
                            </div>
                            <span className={`red_color ${isEmpty && infoUpdateProduct.checkboxColor.length === 0 ? '' : 'display_hidden'}`}>Hãy chọn màu</span>

                            <div>
                                <input 
                                    type="file" 
                                    className="inputfile inputfile-3" 
                                    id="file-3" multiple 
                                    name="image" accept="image/*" 
                                    onChange={handleClickUploadImage}
                                    disabled={isUpdating ? false : true}

                                ></input>
                                <label for="file-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg> 
                                    <span>Choose a file&hellip;</span>
                                </label>
                                <div>
                                    <span className={`red_color ${isEmpty && previewImages.length === 0 && infoUpdateProduct.imgurl.length === 0  ? '' : 'display_hidden'}`}>Chọn ảnh và ảnh thumnail trước khi lưu</span>
                                </div>
                                <div className="renderPreViewImage">
                                    { renderPreViewImageFromImgUrl }
                                    { renderPreViewImage }
                                </div>
                            </div>

                            {/* <textarea 
                                id="w3review" name="desctiption" rows="4" cols="80"
                                value={infoUpdateProduct.desctiption} 
                                onChange={handleInputInfoUpdateProduct}
                            >
                                At w3schools.com you will learn how to make a website.
                                They offer free tutorials in all web development technologies.
                            </textarea> */}
                            <textarea 
                                id="w3review" name="desctiption" rows="4" cols="80"
                                className="w3review" placeholder="Nhập mô tả sản phẩm"
                                value={infoUpdateProduct.desctiption} 
                                onChange={handleInputInfoUpdateProduct}
                                disabled={isUpdating ? false : true}

                            > 
                            </textarea>

                            <span className={`red_color ${isEmpty && infoUpdateProduct.desctiption === '' ? '' : 'display_hidden'}`}>Nhập mô tả trước khi lưu</span>

                        </div> 
                        
                    </div>
                    <div class="col-auto"></div>
                </div>
                <div>
                    <h2>NHẬP SỐ LƯỢNG</h2>
 
                    <div class="col-auto"></div>
                    <div class="body_box container col-lg-7 tuychinh">
                        
                        {renderInputSoLuong}
                        
                        
                    </div>
                    <div class="address_update_button_contain row_xoan_manage">
                        <div class={`${statusPressUpdateProduct ? '' : 'display_hidden'}`}>
                            <button 
                                class={`address_confirm_button btn btn-dark bg_color_green`} 
                                onClick={handleClickUpdateProduct}
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
                    <div class="col-auto"></div>

                </div>
            </div>
        ) 
    }
    const renderLoading = (item) => {
        return (
          <div class={`donut multi size__donut ${item.value.pageQuantity === null ? '' : 'display_hidden'}`}></div> 
        )
      }

    const handleInputInfoAddNewProduct_vnd = (value, name) => { 
        const regex_ChiNhapSo = /^\d*$/;
        console.log(value, 'value')
        if (value === undefined ) {
            value = 0; // Gán giá trị là '0' khi không còn giá trị nào trong trường input
        }
        if((name === 'originPrice' || name === 'sellPrice') && regex_ChiNhapSo.test(value)){
            setInfoUpdateProduct({...infoUpdateProduct, [name]: value});
        }  
    }
    //manageProduct
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
                // <div class="order_status_cover " key={index}> {
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
                                <td>{product.SOLUONGDABAN}</td>  
                                <td>{product.TENPL2}</td>  
                                <td data-label="update">
                                    <div class="icon-update">
                                        <span onClick={()=>handleWatchProductDetail(item, product.MASP, product)}>
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

    const renderPagination = (item_status) => {
        return item_status.value.paginationList.map((item_pagina) => 
            <button key={item_pagina} className="btn_pagination" onClick={() => handleClickItemPagination(item_status, item_pagina)}>{item_pagina}</button>
        )
    }
  

    const renderShowProductEveryState = orderStatus_Array.map((item, index) =>   
        {  
            // console.log(item)
            if(orderStatusPointer === item.value.nameState){
                 
                return(
                    <div 
                        class={`row_xoan_manage justify-content-center ${orderStatusPointer === item.value.nameState ? "" : 'hiddenEachState'}`}
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
                                <th scope="col" >Số lượng đã bán</th> 
                                <th scope="col" >Danh mục</th> 
                                <th scope="col"></th>

                            </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                { renderEachProduct(item, index) } 
                            </tbody>
                        </table>
                    </div>
                    <div class="box-panigation-list">
                        {/* { renderPagination(item) } */}
                        
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
            
            <div className="popup-overlay">
                <div className="popup-container">
                    <div className="popup-card">
                    <h2>{contentPopup.title}</h2>
                    <p>{contentPopup.content}</p>
                    <button id="close-popup" onClick={closePopup}>Close</button>
                    </div>
                </div>
            </div>
            <div class="heading text-uppercase text-center">
                <h1>Sản phẩm</h1>
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
                    <select class="form-select" required
                        onChange={handleInputInfoTypeSearchSendRequest}
                        name="typeSearch"
                        // value={typeSearchParams} 
                    > 
                    <option class="searchOption" selected value="MASP">Mã Sản phẩm</option>
                    <option class="searchOption" value="TENSP">Tên Sản Phẩm</option>
                    {/* <option value="GIABAN">Giá bán</option>
                    <option value="GIAGOC">Giá gốc</option>  */}
                    </select>
                </div> 
                <button onClick={handleSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon> 
                </button>
            </div>
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
                <ul class="nav nav-underline justify-content-center"> 
                    {renderNavState}
                </ul>
                {/* <!--1 đơn hàng đang giao --> */} 
                {renderShowProductEveryState}    
            </div> 
            {renderUpdateProduct()}
    </div>
    )
}

export default ManageProduct;