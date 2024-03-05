import "./addProduct.css"
import 'bootstrap';
import request from "../../../../utils/request";
import { useEffect, useState } from "react"; 
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable"; 

import useAuthCheck from "../../AuthCheckLogin/AuthCheckLogin";
import InputInfoProduct from "../InputInfoProductForAddAndUpdate/InputInfoProductForAddAndUpdate";

function AddProduct(){
    useAuthCheck()
    //NHỮNG THỨ CẦN XỬ LÝ TRONG TRANG addProduct - thêm sản phẩm của admin
    // 1.hiển thị giao diện các ô input nhập thông tin sản phẩm, input chọn size, chọn màu, nhập số lượng sp, chọn ảnh
    // 2.Xử lý hiển thị ảnh preview, xoá, chọn thêm ảnh
    // 3.xử lý lưu thông tin sản phẩm và hình ảnh xuống db

    useEffect(() => {
        document.title = "Admin | Thêm sản phẩm"
    }, []);
 
    const [isEmpty, setIsEmpty] = useState(false);
    const nameFunction = 'add';
  
    // const [checkBoxSizeDefault, setCheckBoxSizeDefault] = useState(["S", "M", "L", "XL", "XXL", "3XL"]);
    const [contentPopup, setContentPopup] = useState({
        title: '',
        content: '',
    }) 
   
    //xử lý lưu tt sp, hình ảnh sp xuống db khi click vào thêm sản phẩm
    const handleClickAddProduct = (infoAddNewProduct) => {
        console.log(infoAddNewProduct.checkboxColor.length * infoAddNewProduct.checkboxSize.length)
        //sử dụng formData để nhét hình ảnh và thông tin vào một cục rồi đẩy xuống db
        infoAddNewProduct.listQuantity.shift();
        console.log(infoAddNewProduct, infoAddNewProduct.typeProduct,'infoAddNewProduct.typeProduct2')
        if(
            infoAddNewProduct.nameProduct === '' ||
            infoAddNewProduct.originPrice === '' ||
            infoAddNewProduct.sellPrice === '' ||
            infoAddNewProduct.typeProduct === '' ||
            infoAddNewProduct.typeProduct2 === '' ||
            infoAddNewProduct.desctiption === '' ||
            infoAddNewProduct.checkboxColor.length === 0 ||
            infoAddNewProduct.checkboxSize.length === 0 ||
            infoAddNewProduct.listQuantity.length !== infoAddNewProduct.checkboxColor.length * infoAddNewProduct.checkboxSize.length ||
            infoAddNewProduct.previewImages.length === 0 
        ){ 
            setIsEmpty(true)
            setContentPopup({
                title: 'Thêm sản phẩm không thành công',
                content: 'Hãy nhập đầy đủ thông tin trước khi thêm sản phẩm'
            })
            openPopup();   
        }
        else{ 
            const formData = new FormData();
            for(const img of infoAddNewProduct.images){
                //images[] phải đặt tên như v thì laravel mới nhận ra đây là array với tên là images
                //xuống laravel dùng $images = $request->file('images');
                formData.append('images[]', img);//thêm image vào formdata
            }
            //thêm thông tin infoAddNewProduct vào form data, vì đây là một đối tượng nên cần stringify
            formData.append('infoAddNewProduct', JSON.stringify(infoAddNewProduct));
            
            
            console.log(infoAddNewProduct.listQuantity.length, 'kádjkasjd', infoAddNewProduct.checkboxColor.length * infoAddNewProduct.checkboxSize.length)
            // setStatusPressAddProduct(!statusPressAddProduct);
            // call api để lưu thông tin, dùng để lưu 'Content-Type': 'multipart/form-data' vì có dùng thêm hình ảnh
            request.post(`api/addProduct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }) 
            .then(res => {  
                setContentPopup({
                    title: 'Thêm sản phẩm thành công',
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
  
    return (
        <div>
            <div className="popup-overlay">
                <div className="popup-container">
                    <div className="popup-card">
                    <h2>{contentPopup.title}</h2>
                    <p>{contentPopup.content}</p>
                    <button id="close-popup" onClick={closePopup}>Close</button>
                    </div>
                </div>
            </div>
            <div>
                <h2>Thêm sản phẩm</h2>
                <div class="col-auto"></div>
                <InputInfoProduct 
                    nameFunction = {nameFunction}
                    functionSaveInfo = {handleClickAddProduct}
                    isEmpty = {isEmpty}
                ></InputInfoProduct>
            </div>
        </div>
    )
}

export default AddProduct;