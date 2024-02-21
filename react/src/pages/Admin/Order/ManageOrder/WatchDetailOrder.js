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

import useAuthCheck from "../../AuthCheckLogin/AuthCheckLogin";


function WatchDetailOrder({note, setNote, infoOrderDetail}){
    const {formatPrice, contentPopup, setContentPopup, openPopup} = useGlobalVariableContext();
    const handleInputNote = (e) => {
        setNote(e.target.value)
        console.log(note)
    }

    const handleSaveEditNote = (madh) => {
        saveNote(madh, note) 
    }
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

    return(  
        <div> 
            <Popup
                contentPopup = {contentPopup}
                confirm = {'no use'}
            />
            <h1>Chi tiết đơn hàng</h1> 
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
export default WatchDetailOrder;
