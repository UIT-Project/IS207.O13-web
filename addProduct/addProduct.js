import "./addProduct.css"
import 'bootstrap';
import * as request from "../../../utils/request";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faL, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';

function AddProduct(){

    // statusPressAddProduct = true thì hiện nút thêm sản phẩm
    const [statusPressAddProduct, setStatusPressAddProduct] = useState(true);
    const [infoAddNewProduct, setInfoAddNewProduct] = useState({
        nameProduct: '',
        originPrice: '',
        sellPrice: '',
        typeProduct: '',
        desctiption: '',
        checkboxColor: [],
        checkboxSize: [],
    });

    const handleInputInfoAddNewProduct = (e) => {
        e.persist();
        setInfoAddNewProduct({...infoAddNewProduct, [e.target.name]: e.target.value});
    }

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

    const handleClickAddProduct = () => {
        setStatusPressAddProduct(!statusPressAddProduct);
        request.post("api/addProduct", infoAddNewProduct)
        .then(res => {
            console.log("ok");
        })
        .catch(error => {
            console.log(error);
        })
    }

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
                                <option selected value="">Nam</option>
                                <option value="">Nữ</option>
                                <option value="">Trẻ em</option>
                                </select>
                            </div> 
                        </div>

                        <div className="row">
                            <div className="col-5 choose_size">
                                <div>
                                    <label>Chọn các loại size</label>
                                </div>
                                <div>
                                    <input type="checkbox" id="size_s" className="checkbox_sizes"  
                                        name="checkboxSize"
                                        value="size_s"
                                        checked={infoAddNewProduct.checkboxSize.includes("size_s")}
                                        onChange={handleInputInfoAddNewProduct_checkbox}
                                    ></input>
                                    <label for="size_s">S</label>

                                    <input 
                                        type="checkbox" id="size_m" className="checkbox_sizes" 
                                        name="checkboxSize"
                                        value="size_m"
                                        checked={infoAddNewProduct.checkboxSize.includes("size_m")}
                                        onChange={handleInputInfoAddNewProduct_checkbox}
                                    ></input>
                                    <label for="size_m">M</label>

                                    <input type="checkbox" id="size_l" className="checkbox_sizes" name="checkbox_sizes"></input>
                                    <label for="size_l">L</label>

                                    <input type="checkbox" id="size_xl" className="checkbox_sizes" name="checkbox_sizes"></input>
                                    <label for="size_xl">XL</label>

                                    <input type="checkbox" id="size_xxl" className="checkbox_sizes" name="checkbox_sizes"></input>
                                    <label for="size_xxl">XXL</label> 
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-5 choose_size">
                                <div>
                                    <label>Chọn các loại màu</label>
                                </div>
                                <div>
                                    <input 
                                        type="checkbox" id="mau1" className="checkbox_sizes" 
                                        name="checkboxColor"
                                        value="mau1"
                                        checked={infoAddNewProduct.checkboxColor.includes("mau1")}
                                        onChange={handleInputInfoAddNewProduct_checkbox}
                                    ></input>
                                    <label for="mau1">
                                        <div className="checkbox_color" style={{backgroundColor: "blue"}}></div>
                                    </label>

                                    <input 
                                        type="checkbox" id="mau2" className="checkbox_sizes" 
                                        name="checkboxColor"
                                        value="mau2"
                                        checked={infoAddNewProduct.checkboxColor.includes("mau2")}
                                        onChange={handleInputInfoAddNewProduct_checkbox}
                                    ></input>
                                    <label for="mau2">
                                        <div className="checkbox_color" style={{backgroundColor: "black"}}></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <textarea id="w3review" name="w3review" rows="4" cols="80">At w3schools.com you will learn how to make a website.
                            They offer free tutorials in all web development technologies.</textarea>

                        <div class="address_update_button_contain row">
                            <div class={`${statusPressAddProduct ? '' : 'display_hidden'}`}>
                                <button class={`address_confirm_button btn btn-dark`} onClick={handleClickAddProduct}>Thêm sản phẩm</button>
                                <button class="address_cancel_button btn btn-outline-secondary">Hủy</button>
                            </div> 
                        </div>
                    </div> 
                    
                </div>
                <div class="col-auto"></div>
            </div>
            <div>
                <h2>Nhập số lượng</h2>

                <div class="col-auto"></div>
                <div class="body_box container col-lg-7">
                    <div>
                        <h6 className="input_quantity__size_name">Size S</h6>
                        <div className="input_quantity__quantity">
                            <div className="input_quantity__product_color" style={{backgroundColor: "blue"}}></div>
                            <div>
                                <span className="input_quantity__quantity_haved">0</span>
                            </div>
                            <div class="input_gia_div">
                                    {/* <label for="#" class="form-label">Giá niêm yết</label> */}
                                    <input type="text" class="form-control" placeholder="Nhập số lượng"/>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="col-auto"></div>

            </div>
        </div>
    )
}

export default AddProduct;