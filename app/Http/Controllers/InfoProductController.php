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

class InfoProductController extends Controller
{
    public function infoProduct(Request $request){
        $id = $request->query('id');
        $data_sanpham = sanpham::where('MASP', 'LIKE', "%$id%")->get();
        $data_mausac = DB::select("SELECT * FROM sanpham_mausac_sizes WHERE MASP = '$id' ");
        $data_MAMAU = DB::select("SELECT DISTINCT(mausacs.MAMAU), HEX, TENMAU FROM sanpham_mausac_sizes, mausacs WHERE sanpham_mausac_sizes.MAMAU = mausacs.MAMAU AND MASP = '$id' ");
        $data_SIZE = DB::select("SELECT DISTINCT(MASIZE) FROM sanpham_mausac_sizes WHERE MASP = '$id'");

        return response()->json([
            'data_sanpham' => $data_sanpham,
            'data_mausac' => $data_mausac,
            'data_mamau' => $data_MAMAU,
            'data_size' => $data_SIZE,
        ]);
    }
    public function addToCart(Request $request){ 
        chitiet_giohang::create([
            'MATK' => $request->matk,
            'MASP' => $request->masp,
            'MASIZE' => $request->masize,
            'MAMAU' => $request->mamau,
            'SOLUONG' => $request->soluongsp,
            'TONGGIA' => $request->tonggia,

        ]);
        return response()->json([
            'status_code' => 200,
        ]);
    } 
    public function updateQuantityProperty(Request $request){
        $matk = $request->input('matk');
        $mamau = $request->input('mamau');
        $masize = $request->input('masize');
        $masp = $request->input('masp');
        $soluong = $request->input('soluong');
        $tonggia = $request->input('tonggia');

        DB::update("UPDATE chitiet_giohangs SET SOLUONG = '$soluong', TONGGIA = '$tonggia' WHERE MASP = '$masp' AND MATK = '$matk' AND MAMAU = '$mamau' AND MASIZE = '$masize' ");
        return response()->json([
            'message' => 200,
            'matk' => $matk,
        ]);
    }
}
