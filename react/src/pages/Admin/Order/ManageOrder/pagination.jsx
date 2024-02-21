import React from "react";
import { returnPaginationRange } from "./utils";

function Pagination(props){
    let array=returnPaginationRange(props.totalPage,props.page,props.limit,props.siblings);
    return(
        <ul className="pagination pagination-md justify-content-end">
            <li className="page-item"><span onClick={() => props.onPageChange("&laquo;", props.item_status)} className="page-link">&laquo;</span></li>
            <li className="page-item"><span onClick={() => props.onPageChange("&lsaquo;", props.item_status)} className="page-link">&lsaquo;</span></li>
            {array.map(value=>{
                if(value===props.page){
                    return(
                        <li key={value} className="page-item active">
                            <span onClick={() => props.onPageChange(value, props.item_status)} className="page-link">{value}</span>
                        </li>
                    )
                    
                } else{
                    return(
                        <li key={value} className="page-item"><span onClick={() => props.onPageChange(value, props.item_status)} className="page-link">{value}</span></li>
                    )
                }
                
            })}
            <li className="page-item"><span onClick={() => props.onPageChange("&rsaquo;", props.item_status)} className="page-link">&rsaquo;</span></li>
            <li className="page-item"><span onClick={() => props.onPageChange("&raquo;", props.item_status)} className="page-link">&raquo;</span></li>
        </ul>
    );
}
export default Pagination;