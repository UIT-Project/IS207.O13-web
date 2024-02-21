import "./AddVoucher.css"
import 'bootstrap';
import request from "../../../../utils/request";
 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faL, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useAuthCheck from "../../AuthCheckLogin/AuthCheckLogin";
import CurrencyInput from 'react-currency-input-field';
import InputInfoVoucher from "../InputInfoVoucherForAddAndUpdate/InputInfoVoucherForAddAndUpdate";
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import Popup from "../../ComponentUseInManyPage/Popup/Popup";


function AddVoucher(){
    //NHỮNG THỨ CẦN XỬ LÝ TRONG TRANG addVoucher - thêm sản phẩm của admin
    // 1.hiển thị giao diện các ô input nhập thông tin sản phẩm, input chọn size, chọn màu, nhập số lượng sp, chọn ảnh
    // 2.Xử lý hiển thị ảnh preview, xoá, chọn thêm ảnh
    // 3.xử lý lưu thông tin sản phẩm và hình ảnh xuống db

    useAuthCheck()
    useEffect(() => {
        document.title = "Admin | Thêm voucher"
     }, []);
     
    const {formatPrice, contentPopup, setContentPopup, openPopup} = useGlobalVariableContext(); 

    //mã hex để hiện thị màu sắc lấy thực thuộc tính hex trong bảng mausacs 
    const [isEmpty, setIsEmpty] = useState(false);  
 
    //xử lý lưu tt sp, hình ảnh sp xuống db khi click vào thêm sản phẩm
    const handleClickAddVoucher = (infoAddNewVoucher) => {
        console.log(infoAddNewVoucher, 'infoAddNewVoucher')
        if(
            infoAddNewVoucher.showNameVoucher === '' ||
            // infoAddNewVoucher.minOrderValue === '' ||
            // infoAddNewVoucher.maxDecreaseMoney === '' ||
            infoAddNewVoucher.typeVoucher === '' ||
            infoAddNewVoucher.desctiption === '' ||
            infoAddNewVoucher.quantityUse === 0 ||
            infoAddNewVoucher.startDate === '' ||
            infoAddNewVoucher.endDate === '' ||
            infoAddNewVoucher.decreasePersent === 0 
            // infoAddNewVoucher.decreasePersent === ""
        ){
            setIsEmpty(true)
            setContentPopup({
                title: 'Thêm voucher không thành công',
                content: 'Hãy nhập đầy đủ thông tin trước khi thêm voucher'
            })
            openPopup();   
        }
        else{
            // sử dụng formData để nhét hình ảnh và thông tin vào một cục rồi đẩy xuống db
            const formData = new FormData(); 
            formData.append('infoAddNewVoucher', JSON.stringify(infoAddNewVoucher)); 
     
            request.post(`api/addVoucher`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                  },
            }) 
            .then(res => {  
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
   

    return (
        <div>
           <Popup
                contentPopup = {contentPopup}
                confirm = {'no use'}
            />
            <div>
                <h2>Thêm Voucher</h2> 
                <InputInfoVoucher
                    nameFunction={'add'}
                    functionSaveInfo={handleClickAddVoucher}
                    isEmpty={isEmpty} 
                />
            </div> 
        </div>
    )
}

export default AddVoucher;