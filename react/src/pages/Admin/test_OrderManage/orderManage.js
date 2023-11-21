import "./orderManage.css"
import 'bootstrap';
import request from "../../../utils/request";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faL, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';

import { useReactToPrint } from "react-to-print";


function OrderManage() {

    const componentPDF = useRef();

    const handleClickImportOrder = useReactToPrint({
        content:() => componentPDF.current,
        documentTitle:"Order",
        onAfterPrint:() => alert("Đã xuất hóa đơn")
    });

    return (
        <div>
            <div ref={componentPDF}>
                <p>Chi tiết hóa đơn</p>
                <p>Danh sách sản phẩm</p>
                <p>Tổng tiền: 25000</p>
            </div>
            <button class="btn btn-primary" onClick={handleClickImportOrder}>Xuất hóa đơn</button>
        </div>
    );
}

export default OrderManage;