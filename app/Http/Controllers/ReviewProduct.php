<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewProduct extends Controller
{
    public function saveReviewProduct(Request $request){
        $madh = $request->madh;
        $masp = $request->masp;
        $soluongsao = $request->soluongsao;
        $noidungdanhgia = $request->noidungdanhgia;
        $matk = $request->matk;
        foreach($masp as $item_masp){
            DB::insert(
                "INSERT INTO danhgia_sanphams(MADH, MASP, MATK, SOLUONG_SAO, NOIDUNG_DANHGIA, created_at) 
                values($madh, $item_masp, $matk, $soluongsao, '$noidungdanhgia', DATE(NOW()))"
            );
            DB::update(
                "UPDATE chitiet_donhangs SET DADANHGIA = 1 
                WHERE MADH = $madh 
                and MAXDSP in (SELECT MAXDSP FROM sanpham_mausac_sizes WHERE MASP = $item_masp)"
            );
        }
    }
}
