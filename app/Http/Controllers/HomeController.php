<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    public function getInfoAtStartLoadingHome(){
        $dataNewProduct = DB::select(
            "SELECT * FROM sanphams, hinhanhsanphams 
            WHERE hinhanhsanphams.masp = sanphams.masp 
            AND MAHINHANH LIKE '%thumnail%'  
            ORDER BY created_at ASC LIMIT 20"
        );
        $dataHotProduct = DB::select(
            "SELECT sanphams.MASP, TENSP, GIAGOC, GIABAN, MAPL_SP 
            FROM sanphams, chitiet_donhangs,  sanpham_mausac_sizes
            WHERE sanpham_mausac_sizes.MAXDSP = chitiet_donhangs.MAXDSP 
            AND sanphams.MASP = sanpham_mausac_sizes.MASP
            GROUP BY sanphams.MASP, TENSP, GIAGOC, GIABAN, MAPL_SP
            ORDER BY SUM(chitiet_donhangs.SOLUONG)"
        ); 
        return response()->json([
            'dataNewProduct' => $dataNewProduct,
            'dataHotProduct' => $dataHotProduct, 
        ]);
    }
}
