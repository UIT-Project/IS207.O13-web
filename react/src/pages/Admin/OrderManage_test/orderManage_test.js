import "./orderManage_test.css"
import 'bootstrap';
import request from "../../../utils/request";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faL, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf-viewer/core';
import { printPlugin } from '@react-pdf-viewer/print';

const handleClickImportOrder = () => {
    alert("Coi như cái này là hóa đơn nha!!!!!!!!!")
}

function OrderManage() {
    return (
        <div>
            <button class="btn btn-primary" onClick={handleClickImportOrder}>Xuất hóa đơn</button>
        </div>
    )
}

export default OrderManage;