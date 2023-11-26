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


class SearchProductController extends Controller
{
    public function filterSearchProduct(Request $request){
        $filter = $request->input('filter'); 
        $tensp = $request->input('textQuery');
        $data_product = [];    
 
        if($filter == 'moinhat'){
            $data_product = DB::select("SELECT * from sanphams where TENSP LIKE '%$tensp%' ORDER BY created_at DESC");
            return response()->json([
                'data_product' => $data_product, 
                'filter'=> $filter,
            ]);
        }
        else if($filter == 'banchay'){
            $data_product = DB::select("SELECT chitiet_donhangs.MASP, TENSP, GIAGOC, GIABAN from chitiet_donhangs, sanphams
                                        where chitiet_donhangs.MASP = sanphams.MASP AND TENSP = '$tensp' 
                                        group by chitiet_donhangs.MASP
                                        order by SUM(SOLUONG) DESC
                                        ");
        }
        else if($filter == 'thapDenCao'){
            $data_product = DB::select("SELECT * from sanphams where TENSP = '$tensp' ORDER BY GIABAN ASC");
        }
        else if($filter == 'caoDenThap'){
            $data_product = DB::select("SELECT * from sanphams where TENSP = '$tensp' ORDER BY GIABAN DESC");
        }

        return response()->json([
            'data_product' => $data_product, 
            'filter'=> $filter,
        ]);
    }
    public function search(Request $request){
        $searchQuery = $request->query('query');
        $data = sanpham::where('TENSP', 'LIKE', "%$searchQuery%")->get();

        return response()->json([
            'data' => $data,
        ]);
    }
}
