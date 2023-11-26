import "./addProduct.css"
import 'bootstrap';
import request from "../../../utils/request";
 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faL, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';

function AddProduct(){
    //NHỮNG THỨ CẦN XỬ LÝ TRONG TRANG addProduct - thêm sản phẩm của admin
    // 1.hiển thị giao diện các ô input nhập thông tin sản phẩm, input chọn size, chọn màu, nhập số lượng sp, chọn ảnh
    // 2.Xử lý hiển thị ảnh preview, xoá, chọn thêm ảnh
    // 3.xử lý lưu thông tin sản phẩm và hình ảnh xuống db


    // statusPressAddProduct = true thì hiện nút thêm sản phẩm
    const [statusPressAddProduct, setStatusPressAddProduct] = useState(true);
    let i = 0;
    //chứa danh sách màu lấy từ db
    const [listColor, setListColor] = useState([]);
    const [listQuantity, setListQuantity] = useState([]);
    //mã hex để hiện thị màu sắc lấy thực thuộc tính hex trong bảng mausacs
    const [listHEX, setListHEX] = useState([]);
    const [infoAddNewProduct, setInfoAddNewProduct] = useState({
        nameProduct: '',
        originPrice: '',
        sellPrice: '',
        typeProduct: '',
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
        setInfoAddNewProduct({...infoAddNewProduct, [e.target.name]: e.target.value});
        console.log(e.target.name + " " + e.target.value);
    }

    //xử lý nhập tt sp với các checkbox
    const handleInputInfoAddNewProduct_checkbox = (e) => {
        e.persist();
        var name = e.target.name;
        var value = e.target.value;
        if(infoAddNewProduct[name].includes(value)){
            setInfoAddNewProduct({...infoAddNewProduct, [name]: infoAddNewProduct[name].filter(item => item !== value)});
            console.log(infoAddNewProduct); 
        }
        else{
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

        //sử dụng formData để nhét hình ảnh và thông tin vào một cục rồi đẩy xuống db
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

        setStatusPressAddProduct(!statusPressAddProduct);
        // call api để lưu thông tin, dùng để lưu 'Content-Type': 'multipart/form-data' vì có dùng thêm hình ảnh
        request.post(`api/addProduct`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
              },
        }) 
        .then(res => {  
        })
        .catch(error => { 
            console.log(error);
        })
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
        console.log('color') 
    }, [])
 

    const renderListColor = listColor.map((item) => {
        return (
            <div className="list_checbox_color_item">
                <input 
                    type="checkbox" id={item.MAMAU} className="checkbox_sizes" 
                    name="checkboxColor"
                    value={item.MAMAU}
                    checked={infoAddNewProduct.checkboxColor.includes(`${item.MAMAU}`)}
                    onChange={handleInputInfoAddNewProduct_checkbox}
                ></input>
                <label for={item.MAMAU}>
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
            </div>
        )
    })

    //hiển thị ảnh preview
    const renderPreViewImage = previewImages.map((image, index) =>{ 
        return ( 
            <div key={index} className="prview_image">
                <img src={image} key={index} width={250} height={350}></img> 
                <input type="radio" name="indexThumnail" value={index} onChange={handleChooseThumnail}></input>
                <div className="delete_prview_image">
                    <button onClick={() => handleClickDeleteImage(index)}>
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                    </button>
                </div>
            </div>
        )
    })

    return (
        <div>
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
                                    onChange={handleInputInfoAddNewProduct} 
                                    name="nameProduct" 
                                    value={infoAddNewProduct.nameProduct}
                                />
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-12 input_gia">
                                <div class="input_gia_div">
                                    {/* <label for="#" class="form-label">Giá niêm yết</label> */}
                                    <input 
                                        type="text" class="form-control" placeholder="Giá niêm yết" 
                                        onChange={handleInputInfoAddNewProduct}
                                        name="originPrice"  
                                        value={infoAddNewProduct.originPrice}
                                    />
                                </div>
                                <div class="input_gia_div">
                                    {/* <label for="#" class="form-label">Giá bán</label> */}
                                    <input 
                                        type="text" class="form-control" placeholder="Giá bán" 
                                        onChange={handleInputInfoAddNewProduct}
                                        name="sellPrice"   
                                        value={infoAddNewProduct.sellPrice}
                                    />
                                </div>
                            </div> 
                        </div>
                        <div class="row mb-3">
                            <div class="col-4">
                                <label for="#" class="form-label">Phân loại</label>
                                <select class="form-select" required
                                    onChange={handleInputInfoAddNewProduct}
                                    name="typeProduct"
                                    value={infoAddNewProduct.typeProduct} 
                                >
                                <option selected value="0"></option>
                                <option value="1">Nam</option>
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
                                        checked={infoAddNewProduct.checkboxSize.includes("S")}
                                        onChange={handleInputInfoAddNewProduct_checkbox}
                                    ></input>
                                    <label for="S">S</label>

                                    <input 
                                        type="checkbox" id="M" className="checkbox_sizes" 
                                        name="checkboxSize"
                                        value="M"
                                        checked={infoAddNewProduct.checkboxSize.includes("M")}
                                        onChange={handleInputInfoAddNewProduct_checkbox}
                                    ></input>
                                    <label for="M">M</label>

                                    <input 
                                        type="checkbox" id="L" className="checkbox_sizes" 
                                        name="checkboxSize"
                                        value="L"
                                        checked={infoAddNewProduct.checkboxSize.includes("L")}
                                        onChange={handleInputInfoAddNewProduct_checkbox}
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
                            value={infoAddNewProduct.desctiption} 
                            onChange={handleInputInfoAddNewProduct}
                        >
                            At w3schools.com you will learn how to make a website.
                            They offer free tutorials in all web development technologies.
                        </textarea>

                        
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
                    <button class={`address_confirm_button btn btn-dark`} onClick={handleClickAddProduct}>Thêm sản phẩm</button>
                    <button class="address_cancel_button btn btn-outline-secondary">Hủy</button>
                </div> 
            </div>
        </div>
    )
}

export default AddProduct;