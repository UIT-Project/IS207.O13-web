import "./ManageVoucher.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';

import request from "../../../utils/request";
  
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {  faEye, faL, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';


function ManageVoucher()
{
    const numberOrderEachPage = 20; 
    const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0); 
    const [watchProductDetail, setWatchProductDetail] = useState(false);
    var quantityDeleteProductInOnePage = 0;
    //update
    const searchParams  = new URLSearchParams(window.location.search);
    const maspParam = searchParams.get('maspParam');  
    const numberPagination = searchParams.get('numberPagination');  
    const nameStatusParam = searchParams.get('nameStatus');

    let i = 0; 
    const [statusPressUpdateProduct, setStatusPressUpdateProduct] = useState(true);
    const Navigate = useNavigate();
    const [listQuantity, setListQuantity] = useState([{
        id: 1,
        soluong: 0,
    }]);
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
    const [keySearch, setKeySearch] = useState('');
    const [typeSearch, setTypeSearch] = useState('MASP');
    const [orderStatus, setOrderStatus] = useState({
        chuaApDung:{
            nameState: 'Chưa áp dụng',
            orderList: [],
            pageQuantity: 0,
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
            pageQuantity: 0,
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
            pageQuantity: 0,
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
    const handleInputInfoUpdateProduct = (e) => {
        e.persist();
        setInfoUpdateProduct({...infoUpdateProduct, [e.target.name]: e.target.value});
        // console.log(e.target.name + " " + e.target.value);
    }

    //hiển thị các ô nhập số lượng sau khi nhấn button thêm sản phẩm
     

    //xử lý nhập tt sp với các checkbox
    const handleInputInfoUpdateProduct_checkbox = (e) => {
        e.persist();
        var name = e.target.name;
        var value = e.target.value;
        if(name === 'checkboxColor')
            value = parseInt(value)
        if(infoUpdateProduct[name].includes(value)){
            setInfoUpdateProduct({...infoUpdateProduct, [name]: infoUpdateProduct[name].filter(item => item !== value)});
            // console.log(infoUpdateProduct); 
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

    //xử lý lưu tt sp, hình ảnh sp xuống db khi click vào thêm sản phẩm
    const handleClickUpdateProduct = () => {
        // console.log(infoUpdateProduct, 'lklklklkl', infoUpdateProduct.quantityImgurl)
        //sử dụng formData để nhét hình ảnh và thông tin vào một cục rồi đẩy xuống db
        const formData = new FormData();
        for(const img of images){
            //images[] phải đặt tên như v thì laravel mới nhận ra đây là array với tên là images
            //xuống laravel dùng $images = $request->file('images');
            formData.append('images[]', img);//thêm image vào formdata
        }
        //thêm thông tin infoUpdateProduct vào form data, vì đây là một đối tượng nên cần stringify
        formData.append('infoUpdateProduct', JSON.stringify(infoUpdateProduct));
        // listQuantity.shift();
        console.log(listQuantity);
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
         })
        .catch(error => { 
            console.log(error);
        })
    }

    const getInfoForUpdateProduct = () => {
        request.get(`/api/getInfoForAddProduct`)
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
            // res.data.dataProductDetail_sanphams.map(item => 
            //     setInfoUpdateProduct({
            //         ...infoUpdateProduct,
            //         nameProduct: item.TENSP
            //     })
            // )
            // console.log(res);
            setInfoProductDetail({
                dataProductDetail_sanphams: res.data.dataProductDetail_sanphams,
                dataProductDetail_sanpham_mausac_sizes__sizes: res.data.dataProductDetail_sanpham_mausac_sizes__sizes,
                dataProductDetail_sanpham_mausac_sizes__colors: res.data.dataProductDetail_sanpham_mausac_sizes__colors, 
                dataProductDetail_sanpham_mausac_sizes__hinhanhs: res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs,
            })
            
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
    }

    const handleWatchProductDetail = (item, masp) => {
        getInforProductDetail(masp);
        setWatchProductDetail(true); 
        getInfoForUpdateProduct();
        console.log(item)
        // Navigate(`/admin/updateProduct?nameStatus=${[item.key]}&numberPagination=${[item.value.openingPage]}&masp=${masp}`);
    }

    const handleDeleteProduct = (masp, item_ofOrderStatusArray) => {  
        
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

        request.post(`api/deleteProduct?masp=${masp}`)
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
        Navigate(`/admin/searchProductAdmin?keySearch=${keySearch}&typeSearch=${typeSearch}`)
    }

    const handleInputInfoTypeSearch = (e) => {
        setTypeSearch(e.target.value)
        console.log(typeSearch)
    }

    useEffect(() => {   
        orderStatus_Array.map(item => getInfoOrderForUsers(item, 1) ) 
        getQuantityOrderToDevidePage()  
        getInfoForUpdateProduct();
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

    const renderListColor = listColor.map((item) => {
        return (
            <div className="list_checbox_color_item">
                <input 
                    type="checkbox" id={item.MAMAU} className="checkbox_sizes" 
                    name="checkboxColor"
                    value={item.MAMAU}
                    checked={infoUpdateProduct.checkboxColor.includes(item.MAMAU)}
                    onChange={handleInputInfoUpdateProduct_checkbox}
                ></input>
                <label for={item.MAMAU}>
                    <div className="checkbox_color" style={{backgroundColor: `${item.HEX}`}}></div>
                </label>
            </div>
        )   
    })

    //hiển thị các ô nhập số lượng sau khi nhấn button thêm sản phẩm
    const renderInputSoLuong =  infoUpdateProduct.checkboxSize.map((itemSize, indexSize) => {
        return (
            <div> 
                <h6 className="input_quantity__size_name" key={indexSize}>Size {itemSize}</h6> 
                {
                    infoUpdateProduct.checkboxColor.map((itemColor, indexColor) => {
                        // console.log(itemColor, 'item')
                        return(
                            <div className="input_quantity__quantity" key={indexColor}>
                                <div className="input_quantity__product_color" style={{backgroundColor: `${listColor[itemColor - 1].HEX}`}}></div>
                                <div> 
                                    {
                                        infoUpdateProduct.quantity.map((item, indexQuantity) => {
                                            // console.log(item)
                                            if(item.HEX === `${listColor[itemColor - 1].HEX}` && item.MASIZE === itemSize){
                                                return(
                                                    <span className="input_quantity__quantity_haved" key={indexQuantity}>{item.SOLUONG}</span> 
                                                ) 
                                            } 
                                        })
                                    }
                                </div>
                                {/* <div class="input_gia_div">
                                        <label for="#" class="form-label">Giá niêm yết</label>
                                        <input type="text" class="form-control" placeholder="Nhập số lượng"/>
                                </div> */}
                                <div class="input_gia_div">
                                        {/* <label for="#" class="form-label">Giá niêm yết</label> */} 
                                    {renderInputQuantity(++i)}    
                                    
                                </div>
                            </div> 

                        )
                    })
                }
            </div>
        )
    })

    //hiển thị ảnh preview
    const renderPreViewImage = previewImages.map((image, index) =>{ 
        return ( 
            <div className="prview_image" key={image.id}>
                <img src={image.src} key={image.id} width={250} height={350}></img> 
                <input 
                    type="radio" name="indexThumnail" 
                    value={infoUpdateProduct.mahinhanh.length + index} 
                    checked={(infoUpdateProduct.mahinhanh.length + index) === (infoUpdateProduct.indexThumnail)}
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

    const renderPreViewImageFromImgUrl = infoUpdateProduct.imgurl.map((item, index) => {
        // console.log(item)
        return ( 
            <div key={index} className="prview_image">
                <img src={item} key={index} width={250} height={350}></img> 
                <input 
                    type="radio" name="indexThumnail" value={index} 
                    onChange={handleChooseThumnail}
                    checked={(infoUpdateProduct.indexThumnail) === index}
                ></input>
                <div className="delete_prview_image">
                    <button onClick={() => handleDeletePreviewImage('imageFromServe', index)}>
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                    </button>
                </div>
            </div>
        )
    })

    const renderCheckBoxSize = checkBoxSizeDefault.map((item, index) =>
        <div key={index}>
            <input type="checkbox" id={`${item}`} className="checkbox_sizes"  
                name="checkboxSize"
                value={`${item}`}
                checked={infoUpdateProduct.checkboxSize.includes(`${item}`)}
                onChange={handleInputInfoUpdateProduct_checkbox}
            ></input>
            <label for={`${item}`}>{item}</label> 
        </div> 
    )
 
    
    const renderUpdateProduct = () => { 
        return(
            <div  className={`${watchProductDetail ? '' : 'display_hidden'}`}>
                <div>
                    <button onClick={handleTurnBack}>turn back</button>
                    <div class="icon-update">
                        <span>
                            <FontAwesomeIcon class="fa-solid fa-pen-to-square" icon={faPenToSquare} ></FontAwesomeIcon>
                        </span>
                    </div>
                    <h2>Cập nhật sản phẩm</h2>
                    <div class="col-auto"></div>
                    <div class="body_box container col-lg-7">
                        
                        <div class="address_update" id="address_update">
                            <div class="row mb-2">
                                <div class="col-12">
                                    {/* <label for="#" class="form-label">Tên sản phẩm</label> */}
                                    <input 
                                        type="text" class="form-control" placeholder="Nhập tên sản phẩm" 
                                        onChange={handleInputInfoUpdateProduct} 
                                        name="nameProduct" 
                                        value={infoUpdateProduct.nameProduct}
                                    />
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-12 input_gia">
                                    <div class="input_gia_div">
                                        {/* <label for="#" class="form-label">Giá niêm yết</label> */}
                                        <input 
                                            type="text" class="form-control" placeholder="Giá niêm yết" 
                                            onChange={handleInputInfoUpdateProduct}
                                            name="originPrice"  
                                            value={infoUpdateProduct.originPrice}
                                        />
                                    </div>
                                    <div class="input_gia_div">
                                        {/* <label for="#" class="form-label">Giá bán</label> */}
                                        <input 
                                            type="text" class="form-control" placeholder="Giá bán" 
                                            onChange={handleInputInfoUpdateProduct}
                                            name="sellPrice"   
                                            value={infoUpdateProduct.sellPrice}
                                        />
                                    </div>
                                </div> 
                            </div>
                            <div class="row mb-3">
                                <div class="col-4">
                                    <label for="#" class="form-label">Phân loại</label>
                                    <select class="form-select" required
                                        onChange={handleInputInfoUpdateProduct}
                                        name="typeProduct"
                                        value={infoUpdateProduct.typeProduct}
                                    >
                                    <option selected value="1">Nam</option>
                                    <option value="2">Nữ</option>
                                    <option value="3">Trẻ em</option>
                                    </select>
                                </div> 
                            </div>

                            <div className="row">
                                <div className="col-5 choose_size">
                                    <div>
                                        <label>Chọn các loại size</label>
                                    </div>
                                    <div>
                                        {renderCheckBoxSize} 
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-5 choose_size">
                                    <div>
                                        <label>Chọn các loại màu</label>
                                    </div>
                                    <div className="list_checbox_color">
                                        {renderListColor} 
                                    </div>
                                </div>
                            </div>

                            <div>
                                <input type="file" multiple name="image" accept="image/*" onChange={handleClickUploadImage}></input>
                                <div>
                                    { renderPreViewImageFromImgUrl }
                                    { renderPreViewImage }
                                </div>
                            </div>

                            <textarea 
                                id="w3review" name="desctiption" rows="4" cols="80"
                                value={infoUpdateProduct.desctiption} 
                                onChange={handleInputInfoUpdateProduct}
                            >
                                At w3schools.com you will learn how to make a website.
                                They offer free tutorials in all web development technologies.
                            </textarea>

                            
                        </div> 
                        
                    </div>
                    <div class="col-auto"></div>
                </div>
                <div>
                    <h2>Nhập số lượng</h2>
 
                    <div class="col-auto"></div>
                    <div class="body_box container col-lg-7">
                        {renderInputSoLuong} 
                    </div>
                    <div class="address_update_button_contain row">
                        <div class={`${statusPressUpdateProduct ? '' : 'display_hidden'}`}>
                            <button class={`address_confirm_button btn btn-dark`} onClick={handleClickUpdateProduct}>Cập nhật sản phẩm</button>
                            <button class="address_cancel_button btn btn-outline-secondary">Hủy</button>
                        </div> 
                    </div>
                    <div class="col-auto"></div>

                </div>
            </div>
        ) 
    }
    
    //manageProduct
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
                // <div class="order_status_cover " key={index}> {
                {
                    if(product === null){ 
                        console.log(product, 'đây null ', index)
                        return null;
                    }
                    else{
                        return (
                            <tr key={index}  id={`product_${product.MAVOUCHER}`}>
                                <td data-label="Order-code">{product.MAVOUCHER}</td> 
                                <td data-label="Order-code">{product.PHANLOAI_VOUCHER}</td>
                                <td data-label="Name">{product.GIATRIGIAM}</td>
                                <td data-label="Phone-number">{product.THOIGIANBD}</td>
                                <td data-label="Address">{product.THOIGIANKT}</td>
                                <td data-label="Day">{product.SOLUONG}</td>
                                <td data-label="Day">{product.GIATRI_DH_MIN}</td>
                                <td data-label="Day">{product.GIATRI_GIAM_MAX}</td> 
                                <td data-label="update">
                                    <div class="icon-update">
                                        <FontAwesomeIcon icon={faEye} class="fa-solid fa-eye" ></FontAwesomeIcon>
                                        <span 
                                            onClick={()=>handleWatchProductDetail(item, product.MASP, product)} 
                                            className={`${item.value.nameState !== 'Đã qua sử dụng' ? '' : 'display_hidden'}`}
                                        >
                                            <FontAwesomeIcon class="fa-solid fa-pen-to-square" icon={faPenToSquare} ></FontAwesomeIcon>
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
            <button key={item_pagina} onClick={() => handleClickItemPagination(item_status, item_pagina)}>{item_pagina}</button>
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
                    ></input> 
                </div>
                <div class="col-2"> 
                    <select class="form-select" required
                        onChange={handleInputInfoTypeSearch}
                        name="typeSearch"
                        value={typeSearch} 
                    > 
                    <option selected value="MASP">Mã Sản phẩm</option>
                    <option value="TENSP">Tên Sản Phẩm</option>
                    {/* <option value="GIABAN">Giá bán</option>
                    <option value="GIAGOC">Giá gốc</option>  */}
                    </select>
                </div> 
                <button onClick={handleSearch}>Search</button>
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

export default ManageVoucher;