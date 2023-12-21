import "./addProduct.css"
import 'bootstrap';
import request from "../../../utils/request";
 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faFloppyDisk, faL, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";
import CurrencyInput from 'react-currency-input-field';

import useAuthCheck from "../AuthCheckLogin/AuthCheckLogin";

function AddProduct(){
    useAuthCheck()
    //NHỮNG THỨ CẦN XỬ LÝ TRONG TRANG addProduct - thêm sản phẩm của admin
    // 1.hiển thị giao diện các ô input nhập thông tin sản phẩm, input chọn size, chọn màu, nhập số lượng sp, chọn ảnh
    // 2.Xử lý hiển thị ảnh preview, xoá, chọn thêm ảnh
    // 3.xử lý lưu thông tin sản phẩm và hình ảnh xuống db

    const {formatPrice} = useGlobalVariableContext(); 

    // statusPressAddProduct = true thì hiện nút thêm sản phẩm
    const [listDetailCategory2, setListDetailCategory2] = useState([])
    const [statusPressAddProduct, setStatusPressAddProduct] = useState(true);
    let i = 0;
    const [isEmpty, setIsEmpty] = useState(false);
    //chứa danh sách màu lấy từ db
    const [listColor, setListColor] = useState([]);
    const [listQuantity, setListQuantity] = useState([]);
    //mã hex để hiện thị màu sắc lấy thực thuộc tính hex trong bảng mausacs
    const [listHEX, setListHEX] = useState([]);
    const [checkBoxSizeDefault, setCheckBoxSizeDefault] = useState(["S", "M", "L", "XL", "XXL", "3XL"]);

    const [contentPopup, setContentPopup] = useState({
        title: '',
        content: '',
    })
    const [infoAddNewProduct, setInfoAddNewProduct] = useState({
        nameProduct: '',
        originPrice: '',
        sellPrice: '',
        typeProduct: '',
        typeProduct2: '',
        desctiption: '',
        checkboxColor: [],
        checkboxSize: [], 
        indexThumnail: 0, 
    }); 
    //lưu thông tin ảnh sẽ lưu xuống DB
    const [images, setImages] = useState([]);

    //lưu thông tin ảnh sẽ hiển thị preview
    const [previewImages, setPreviewImages] = useState([]);

    //xử lý nhập thông tin sản phẩm
    const handleInputInfoAddNewProduct = (e) => {
        e.persist();
        let {value, name} = e.target; 
        const regex_ChiNhapSo = /^\d*$/;
        if((name === 'originPrice' || name === 'sellPrice') && regex_ChiNhapSo.test(value)){
            setInfoAddNewProduct({...infoAddNewProduct, [e.target.name]: e.target.value});
        } 
        else if( name === 'typeProduct' || name === 'typeProduct2' ){
            console.log(e.target.name + " " + e.target.value, 'okojjj');
            setInfoAddNewProduct({...infoAddNewProduct, [e.target.name]: value !== "" ? parseInt( e.target.value) : ''}); 

        }
        else if(
            name === 'nameProduct' || 
            name === 'desctiption' || 
            name === 'checkboxColor' ||
            name === 'checkboxSize' ||
            name === 'indexThumnail'
        ){
            setInfoAddNewProduct({...infoAddNewProduct, [e.target.name]: e.target.value});
        }
    }

    const handleInputInfoAddNewProduct_vnd = (value, name) => { 
        const regex_ChiNhapSo = /^\d*$/;
        console.log(value, 'value')
        if (value === undefined ) {
            value = 0; // Gán giá trị là '0' khi không còn giá trị nào trong trường input
        }
        if((name === 'originPrice' || name === 'sellPrice') && regex_ChiNhapSo.test(value)){
            setInfoAddNewProduct({...infoAddNewProduct, [name]: value});
        }  
    }

    //xử lý nhập tt sp với các checkbox
    const handleInputInfoAddNewProduct_checkbox = (e) => {
        e.persist();
        var name = e.target.name;
        var value = e.target.value;
        if(infoAddNewProduct[name].includes(value)){
            setInfoAddNewProduct({...infoAddNewProduct, [name]: infoAddNewProduct[name].filter(item => item !== value)});
            console.log(name, 'name'); 
        }
        else{ 
            if(name === 'checkboxColor')
                value = parseInt(value)
            setInfoAddNewProduct({...infoAddNewProduct, [name]: [...infoAddNewProduct[name], value]})
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

        for (const file of fileImages) {
            const imageURL = await readAsDataURL(file); 
            containFileImagesToRead.push(imageURL);
        }
 
        setPreviewImages(containFileImagesToRead); 
    }

    //xử lý lưu tt sp, hình ảnh sp xuống db khi click vào thêm sản phẩm
    const handleClickAddProduct = () => {
        console.log(infoAddNewProduct.checkboxColor.length * infoAddNewProduct.checkboxSize.length, '828282', listQuantity.length + 1)
        //sử dụng formData để nhét hình ảnh và thông tin vào một cục rồi đẩy xuống db
        console.log(infoAddNewProduct.typeProduct2, infoAddNewProduct.typeProduct,'infoAddNewProduct.typeProduct2')
        if(
            infoAddNewProduct.nameProduct === '' ||
            infoAddNewProduct.originPrice === '' ||
            infoAddNewProduct.sellPrice === '' ||
            infoAddNewProduct.typeProduct === '' ||
            infoAddNewProduct.typeProduct2 === '' ||
            infoAddNewProduct.desctiption === '' ||
            infoAddNewProduct.checkboxColor.length === 0 ||
            infoAddNewProduct.checkboxSize.length === 0 ||
            listQuantity.length - 1 !== infoAddNewProduct.checkboxColor.length * infoAddNewProduct.checkboxSize.length ||
            previewImages.length === 0 
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
            for(const img of images){
                //images[] phải đặt tên như v thì laravel mới nhận ra đây là array với tên là images
                //xuống laravel dùng $images = $request->file('images');
                formData.append('images[]', img);//thêm image vào formdata
            }
            //thêm thông tin infoAddNewProduct vào form data, vì đây là một đối tượng nên cần stringify
            formData.append('infoAddNewProduct', JSON.stringify(infoAddNewProduct));
            listQuantity.shift();
            formData.append('listQuantity', JSON.stringify(listQuantity));
            console.log(listQuantity.length, 'kádjkasjd', infoAddNewProduct.checkboxColor.length * infoAddNewProduct.checkboxSize.length)
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

    const getInfoForAddProduct = () => {
        request.get('api/getInfoForAddProduct')
        .then(res => {
            setListColor(res.data.listColor);
            console.log(res.data.listColor, "ok");
        })
        .catch(error =>{
            console.log(error)
        })
    }

    //chọn một ảnh làm thumnail
    const handleChooseThumnail = (e) =>{
        setInfoAddNewProduct({...infoAddNewProduct, [e.target.name]: e.target.value}); 
        console.log(infoAddNewProduct.indexThumnail);
    }

    const handleClickDeleteImage = (index) => {
        const updatedImages = [...images];
        const updatedPreviewImages = [...previewImages];
      
        // // Xoá hình ảnh tại vị trí index
        updatedImages.splice(index, 1);
        updatedPreviewImages.splice(index, 1);
      
        // // Cập nhật state với các mảng đã cập nhật
        setImages(updatedImages);
        setPreviewImages(updatedPreviewImages);
    } 

    useEffect(() => {
        getInfoForAddProduct(); 
    }, [])

    const getDetailCategory2 = () => {
        // const data = {
        //     typeProduct_mapl: infoAddNewProduct.typeProduct
        // }
        request.get(`api/getDetailCategory2`, {params: {typeProduct_mapl: infoAddNewProduct.typeProduct}})
        .then(res => {
            console.log(res.data.listDetailCategory2)
            setListDetailCategory2(res.data.listDetailCategory2)
        })                                                                                      
        .catch(err => {
            console.log(infoAddNewProduct.typeProduct, err)
        })
    } 
    
    useEffect(() => {
        if(infoAddNewProduct.typeProduct !== 0 && infoAddNewProduct.typeProduct !== ''){
            console.log(infoAddNewProduct.typeProduct, 'phanloai2')
            getDetailCategory2();
        }
    }, [infoAddNewProduct.typeProduct])

    const renderListColor = listColor.map((item) => {
        console.log(item.MAMAU, 'lklkl', infoAddNewProduct.checkboxColor.includes(item.MAMAU), infoAddNewProduct.checkboxColor)
        return (
            <div className="list_checbox_color_item">
                <input 
                    type="checkbox" id={item.MAMAU} className="checkbox_sizes" 
                    name="checkboxColor"
                    value={item.MAMAU}
                    checked={infoAddNewProduct.checkboxColor.includes(item.MAMAU)}
                    onChange={handleInputInfoAddNewProduct_checkbox} 
                ></input>
                <label 
                    for={item.MAMAU}
                    className={
                        ` 
                            size_icon1 size_icon_color
                            ${infoAddNewProduct.checkboxColor.includes(item.MAMAU)
                                ? 'border_size_color' 
                                : ''
                            }
                        `
                    }
                >
                    <div className="checkbox_color" style={{backgroundColor: `${item.HEX}`}}></div>
                </label>
            </div>
        )
    })


    const handleInputQuantity = (e, i) => { 
        const update = [...listQuantity];
        update[i] = e.target.value
        setListQuantity(update)
        console.log(listQuantity, "nhập số lượng")
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

    //hiển thị các ô nhập số lượng sau khi nhấn button thêm sản phẩm
    const renderInputSoLuong =  infoAddNewProduct.checkboxSize.map(itemSize => {
        
        return (
            <div>
                <h6 className="input_quantity__size_name">Size {itemSize}</h6> 
                {
                    infoAddNewProduct.checkboxColor.map((itemColor, index) => {
                        console.log(itemColor)
                        return(
                            <div className="input_quantity__quantity" key={index}>
                                <div className="input_quantity__product_color" style={{backgroundColor: `${listColor[itemColor - 1].HEX}`}}></div>
                                <div>
                                    <span className="input_quantity__quantity_haved">0</span>
                                </div>
                                <div class="input_gia_div">
                                        {/* <label for="#" class="form-label">Giá niêm yết</label> */} 
                                    {renderInputQuantity(++i)}    
                                </div>
                            </div> 

                        )
                    })
                }
                <span className={`red_color ${isEmpty && listQuantity.length - 1 !== infoAddNewProduct.checkboxColor.length * infoAddNewProduct.checkboxSize.length ? '' : 'display_hidden'}`}>Nhập số lượng trước khi lưu</span>
            </div>
        )
    })

    //hiển thị ảnh preview
    const renderPreViewImage = previewImages.map((image, index) =>{ 
        return ( 
            <div key={index} className="prview_image">
                <div>
                    <img src={image} key={index} width={150} height={250} className="prview_image__img"></img> 
                </div>
                <input type="radio" name="indexThumnail" value={index} onChange={handleChooseThumnail}></input>
                <div className="delete_prview_image">
                    <button className="delete_prview_image__css" onClick={() => handleClickDeleteImage(index)}>
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                    </button>
                </div>
            </div>
        )
    })

    const renderListDetailCategory2 = listDetailCategory2.map(item => 
        <option value={item.MAPL2}>{item.TENPL2}</option> 
    )

    const renderCheckBoxSize = checkBoxSizeDefault.map((item, index) =>
        <div key={index} className="choose_size__div__item">
            <input 
                type="checkbox" id={`${item}`} 
                className="checkbox_sizes"  
                name="checkboxSize"
                value={`${item}`}
                checked={infoAddNewProduct.checkboxSize.includes(`${item}`)}
                onChange={handleInputInfoAddNewProduct_checkbox} 
            ></input>
            <label 
                for={`${item}`} 
                className={
                    `
                        size_icon1 
                        ${infoAddNewProduct.checkboxSize.find(itemChecked => itemChecked === item) 
                            ? 'border_size_color' 
                            : ''
                        }
                    `
                }
            >
                {item}
            </label> 
        </div> 
    )

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
                <div class="body_box container col-lg-7">
                    
                    <div class="address_update" id="address_update">
                        <div class="row mb-2">
                            <div class="input_ten_div">
                                {/* <label for="#" class="form-label">Tên sản phẩm</label> */}
                                <input 
                                    type="text" class="form-control" placeholder="Nhập tên sản phẩm" 
                                    onChange={handleInputInfoAddNewProduct} 
                                    name="nameProduct" 
                                    value={infoAddNewProduct.nameProduct}
                                />
                                <span className={`red_color ${isEmpty && infoAddNewProduct.nameProduct === '' ? '' : 'display_hidden'}`}>Nhập tên sản phẩm trước khi lưu</span>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-12 input_gia">
                                <div class="input_gia_div">
                                    {/* <label for="#" class="form-label">Giá niêm yết</label> */} 
                                    {/* <input 
                                        type="text" class="form-control width_gia" placeholder="Giá niêm yết" 
                                        onChange={handleInputInfoAddNewProduct}
                                        name="originPrice"  
                                        value={infoAddNewProduct.originPrice}
                                    />   */}
                                    <CurrencyInput
                                        className="form-control width_gia"
                                        placeholder="Giá niêm yết"
                                        onValueChange={(value, name) => handleInputInfoAddNewProduct_vnd(value, name)}
                                        name="originPrice"
                                        value={infoAddNewProduct.originPrice}
                                        allowNegativeValue={false} // Tùy chọn, để không cho phép giá trị âm
                                        decimalSeparator="," // Phân cách phần thập phân
                                        groupSeparator="." // Phân cách hàng nghìn
                                        suffix=" VND" // Đơn vị tiền tệ
                                    />
                                    <span className={`red_color ${isEmpty && infoAddNewProduct.originPrice === '' ? '' : 'display_hidden'}`}>Nhập giá niêm yết trước khi lưu</span>
                                </div>
                                <div class="input_gia_div">
                                    {/* <label for="#" class="form-label">Giá bán</label> */}
                                    {/* <input 
                                        type="text" class="form-control width_gia" placeholder="Giá bán" 
                                        onChange={handleInputInfoAddNewProduct}
                                        name="sellPrice"   
                                        value={infoAddNewProduct.sellPrice}
                                    /> */}
                                    <CurrencyInput
                                        className="form-control width_gia"
                                        placeholder="Giá bán"
                                        onValueChange={(value, name) => handleInputInfoAddNewProduct_vnd(value, name)}
                                        name="sellPrice"
                                        value={infoAddNewProduct.sellPrice}
                                        allowNegativeValue={false} // Tùy chọn, để không cho phép giá trị âm
                                        decimalSeparator="," // Phân cách phần thập phân
                                        groupSeparator="." // Phân cách hàng nghìn
                                        suffix=" VND" // Đơn vị tiền tệ
                                    />
                                    <span className={`red_color ${isEmpty && infoAddNewProduct.sellPrice === '' ? '' : 'display_hidden'}`}>Nhập giá bán trước khi lưu</span>

                                </div>
                                
                            </div> 
                            <span className={`red_color ${parseInt(infoAddNewProduct.originPrice) < parseInt(infoAddNewProduct.sellPrice) ? '' : 'display_hidden'}`}>Giá bán phải nhỏ hơn hoặc = giá niêm yết</span>

                        </div>
                        <div class="row mb-3">
                            <div class="col-4">
                                <label for="#" class="form-label">Phân loại</label>
                                <select class="form-select" required
                                    onChange={handleInputInfoAddNewProduct}
                                    name="typeProduct"
                                    value={infoAddNewProduct.typeProduct} 
                                >
                                <option selected value="">-- Chọn phân loại --</option>
                                <option value="1">Nam</option>
                                <option value="2">Nữ</option>
                                <option value="3">Trẻ em</option>
                                </select>
                                <span className={`red_color ${isEmpty && infoAddNewProduct.typeProduct === '' ? '' : 'display_hidden'}`}>Hãy chọn phân loại</span>
                            </div> 
                            <div class="col-4">
                                <label for="#" class="form-label">Danh mục</label>
                                <select class="form-select" required
                                    onChange={handleInputInfoAddNewProduct}
                                    name="typeProduct2"
                                    value={infoAddNewProduct.typeProduct2} 
                                >
                                    <option selected value="">-- Chọn danh mục --</option>
                                    {renderListDetailCategory2}
                                </select>
                                <span className={`red_color ${isEmpty && infoAddNewProduct.typeProduct2 === '' ? '' : 'display_hidden'}`}>Hãy chọn phân loại sản phẩm chi tiết</span>

                            </div> 
                        </div>

                        <div className="row">
                            <div className="col-5 choose_size">
                                <div>
                                    <label>Chọn các loại size</label>
                                </div>
                                <div>
                                    <div className="choose_size__div">
                                        {renderCheckBoxSize} 
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className={`red_color ${isEmpty && infoAddNewProduct.checkboxSize.length === 0 ? '' : 'display_hidden'}`}>Hãy chọn size</span>

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
                        <span className={`red_color ${isEmpty && infoAddNewProduct.checkboxColor.length === 0 ? '' : 'display_hidden'}`}>Hãy chọn màu</span>

                            <span>Chọn ảnh sản phẩm</span>
                        <div>
                            <input type="file" className="inputfile inputfile-3" id="file-3" multiple name="image" accept="image/*" onChange={handleClickUploadImage}></input>
                            <label for="file-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg> 
                                <span>Choose a file&hellip;</span>
                            </label>
                            <div>
                                <span className={`red_color ${isEmpty && previewImages.length === 0 ? '' : 'display_hidden'}`}>Chọn ảnh và ảnh thumnail trước khi lưu</span>
                            </div>

                            
                            <div className="renderPreViewImage">
                                { renderPreViewImage }
                            </div>
                        </div>

                        <textarea 
                            id="w3review" name="desctiption" rows="4" cols="80"
                            className="w3review" placeholder="Nhập mô tả sản phẩm"
                            value={infoAddNewProduct.desctiption} 
                            onChange={handleInputInfoAddNewProduct}
                        > 
                        </textarea>

                        <span className={`red_color ${isEmpty && infoAddNewProduct.desctiption === '' ? '' : 'display_hidden'}`}>Nhập mô tả trước khi lưu</span>

                    </div> 
                    
                </div>
                <div class="col-auto"></div>
            </div>
            <div class={`${statusPressAddProduct ? '' : 'display_hidden'}`}>
                <h2>Nhập số lượng</h2> 
                <div class="col-auto"></div>
                <div class="body_box container col-lg-7">
                    {renderInputSoLuong} 
                </div>
                 
                <div class="col-auto"></div> 
            </div>
            <div class="address_update_button_contain row">
                <div class={`${statusPressAddProduct ? '' : ''}`}>
                    <button class={`address_confirm_button btn btn-dark`} onClick={handleClickAddProduct}>
                        <FontAwesomeIcon icon={faFloppyDisk} className="add_product_save"></FontAwesomeIcon>
                        Lưu
                    </button>
                    <button class="address_cancel_button btn btn-outline-secondary">
                        <FontAwesomeIcon icon={faXmark} className="add_product_save"></FontAwesomeIcon>
                        Hủy
                    </button>
                </div> 
            </div>
        </div>
    )
}

export default AddProduct;