import "./updateProduct.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';

import * as request from "../../../utils/request";
import requestGet from "../../../utils/request";
import requestPost from "../../../utils/request";
import { useEffect, useState } from "react";
import {  Navigate, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faClose, faEye, faL, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';


function UpdateProduct()
{
    

    const [statusPressUpdateProduct, setStatusPressUpdateProduct] = useState(true);
    const Navigate = useNavigate();
    //chứa danh sách màu lấy từ db
    const [listColor, setListColor] = useState([]); 
    const searchParams  = new URLSearchParams(window.location.search);
    const maspParam = searchParams.get('masp');
    const numberPagination = searchParams.get('numberPagination');
    const nameStatus = searchParams.get('nameStatus');
    console.log(numberPagination, nameStatus)
    //mã hex để hiện thị màu sắc lấy thực thuộc tính hex trong bảng mausacs 
    const [checkBoxSizeDefault, setCheckBoxSizeDefault] = useState(["S", "M", "L", "XL", "XXL", "3XL"]);
    const [infoUpdateProduct, setInfoUpdateProduct] = useState({
        nameProduct: '',
        originPrice: '',
        sellPrice: '',
        typeProduct: '',
        desctiption: '',
        checkboxColor: [],
        checkboxSize: [],
        imgurl: [], 
        listHEX: [],
        quantity: [],
        maHinhAnhDeleted: [],
        mahinhanh: [],
        masp: 1,
        quantityImgurl: 0,
        indexThumnail: 0,
    });
    const [infoProductDetail, setInfoProductDetail] = useState({
        dataProductDetail_sanphams: [],
        dataProductDetail_sanpham_mausac_sizes__sizes: [],
        dataProductDetail_sanpham_mausac_sizes__colors: [], 
        dataProductDetail_sanpham_mausac_sizes__hinhanhs: [],
    })
    // const [infoUpdateProduct, setInfoUpdateProduct] = useState({
    //     nameProduct: '',
    //     originPrice: '',
    //     sellPrice: '',
    //     typeProduct: '',
    //     desctiption: '',
    //     checkboxColor: [],
    //     checkboxSize: [],
    //     indexThumnail: 0,
    //     listHEX: [],
    //     listColor: [],
    //     images: [],
    //     previewImages: [],
    //     deleted: []
    // });
    //lưu thông tin ảnh sẽ lưu xuống DB
    const [images, setImages] = useState([]);

    //lưu thông tin ảnh sẽ hiển thị preview
    const [previewImages, setPreviewImages] = useState([]);

    //xử lý nhập thông tin sản phẩm
    const handleInputInfoUpdateProduct = (e) => {
        e.persist();
        setInfoUpdateProduct({...infoUpdateProduct, [e.target.name]: e.target.value});
        console.log(e.target.name + " " + e.target.value);
    }

    //xử lý nhập tt sp với các checkbox
    const handleInputInfoUpdateProduct_checkbox = (e) => {
        e.persist();
        var name = e.target.name;
        var value = e.target.value;
        if(infoUpdateProduct[name].includes(value)){
            setInfoUpdateProduct({...infoUpdateProduct, [name]: infoUpdateProduct[name].filter(item => item !== value)});
            console.log(infoUpdateProduct); 
        }
        else{
            setInfoUpdateProduct({...infoUpdateProduct, [name]: [...infoUpdateProduct[name], value]})
        }  
        console.log(infoUpdateProduct.checkboxColor);
        console.log(infoUpdateProduct.checkboxSize);
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
        let i = 0;
        for (const file of fileImages) {
            const imageURL = await readAsDataURL(file); 
            containFileImagesToRead.push({id: i, src: imageURL});
            i++;
        }
 
        setPreviewImages(containFileImagesToRead); 
    }

    //xử lý lưu tt sp, hình ảnh sp xuống db khi click vào thêm sản phẩm
    const handleClickUpdateProduct = () => {
        console.log(infoUpdateProduct.indexThumnail, 'lklklklkl', infoUpdateProduct.quantityImgurl)
        //sử dụng formData để nhét hình ảnh và thông tin vào một cục rồi đẩy xuống db
        const formData = new FormData();
        for(const img of images){
            //images[] phải đặt tên như v thì laravel mới nhận ra đây là array với tên là images
            //xuống laravel dùng $images = $request->file('images');
            formData.append('images[]', img);//thêm image vào formdata
        }
        //thêm thông tin infoUpdateProduct vào form data, vì đây là một đối tượng nên cần stringify
        formData.append('infoUpdateProduct', JSON.stringify(infoUpdateProduct));

        // setStatusPressUpdateProduct(!statusPressUpdateProduct);
        // call api để lưu thông tin, dùng để lưu 'Content-Type': 'multipart/form-data' vì có dùng thêm hình ảnh
        requestPost.post(`api/updateProduct`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
              },
        })
        // request.post(`api/UpdateProduct`, infoUpdateProduct)
        .then(res => { 
            console.log(res.data);
         })
        .catch(error => { 
            console.log(error);
        })
    }

    const getInfoForUpdateProduct = () => {
        requestGet.get(`/api/getInfoForAddProduct`)
        .then(res => {
            setListColor(res.data.listColor);
            console.log(res.data.listColor, 'color      lll');
        })
        .catch(error =>{
            console.log(error)
        })
    }

    //chọn một ảnh làm thumnail
    const handleChooseThumnail = (e) =>{
        setInfoUpdateProduct({...infoUpdateProduct, [e.target.name]: parseInt(e.target.value)}); 
        console.log(infoUpdateProduct.indexThumnail, "ok test choosethumnail", e.target.value);
    }
    const handleTurnBack = () => {
        Navigate(`/admin/manageProduct?nameStatus=${nameStatus}&numberPagination=${numberPagination}&maspParam=${maspParam}`);
    }

    const getInforProductDetail = (masp) => {
        request.get(`/api/infoProductDetail?masp=${masp}`)
        .then(res => {   
            
            setInfoUpdateProduct({
                ...infoUpdateProduct,
                nameProduct: res.dataProductDetail_sanphams[0].TENSP,
                originPrice: res.dataProductDetail_sanphams[0].GIAGOC,
                sellPrice: res.dataProductDetail_sanphams[0].GIABAN,
                typeProduct: res.dataProductDetail_sanphams[0].MAPL_SP,
                desctiption: res.dataProductDetail_sanphams[0].MOTA, 
                checkboxSize: [...infoUpdateProduct.checkboxSize.map(item => item), 
                    ...res.dataProductDetail_sanpham_mausac_sizes__sizes.map(item => item.MASIZE)],
                imgurl: [...infoUpdateProduct.imgurl.map(item => item), 
                    ...res.dataProductDetail_sanpham_mausac_sizes__hinhanhs.map(item => item.imgURL)],
                listHEX: [...infoUpdateProduct.listHEX.map(item => item), 
                    ...res.dataProductDetail_sanpham_mausac_sizes__colors.map(item => item.HEX)],
                quantity: [...infoUpdateProduct.quantity.map(item => item), 
                    ...res.dataProductDetail_sanpham_mausac_sizes__soluongs.map(item => item)],
                checkboxColor: [...infoUpdateProduct.checkboxColor.map(item => item), 
                    ...res.dataProductDetail_sanpham_mausac_sizes__colors.map(item => item.MAMAU)],
                masp: maspParam,
                quantityImgurl: res.dataProductDetail_sanpham_mausac_sizes__hinhanhs.length,
                mahinhanh: [...infoUpdateProduct.mahinhanh.map(item => item), 
                    ...res.dataProductDetail_sanpham_mausac_sizes__hinhanhs.map(item => item.MAHINHANH)],
                indexThumnail: parseInt(res.indexthumnail) - 1,
            }) 
 
            
            console.log(parseInt(res.indexthumnail), 'test 00000');
            // res.data.dataProductDetail_sanphams.map(item => 
            //     setInfoUpdateProduct({
            //         ...infoUpdateProduct,
            //         nameProduct: item.TENSP
            //     })
            // )
            console.log(res);
            setInfoProductDetail({
                dataProductDetail_sanphams: res.dataProductDetail_sanphams,
                dataProductDetail_sanpham_mausac_sizes__sizes: res.dataProductDetail_sanpham_mausac_sizes__sizes,
                dataProductDetail_sanpham_mausac_sizes__colors: res.dataProductDetail_sanpham_mausac_sizes__colors, 
                dataProductDetail_sanpham_mausac_sizes__hinhanhs: res.dataProductDetail_sanpham_mausac_sizes__hinhanhs,
            })
            
        })
    };

    useEffect(() => {
        getInfoForUpdateProduct();
        maspParam ? getInforProductDetail(maspParam) : getInforProductDetail(1);
        console.log(infoProductDetail, 'ok')
    }, [])

    const handleDeletePreviewImage = (type, index) => {
        if(type === 'imageFromClient'){
            const updatedImages = [...images];
            const updatedPreviewImages = [...previewImages];
        
            // // Xoá hình ảnh tại vị trí index
            updatedImages.splice(index, 1);
            updatedPreviewImages.splice(index, 1);
        
            // // Cập nhật state với các mảng đã cập nhật
            setImages(updatedImages);
            setPreviewImages(updatedPreviewImages);
            if(index === infoUpdateProduct.indexThumnail){
                setInfoUpdateProduct({
                    ...infoUpdateProduct,  
                    indexThumnail: 0
                })
            }
            else if(index < infoUpdateProduct.indexThumnail && index != 0){
                const newIndexThumnail = infoUpdateProduct.indexThumnail - 1;
                setInfoUpdateProduct({ 
                    indexThumnail: newIndexThumnail
                })
            }
            else if(index < infoUpdateProduct.indexThumnail && index == 0){
                const newIndexThumnail = infoUpdateProduct.indexThumnail - 1;
                setInfoUpdateProduct({
                    ...infoUpdateProduct,   
                    indexThumnail: newIndexThumnail
                })
            } 
        }
        else if(type === 'imageFromServe'){ 
            const listDeleted = infoUpdateProduct.mahinhanh.filter((item, indexMAHINHANH) => {
                console.log(item, "okokok", index, '  ', indexMAHINHANH)
                if(indexMAHINHANH === index){
                    console.log(item, "ok in ra")
                    return item
                }
            });
            
            infoUpdateProduct.mahinhanh.splice(index, 1);
            infoUpdateProduct.imgurl.splice(index, 1);

            console.log(listDeleted, 'xoá nào');
            if(index === infoUpdateProduct.indexThumnail){
                setInfoUpdateProduct({
                    ...infoUpdateProduct, 
                    maHinhAnhDeleted: [
                        ...infoUpdateProduct.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoUpdateProduct.mahinhanh.length,
                    indexThumnail: 0
                })
            }
            else if(index < infoUpdateProduct.indexThumnail && index != 0){
                const newIndexThumnail = infoUpdateProduct.indexThumnail - 1;
                setInfoUpdateProduct({
                    ...infoUpdateProduct, 
                    maHinhAnhDeleted: [
                        ...infoUpdateProduct.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoUpdateProduct.mahinhanh.length,
                    indexThumnail: newIndexThumnail
                })
            }
            else if(index < infoUpdateProduct.indexThumnail && index == 0){
                const newIndexThumnail = infoUpdateProduct.indexThumnail - 1;
                setInfoUpdateProduct({
                    ...infoUpdateProduct, 
                    maHinhAnhDeleted: [
                        ...infoUpdateProduct.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoUpdateProduct.mahinhanh.length,
                    indexThumnail: newIndexThumnail
                })
            }
            else{
                setInfoUpdateProduct({
                    ...infoUpdateProduct, 
                    maHinhAnhDeleted: [
                        ...infoUpdateProduct.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoUpdateProduct.mahinhanh.length, 
                })
            }
  
        } 
        console.log("mã hình ảnh ", infoUpdateProduct.indexThumnail, ' ', index) 
        
    }

    const renderListColor = listColor.map((item) => {
        return (
            <div className="list_checbox_color_item">
                <input 
                    type="checkbox" id={item.MAMAU} className="checkbox_sizes" 
                    name="checkboxColor"
                    value={item.MAMAU}
                    checked={infoUpdateProduct.checkboxColor.includes(item.MAMAU)}
                    onChange={handleInputInfoUpdateProduct_checkbox}
                ></input>
                <label for={item.MAMAU}>
                    <div className="checkbox_color" style={{backgroundColor: `${item.HEX}`}}></div>
                </label>
            </div>
        )   
    })

    //hiển thị các ô nhập số lượng sau khi nhấn button thêm sản phẩm
    const renderInputSoLuong =  infoUpdateProduct.checkboxSize.map(itemSize => {
        return (
            <div>
                <h3>orderDetail</h3>
                   
                <h6 className="input_quantity__size_name">Size {itemSize}</h6> 
                {
                    infoUpdateProduct.listHEX.map(itemColor => {
                        console.log(itemColor)
                        return(
                            <div className="input_quantity__quantity">
                                <div className="input_quantity__product_color" style={{backgroundColor: `${itemColor}`}}></div>
                                <div> 
                                    {
                                        infoUpdateProduct.quantity.map(item => {
                                            console.log(item)
                                            if(item.HEX === itemColor && item.MASIZE === itemSize){
                                                return(
                                                    <span className="input_quantity__quantity_haved">{item.SOLUONG}</span> 
                                                ) 
                                            }
                                        })
                                    }
                                </div>
                                <div class="input_gia_div">
                                        {/* <label for="#" class="form-label">Giá niêm yết</label> */}
                                        <input type="text" class="form-control" placeholder="Nhập số lượng"/>
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
            <div className="prview_image" key={image.id}>
                <img src={image.src} key={image.id} width={250} height={350}></img> 
                <input 
                    type="radio" name="indexThumnail" 
                    value={infoUpdateProduct.mahinhanh.length + index} 
                    checked={(infoUpdateProduct.mahinhanh.length + index) === (infoUpdateProduct.indexThumnail)}
                    onChange={handleChooseThumnail}
                ></input>
                <div className="delete_prview_image">
                    <button onClick={() => handleDeletePreviewImage('imageFromClient', image.id)}>
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>lll
                    </button>
                </div>
            </div>
        )
    })

    const renderPreViewImageFromImgUrl = infoUpdateProduct.imgurl.map((item, index) => {
        console.log(item)
        return ( 
            <div key={index} className="prview_image">
                <img src={item} key={index} width={250} height={350}></img> 
                <input 
                    type="radio" name="indexThumnail" value={index} 
                    onChange={handleChooseThumnail}
                    checked={(infoUpdateProduct.indexThumnail) === index}
                ></input>
                <div className="delete_prview_image">
                    <button onClick={() => handleDeletePreviewImage('imageFromServe', index)}>
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                    </button>
                </div>
            </div>
        )
    })

    const renderCheckBoxSize = checkBoxSizeDefault.map((item, index) =>
        <div key={index}>
            <input type="checkbox" id={`${item}`} className="checkbox_sizes"  
                name="checkboxSize"
                value={`${item}`}
                checked={infoUpdateProduct.checkboxSize.includes(`${item}`)}
                onChange={handleInputInfoUpdateProduct_checkbox}
            ></input>
            <label for={`${item}`}>{item}</label> 
        </div> 
    )

    return (
        <div>
            <div>
                <button onClick={handleTurnBack}>turn back</button>
                <div class="icon-update">
                    <span>
                        <FontAwesomeIcon class="fa-solid fa-pen-to-square" icon={faPenToSquare} ></FontAwesomeIcon>
                    </span>
                </div>
                <h2>Thêm sản phẩm</h2>
                <div class="col-auto"></div>
                <div class="body_box container col-lg-7">
                    
                    <div class="address_update" id="address_update">
                        <div class="row mb-2">
                            <div class="col-12">
                                {/* <label for="#" class="form-label">Tên sản phẩm</label> */}
                                <input 
                                    type="text" class="form-control" placeholder="Nhập tên sản phẩm" 
                                    onChange={handleInputInfoUpdateProduct} 
                                    name="nameProduct" 
                                    value={infoUpdateProduct.nameProduct}
                                />
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-12 input_gia">
                                <div class="input_gia_div">
                                    {/* <label for="#" class="form-label">Giá niêm yết</label> */}
                                    <input 
                                        type="text" class="form-control" placeholder="Giá niêm yết" 
                                        onChange={handleInputInfoUpdateProduct}
                                        name="originPrice"  
                                        value={infoUpdateProduct.originPrice}
                                    />
                                </div>
                                <div class="input_gia_div">
                                    {/* <label for="#" class="form-label">Giá bán</label> */}
                                    <input 
                                        type="text" class="form-control" placeholder="Giá bán" 
                                        onChange={handleInputInfoUpdateProduct}
                                        name="sellPrice"   
                                        value={infoUpdateProduct.sellPrice}
                                    />
                                </div>
                            </div> 
                        </div>
                        <div class="row mb-3">
                            <div class="col-4">
                                <label for="#" class="form-label">Phân loại</label>
                                <select class="form-select" required
                                    onChange={handleInputInfoUpdateProduct}
                                    name="typeProduct"
                                    value={infoUpdateProduct.typeProduct}
                                >
                                <option selected value="1">Nam</option>
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
                                    {renderCheckBoxSize} 
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
                                { renderPreViewImageFromImgUrl }
                                { renderPreViewImage }
                            </div>
                        </div>

                        <textarea 
                            id="w3review" name="desctiption" rows="4" cols="80"
                            value={infoUpdateProduct.desctiption} 
                            onChange={handleInputInfoUpdateProduct}
                        >
                            At w3schools.com you will learn how to make a website.
                            They offer free tutorials in all web development technologies.
                        </textarea>

                        <div class="address_update_button_contain row">
                            <div class={`${statusPressUpdateProduct ? '' : 'display_hidden'}`}>
                                <button class={`address_confirm_button btn btn-dark`} onClick={handleClickUpdateProduct}>Thêm sản phẩm</button>
                                <button class="address_cancel_button btn btn-outline-secondary">Hủy</button>
                            </div> 
                        </div>
                    </div> 
                    
                </div>
                <div class="col-auto"></div>
            </div>
            <div>
                <h2>Nhập số lượng</h2>

                <div className="displayhidden">hi</div>
                <div className="">ba</div>
                <div class="col-auto"></div>
                <div class="body_box container col-lg-7">
                    {renderInputSoLuong} 
                </div>
                
                <div class="col-auto"></div>

            </div>
        </div>
    )
}

export default UpdateProduct;