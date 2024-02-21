import "../ManageProduct/manageProduct.css"
import 'bootstrap';
import request from "../../../../utils/request";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faCircleChevronLeft, faFloppyDisk, faL, faPenToSquare, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import CurrencyInput from 'react-currency-input-field';
import Popup from "../../ComponentUseInManyPage/Popup/Popup";

import useAuthCheck from "../../AuthCheckLogin/AuthCheckLogin";
import InputInfoProduct from "../InputInfoProductForAddAndUpdate/InputInfoProductForAddAndUpdate";

function UpdateProduct(){
    const {formatPrice, contentPopup, setContentPopup, openPopup} = useGlobalVariableContext(); 
    const nameFunction = 'update';  
    const [isEmpty, setIsEmpty] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const Navigate = useNavigate();
    const [watchProductDetail, setWatchProductDetail] = useState(false);
  
    const handleTurnBack = () => {
        setWatchProductDetail(false);
        setIsUpdating(false);
        window.history.back();
    }
    const handleClickUpdate= () => {
        setIsUpdating(true)
    }

    const handleClickUpdateProduct = (infoUpdateProduct) => {
        // console.log(infoUpdateProduct, 'lklklklkl', infoUpdateProduct.quantityImgurl)
        //sử dụng formData để nhét hình ảnh và thông tin vào một cục rồi đẩy xuống db
        if(
            infoUpdateProduct.nameProduct === '' ||
            infoUpdateProduct.originPrice === '' ||
            infoUpdateProduct.sellPrice === '' ||
            infoUpdateProduct.typeProduct === '' ||
            infoUpdateProduct.desctiption === '' ||
            infoUpdateProduct.checkboxColor.length === 0 ||
            infoUpdateProduct.checkboxSize.length === 0 ||
            // listQuantity.length !== infoUpdateProduct.checkboxColor.length * infoUpdateProduct.checkboxSize.length ||
            (infoUpdateProduct.previewImages.length === 0 && infoUpdateProduct.imgurl.length === 0)
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
            for(const img of infoUpdateProduct.images){
                //images[] phải đặt tên như v thì laravel mới nhận ra đây là array với tên là images
                //xuống laravel dùng $images = $request->file('images');
                formData.append('images[]', img);//thêm image vào formdata
            }
            //thêm thông tin infoUpdateProduct vào form data, vì đây là một đối tượng nên cần stringify
            formData.append('infoUpdateProduct', JSON.stringify(infoUpdateProduct)); 

            // setStatusPressUpdateProduct(!statusPressUpdateProduct);
            // call api để lưu thông tin, dùng để lưu 'Content-Type': 'multipart/form-data' vì có dùng thêm hình ảnh
            request.post(`api/updateProduct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            // request.post(`api/UpdateProduct`, infoUpdateProduct)
            .then(res => { 
                console.log(res.data, 'data');
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

    return ( 
        <div> 
            <Popup
                contentPopup = {contentPopup}
                confirm = {'no use'}
            />
            <div class={`${nameFunction ? 'update' : 'display_hidden'} icon-update icon-update__margin`}>
                <span onClick={handleTurnBack}  className="faCircleChevronLeft">
                    <FontAwesomeIcon class={`fa-solid faCircleChevronLeft`} icon={faCircleChevronLeft} ></FontAwesomeIcon>
                </span>
                <span onClick={handleClickUpdate}>
                    <FontAwesomeIcon class={`fa-solid fa-pen-to-square `} icon={faPenToSquare} ></FontAwesomeIcon>
                </span>
            </div>
            <h2>CẬP NHẬT SẢN PHẨM</h2>
            <div class="col-auto"></div>
                <InputInfoProduct
                    nameFunction = {nameFunction}
                    functionSaveInfo = {handleClickUpdateProduct}
                    isEmpty = {isEmpty}
                    isUpdating = {isUpdating}
                    setIsUpdating = {setIsUpdating}
                ></InputInfoProduct>
            <div class="col-auto"></div>
        </div>
    )
}

export default UpdateProduct;