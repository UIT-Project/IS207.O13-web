 
import React, { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Label, PieChart, Pie, Cell } from 'recharts';


import request from "../../../../utils/request"; 
import { useEffect, useState } from "react";
import {  Navigate, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faChartColumn, faChartPie, faClose, faEye, faL, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";


function SetData()
{  
    const [load, setLoad] = useState("Chưa hoàn thành")
    const setData = () => {
        request.get('/api/setdata')
        .then(res => {
            setLoad("Hoàn thành")
            console.log(res)
        })
        .catch(err => {
            setLoad(`Lỗi ${err}`)
        })
    }
    useEffect(() => {
        setData()
    }, [])
    return (
      <div className="static_div">
        Load dữ liệu: {load}
      </div>  
    );
}

export default SetData;