<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewProduct extends Controller
{
    public function saveReviewProduct(Request $request){
        $madh = $request->madh;
        $maxdsp = $request->maxdsp;
        $soluongsao = $request->soluongsao;
        $noidungdanhgia = $request->noidungdanhgia;
        foreach($maxdsp as $item_maxdsp){
            DB::insert(
                "INSERT INTO danhgia_sanphams(MADH, MAXDSP, SOLUONG_SAO, NOIDUNG_DANHGIA) 
                values($madh, $item_maxdsp, $soluongsao, '$noidungdanhgia')"
            );
            DB::update(
                "UPDATE chitiet_donhangs SET DADANHGIA = 1 WHERE MADH = $madh and MAXDSP = $item_maxdsp"
            );
        }
    }
}
