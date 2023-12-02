import "./AddVoucher.css"
import 'bootstrap';
import request from "../../../utils/request";
 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faL, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';

function AddVoucher(){
    //NHỮNG THỨ CẦN XỬ LÝ TRONG TRANG addVoucher - thêm sản phẩm của admin
    // 1.hiển thị giao diện các ô input nhập thông tin sản phẩm, input chọn size, chọn màu, nhập số lượng sp, chọn ảnh
    // 2.Xử lý hiển thị ảnh preview, xoá, chọn thêm ảnh
    // 3.xử lý lưu thông tin sản phẩm và hình ảnh xuống db


    // statusPressAddVoucher = true thì hiện nút thêm sản phẩm
    const [statusPressAddVoucher, setStatusPressAddVoucher] = useState(true);
    let i = 0;
    //chứa danh sách màu lấy từ db
    const [listColor, setListColor] = useState([]);
    const [listQuantity, setListQuantity] = useState([]);
    //mã hex để hiện thị màu sắc lấy thực thuộc tính hex trong bảng mausacs
    const [listHEX, setListHEX] = useState([]);
    const [infoAddNewVoucher, setInfoAddNewVoucher] = useState({
        showNameVoucher: '',
        minOrderValue: 0,
        maxDecreaseMoney: 50000,
        typeVoucher: '',
        desctiption: '', 
        quantityUse: 0, 
        startDate: '',
        endDate: '',
        decreasePersent: 0,
    }); 
    //lưu thông tin ảnh sẽ lưu xuống DB
    const [images, setImages] = useState([]);

    //lưu thông tin ảnh sẽ hiển thị preview
    const [previewImages, setPreviewImages] = useState([]);

    //xử lý nhập thông tin sản phẩm
    const handleInputInfoAddNewVoucher = (e) => {
        e.persist();
        let {value, name} = e.target;
        if(name === 'decreasePersent') value = parseFloat(value)
        setInfoAddNewVoucher({...infoAddNewVoucher, [name]: value});
        console.log(name + "fff " + typeof(value));
    }

    //xử lý nhập tt sp với các checkbox
    const handleInputInfoAddNewVoucher_checkbox = (e) => {
        e.persist();
        var name = e.target.name;
        var value = e.target.value;
        if(infoAddNewVoucher[name].includes(value)){
            setInfoAddNewVoucher({...infoAddNewVoucher, [name]: infoAddNewVoucher[name].filter(item => item !== value)});
            console.log(infoAddNewVoucher); 
        }
        else{
            setInfoAddNewVoucher({...infoAddNewVoucher, [name]: [...infoAddNewVoucher[name], value]})
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
    const handleClickAddVoucher = () => {

        //sử dụng formData để nhét hình ảnh và thông tin vào một cục rồi đẩy xuống db
        const formData = new FormData();
        // for(const img of images){
        //     //images[] phải đặt tên như v thì laravel mới nhận ra đây là array với tên là images
        //     //xuống laravel dùng $images = $request->file('images');
        //     formData.append('images[]', img);//thêm image vào formdata
        // }
        //thêm thông tin infoAddNewVoucher vào form data, vì đây là một đối tượng nên cần stringify
        formData.append('infoAddNewVoucher', JSON.stringify(infoAddNewVoucher)); 

        // setStatusPressAddVoucher(!statusPressAddVoucher);
        // call api để lưu thông tin, dùng để lưu 'Content-Type': 'multipart/form-data' vì có dùng thêm hình ảnh
        request.post(`api/addVoucher`, formData, {
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

    const getInfoForAddVoucher = () => {
        // request.get('api/getInfoForAddVoucher')
        // .then(res => {
        //     setListColor(res.data.listColor);
        //     console.log(res.data.listColor, "ok");
        // })
        // .catch(error =>{
        //     console.log(error)
        // })
    }

    //chọn một ảnh làm thumnail
    const handleChooseThumnail = (e) =>{
        setInfoAddNewVoucher({...infoAddNewVoucher, [e.target.name]: e.target.value}); 
        console.log(infoAddNewVoucher.indexThumnail);
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
        getInfoForAddVoucher();
        console.log('color') 
    }, [])
 

    const renderListColor = listColor.map((item) => {
        return (
            <div className="list_checbox_color_item">
                <input 
                    type="checkbox" id={item.MAMAU} className="checkbox_sizes" 
                    name="checkboxColor"
                    value={item.MAMAU}
                    checked={infoAddNewVoucher.checkboxColor.includes(`${item.MAMAU}`)}
                    onChange={handleInputInfoAddNewVoucher_checkbox}
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
                <h2>Thêm Voucher</h2>
                <div class="col-auto"></div>
                <div class="body_box container col-lg-7">
                    
                    <div class="address_update" id="address_update">
                        <div class="row mb-2">
                            <div class="input_ten_div">
                                {/* <label for="#" class="form-label">Tên sản phẩm</label> */}
                                <input 
                                    type="text" class="form-control " placeholder="Mã voucher" 
                                    onChange={handleInputInfoAddNewVoucher} 
                                    name="showNameVoucher" 
                                    value={infoAddNewVoucher.showNameVoucher}
                                />
                            </div>
                        </div>
                        
                        <div class="row mb-3 phanLoai_chooseGiaTriGiam">
                            <div class="col-4">
                                <label for="#" class="form-label">Phân loại</label>
                                <select class="form-select" required
                                    onChange={handleInputInfoAddNewVoucher}
                                    name="typeVoucher"
                                    value={infoAddNewVoucher.typeVoucher} 
                                >
                                <option selected value=""></option>
                                <option value="Đơn hàng">Đơn hàng</option>
                                <option value="Vận chuyển">Vận chuyển</option> 
                                </select>
                            </div> 
                            <div class="col-4">
                                <label for="#" class="form-label">Phần trăm giảm</label>
                                <select class="form-select" required
                                    onChange={handleInputInfoAddNewVoucher}
                                    name="decreasePersent"
                                    value={infoAddNewVoucher.decreasePersent} 
                                >
                                    <option selected value="0"></option>
                                    <option value="0.05">5%</option>
                                    <option value="0.1">10%</option> 
                                </select>
                            </div> 
                        </div>
                        <div className="row mb-3 phanLoai_chooseGiaTriGiam">
                            <div class="col-4 inputDate">
                                <label className="form-label">Ngày bắt đầu</label> 
                                <input 
                                    type="date" 
                                    name="startDate" 
                                    className="form-control widthInputDate"
                                    onChange={handleInputInfoAddNewVoucher}
                                    value={infoAddNewVoucher.startDate}  
                                ></input>
                            </div>
                            <div class="col-4 inputDate">
                                <label className="form-label">Ngày hết hạn</label>
                                <input 
                                    type="date" 
                                    name="endDate" 
                                    className="form-control widthInputDate"
                                    onChange={handleInputInfoAddNewVoucher}
                                    value={infoAddNewVoucher.endDate}
                                ></input>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-12 input_gia">
                                <div class="col-4 inputDate">
                                    <label for="#" class="form-label">Giá trị đơn hàng tối thiểu</label>
                                    <input 
                                        type="text" class="form-control widthInputDate" placeholder="Giá trị đơn hàng tối thiểu" 
                                        onChange={handleInputInfoAddNewVoucher}
                                        name="minOrderValue"  
                                        value={infoAddNewVoucher.minOrderValue}
                                    />
                                </div>
                                <div class="col-4 inputDate">
                                    <label for="#" class="form-label">Giá trị giảm tối đa</label>
                                    <input 
                                        type="text" class="form-control widthInputDate" placeholder="Tiền giảm tối đa" 
                                        onChange={handleInputInfoAddNewVoucher}
                                        name="maxDecreaseMoney"   
                                        value={infoAddNewVoucher.maxDecreaseMoney}
                                    />
                                </div>
                            </div> 
                        </div>
                        <div className="row mb-3 phanLoai_chooseGiaTriGiam">
                                <label className="form-label">Số lần sử dụng</label>
                            <div class="col-6 soLanSuDungDiv">
                                <input 
                                    type="text" class="form-control" placeholder="Số lần sử dụng" 
                                    onChange={handleInputInfoAddNewVoucher}
                                    name="quantityUse"  
                                    value={infoAddNewVoucher.quantityUse}
                                />
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
                            value={infoAddNewVoucher.desctiption} 
                            onChange={handleInputInfoAddNewVoucher}
                        >
                            At w3schools.com you will learn how to make a website.
                            They offer free tutorials in all web development technologies.
                        </textarea>

                        
                    </div> 
                    
                </div>
                <div class="col-auto"></div>
            </div> 
            <div class="address_update_button_contain row">
                <div class={`${statusPressAddVoucher ? '' : ''}`}>
                    <button class={`address_confirm_button btn btn-dark`} onClick={handleClickAddVoucher}>Thêm voucher</button>
                    <button class="address_cancel_button btn btn-outline-secondary">Hủy</button>
                </div> 
            </div>
        </div>
    )
}

export default AddVoucher;