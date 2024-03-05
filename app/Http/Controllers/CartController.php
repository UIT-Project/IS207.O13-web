<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; 
 
class CartController extends Controller
{
    public function infoCart(Request $request){
        $matk = $request->input('matk');
        $data_sanpham = DB::select(
            "SELECT MATK, sanphams.MASP, TENSP, TONGGIA, SOLUONG, TENMAU, 
            chitiet_giohangs.MASIZE, GIABAN, SELECTED, mausacs.MAMAU, imgURL
            FROM chitiet_giohangs, sanphams, mausacs, hinhanhsanphams 
            WHERE MATK = '$matk' 
            AND MAHINHANH LIKE '%thumnail%'
            AND chitiet_giohangs.MASP = sanphams.MASP 
            AND mausacs.MAMAU = chitiet_giohangs.MAMAU
            AND hinhanhsanphams.MASP = sanphams.MASP"
        );
        return response()->json([ 
            'data' => $data_sanpham, 
        ]);
    } 

    public function updateSelectedProperty(Request $request){
        $matk = $request->input('matk');
        $mamau = $request->input('mamau');
        $masize = $request->input('masize');
        $masp = $request->input('masp');
        $selected = $request->input('selected');
        DB::update("UPDATE chitiet_giohangs SET SELECTED = '$selected' WHERE MASP = '$masp' AND MATK = '$matk' AND MAMAU = '$mamau' AND MASIZE = '$masize' ");
        return response()->json([
            'message' => 200,
        ]);
    }

    public function deleteItemCart(Request $request){
        $matk = $request->input('matk');
        $mamau = $request->input('mamau');
        $masize = $request->input('masize');
        $masp = $request->input('masp');

        DB::delete("DELETE FROM chitiet_giohangs WHERE MATK = '$matk' AND MASP = '$masp' AND MAMAU = '$mamau' AND MASIZE = '$masize' ");
        return response()->json([
            'message' => 200,
        ]);
    }

    public function updateQuantityProperty(Request $request){
        $matk = $request->input('matk');
        $mamau = $request->input('mamau');
        $masize = $request->input('masize');
        $masp = $request->input('masp');
        $soluong = $request->input('soluong');
        $tonggia = $request->input('tonggia');

        DB::update(
            "UPDATE chitiet_giohangs 
            SET SOLUONG = '$soluong', TONGGIA = '$tonggia' 
            WHERE MASP = '$masp' 
            AND MATK = '$matk' 
            AND MAMAU = '$mamau' 
            AND MASIZE = '$masize' "
        );
        return response()->json([
            'message' => 200,
            'matk' => $matk,
        ]);
    }
}
