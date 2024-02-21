import "../ManageVoucher/ManageVoucher.css"
import 'bootstrap';
import request from "../../../../utils/request";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faCircleChevronLeft, faFloppyDisk, faL, faPenToSquare, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import CurrencyInput from 'react-currency-input-field';

import useAuthCheck from "../../AuthCheckLogin/AuthCheckLogin";
import InputInfoVoucher from "../InputInfoVoucherForAddAndUpdate/InputInfoVoucherForAddAndUpdate";
import Popup from "../../ComponentUseInManyPage/Popup/Popup";

function UpdateVoucher({orderStatusPointer, orderStatus}){
    const {formatPrice, contentPopup, setContentPopup, openPopup} = useGlobalVariableContext(); 
    const [isUpdating, setIsUpdating] = useState(false);
    const [watchVoucherDetail, setWatchVoucherDetail] = useState(false);
    const Navigate = useNavigate();
    const [isEmpty, setIsEmpty] = useState(false);

    const handleTurnBack = () => {
        setWatchVoucherDetail(false);
        setIsUpdating(false) 
        window.history.back();
    }
    const handleClickUpdate= () => {
        setIsUpdating(true)
    }
 

    const handleClickUpdateVoucher = (infoUpdateVoucher) => {
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
            formData.append('infoUpdateVoucher', JSON.stringify(infoUpdateVoucher));  
            request.post(`api/updateVoucher`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }) 
            .then(res => {  
                console.log('ok');
                setContentPopup({
                    title: 'Cập nhật voucher thành công',
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

    return(
        <div> 
            <Popup
                contentPopup = {contentPopup}
                confirm = {'no use'}
            />
            <div class="icon-update icon-update__margin">
                <span onClick={handleTurnBack}  className="faCircleChevronLeft">
                    <FontAwesomeIcon class={`fa-solid faCircleChevronLeft ${orderStatusPointer === orderStatus.chuaApDung.nameState ? '' : ''}`} icon={faCircleChevronLeft} ></FontAwesomeIcon>
                </span>
                <span onClick={handleClickUpdate}>
                    <FontAwesomeIcon class={`fa-solid fa-pen-to-square ${orderStatusPointer === orderStatus.chuaApDung.nameState ? '' : 'display_hidden'}`} icon={faPenToSquare} ></FontAwesomeIcon>
                </span>
            </div>
            <h2>Cập nhật Voucher</h2>
            <InputInfoVoucher 
                nameFunction={'update'}
                functionSaveInfo = {handleClickUpdateVoucher}
                isEmpty = {isEmpty}
                isUpdating= {isUpdating}
                setIsUpdating= {setIsUpdating}
            />
        </div> 
    )
}

export default UpdateVoucher;