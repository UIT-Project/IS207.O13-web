import "./searchProductAdmin.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';

import request from "../../../utils/request";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faEye, faL, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';


function SearchProductAdmin()
{
    const numberOrderEachPage = 20;
    const [xoadau, setXoaDau] = useState(0);
    const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0); 
    const [watchProductDetail, setWatchProductDetail] = useState(false);
    const [infoProductDetail, setInfoProductDetail] = useState({
        dataProductDetail_sanphams: [],
        dataProductDetail_sanpham_mausac_sizes__sizes: [],
        dataProductDetail_sanpham_mausac_sizes__colors: [], 
        dataProductDetail_sanpham_mausac_sizes__hinhanhs: [],
    })
    const searchParams  = new URLSearchParams(window.location.search);
    var keySearch = searchParams.get('keySearch');
    const typeSearch = searchParams.get('typeSearch');

    const Navigate = useNavigate();
    const [infoUpdateProduct, setInfoUpdateProduct] = useState({
        nameProduct: '',
        originPrice: '',
        sellPrice: '',
        typeProduct: '',
        desctiption: '',
        checkboxColor: [],
        checkboxSize: [],
        indexThumnail: 0,
        listHEX: [],
        listColor: [],
        images: [],
        imgurl: [], 
        previewImages: [],
        deleted: []
    });

    const handleInputInfoUpdateProduct = (e) => {
        e.persist();
        setInfoUpdateProduct({...infoUpdateProduct, [e.target.name]: e.target.value});
        console.log(e.target.name + " " + e.target.value);
    }

    const handleInputInfoUpdateProduct_checkbox = (e) => {
        e.persist();
        var name = e.target.name;
        var value = e.target.value;
        if(infoUpdateProduct[name].includes(value)){
            setInfoUpdateProduct({...infoUpdateProduct, [name]: infoUpdateProduct[name].filter(item => item !== value)});
            console.log(infoUpdateProduct); 
        }
        else{
            setInfoUpdateProduct({...infoUpdateProduct, [name]: [...infoUpdateProduct[name], value]})
        }  
    }

    const handleClickUploadImage = async (e) => {
        const fileImages = e.target.files;
        setInfoUpdateProduct({...infoUpdateProduct, images: [...infoUpdateProduct.images, ...fileImages]});

        const containFileImagesToRead = [...infoUpdateProduct.previewImages] 

        //khối lệnh xử lý mã hoá để hiển thị preview ảnh
        const readAsDataURL = (file) => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            });
        };

        for (const file of fileImages) {
            const imageURL = await readAsDataURL(file); 
            containFileImagesToRead.push(imageURL);
        }
 
        setInfoUpdateProduct(containFileImagesToRead); 
    }

    const handleChooseThumnail = (e) =>{
        setInfoUpdateProduct({...infoUpdateProduct, [e.target.name]: e.target.value}); 
        console.log(infoUpdateProduct.indexThumnail);
    }

    const [orderStatus, setOrderStatus] = useState({
        nam:{
            nameState: 'Nam',
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
        nu: {
            nameState: 'Nữ',
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
        treEm: {
            nameState: 'Trẻ em',
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
        // trahang: {
        //     nameState: 'Trả hàng',
        //     orderList: [],
        //     pageQuantity: 0,
        //     paginationList: [],
        //     openingPage: 1, 
        //     spaceGetDataFromOrderList: [{
        //         paginationNumber: 1,
        //         ordinalNumber: 1,
        //         startIndex: 0,
        //         endIndex: numberOrderEachPage,
        //     }]
        // }  
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
    const [orderStatusPointer, setOrderStatusPointer] = useState( orderStatus.nam.nameState );

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
        console.log(item_status, 'test', item_pagina);
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
        setWatchProductDetail(false);
    }

    const handleWatchProductDetail = (item, masp) => {
        getInforProductDetail(masp);
        setWatchProductDetail(true); 
        Navigate(`/admin/updateProduct?nameStatus=${[item.key]}&numberPagination=${[item.value.openingPage]}&masp=${masp}`);
    }

    const getInfoOrderForUsers =  (itemInOrderStatus_Array, openingPage) => {   
        var queryForGetInfoOrderForUsers = { 
            start: numberOrderEachPage * ( openingPage - 1),
            tenDanhMuc: itemInOrderStatus_Array.value.nameState,
            numberOrderEachPage: numberOrderEachPage,
            typeSearch: typeSearch,
            keySearch: keySearch,
        }   
        console.log(keySearch, ' test test', typeSearch)
        if(typeSearch === 'MASP'){
            keySearch = parseInt(keySearch);
        }

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
    const data = {
        keySearch: keySearch,
        typeSearch: typeSearch,
    }

    const getQuantityOrderToDevidePage = () => {
        request.get(`/api/getQuantityProductToDevidePage_SearchProductAdmin`, {params: data})
        .then(res=> {
            res.data.quantity.forEach(itemStatusFromDB => {
                orderStatus_Array.forEach(itemStatus => {
                    if(itemStatusFromDB.TENPL === itemStatus.value.nameState)
                    {
                        const pageQuantityShow = parseInt(itemStatusFromDB.SL_MASP / numberOrderEachPage) + ((itemStatusFromDB.SL_MASP % numberOrderEachPage) > 0 ? 1 : 0)

                        let arrAddToPaginationList = [];
                        for(let i = 1; i <= pageQuantityShow; i++)
                            arrAddToPaginationList.push(i);
                        // console.log(pageQuantityShow);
                        setOrderStatus(prevOrderStatus => ({
                            ...prevOrderStatus, 
                            [itemStatus.key] : {...prevOrderStatus[itemStatus.key],  pageQuantity: itemStatusFromDB.SL_MASP, paginationList: arrAddToPaginationList}
                        }))
                    }
                })
            });
            // console.log(orderStatus) 
         }) 
    } 
    const getInforProductDetail = (masp) => {
        request.get(`/api/infoProductDetail`, {params: {masp: masp}})
        .then(res => {  
            setInfoProductDetail({
                dataProductDetail_sanphams: res.data.dataProductDetail_sanphams,
                dataProductDetail_sanpham_mausac_sizes__sizes: res.data.dataProductDetail_sanpham_mausac_sizes__sizes,
                dataProductDetail_sanpham_mausac_sizes__colors: res.data.dataProductDetail_sanpham_mausac_sizes__colors, 
                dataProductDetail_sanpham_mausac_sizes__hinhanhs: res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs,
            })
            console.log(res, ' ', infoProductDetail, ' ', masp, '  ', res.data.dataProductDetail_sanphams[0].GIAGOC);
            setInfoUpdateProduct({
                ...infoUpdateProduct,
                nameProduct: 'ok'
            })

            res.data.dataProductDetail_sanphams.map(item => 
                setInfoUpdateProduct({
                    ...infoUpdateProduct,
                    nameProduct: item.TENSP,
                })
            )
            
            setInfoUpdateProduct(prevState  => ({
                ...prevState,
                checkboxColor: [
                    ...prevState.checkboxColor.filter(item => item), 
                    ...res.data.dataProductDetail_sanpham_mausac_sizes__colors.filter(item => item)
                ]
            }))
            setInfoUpdateProduct({
                ...infoUpdateProduct,
                checkboxSize: [
                    ...infoUpdateProduct.checkboxSize.filter(item => item), 
                    ...res.data.dataProductDetail_sanpham_mausac_sizes__sizes.filter(item => item)
                ]
            }) 
            console.log(infoUpdateProduct, "get2")

            res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs.map(item => 
                setInfoUpdateProduct({
                    ...infoUpdateProduct,
                    imgurl: [...infoUpdateProduct.imgurl, item.imgURL]
                })
            )
            
            
        })
    };
 

    useEffect(() => {   
        orderStatus_Array.map(item => getInfoOrderForUsers(item, 1))
 
        getQuantityOrderToDevidePage()
        // console.log(document.getElementById(`product_${maspParam}`));
        // maspParam ?  document.getElementById(`product_${maspParam}`).scrollIntoView({ behavior: 'smooth' })
        // :  handleScrollToTop();
        console.log(orderStatus, " ok") 
    }, []) 
    // useEffect(() => {
    //     // Đây là một ví dụ cơ bản, bạn cần điều chỉnh logic ở đây để phù hợp với việc lấy dữ liệu từ API
    //     if (infoUpdateProduct.nameProduct !== '') {
    //       // Nếu dữ liệu đã có, bạn có thể thực hiện các xử lý tiếp theo ở đây
    //       getInforProductDetail(1)   

    //       console.log('Dữ liệu đã được cập nhật:', infoUpdateProduct);
    //     }
    //   }, [infoUpdateProduct]);

    const renderListColor = infoUpdateProduct.listColor.map((item) => {
        return (
            <div className="list_checbox_color_item">
                <input 
                    type="checkbox" id={item.MAMAU} className="checkbox_sizes" 
                    name="checkboxColor"
                    value={item.MAMAU}
                    checked={infoUpdateProduct.checkboxColor.includes(`${item.MAMAU}`)}
                    onChange={handleInputInfoUpdateProduct_checkbox}
                ></input>
                <label for={item.MAMAU}>
                    <div className="checkbox_color" style={{backgroundColor: `${item.HEX}`}}></div>
                </label>
            </div>
        )   
    })

    //hiển thị các ô nhập số lượng sau khi nhấn button thêm sản phẩm
    const renderInputSoLuong =  infoUpdateProduct.checkboxSize.map((itemSize, index) => {
        return (
            <div key={index}>
                <h6 className="input_quantity__size_name">Size {itemSize}</h6> 
                {
                    infoUpdateProduct.listHEX.map(itemColor => {
                        console.log(itemColor)
                        return(
                            <div className="input_quantity__quantity">
                                <div className="input_quantity__product_color" style={{backgroundColor: `${itemColor.HEX}`}}></div>
                                <div>
                                    <span className="input_quantity__quantity_haved">0</span>
                                </div>
                                <div class="input_gia_div">
                                        {/* <label for="#" class="form-label">Giá niêm yết</label> */}
                                        <input type="text" class="form-control" placeholder="Nhập số lượng"/>
                                </div>
                            </div> 

                        )
                    })
                }
            </div>
        )
    })

    //hiển thị ảnh preview
    const renderPreViewImage = infoUpdateProduct.previewImages.map((image, index) =>{ 
        return ( 
            <div key={index}>
                <img src={image} key={index} width={250} height={350}></img> 
                <input type="radio" name="indexThumnail" value={index} onChange={handleChooseThumnail}></input>
            </div>
        )
    })
 
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
                        <tr key={index}  id={`product_${product.MASP}`}>
                            <td data-label="Order-code">{product.MASP}</td>
                            <td data-label="Name">{product.TENSP}</td>
                            <td data-label="Phone-number">{product.GIABAN}</td>
                            <td data-label="Address">{product.GIAGOC}</td>
                            <td data-label="Day">{product.SOLUONGCONLAI}</td>
                            <td><button type="button" id="btn-status-deliveried">Đã giao</button>
                            </td>
                            <td><button type="button" id="btn-payment-after">Trả sau</button>
                            </td>
                            <td data-label="Subtotal">540.000</td>
                            <td data-label="update">
                                <div class="icon-update">
                                    <FontAwesomeIcon icon={faEye} class="fa-solid fa-eye" ></FontAwesomeIcon>
                                    <FontAwesomeIcon class="fa-solid fa-print" icon={faPrint}></FontAwesomeIcon>
                                    <span onClick={()=>handleWatchProductDetail(item, product.MASP)}>
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

    const renderProductDetail = () => {
        // console.log("ok");
        // getInforOrderDetail()   
        // console.log(infoProductDetail, 'render') 
        if(watchProductDetail === true)
        {
            // className={`${watchProductDetail ? "" : "display_hidden"}`}
            return(  
                <div >
                    <h3>product detail</h3>
                    <button onClick={handleTurnBack}>turn back</button>
                    <div class="icon-update">
                        <span>
                            <FontAwesomeIcon class="fa-solid fa-pen-to-square" icon={faPenToSquare} ></FontAwesomeIcon>
                        </span>
                    </div>
                    <div>
                        <h6>{infoProductDetail.dataProductDetail_sanphams.TENSP}</h6>  
                        <h6>{infoProductDetail.dataProductDetail_sanphams.MAPL_SP}</h6>  

                    </div>
                    <div>
                        <h2>Thêm sản phẩm</h2>
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
                                            <input type="checkbox" id="S" className="checkbox_sizes"  
                                                name="checkboxSize"
                                                value="S"
                                                checked={infoUpdateProduct.checkboxSize.includes("S")}
                                                onChange={handleInputInfoUpdateProduct_checkbox}
                                            ></input>
                                            <label for="S">S</label>

                                            <input 
                                                type="checkbox" id="M" className="checkbox_sizes" 
                                                name="checkboxSize"
                                                value="M"
                                                checked={infoUpdateProduct.checkboxSize.includes("M")}
                                                onChange={handleInputInfoUpdateProduct_checkbox}
                                            ></input>
                                            <label for="M">M</label>

                                            <input 
                                                type="checkbox" id="L" className="checkbox_sizes" 
                                                name="checkboxSize"
                                                value="L"
                                                checked={infoUpdateProduct.checkboxSize.includes("L")}
                                                onChange={handleInputInfoUpdateProduct_checkbox}
                                            ></input>
                                            <label for="L">L</label>
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

                                <div class="address_update_button_contain row">
                                    {/* <div class={`${statusPressAddProduct ? '' : 'display_hidden'}`}>
                                        <button class={`address_confirm_button btn btn-dark`} onClick={handleClickAddProduct}>Thêm sản phẩm</button>
                                        <button class="address_cancel_button btn btn-outline-secondary">Hủy</button>
                                    </div>  */}
                                </div>
                            </div> 
                            
                        </div>
                        <div class="col-auto"></div>
                    </div>
                    {
                        infoProductDetail.dataProductDetail_sanphams.map((item, index) => 
                            <div>
                                <h6 key={index}>{item.TENSP}</h6>  
                            </div>
                        )
                    }
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
                        renderProductDetail()
                    }
                    <div class={`content_list_order  ${watchProductDetail ? "display_hidden" : ""}`}>
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col" >Mã sản phẩm</th>
                                <th scope="col">Tên sản phẩm</th>
                                <th scope="col">Giá bán</th>
                                <th scope="col">Giá gốc</th>
                                <th scope="col" >Số lượng còn lại</th>
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
                <h1>Sản phẩm</h1>
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

export default SearchProductAdmin;