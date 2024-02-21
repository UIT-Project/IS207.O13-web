import "./SearchInPageManage.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react'; 
import { useState } from "react"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SearhInPageManage({infoSearchOption, handleSearch})
{ 
    const [infoSearchSendRequest, setInfoSearchSendRequest] = useState({
        keySearchSendRequest: '',
        typeSearchSendRequest: infoSearchOption[0].value,
    })

    const handleSearchInput = (e) => {  
        setInfoSearchSendRequest({
            ...infoSearchSendRequest,
            [e.target.name]: e.target.value
        })
    } 

    const renderSearchOption = infoSearchOption.map((item, index) => 
        <option 
            key={index} 
            class="searchOption" 
            selected={index === 0 ? 'selected' : null} 
            value={item.value}
        >
            {item.show}
        </option>
    )

    return (
        <div className="div_search">
            <div>
                Tìm kiếm: 
            </div>
            <div>
                <input 
                    name="keySearchSendRequest"
                    onChange={handleSearchInput} 
                    className="keySearch"
                    placeholder="Nhập nội dung tìm kiếm"
                ></input> 
            </div>
            <div class="col-2 width_search"> 
                <select class="form-select width_formselect_manageProduct" required
                    onChange={handleSearchInput}
                    name="typeSearchSendRequest"
                    // value={typeSearchParams} 
                >  
                {renderSearchOption}
                </select>
            </div> 
            <button onClick={() => handleSearch(infoSearchSendRequest)}>
                <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon> 
            </button>
        </div>
    )
} 
export default SearhInPageManage;    