import "./NavigationInPageManage.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react'; 
import { useState } from "react"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function NavigationInPageManage({orderStatus_Array, orderStatusPointer, handleClickNavState})
{  
    const renderLoading = (item) => {
        return (
          <div class={`donut multi size__donut ${item.value.pageQuantity === null ? '' : 'display_hidden'}`}></div> 
        )
    }
    const renderNavState = orderStatus_Array.map((item, index) =>  
        <li class="nav-item col-auto p-2" key={index}>
            <button 
                class={`nav-link button_nav ${orderStatusPointer === item.value.nameState ? 'active' : ''}`} 
                aria-current="page"  
                onClick={()=>handleClickNavState(item, 1)}
            >
                {item.value.nameState}
                <span className={`itemQuantityFound ${item.value.pageQuantity === null ? 'display_hidden' : ''}`}>
                    {item.value.pageQuantity}
                </span>
                {renderLoading(item)} 
            </button>
        </li> 
    )
    return (
        <ul class="nav nav-underline justify-content-center"> 
            {renderNavState}
        </ul>
    )
} 
export default NavigationInPageManage;    