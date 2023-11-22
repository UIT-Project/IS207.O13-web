<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\taikhoan;
use App\Models\User;
use App\Models\sanpham;
use App\Models\chitiet_giohang;
use App\Models\donhang;
use App\Models\hinhanhsanpham;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use stdClass; 
class AdminManageOrderController extends Controller
{
    public function getQuantityOrderToDevidePage(Request $request){ 
        $quantity = DB::select(
            "SELECT COUNT(MADH)AS SL_MADH , TRANGTHAI_DONHANG 
            FROM donhangs GROUP BY TRANGTHAI_DONHANG "
        ); 

        return response()->json([
            'quantity'=> $quantity, 
        ]); 
    }
    public function getInfoManageOrder(Request $request){
        $tenTrangThai = $request->query('tenTrangThai');
        $start = $request->query('start');
        $numberOrderEachPage = $request->query('numberOrderEachPage');
        // $orderList_DB = donhang::where('TRANGTHAI_DONHANG', 'LIKE', "%$tenTrangThai%")->orderBy('MADH', 'desc')
        // ->skip($start)->take($numberOrderEachPage)->get(); 

        $orderList_DB = DB::select(
            "SELECT donhangs.MADH, TEN, SDT, DIACHI, TINH_TP, QUAN_HUYEN, PHUONG_XA, DANGSUDUNG, NGAYORDER,
            TRANGTHAI_THANHTOAN, HINHTHUC_THANHTOAN
            FROM donhangs, thongtingiaohangs 
            WHERE TRANGTHAI_DONHANG = '$tenTrangThai' AND thongtingiaohangs.MATTGH = donhangs.MATTGH
            ORDER BY donhangs.MADH DESC
            LIMIT $start, $numberOrderEachPage"
        );

        return response()->json([
            'orderList_DB' => $orderList_DB, 
        ]);
    }
    public function infoOrderDetail(Request $request){
        $madh = $request->query('madh');
        $data_relative_Donhang =  DB::select(
            "SELECT donhangs.MADH, thongtingiaohangs.TEN, SDT, DIACHI, 
            TINH_TP, QUAN_HUYEN, PHUONG_XA, TONGTIEN, SOLUONG, TONGTIEN_SP,
            VOUCHERGIAM, TONGTIENDONHANG, HINHTHUC_THANHTOAN, TRANGTHAI_THANHTOAN, GHICHU
            from donhangs, chitiet_donhangs, thongtingiaohangs 
            where donhangs.MADH = '$madh'  AND donhangs.MADH = chitiet_donhangs.MADH 
            AND thongtingiaohangs.MATTGH = donhangs.MATTGH"
        );
        $data_sanPham_relative_CTDH = DB::select(
            "SELECT TENSP, GIABAN, TENMAU, HEX, MASIZE  
            from mausacs, chitiet_donhangs, sanphams, sanpham_mausac_sizes 
            where chitiet_donhangs.MADH = '$madh' AND chitiet_donhangs.MAXDSP = sanpham_mausac_sizes.MAXDSP 
            AND sanpham_mausac_sizes.MASP = sanphams.MASP AND sanpham_mausac_sizes.MAMAU = mausacs.MAMAU"
        );
        return response()->json([
            'data_relative_Donhang' => $data_relative_Donhang,
            'data_sanPham_relative_CTDH' => $data_sanPham_relative_CTDH,
        ]);
    }
}
