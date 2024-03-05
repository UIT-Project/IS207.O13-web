 
import 'bootstrap';
import request from "../../../../utils/request";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import {  faCircleChevronLeft, faFloppyDisk, faL, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import CurrencyInput from 'react-currency-input-field';

import useAuthCheck from "../../AuthCheckLogin/AuthCheckLogin";

function InputInfoProduct({nameFunction, functionSaveInfo, isEmpty, isUpdating, setIsUpdating}){
    
    const {formatPrice, listSizeToCheck} = useGlobalVariableContext(); 
    const nameFunctionIs = {
        add: 'add',
        update: 'update'
    }
    // statusPressAddProduct = true thì hiện nút thêm sản phẩm
    const [listDetailCategory2, setListDetailCategory2] = useState([])
    const [statusPressAddProduct, setStatusPressAddProduct] = useState(true);
    let i = 0;
    //chứa danh sách màu lấy từ db
    const [listColor, setListColor] = useState([]); 
    const [watchProductDetail, setWatchProductDetail] = useState(false);
    const Navigate = useNavigate();
    const [infoProductDetail, setInfoProductDetail] = useState({
        dataProductDetail_sanphams: [],
        dataProductDetail_sanpham_mausac_sizes__sizes: [],
        dataProductDetail_sanpham_mausac_sizes__colors: [], 
        dataProductDetail_sanpham_mausac_sizes__hinhanhs: [],
    })
    const searchParams  = new URLSearchParams(window.location.search);
    // const [checkBoxSizeDefault, setCheckBoxSizeDefault] = useState(["S", "M", "L", "XL", "XXL", "3XL"]);
           
    const [infoProduct, setInfoProduct] = useState({
        nameProduct: '',
        originPrice: '',
        sellPrice: '',
        typeProduct: '',
        typeProduct2: '',
        desctiption: '',
        checkboxColor: [],
        checkboxSize: [], 
        indexThumnail: 0, 
        previewImages: [], 
        listQuantity: [],
        images: [],
        imgurl: [], 
        listHEX: [],
        quantity: [],
        masp: 0,
        quantityImgurl: 0,
        mahinhanh: 0,
        indexThumnail: 0,
        maHinhAnhDeleted: [],
    });  
    useEffect(() => {   
        console.log("thay đổi masp")
        const masp = searchParams.get('masp');
        if(masp !== null){ 
            handleWatchProductDetail('default but don;t use', searchParams.get('masp'))
        }   
        // else    
        //     setWatchProductDetail(false);
    }, [window.location.search]);
    
    const handleWatchProductDetail = (item, masp) => {
        getInforProductDetail(masp); 
        getInfoListColor();//color
        console.log(item);
    }

    const getInforProductDetail = (masp) => {
        const data = {
            masp: masp,
        } 
        request.get(`/api/infoProductDetail`, {params: data})
        .then(res => {   
            console.log(res.data.dataProductDetail_sanphams[0].GIAGOC, 'ok')
             
            console.log(parseInt(res.data.indexthumnail), 'test 00000'); 
            setInfoProductDetail({
                dataProductDetail_sanphams: res.data.dataProductDetail_sanphams,
                dataProductDetail_sanpham_mausac_sizes__sizes: res.data.dataProductDetail_sanpham_mausac_sizes__sizes,
                dataProductDetail_sanpham_mausac_sizes__colors: res.data.dataProductDetail_sanpham_mausac_sizes__colors, 
                dataProductDetail_sanpham_mausac_sizes__hinhanhs: res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs,
            })
            

            var updatedList = []  
            res.data.dataProductDetail_sanpham_mausac_sizes__sizes.forEach(itemSize => {
                res.data.dataProductDetail_sanpham_mausac_sizes__colors.forEach(itemColor => {
                    res.data.dataProductDetail_sanpham_mausac_sizes__soluongs.forEach(itemSoluong => {
                        if(itemSoluong.HEX === itemColor.HEX && itemSoluong.MASIZE === itemSize.MASIZE){
                            updatedList = [
                                ...updatedList,
                                { 
                                    mamau: itemColor.MAMAU,
                                    maSize: itemSize.MASIZE,
                                    soluong: itemSoluong.SOLUONG 
                                }
                            ]  
                        } 
                    })
                })
            })
 
            console.log(
                updatedList, 
                res.data.dataProductDetail_sanpham_mausac_sizes__colors, 
                "nhập số lượng", 
                res.data.dataProductDetail_sanpham_mausac_sizes__soluongs, 
                res.data.dataProductDetail_sanpham_mausac_sizes__colors
            )   
            setInfoProduct({
                ...infoProduct,
                nameProduct: res.data.dataProductDetail_sanphams[0].TENSP,
                originPrice: res.data.dataProductDetail_sanphams[0].GIAGOC,
                sellPrice: res.data.dataProductDetail_sanphams[0].GIABAN,
                typeProduct: res.data.dataProductDetail_sanphams[0].MAPL_SP,
                typeProduct2: res.data.dataProductDetail_sanphams[0].MAPL_SP2,
                desctiption: res.data.dataProductDetail_sanphams[0].MOTA, 
                checkboxSize:  res.data.dataProductDetail_sanpham_mausac_sizes__sizes.map(item => item.MASIZE),
                imgurl:  res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs.map(item => item.imgURL),
                listHEX:  res.data.dataProductDetail_sanpham_mausac_sizes__colors.map(item => item.HEX),
                quantity: res.data.dataProductDetail_sanpham_mausac_sizes__soluongs,
                checkboxColor:  res.data.dataProductDetail_sanpham_mausac_sizes__colors.map(item => item.MAMAU),
                masp: masp,
                quantityImgurl: res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs.length,
                mahinhanh:  res.data.dataProductDetail_sanpham_mausac_sizes__hinhanhs.map(item => item.MAHINHANH),
                indexThumnail: parseInt(res.data.indexthumnail) - 1,
                listQuantity: updatedList,
            }) 
        })
    };

    //xử lý nhập thông tin sản phẩm
    const handleInputInfoProduct = (e) => {
        e.persist();
        let {value, name} = e.target; 
        const regex_ChiNhapSo = /^\d*$/;
        if((name === 'originPrice' || name === 'sellPrice') && regex_ChiNhapSo.test(value)){
            setInfoProduct({...infoProduct, [e.target.name]: e.target.value});
        } 
        else if( name === 'typeProduct' || name === 'typeProduct2' ){
            console.log(e.target.name + " " + e.target.value, 'okojjj');
            setInfoProduct({...infoProduct, [e.target.name]: value !== "" ? parseInt( e.target.value) : ''}); 

        }
        else if(
            name === 'nameProduct' || 
            name === 'desctiption' || 
            name === 'checkboxColor' ||
            name === 'checkboxSize' ||
            name === 'indexThumnail'
        ){
            setInfoProduct({...infoProduct, [e.target.name]: e.target.value});
        }
    }

    const handleInputInfoProduct_vnd = (value, name) => { 
        const regex_ChiNhapSo = /^\d*$/;
        console.log(value, 'value')
        if (value === undefined ) {
            value = 0; // Gán giá trị là '0' khi không còn giá trị nào trong trường input
        }
        if((name === 'originPrice' || name === 'sellPrice') && regex_ChiNhapSo.test(value)){
            setInfoProduct({...infoProduct, [name]: value});
        }  
    }

    //xử lý nhập tt sp với các checkbox
    const handleInputInfoProduct_checkbox = (e) => {
        e.persist();
        var name = e.target.name;
        var value = e.target.value;
        if(infoProduct[name].includes(value)){
            setInfoProduct({...infoProduct, [name]: infoProduct[name].filter(item => item !== value)});
            console.log(name, 'name'); 
        }
        else{ 
            if(name === 'checkboxColor')
                value = parseInt(value)
            setInfoProduct({...infoProduct, [name]: [...infoProduct[name], value]})
        }   
    }

    const handleInputInfoProduct_checkboxUpdate = (e) => {
        e.persist();
        var name = e.target.name;
        var value = e.target.value;
        
        let update = [...infoProduct.listQuantity] 
        if(name === 'checkboxColor'){
            value = parseInt(value)
            infoProduct.checkboxSize.forEach(itemSize => {
                update = [
                    ...update,
                    { mamau: value, maSize: itemSize, soluong: 0}
                ]  
            })   
        }
        else if(name === 'checkboxSize'){ 
            infoProduct.checkboxColor.forEach(itemColor => {
                update = [
                    ...update,
                    { mamau: itemColor, maSize: value, soluong: 0}
                ]  
            })  
        }
        // setListQuantity(update)
        console.log(update, 'update2222222222', name)
        if(infoProduct[name].includes(value)){
            setInfoProduct({
                ...infoProduct, 
                [name]: infoProduct[name].filter(item => item !== value),
                listQuantity: update,
            }); 
        }
        else{
            setInfoProduct({
                ...infoProduct, 
                [name]: [...infoProduct[name], value],
                listQuantity: update,
            })
        }   
    }

    //xử lý nhập ảnh, chọn ảnh từ máy client
    //xử lý theo async, chờ upload hết ảnh mới hiển thị, không thì sẽ hiển thị sai
    const handleClickUploadImage = async (e) => {
        const fileImages = e.target.files; 
        // setInfoProduct({...infoProduct, images: [...infoProduct.images, ...fileImages]}); 
        const containFileImagesToRead = [...infoProduct.previewImages] 

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
        console.log('image', infoProduct.images, fileImages)
        setInfoProduct({...infoProduct, 
            previewImages: containFileImagesToRead,
            images: [...infoProduct.images, ...fileImages]
        }); 
    }

    const handleClickUploadImageUpdate = async (e) => {
        const fileImages = e.target.files; 
        console.log('image dsac22', infoProduct.images, fileImages)

        const containFileImagesToRead = [...infoProduct.previewImages] 

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
 
        setInfoProduct(
            {
                ...infoProduct, 
                previewImages: containFileImagesToRead,
                images: [...infoProduct.images, ...fileImages]
            }
        );
    }

    //xử lý lưu tt sp, hình ảnh sp xuống db khi click vào thêm sản phẩm
    
    const getInfoListColor = () => {
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
        setInfoProduct({...infoProduct, [e.target.name]:  parseInt(e.target.value)}); 
        console.log(infoProduct.indexThumnail);
    }
    const handleDeletePreviewImage = (type, index) => {
        if(type === 'imageFromClient'){
            const updatedImages = [...infoProduct.images];
            const updatedPreviewImages = [...infoProduct.previewImages];
        
            // // Xoá hình ảnh tại vị trí index
            updatedImages.splice(index, 1);
            updatedPreviewImages.splice(index, 1);
        
            // // Cập nhật state với các mảng đã cập nhật 
            if(index === infoProduct.indexThumnail){
                setInfoProduct({
                    ...infoProduct,  
                    indexThumnail: 0,
                    images: updatedImages,
                    previewImages: updatedPreviewImages,
                })
            }
            else if(index < infoProduct.indexThumnail && index != 0){
                const newIndexThumnail = infoProduct.indexThumnail - 1;
                setInfoProduct({ 
                    indexThumnail: newIndexThumnail,
                    images: updatedImages,
                    previewImages: updatedPreviewImages,
                })
            }
            else if(index < infoProduct.indexThumnail && index == 0){
                const newIndexThumnail = infoProduct.indexThumnail - 1;
                setInfoProduct({
                    ...infoProduct,   
                    indexThumnail: newIndexThumnail,
                    images: updatedImages,
                    previewImages: updatedPreviewImages,
                })
            } 
        }
        else if(type === 'imageFromServe'){ 
            const listDeleted = infoProduct.mahinhanh.filter((item, indexMAHINHANH) => {
                // console.log(item, "okokok", index, '  ', indexMAHINHANH)
                if(indexMAHINHANH === index){
                    console.log(item, "ok in ra")
                    return item
                }
            });
            
            infoProduct.mahinhanh.splice(index, 1);
            infoProduct.imgurl.splice(index, 1);

            // console.log(listDeleted, 'xoá nào');
            if(index === infoProduct.indexThumnail){
                setInfoProduct({
                    ...infoProduct, 
                    maHinhAnhDeleted: [
                        ...infoProduct.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoProduct.mahinhanh.length,
                    indexThumnail: 0
                })
            }
            else if(index < infoProduct.indexThumnail && index != 0){
                const newIndexThumnail = infoProduct.indexThumnail - 1;
                setInfoProduct({
                    ...infoProduct, 
                    maHinhAnhDeleted: [
                        ...infoProduct.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoProduct.mahinhanh.length,
                    indexThumnail: newIndexThumnail
                })
            }
            else if(index < infoProduct.indexThumnail && index == 0){
                const newIndexThumnail = infoProduct.indexThumnail - 1;
                setInfoProduct({
                    ...infoProduct, 
                    maHinhAnhDeleted: [
                        ...infoProduct.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoProduct.mahinhanh.length,
                    indexThumnail: newIndexThumnail
                })
            }
            else{
                setInfoProduct({
                    ...infoProduct, 
                    maHinhAnhDeleted: [
                        ...infoProduct.maHinhAnhDeleted.filter(item => item), 
                        ...listDeleted.filter(item => item)
                    ],
                    quantityImgurl: infoProduct.mahinhanh.length, 
                })
            }
  
        } 
        console.log("mã hình ảnh ", infoProduct.indexThumnail, ' ', index) 
        
    }

    const handleClickDeleteImage = (index) => {
        const updatedImages = [...infoProduct.images];
        const updatedPreviewImages = [...infoProduct.previewImages];
      
        // // Xoá hình ảnh tại vị trí index
        updatedImages.splice(index, 1);
        updatedPreviewImages.splice(index, 1);
      
        // // Cập nhật state với các mảng đã cập nhật 
        setInfoProduct({...infoProduct, 
            previewImages: updatedPreviewImages,
            images: updatedImages
        }); 
    } 

    const handleTurnBack = () => {
        setWatchProductDetail(false);
        setIsUpdating(false);
        Navigate(`/admin/manageProduct`); 
    }
    const handleClickUpdate= () => {
        setIsUpdating(true)
    }

    useEffect(() => {
        getInfoListColor(); 
    }, [])

    const getDetailCategory2 = () => {
        // const data = {
        //     typeProduct_mapl: infoProduct.typeProduct
        // }
        request.get(`api/getDetailCategory2`, {params: {typeProduct_mapl: infoProduct.typeProduct}})
        .then(res => {
            console.log(res.data.listDetailCategory2)
            setListDetailCategory2(res.data.listDetailCategory2)
        })                                                                                      
        .catch(err => {
            console.log(infoProduct.typeProduct, err)
        })
    } 
    
    useEffect(() => {
        if(infoProduct.typeProduct !== 0 && infoProduct.typeProduct !== ''){
            console.log(infoProduct.typeProduct, 'phanloai2')
            getDetailCategory2();
        }
    }, [infoProduct.typeProduct])

    const renderListColor = listColor.map((item, index) => { 
        return (
            <div className="list_checbox_color_item" key={index}>
                <input 
                    type="checkbox" id={item.MAMAU} className="checkbox_sizes" 
                    name="checkboxColor"
                    value={item.MAMAU}
                    checked={infoProduct.checkboxColor.includes(item.MAMAU)}
                    onChange={
                        nameFunction === nameFunctionIs.update 
                        ? handleInputInfoProduct_checkboxUpdate 
                        : handleInputInfoProduct_checkbox
                    } 
                    disabled={isUpdating || nameFunction === nameFunctionIs.add ? false : true}
                ></input>
                <label 
                    for={item.MAMAU}
                    className={
                        ` 
                            size_icon1 size_icon_color
                            ${infoProduct.checkboxColor.includes(item.MAMAU)
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
        const update = [...infoProduct.listQuantity];
        update[i] = e.target.value
        setInfoProduct({...infoProduct, listQuantity: update})
        console.log(infoProduct.listQuantity, "nhập số lượng add")
    }
    
    const handleInputQuantityUpdate = (e, foundIndex) => {  

        let value  = parseInt( e.target.value)
        const updatedList = infoProduct.listQuantity.map((item, index) => {
            if (index === foundIndex) {
                return { ...item, soluong: value }; // Cập nhật giá trị soluong cho phần tử cần chỉnh sửa
            }
            return item;
        });
        console.log(updatedList, "nhập số lượng", foundIndex, value) 
        setInfoProduct({...infoProduct, listQuantity: updatedList})
    }

    const renderInputQuantityUpdate = (itemColor, itemSize) => {  
        // console.log(infoProduct.listQuantity, 'llllkksdk8', i)
 
        const foundIndex = infoProduct.listQuantity.findIndex(item => item.mamau === itemColor && item.maSize === itemSize);
        // console.log(foundIndex, infoProduct.listQuantity[foundIndex], 'foundindex')
        if(foundIndex !== -1){
            return(
                <input 
                    type="text" 
                    class="form-control" 
                    placeholder="Nhập số lượng"
                    name="listQuantity" 
                    value={infoProduct.listQuantity.length > 0 ? infoProduct.listQuantity[foundIndex].soluong : ''} // Đảm bảo giá trị null hoặc undefined không gây lỗi
                    onChange={(e) => handleInputQuantityUpdate(e, foundIndex)}
                    disabled={isUpdating ? false : true} 
                />
            )
        }
    }

    const renderInputQuantity = (i) => { 
        return(
            <input 
                type="text" class="form-control" 
                placeholder="Nhập số lượng"
                name="listQuantity"
                onChange={
                    nameFunction === nameFunctionIs.add 
                    ? (e) => handleInputQuantity(e, i) 
                    : (e) => handleInputQuantityUpdate(e, i)
                }
            />
        )
    }

    //hiển thị các ô nhập số lượng sau khi nhấn button thêm sản phẩm
    const renderInputSoLuong =  infoProduct.checkboxSize.map((itemSize, index) => { 
        return (
            <div key={index}>
                <h6 className="input_quantity__size_name">
                    <span className="input_quantity__size_name_text">Size {itemSize}</span>
                </h6> 
                {
                    infoProduct.checkboxColor.map((itemColor, index) => { 
                        if(listColor.length  === 0) return
                        return(
                            <div className="input_quantity__quantity" key={index}>
                                <div className="input_quantity__product_color" style={{backgroundColor: `${listColor[itemColor - 1].HEX}`}}></div>
                                <div className='input_quantity__quantity_haved_div_width'>
                                    <span className="input_quantity__quantity_haved1">0</span>
                                </div>
                                <div class="input_gia_div">
                                        {/* <label for="#" class="form-label">Giá niêm yết</label> */} 
                                    {renderInputQuantity(++i)}    
                                </div>
                            </div> 

                        )
                    })
                }
                <span className={`red_color ${isEmpty && infoProduct.listQuantity.length !== infoProduct.checkboxColor.length * infoProduct.checkboxSize.length ? '' : 'display_hidden'}`}>Nhập số lượng trước khi lưu</span>
            </div>
        )
    })
    const renderInputQuantity_0 = (itemColor, itemSize) => {
        const foundItem_size = infoProduct.quantity.some(item => item.MASIZE === itemSize);
        const foundItem_color = infoProduct.quantity.some(item => item.HEX === `${listColor[itemColor - 1].HEX}`);
        console.log(foundItem_size, foundItem_color, 'AKSJDKJSDSK')
        if(foundItem_size === false || foundItem_color === false){ 
            return ( 
                <div className="display_flex_ee">
                    <div className="input_quantity__quantity_haved_div_width">
                        <span className="input_quantity__quantity_haved1">0</span> 
                    </div>

                    <div>
                        {/* <label for="#" class="form-label">Giá niêm yết</label> */} 
                        {renderInputQuantityUpdate(itemColor, itemSize)}                                                                
                    </div>
                </div> 
            )
        }
    }
    const renderInputQuantity_0Update = (itemColor, itemSize) => {
        const foundItem_size = infoProduct.quantity.some(item => item.MASIZE === itemSize);
        const foundItem_color = infoProduct.quantity.some(item => item.HEX === `${listColor[itemColor - 1].HEX}`);
        console.log(foundItem_size, foundItem_color, 'AKSJDKJSDSK')
        if(foundItem_size === false || foundItem_color === false){ 
            return ( 
                <div className="display_flex_ee">
                    <div className="input_quantity__quantity_haved_div_width">
                        <span className="input_quantity__quantity_haved1">0</span> 
                    </div>

                    <div> 
                        {renderInputQuantityUpdate(itemColor, itemSize)}                                                                
                    </div>
                </div> 
            )
        }
    }

    const renderInputSoLuongUpdate =  infoProduct.checkboxSize.map((itemSize, indexSize) => { 
        if(nameFunction === nameFunctionIs.add) return
        return ( 
            <div class = "info" key={indexSize}> 
                <h6 className="input_quantity__size_name">
                    <span className="input_quantity__size_name_text">Size {itemSize}</span>
                </h6> 
                {
                    infoProduct.checkboxColor.map((itemColor, indexColor) => { 
                        if(listColor.length  === 0) return
                        return(
                            <div className="input_quantity__quantity" key={indexColor}>
                                <div 
                                    className="input_quantity__product_color" 
                                    style={{
                                        backgroundColor: `${listColor.find(item => item.MAMAU === itemColor).HEX}`
                                    }}
                                ></div>
                                <div>  
                                    { 
                                        infoProduct.quantity.map((item, indexQuantity) => { 
                                            // console.log(item.HEX, item.MASIZE, 'lk12', listColor[indexQuantity].HEX, indexQuantity,  itemSize, 'oio', listColor, '0909')
                                            if(item.MAMAU === itemColor && item.MASIZE === itemSize){ 
                                                return(
                                                    <div className="display_flex_ee" key={indexQuantity}>
                                                        <div className="input_quantity__quantity_haved_div_width">
                                                            <span className="input_quantity__quantity_haved1">{item.SOLUONG}</span> 
                                                        </div>
                                                        <div> 
                                                            { renderInputQuantityUpdate(itemColor, itemSize)}                                                                
                                                        </div>
                                                    </div>
                                                ) 
                                            }  
                                        })
                                    }
                                </div> 
                                {renderInputQuantity_0Update(itemColor, itemSize) } 
                            </div> 

                        )
                    })
                }
                <span className={`red_color ${isEmpty && infoProduct.listQuantity.length !== infoProduct.checkboxColor.length * infoProduct.checkboxSize.length ? '' : 'display_hidden'}`}>Nhập số lượng trước khi lưu</span>

            </div>
        )
    })

    //hiển thị ảnh preview
    const renderPreViewImage = infoProduct.previewImages.map((image, index) =>{ 
        console.log(infoProduct.previewImages, 'ádh33rs')
        return ( 
            <div key={index} className="prview_image">
                <div>
                    <img src={nameFunction === nameFunctionIs.add ? image : image.src} key={index} width={150} height={250} className="prview_image__img"></img> 
                </div>
                <input type="radio" name="indexThumnail" value={index} onChange={handleChooseThumnail}></input>
                <div className="delete_prview_image">
                    <button 
                        className="delete_prview_image__css" 
                        onClick={nameFunction === nameFunctionIs.add ? () => handleClickDeleteImage(index) : () => handleDeletePreviewImage('imageFromClient', image.id)}
                    >
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                    </button>
                </div>
            </div>
        )
    })

    const renderPreViewImageFromImgUrl = infoProduct.imgurl.map((item, index) => {
        // console.log(item)
        return ( 
            <div key={index} className="prview_image">
                <div>
                    <img src={item} key={index} width={150} height={250} className="prview_image__img"></img> 
                    
                </div>
                <input 
                    type="radio" name="indexThumnail" value={index} 
                    onChange={handleChooseThumnail}
                    checked={(infoProduct.indexThumnail) === index}
                ></input>
                <div className="delete_prview_image">
                    <button  
                        className="delete_prview_image__css" 
                        onClick={() => handleDeletePreviewImage('imageFromServe', index)}
                        disabled={isUpdating || nameFunction === nameFunctionIs.add ? false : true}
                    >
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                    </button>
                </div>
            </div>
        )
    })

    const renderListDetailCategory2 = listDetailCategory2.map((item, index) => 
        <option value={item.MAPL2} key={index}>{item.TENPL2}</option> 
    )

    const renderCheckBoxSize = listSizeToCheck.map((item, index) =>
        <div key={index} className="choose_size__div__item">
            <input 
                type="checkbox" id={`${item}`} 
                className="checkbox_sizes"  
                name="checkboxSize"
                value={`${item}`}
                checked={infoProduct.checkboxSize.includes(`${item}`)}
                onChange={
                    nameFunction === nameFunctionIs.update 
                    ? handleInputInfoProduct_checkboxUpdate 
                    : handleInputInfoProduct_checkbox
                } 
                disabled={isUpdating || nameFunction === nameFunctionIs.add ? false : true}
            ></input>
            <label 
                for={`${item}`} 
                className={
                    `
                        size_icon1 
                        ${infoProduct.checkboxSize.find(itemChecked => itemChecked === item) 
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
            <div class="body_box container col-lg-7"> 
                <div class="address_update" id="address_update">
                    <div class="row mb-2" id="roww">
                        <div class="input_ten_div_product">
                            <label for="#" class="form-label">Tên sản phẩm</label>
                            <input 
                                type="text" class="form-control" placeholder="Nhập tên sản phẩm" 
                                onChange={handleInputInfoProduct} 
                                name="nameProduct" 
                                value={infoProduct.nameProduct}
                                disabled={isUpdating || nameFunction === nameFunctionIs.add ? false : true}
                            />
                            <span className={`red_color ${isEmpty && infoProduct.nameProduct === '' ? '' : 'display_hidden'}`}>Nhập tên sản phẩm trước khi lưu</span>
                        </div>
                    </div>
                    <div class="row mb-2" id="roww">
                        <div class="col-12 input_gia_product">
                            <div class="input_gia_div_product">
                                
                                <label for="##" class="form-label">Giá niêm yết</label> 
                                {/* <input 
                                    type="text" class="form-control width_gia" placeholder="Giá niêm yết" 
                                    onChange={handleInputInfoProduct}
                                    name="originPrice"  
                                    value={infoProduct.originPrice}
                                />   */}
                                <CurrencyInput
                                    className="form-control width_gia"
                                    placeholder="Giá niêm yết"
                                    onValueChange={(value, name) => handleInputInfoProduct_vnd(value, name)}
                                    name="originPrice"
                                    value={infoProduct.originPrice}
                                    allowNegativeValue={false} // Tùy chọn, để không cho phép giá trị âm
                                    decimalSeparator="," // Phân cách phần thập phân
                                    groupSeparator="." // Phân cách hàng nghìn
                                    suffix=" VND" // Đơn vị tiền tệ
                                    disabled={isUpdating || nameFunction === nameFunctionIs.add ? false : true}
                                />
                                <span className={`red_color ${isEmpty && infoProduct.originPrice === '' ? '' : 'display_hidden'}`}>Nhập giá niêm yết trước khi lưu</span>
                            </div>
                            <div class="input_gia_div_product">
                                <label for="##" class="form-label">Giá bán</label>
                                {/* <input 
                                    type="text" class="form-control width_gia" placeholder="Giá bán" 
                                    onChange={handleInputInfoProduct}
                                    name="sellPrice"   
                                    value={infoProduct.sellPrice}
                                /> */}
                                <CurrencyInput
                                    className="form-control width_gia"
                                    placeholder="Giá bán"
                                    onValueChange={(value, name) => handleInputInfoProduct_vnd(value, name)}
                                    name="sellPrice"
                                    value={infoProduct.sellPrice}
                                    allowNegativeValue={false} // Tùy chọn, để không cho phép giá trị âm
                                    decimalSeparator="," // Phân cách phần thập phân
                                    groupSeparator="." // Phân cách hàng nghìn
                                    suffix=" VND" // Đơn vị tiền tệ
                                    disabled={isUpdating || nameFunction === nameFunctionIs.add ? false : true}
                                />
                                <span className={`red_color ${isEmpty && infoProduct.sellPrice === '' ? '' : 'display_hidden'}`}>Nhập giá bán trước khi lưu</span>

                            </div>
                            
                        </div> 
                        <span className={`red_color ${parseInt(infoProduct.originPrice) < parseInt(infoProduct.sellPrice) ? '' : 'display_hidden'}`}>Giá bán phải nhỏ hơn hoặc = giá niêm yết</span>

                    </div>
                    <div class="row mb-3" id="roww">
                        <div class="col-6 category-form">
                            <label for="#" class="form-label">Phân loại</label>
                            <select class="form-select" required
                                onChange={handleInputInfoProduct}
                                name="typeProduct"
                                value={infoProduct.typeProduct} 
                                disabled={isUpdating || nameFunction === nameFunctionIs.add ? false : true}
                            >
                            <option selected value="">-- Chọn phân loại --</option>
                            <option value="1">Nam</option>
                            <option value="2">Nữ</option>
                            <option value="3">Trẻ em</option>
                            </select>
                            <span className={`red_color ${isEmpty && infoProduct.typeProduct === '' ? '' : 'display_hidden'}`}>Hãy chọn phân loại</span>
                        </div> 
                        <div class="col-6 category-form">
                            <label for="#" class="form-label">Danh mục</label>
                            <select class="form-select" required
                                onChange={handleInputInfoProduct}
                                name="typeProduct2"
                                value={infoProduct.typeProduct2} 
                                disabled={isUpdating || nameFunction === nameFunctionIs.add ? false : true}
                            >
                                <option selected value="">-- Chọn danh mục --</option>
                                {renderListDetailCategory2}
                            </select>
                            <span className={`red_color ${isEmpty && infoProduct.typeProduct2 === '' ? '' : 'display_hidden'}`}>Hãy chọn phân loại sản phẩm chi tiết</span>

                        </div> 
                    </div>

                    <div className="row" id ="roww">
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
                    <span className={`red_color ${isEmpty && infoProduct.checkboxSize.length === 0 ? '' : 'display_hidden'}`}>Hãy chọn size</span>

                    <div className="row" id="roww">
                        <div className="col-5 choose_size">
                            <div>
                                <label>Chọn các loại màu</label>
                            </div>
                            <div className="list_checbox_color">
                                {renderListColor} 
                            </div>
                        </div>
                    </div>
                    <span className={`red_color ${isEmpty && infoProduct.checkboxColor.length === 0 ? '' : 'display_hidden'}`}>Hãy chọn màu</span>

                        <span>Chọn ảnh sản phẩm</span>
                    <div>
                        <input 
                            type="file" 
                            className="inputfile inputfile-3" 
                            id="file-3" 
                            multiple 
                            name="image" 
                            accept="image/*" 
                            onChange={
                                nameFunction === nameFunctionIs.update 
                                ? handleClickUploadImageUpdate 
                                : handleClickUploadImage
                            }
                            disabled={isUpdating || nameFunction === nameFunctionIs.add ? false : true}
                        ></input>
                        <label for="file-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg> 
                            <span>Choose a file&hellip;</span>
                        </label>
                        <div>
                            <span className={`red_color 
                                ${
                                    isEmpty && infoProduct.previewImages.length === 0 && nameFunction === nameFunctionIs.add
                                    ||
                                    isEmpty && infoProduct.previewImages.length === 0 && infoProduct.imgurl.length === 0 && nameFunction === nameFunctionIs.update
                                    ? '' 
                                    : 'display_hidden'
                                }
                            `}>
                                Chọn ảnh và ảnh thumnail trước khi lưu
                            </span>
                        </div>

                        
                        <div className="renderPreViewImage">
                            { renderPreViewImageFromImgUrl }
                            { renderPreViewImage }
                        </div>
                    </div>

                    <div>
                        <span>Mô tả sản phẩm</span>
                        <textarea 
                            id="w3review" name="desctiption" rows="4" cols="80"
                            className="w3review" placeholder="Nhập mô tả sản phẩm"
                            value={infoProduct.desctiption} 
                            onChange={handleInputInfoProduct}
                            disabled={isUpdating || nameFunction === nameFunctionIs.add ? false : true}
                        > 
                    </textarea>
                    </div>

                    <span className={`red_color ${isEmpty && infoProduct.desctiption === '' ? '' : 'display_hidden'}`}>Nhập mô tả trước khi lưu</span>

                </div>  
            </div>
            <div class={`${statusPressAddProduct ? '' : 'display_hidden'}`}>
                <h2>Nhập số lượng</h2> 
                <div class="col-auto"></div>
                <div class="body_box container col-lg-7">
                    {nameFunction === nameFunctionIs.update ? renderInputSoLuongUpdate : renderInputSoLuong} 
                </div>
                
                <div class="col-auto"></div> 
            </div>
            <div class="col-auto"></div>
            <div class="address_update_button_contain row">
                <div class={`${statusPressAddProduct ? '' : ''}`}>
                    <button class={`address_confirm_button btn btn-dark`} onClick={() => functionSaveInfo(infoProduct)}>
                        <FontAwesomeIcon icon={faFloppyDisk} className="add_product_save"></FontAwesomeIcon>
                        {nameFunction === nameFunctionIs.add ? 'Thêm' : 'Cập nhật'}
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
export default InputInfoProduct;