<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class VoucherController extends Controller
{
    public function addVoucher(Request $request){
        $objectInfoAddNewVoucher = json_decode($request->input('infoAddNewVoucher'));  

        $MAVOUCHER = $objectInfoAddNewVoucher->showNameVoucher;
        $PHANLOAI_VOUCHER = $objectInfoAddNewVoucher->typeVoucher;
        $GIATRIGIAM = (float)$objectInfoAddNewVoucher->decreasePersent;
        $THOIGIANBD = $objectInfoAddNewVoucher->startDate;
        $THOIGIANKT = $objectInfoAddNewVoucher->endDate;
        $GIATRI_DH_MIN = $objectInfoAddNewVoucher->minOrderValue;
        $GIATRI_GIAM_MAX = $objectInfoAddNewVoucher->maxDecreaseMoney;
        $SOLUONG = $objectInfoAddNewVoucher->quantityUse;
        $MOTA = $objectInfoAddNewVoucher->desctiption; 

        DB::insert(
            "INSERT into vouchers(MAVOUCHER, PHANLOAI_VOUCHER, GIATRIGIAM, THOIGIANBD, THOIGIANKT, 
            GIATRI_DH_MIN, GIATRI_GIAM_MAX, SOLUONG, MOTA) 
            values('$MAVOUCHER', '$PHANLOAI_VOUCHER', $GIATRIGIAM, '$THOIGIANBD', '$THOIGIANKT', 
            $GIATRI_DH_MIN, $GIATRI_GIAM_MAX, $SOLUONG, '$MOTA')"
        ); 
        return response()->json([]); 
    }
    public function getQuantityVoucherToDevidePage_Search(Request $request){
        $currentDate = now()->format('Y-m-d');

        $quantity_chuaApDung = DB::select(
            "SELECT COUNT(MAVOUCHER) AS SL_MATVOUCHER,
            'Chưa áp dụng' AS TEN_TRANGTHAI
            FROM vouchers 
            WHERE vouchers.THOIGIANKT < '$currentDate'"
        ); 
        $quantity_DangSuDung = DB::select(
            "SELECT COUNT(MAVOUCHER) AS SL_MATVOUCHER
            'Đang áp dụng' AS TEN_TRANGTHAI 
            FROM vouchers 
            WHERE vouchers.THOIGIANBD < '$currentDate' 
            AND vouchers.THOIGIANKT > '$currentDate' 
            AND SOLUONG_CONLAI > 0"
        );
        $quantity_daSuDung = DB::select(
            "SELECT COUNT(MAVOUCHER) AS SL_MATVOUCHER
            'Đã qua sử dụng' AS TEN_TRANGTHAI 
            FROM vouchers 
            WHERE vouchers.THOIGIANBD > '$currentDate' OR SOLUONG_CONLAI = 0"
        );

        $quantity = array_merge($quantity_chuaApDung, $quantity_DangSuDung, $quantity_daSuDung);

        return response()->json([
            'quantity'=> $quantity, 
        ]); 
    }
}
