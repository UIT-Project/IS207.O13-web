import "./myorder.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';

import request from "../../../utils/request";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import { faCircleChevronLeft, faEye, faL, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";

function MyOrder() {
    useEffect(() => {
        document.title = "DosiIn | Đơn hàng"
    }, []);
    const { formatPrice } = useGlobalVariableContext();
    const numberOrderEachPage = 20;
    const [xoadau, setXoaDau] = useState(0);
    const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0);
    const [watchOrderDetail, setWatchOrderDetail] = useState(false);
    const [infoOrderDetail, setInfoOrderDetail] = useState({
        data_relative_Donhang: [],
        data_sanPham_relative_CTDH: [],
    })
    const [note, setNote] = useState('');
    const [keySearch, setKeySearch] = useState('');
    const [listMASPTranferState, setListMASPTranferState] = useState([]);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const Navigate = useNavigate();
    const [typeSearch, setTypeSearch] = useState('MADH');
    const searchParams = new URLSearchParams(window.location.search);
    const numberPagination = searchParams.get('numberPagination');

    const [orderStatus, setOrderStatus] = useState({
        danggiao: {
            nameState: 'Chuẩn bị hàng',
            orderList: [],
            pageQuantity: 0,
            paginationList: [],
            openingPage: 1,
            hasLoadFirtTime: 0,
            hasChangeFromPreState: 0,
            spaceGetDataFromOrderList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberOrderEachPage,
            }]
        },
        dagiao: {
            nameState: 'Đang giao',
            orderList: [],
            pageQuantity: 0,
            paginationList: [],
            openingPage: 1,
            hasLoadFirtTime: 0,
            hasChangeFromPreState: 0,
            spaceGetDataFromOrderList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberOrderEachPage,
            }]
        },
        dahuy: {
            nameState: 'Đã Giao',
            orderList: [],
            pageQuantity: 0,
            paginationList: [],
            openingPage: 1,
            hasLoadFirtTime: 0,
            hasChangeFromPreState: 0,
            spaceGetDataFromOrderList: [{
                paginationNumber: 1,
                ordinalNumber: 1,
                startIndex: 0,
                endIndex: numberOrderEachPage,
            }]
        },
        trahang: {
            nameState: 'Đã huỷ',
            orderList: [],
            pageQuantity: 0,
            paginationList: [],
            openingPage: 1,
            hasLoadFirtTime: 0,
            hasChangeFromPreState: 0,
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
        orderStatus.danggiao.nameState
    );

    const handleClickNavState = (item_status, item_pagina) => {
        // console.log(e.target.value) 
        setWatchOrderDetail(false)
        setOrderStatusPointer(item_status.value.nameState)
        if (item_status.value.hasLoadFirtTime === 0 || item_status.value.hasChangeFromPreState === 1) {
            const updateOpeningPage = prevOrderStatus => (
                {
                    ...prevOrderStatus,
                    [item_status.key]: {
                        ...prevOrderStatus[item_status.key],
                        openingPage: item_pagina,
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
                [item_status.key]: { ...prevOrderStatus[item_status.key], openingPage: item_pagina }
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
        // Navigate(`/reviewProduct?madh=${madh}`)
    }
    const handleReviewProduct = (madh) => {
        // getInforOrderDetail(madh);
        // setWatchOrderDetail(true); 
        Navigate(`/reviewProduct?madh=${madh}`)
    }

    const handleInputNote = (e) => {
        setNote(e.target.value)
        console.log(note)
    }

    const getInfoOrderForUsers = (itemInOrderStatus_Array, openingPage) => {
        const queryForGetInfoOrderForUsers = {
            start: numberOrderEachPage * (openingPage - 1),
            tenTrangThai: itemInOrderStatus_Array.value.nameState,
            numberOrderEachPage: numberOrderEachPage,
            matk: localStorage.getItem('auth_matk')
        }
        console.log(queryForGetInfoOrderForUsers, 'aksjd');

        try {
            request.get(`/api/getInfoMyOrder`, { params: queryForGetInfoOrderForUsers })
                // request.get('api/getInfoManageOrder', queryForGetInfoOrderForUsers)
                .then(res => {
                    console.log(res.data, 'okk');

                    setOrderStatus(prevOrderStatus => {
                        const itemIndex = prevOrderStatus[itemInOrderStatus_Array.key].spaceGetDataFromOrderList.findIndex(
                            item => item.paginationNumber === openingPage
                        );
                        if (itemIndex === -1 || (openingPage === 1 && paginationNumberRunFirst === 0)) {
                            setPaginationNumberRunFirst(1);
                            // console.log(res.data.orderList_DB.length)
                            return {
                                ...prevOrderStatus,
                                [itemInOrderStatus_Array.key]:
                                {
                                    ...prevOrderStatus[itemInOrderStatus_Array.key],
                                    orderList: [
                                        ...prevOrderStatus[itemInOrderStatus_Array.key].orderList.filter(item => item),
                                        ...res.data.orderList_DB.filter(item => item)
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
                        else {
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
        catch (err) {
            console.log(err)
        }

    }

    const getQuantityOrderToDevidePage = () => {
        const data = {
            matk: localStorage.getItem('auth_matk')
        }
        request.get('/api/getQuantityOrderToDevidePage__myOder', { params: data })
            .then(res => {
                res.data.quantity.forEach(itemStatusFromDB => {
                    orderStatus_Array.forEach(itemStatus => {
                        if (itemStatusFromDB.TRANGTHAI_DONHANG === itemStatus.value.nameState) {
                            const pageQuantityShow = Math.ceil(itemStatusFromDB.SL_MADH / numberOrderEachPage)

                            let arrAddToPaginationList = [];
                            for (let i = 1; i <= pageQuantityShow; i++)
                                arrAddToPaginationList.push(i);
                            // console.log(pageQuantityShow);
                            setOrderStatus(prevOrderStatus => ({
                                ...prevOrderStatus,
                                [itemStatus.key]:
                                {
                                    ...prevOrderStatus[itemStatus.key],
                                    pageQuantity: itemStatusFromDB.SL_MADH,
                                    paginationList: arrAddToPaginationList
                                }
                            }))
                        }
                    })
                });
                // console.log(orderStatus) 
            })
    }

    const getInforOrderDetail = (madh) => {
        const data = {
            madh: madh
        }
        request.get(`/api/infoOrderDetail`, { params: data })
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
                setNote(res.data.data_relative_Donhang[0].GHICHU);
                console.log(res, ' ', infoOrderDetail, ' ', madh);
                setWatchOrderDetail(true);

            })
    };

    const saveNote = (madh, note) => {
        console.log(madh, "okokokok", note)
        const data = {
            note: note,
            madh: madh
        }
        try {
            // requestPost.post(`api/saveNote?note=${note}&madh=${madh}`, {note, madh})
            request.post('api/saveNote', data)
                .then(res => {
                    console.log(res)
                })
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleSearchInput = (e) => {
        setKeySearch(e.target.value)
    }

    const handleSearch = () => {
        Navigate(`/admin/searchOrder?keySearch=${keySearch}&typeSearch=${typeSearch}`)
    }

    const handleInputInfoTypeSearch = (e) => {
        setTypeSearch(e.target.value)
        console.log(typeSearch)
    }

    const handleClickCheckbox = (product, item) => {


        if (listMASPTranferState.includes(product.MADH)) {
            setListMASPTranferState(listMASPTranferState.filter(item => item !== product.MADH))
            setIsCheckedAll(false)
        }
        else {
            setListMASPTranferState([...listMASPTranferState, product.MADH]);
            console.log(listMASPTranferState.length, 'length');
            if (listMASPTranferState.length + 1 === numberOrderEachPage)
                setIsCheckedAll(!isCheckedAll);
        }
    }

    const handleUpdateState = (orderStatus_Array, index) => {
        console.log(listMASPTranferState);
        const itemWillUpdate = orderStatus_Array[index + 1];
        const itemCurent = orderStatus_Array[index];
        const data = {
            nameStatusWillUpdate: itemWillUpdate.value.nameState,
            listMASPTranferState: listMASPTranferState
        }

        setOrderStatus({
            ...orderStatus,
            [itemWillUpdate.key]: {
                ...orderStatus[itemWillUpdate.key],
                hasChangeFromPreState: 1,
            },
            [itemCurent.key]: {
                ...orderStatus[itemCurent.key],
                orderList: orderStatus[itemCurent.key].orderList.map(item => {
                    if (item !== null) {
                        if (listMASPTranferState.includes(item.MADH))
                            return null;
                        else {
                            return item;
                        }
                    }
                    else {
                        return item;
                    }
                })
            }
        })
        try {
            request.post(
                `api/updateOrderStatus`, data
            )
                .then(res => {

                    let indexNull = {
                        start: 0,
                        end: 0,
                    }
                    itemCurent.value.spaceGetDataFromOrderList.forEach(item => {
                        if (itemCurent.value.openingPage === item.paginationNumber) {
                            indexNull.start = item.startIndex;
                            indexNull.end = item.endIndex;
                        }
                    })
                    // index.end = item_ofOrderStatusArray.value.openingPage * numberOrderEachPage - 1;
                    console.log(indexNull.start, ' ', indexNull.end, 'orderlist: ', itemCurent.value.orderList)
                    // nếu toàn bộ item_ofOrderStatusArray từ start đến end thì reload trang
                    let i = 0;
                    itemCurent.value.orderList.slice(indexNull.start, indexNull.end).forEach(item => {
                        if (item === null) {
                            i++;
                        }
                    })
                    console.log(i + listMASPTranferState.length, ' ', indexNull.end)

                    if (i + listMASPTranferState.length === indexNull.end)
                        window.location.reload();
                })
        }
        catch (err) {
            console.log(err)
        }
        setListMASPTranferState([]);
    }

    const handleClickCheckboxAll = (item) => {
        if (!isCheckedAll) {
            // setListMASPTranferState([
            //     ...listMASPTranferState,
            //     item.value.orderList.filter(item => {
            //         if(item.MADH !== listMASPTranferState.includes(item.MADH))
            //             return item.MADH
            //     })
            // ]);

            const allItems = item.value.orderList.map(orderItem => {
                if (orderItem !== null)
                    return orderItem.MADH;
            });
            // Thêm tất cả các phần tử đã được chọn vào listMASPTranferState
            console.log(allItems, 'jasdhjh')
            setListMASPTranferState(allItems);

        }
        else if (isCheckedAll) {
            listMASPTranferState.splice(0, listMASPTranferState.length);
        }
        setIsCheckedAll(!isCheckedAll);
    }

    useEffect(() => {
        orderStatus_Array.map(item => getInfoOrderForUsers(item, 1))
        getQuantityOrderToDevidePage()
        // getInforOrderDetail(1);
    }, [])
    useEffect(() => {
        console.log(orderStatus);
    }, [orderStatus.dagiao.orderList])


    const renderNavState = orderStatus_Array.map((item, index) =>
        <li class={`nav-item col-auto p-2`} key={index}>
            <button
                class={`nav-link ${orderStatusPointer === item.value.nameState ? 'active' : ''}`}
                aria-current="page"
                onClick={() => handleClickNavState(item, 1)}
            >
                {item.value.nameState === 'Đã Giao' ? 'Đã nhận' : item.value.nameState}
            </button>
        </li>
    )


    const renderEachProduct = (item, indexOrder) => {
        let index = {
            start: 0,
            end: 0,
        }
        item.value.spaceGetDataFromOrderList.filter(item_pagination => {
            if (item_pagination.paginationNumber === item.value.openingPage) {
                index.start = item_pagination.startIndex;
                index.end = item_pagination.endIndex;
            }
        })
        // console.log(index)
        return (
            item.value.orderList.slice(index.start, index.end).map((product, index) =>
            // <div class="order_status_cover " key={index}> 
            {
                if (product === null) {
                    console.log(product, 'đây null ', index)
                    return null;
                }
                else {
                    return (
                        <tr key={index}>
                            {/* <td>
                                    <input 
                                        type="checkbox" 
                                        name="checkboxProductInCart" id=""   
                                        checked = {listMASPTranferState.includes(product.MADH)}   
                                        onChange={() => handleClickCheckbox(product, index)}
                                    />
                                </td> */}
                            <td data-label="Order-code">{product.MADH}</td>
                            <td data-label="Name">{product.TEN}</td>
                            <td data-label="Phone-number">{product.SDT}</td>
                            <td data-label="Address">{product.DIACHI}, {product.PHUONG_XA}, {product.QUAN_HUYEN}, {product.TINH_TP}</td>
                            <td data-label="Day">{product.NGAYORDER}</td>
                            <td> {product.HINHTHUC_THANHTOAN}  </td>
                            <td> {product.TRANGTHAI_THANHTOAN}  </td>
                            <td data-label="Subtotal">{formatPrice(product.TONGTIENDONHANG)}</td>
                            <td data-label="update">
                                <div class="icon-update">
                                    <span onClick={() => handleWatchOrderDetail(product.MADH)} >
                                        <FontAwesomeIcon icon={faEye} class="fa-solid fa-eye" ></FontAwesomeIcon>
                                    </span>
                                    <span onClick={() => handleReviewProduct(product.MADH)} className={`${orderStatusPointer === orderStatus.dahuy.nameState ? '' : 'display_hidden'}`}>
                                        <FontAwesomeIcon class={`fa-solid fa-pen-to-square `} icon={faPenToSquare} ></FontAwesomeIcon>
                                    </span>
                                </div>
                            </td>
                        </tr>
                        //     <div key={index} class="row justify-content-center">
                        //     <div class="order_status_cover col-8">
                        //         <div class="row p-2">
                        //             <img src="" class="col-2 p-2 float-start" alt="" />
                        //             <div class="info1 col-5 p-2">
                        //                 <span>
                        //                     Sản phẩm 1 <br />
                        //                     Màu: Đỏ <br />
                        //                     Size: M
                        //                 </span>
                        //             </div>
                        //             <div class="info2 col-5 p-3 text-end d-flex">
                        //                 <div class="col p-0">
                        //                     <span>
                        //                         x 2 <br />
                        //                         <del>170000đ</del> 150000đ
                        //                     </span>
                        //                 </div>

                        //             </div>
                        //         </div>
                        //         <div class="sub_info_1 row p-2 text-sm-center">
                        //             <a class="text-decoration-none bland" href="#">Xem thêm sản phẩm</a>
                        //         </div>
                        //         <div class="sub_info_2 row p-2 justify-content-between">
                        //             <div class="col-auto text-start bland">
                        //                 <span>Mã đơn hàng: {product.MADH}</span>
                        //             </div>
                        //             <div class="col-auto text-end">
                        //                 <span>Thành tiền: </span>
                        //                 <span class="color_red">{product.TONGTIEN}đ</span>
                        //             </div>
                        //         </div>
                        //         <div class="sub_info_2 row p-2 justify-content-between">
                        //             <div class="col-auto text-start">
                        //                 <i class="fa-solid fa-truck-fast"></i>
                        //                 <span>Đơn hàng đang được chuẩn bị</span>
                        //             </div>
                        //             <div class="col-auto text-end">
                        //                 <a asp-action="Delete" asp-route-id="@order.MADH" ><button class="btn btn-danger">Hủy đơn hàng</button></a>
                        //                 <a class="text-decoration-none bland" asp-action="OrderDetail" asp-route-id="@order.MADH">Chi tiết</a>
                        //             </div>
                        //         </div>
                        //     </div>
                        // </div>
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

    // const renderInfoProduct = infoOrderDetail.data_sanPham_relative_CTDH.map((item, index) => 
    //         <div className="div_thongtinsanpham" key={index}>
    //             <span>Tên sản phẩm: {item.TENSP}</span>  
    //             <span>Tên màu: {item.TENMAU}</span> 
    //             <span>Size: {item.MASIZE}</span> 
    //             <span>Giá bán: {item.GIABAN}</span> 
    //             <span>Số lượng: {item.SOLUONG}</span>  
    //             {/* <img src={item.imgURL} height={300} width={300}></img> */}
    //         </div>
    //     ) 

    // const renderOrderDetail = () => {
    //     // console.log("ok");
    //     // getInforOrderDetail()   
    //     console.log(infoOrderDetail, 'render')
    //     if(watchOrderDetail === true) {
    //         return(  
    //             <div>
    //                 <h3>orderDetail</h3>
    //                 <button onClick={handleTurnBack}>turn back</button>
    //                 <div class="icon-update">
    //                     <span>
    //                         <FontAwesomeIcon class="fa-solid fa-pen-to-square" icon={faPenToSquare} ></FontAwesomeIcon>
    //                     </span>
    //                 </div>
    //                 <div className="div_thongTinGiaoHang">
    //                     <span className="thongTinGiaoHang">Thông tin giao hàng</span>  
    //                     <span>Tên: {infoOrderDetail.data_relative_Donhang.TEN}</span>  
    //                     <span>SDT: {infoOrderDetail.data_relative_Donhang.SDT}</span> 
    //                     <span>DIACHI: {infoOrderDetail.data_relative_Donhang.DIACHI}</span> 
    //                     <span>TINH_TP: {infoOrderDetail.data_relative_Donhang.TINH_TP}</span> 
    //                     <span>QUAN_HUYEN: {infoOrderDetail.data_relative_Donhang.QUAN_HUYEN}</span> 
    //                     <span>PHUONG_XA: {infoOrderDetail.data_relative_Donhang.PHUONG_XA}</span> 
    //                     <span>Tên: {infoOrderDetail.data_relative_Donhang.TEN}</span> 
    //                     <span>Tên: {infoOrderDetail.data_relative_Donhang.TEN}</span> 
    //                 </div>
    //                 <div className="div_thongTinGiaoHang">
    //                     <span className="thongTinGiaoHang">Thông tin Đơn hàng</span>  
    //                     <span>Tổng tiền phải trả: {infoOrderDetail.data_relative_Donhang.TONGTIEN}</span>  
    //                     <span>Tổng tiền sản phẩm: {infoOrderDetail.data_relative_Donhang.TONGTIEN_SP}</span> 
    //                     <span>Mã voucher giảm: {infoOrderDetail.data_relative_Donhang.VOUCHERGIAM}</span> 
    //                     <span>Tổng tiền đơn hàng: {infoOrderDetail.data_relative_Donhang.TONGTIENDONHANG}</span> 
    //                     <span>Hình thức thanh toán: {infoOrderDetail.data_relative_Donhang.HINHTHUC_THANHTOAN}</span> 
    //                     <span>Trạng thái thanh toán: {infoOrderDetail.data_relative_Donhang.TRANGTHAI_THANHTOAN}</span> 
    //                     <span>Ghi chú:</span> 
    //                     <textarea 
    //                         name="note"
    //                         value={note}
    //                         onChange={handleInputNote}
    //                     >
    //                     </textarea> 
    //                     <button onClick={() => saveNote(infoOrderDetail.data_relative_Donhang.MADH, note)}>save</button>
    //                 </div>
    //                 <div className="div_thongTinGiaoHang">
    //                     <span className="thongTinGiaoHang">Thông tin các sản phẩm</span>  
    //                     {renderInfoProduct}

    //                 </div> 
    //             </div>  
    //         )
    //     }
    // }
    const renderInfoProduct = infoOrderDetail.data_sanPham_relative_CTDH.map((item, index) =>

        <tr className="" key={index}>
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
        if (watchOrderDetail === true) {
            return (
                <div>
                    <div class="icon-update icon-update__margin">
                        <span onClick={handleTurnBack} className="faCircleChevronLeft">
                            <FontAwesomeIcon class={`fa-solid faCircleChevronLeft`} icon={faCircleChevronLeft} ></FontAwesomeIcon>
                        </span>
                    </div>
                    <h1>Chi tiết đơn hàng</h1>
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
                    <div className="div_thongTinGiaoHang">
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
                                    <th scope="col">Giá trị Voucher giảm</th>
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
                                    <td data-label="Phone-number">  {infoOrderDetail.data_relative_Donhang.VOUCHERGIAM === 0 ? 0 : formatPrice(infoOrderDetail.data_relative_Donhang.VOUCHERGIAM)}    </td>
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
                                {renderInfoProduct}
                            </tbody>
                        </table>
                    </div>

                </div>
            )
        }
    }

    const renderShowProductEveryState = orderStatus_Array.map((item, index) => {
        // console.log(item)
        if (orderStatusPointer === item.value.nameState) {
            return (
                <div
                    class={`row justify-content-center ${orderStatusPointer === item.value.nameState ? "" : 'hiddenEachState'}`}
                    key={index}
                >
                    {
                        renderOrderDetail()
                    }
                    <div class={`content_list_order  ${watchOrderDetail ? "display_hidden" : ""}`}>
                        {/* <div className={`${orderStatus_Array.length !== index + 1 ? '' : 'display_hidden'}`}>
                            Cập nhật trạng thái sang 
                            <span className="StateWillTranfer">
                                {orderStatus_Array.length !== index + 1 ? orderStatus_Array[index + 1].value.nameState : ''}
                            </span>
                            <button className="buttonUpdate" onClick={() => handleUpdateState(orderStatus_Array, index)}>Update</button>
                        </div> */}
                        <table class="table">
                            <thead>
                                <tr>
                                    {/* <th scope="col">                        
                                    <input 
                                        type="checkbox" 
                                        name="checkboxProductInCart" id=""  
                                        checked = {isCheckedAll} 
                                        onChange={() => handleClickCheckboxAll(item)}
                                    />
                                </th> */}
                                    <th scope="col" >Mã đơn hàng</th>
                                    <th scope="col">Tên khách hàng</th>
                                    <th scope="col">SĐT</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col" >Ngày đặt hàng</th>
                                    <th scope="col">Hình thức thanh toán</th>
                                    <th scope="col">Trạng thái thanh toán</th>
                                    <th scope="col">Tổng tiền đơn hàng</th>
                                    <th scope="col"></th>

                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                {renderEachProduct(item, index)}
                            </tbody>
                        </table>
                    </div>
                    <div className={`${watchOrderDetail ? 'display_hidden' : ''} pagination-container_myorder`}>
                        {renderPagination(item)}
                        {/* <SelectLimit onLimitChange={setLimit}/> */}
                        {/* <Pagination totalPage={item.value.paginationList.length} page={item.value.openingPage} limit={numberOrderEachPage} siblings={1} onPageChange={handlePageChange} item_status={item}/> */}
                    </div>
                </div>
            )
        }
    }
    )

    return (
        <div class="order_info_body container">
            <div class="heading text-uppercase text-center">
                <h1>Đơn hàng</h1>
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

export default MyOrder