import "./Statistic.css"
import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Label, PieChart, Pie, Cell } from 'recharts';


import request from "../../../utils/request"; 
import { useEffect, useState } from "react";
import {  Navigate, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFaceAngry } from '@fortawesome/free-regular-svg-icons';
import {  faChartColumn, faChartPie, faClose, faEye, faL, faPenToSquare, faPrint, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";


function Statistic()
{ 
    const [data_doanhthu, setData_doanhthu] = useState(null);
    const [data_TrangThaiDonHang, setData_TrangThaiDonHang] = useState([
      { name: 'Đã giao', value: 50, soluong: 1 }, // Giả sử đã giao là 60%
      { name: 'Đã huỷ', value: 50, soluong: 1 }, // Giả sử đã huỷ là 40%
    ]);
    const [data_HinhThucThanhToan, setData_HinhThucThanhToan] = useState([
      { name: 'Chuyển khoản', value: 50, soluong: 1 }, // Giả sử đã giao là 60%
      { name: 'Thanh toán khi nhận hàng', value: 50, soluong: 1 }, // Giả sử đã huỷ là 40%
    ]);
    const {formatPrice} = useGlobalVariableContext(); 
    const COLORS = ['#0088FE', '#FF0000']; // Màu xanh lá và màu đỏ cho trạng thái đơn hàng

   const [selectedOption, setSelectedOption] = useState('Tuần');
   const [selectedMonth, setSelectedMonth] = useState(1);
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

   const [startDate_TTDH, setStartDate_TTDH] = useState('2022-01-01');
   const [endDate_TTDH, setEndDate_TTDH] = useState(new Date().toISOString().split('T')[0]);

   const [startDate_HTTT, setStartDate_HTTT] = useState('2022-01-01');
   const [endDate_HTTT, setEndDate_HTTT] = useState(new Date().toISOString().split('T')[0]);
 
   const CharTypeCircle = ['Trạng thái đơn hàng', 'Hình thức thanh toán']

   const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
      const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
  
      return (
        <text x={x} y={y} fill="white" textAnchor="middle">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
   };
   const handleOptionChange = (e) => {
      setSelectedOption(e.target.value);
   };

   const handleMonthChange = (e) => {
      setSelectedMonth(e.target.value);
   };

   const handleYearChange = (e) => {
      setSelectedYear(e.target.value);
   };

    const vietnameseMonths = [];
    for (let month = 1; month <= 12; month++) {
      vietnameseMonths.push({
        id: month,
        name: `Tháng ${month}`
      });
    }

    const currentYear = new Date().getFullYear();
      const years = Array.from({ length: currentYear - 2020 + 1 }, (_, index) => {
      return {
         id: currentYear - index,
         name: currentYear - index
      };
   });

   const statisticRevenue = () => {
      const data = {
         selectedOption: selectedOption,
         selectedMonth: selectedMonth,
         selectedYear: selectedYear,
      }
      request.get('/api/statisticRevenue', {params: data})
      .then(res => {
         console.log(res.data.data)
         setData_doanhthu(res.data.data)
      })
      // request.get('/api/insertDataForYear2023') 
   }

   const statisticOrderAndPayMethod = (chartType) => {
      const data = {
         chartType: chartType,
         startDate_HTTT_OR_TTDH: chartType === 0 ? startDate_TTDH : startDate_HTTT,
         endDate_HTTT_OR_TTDH: chartType === 0 ? endDate_TTDH : endDate_HTTT,
      }
      request.get('/api/statisticOrderAndPayMethod', {params: data})
      .then(res => {
         console.log(res.data.data_statisticOrderAndPayMethod, 'ttttt', data)

         chartType === 0 
         ? setData_TrangThaiDonHang(res.data.data_statisticOrderAndPayMethod) 
         : setData_HinhThucThanhToan(res.data.data_statisticOrderAndPayMethod)
      })
      // request.get('/api/insertDataForYear2023')

   }

   const performModifyDataset = () => { 
      // request.get('/api/performModifyDataset') 
   }
   
   useEffect(() => {
      statisticRevenue()
      performModifyDataset()
   }, [])

    return (
      <div className="static_div">
         {/* //doanh thu */}
         <div>
         <h2>Doanh thu</h2>
            <div className="dropdowns">
               <select value={selectedOption} onChange={handleOptionChange}>
                  <option value="Tuần">Tuần</option>
                  <option value="Tháng">Tháng</option>
               </select>
               {selectedOption === 'Tuần' ? (
                  <div className="week-dropdowns">
                     <select value={selectedMonth} onChange={handleMonthChange}>
                        {vietnameseMonths.map((month) => (
                           <option key={month.id} value={month.id}>{month.name}</option>
                        ))}
                     </select>
                     <select value={selectedYear} onChange={handleYearChange}>
                        {years.map((year) => (
                           <option key={year.id} value={year.id}>{year.name}</option>
                        ))}
                     </select>
                  </div>
               ) : (
                  <select value={selectedYear} onChange={handleYearChange}>
                     {years.map((year) => (
                        <option key={year.id} value={year.id}>{year.name}</option>
                     ))}
                  </select>
               )}
               <button 
                  onClick={statisticRevenue}
                  className="btn_pagination"
               >
                  <FontAwesomeIcon className="faChartColumn"  icon={faChartPie}></FontAwesomeIcon>
               </button>
            </div>
         <BarChart width={1000} height={300} data={data_doanhthu}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            {/* <YAxis /> */}
            <YAxis 
               tickCount={20} 
               allowDataOverflow={true} 
               tick={{ fontSize: 12 }}
               tickFormatter={(value) => `${formatPrice(value)}`} 
            > 
            </YAxis>
            <Tooltip formatter={(value) => `${formatPrice(value)}`} />
            <Legend />
            <Bar dataKey="revenue" name="Doanh thu" fill="#8884d8" />
         </BarChart>
         </div>
         {/* trạng thái đơn hàng */}
         <div className="chartCircle">
            <div>
               <h2>TRẠNG THÁI ĐƠN HÀNG</h2>
                  <div className="dateInputs_TTDH" style={{ backgroundColor: 'yellow', borderRadius: '8px', padding: '10px' }}>
                     <input 
                        type="date" 
                        value={startDate_TTDH} 
                        min="2022-01-01"  max={endDate_TTDH}
                        onChange={(e) => setStartDate_TTDH(e.target.value)} 
                     />
                     <input 
                        type="date" 
                        value={endDate_TTDH} 
                        max={new Date().toISOString().split('T')[0]} 
                        onChange={(e) => setEndDate_TTDH(e.target.value)} 
                     />
                     <button 
                        onClick={()=>statisticOrderAndPayMethod(0)}
                        className="btn_pagination"
                     >
                        <FontAwesomeIcon className="faChartColumn"  icon={faChartPie}></FontAwesomeIcon>
                     </button>
                  </div>
                  <div className="pieChartContainer">
                     <PieChart width={230} height={230}>
                        <Pie
                           data={data_TrangThaiDonHang}
                           dataKey="value"
                           nameKey="name"
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           label={renderCustomizedLabel}
                           outerRadius={90}
                           fill="#8884d8"
                        >
                           {data_TrangThaiDonHang.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        {/* <Tooltip formatter={(value) => `${value}%`} /> */}
                        <Tooltip formatter={(value, name, props) => [`${props.payload.soluong}`, name]} />

                        <Legend />
                     </PieChart> 
                  </div>
            </div>
            <div>
               <h2>HÌNH THỨC THANH TOÁN</h2>
                  <div className="dateInputs_TTDH" style={{ backgroundColor: 'yellow', borderRadius: '8px', padding: '10px' }}>
                     <input 
                        type="date" 
                        value={startDate_HTTT} 
                        min="2022-01-01"  max={endDate_HTTT}
                        onChange={(e) => setStartDate_HTTT(e.target.value)} 
                     />
                     <input 
                        type="date" 
                        value={endDate_HTTT} 
                        max={new Date().toISOString().split('T')[0]} 
                        onChange={(e) => setEndDate_HTTT(e.target.value)} 
                     />
                     <button 
                        onClick={()=>statisticOrderAndPayMethod(1)}
                        className="btn_pagination"
                     >
                        <FontAwesomeIcon className="faChartColumn"  icon={faChartPie}></FontAwesomeIcon>
                     </button>
                  </div>
                  <div className="pieChartContainer">
                     <PieChart width={250} height={250}>
                        <Pie
                           data={data_HinhThucThanhToan}
                           dataKey="value"
                           nameKey="name"
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           label={renderCustomizedLabel}
                           outerRadius={90}
                           fill="#8884d8"
                        >
                           {data_HinhThucThanhToan.map((entry, index) => (
                              <Cell 
                                 key={`cell-${index}`} 
                                 fill={COLORS[index % COLORS.length]}   
                              />
                           ))}
                        </Pie>
                        {/* <Tooltip formatter={(value) => `${value}%`} /> */}
                        <Tooltip formatter={(value, name, props) => [`${props.payload.soluong}`, name]} />

                        <Legend />
                     </PieChart> 
                  </div>
            </div>
         </div>
      </div>
    );
}

export default Statistic;