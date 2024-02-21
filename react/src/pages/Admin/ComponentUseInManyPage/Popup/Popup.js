import "./Popup.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react'; 
import { useState } from "react"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Popup({contentPopup, confirm})
{ 
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
        <div className="popup-overlay">
            <div className="popup-container">
                <div className="popup-card">
                <h2>{contentPopup.title}</h2>
                <p>{contentPopup.content}</p>
                <div>
                    <button id="close-popup" className="closePopup__margin" onClick={closePopup}>{confirm === 'no use' ? 'Ok' : 'Huỷ'}</button>
                    {confirm !== 'no use' ? <button id="close-popup" className="closePopup__margin" onClick={confirm}>Xác nhận</button> : ''}
                </div>
                </div>
            </div>
        </div>
    )
} 
export default Popup;    