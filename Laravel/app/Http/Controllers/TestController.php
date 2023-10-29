<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\taikhoan;
use App\Models\User;
use App\Models\sanpham;
use App\Models\chitiet_giohang;

use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

use stdClass; 

class TestController extends Controller
{
    public function test(){
        $info_product = DB::select("SELECT * FROM sanphams");
        return response()->json($info_product);
    }

    public function register(Request $request){
        $Validator = Validator::make($request->all(), [
            'name' => 'required|max:191',
            'email' => 'required|email:191|unique:taikhoans',
            'password' => 'required|max:191|min:6',
        ]);

        if($Validator->fails()){
            return response()->json([
                'validation_errors' => $Validator->messages(), 422
            ]);
        }
        else{
            $taikhoan = taikhoan::create([
                'ten' => $request->name,
                'email' => $request->email,
                'password' =>Hash::make($request->password),
            ]);
 

            $token = $taikhoan->createToken($taikhoan->email.'_Token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'email' => $taikhoan->email,
                'token' => $token,
                'massage' => 'Registered Successfully',
            ]);
        }
    }

    public function login(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email:191',
            'password' => 'required',
        ]);
        
        if($validator->fails())
        {
            return response()->json([
            'validation_errors' =>$validator->messages(),
            ]);
        }
        else
        {
            $taikhoan = taikhoan::where('email', $request->email)->first();   
            if(!$taikhoan) { 
                $data = new stdClass();
                $data->email = "email sai"; 
                return response()->json([
                    'status'=>401,
                    'validation_errors' => $data,
                ]);  
            }
            else if(!Hash::check($request->password,$taikhoan->PASSWORD)){
                $data = new stdClass();
                $data->password = "mật khẩu sai";
                return response()->json([
                    'status'=>401,
                    'validation_errors' =>$data,
                ]);
            }
            else {
                // if($taikhoan->role_as == 1) //1 = admin
                // {
                //     $role = 'admin';
                //     $token = $taikhoan->createToken($taikhoan->email.'_AdminToken',['server:admin'])->plainTextToken;
                // }
                // else
                // {
                //     $role = '';

                // đoạn này có hay không cũng được, đều đúng
                // $credentials = $request->only('email', 'password');
                // if (Auth::attempt($credentials)) {
                //     $user = Auth::user();
                //     $token_test = $user->createToken($user->email.'_Token')->plainTextToken;
                //     return response()->json([
                //         'status' =>200,
                //         'email' =>$taikhoan->EMAIL,
                //         'token' => $token_test,
                //         'message' =>'Logged In Successfully',
                //         // 'role'=>$role,
                //     ]);
                // }
                 
                $token = $taikhoan->createToken($taikhoan->email.'_Token')->plainTextToken;
                    
                    return response()->json([
                        'status' =>200,
                        'email' =>$taikhoan->EMAIL,
                        'matk' => $taikhoan->MATK,
                        'token' => $token,
                        'message' =>'Logged In Successfully',
                        // 'role'=>$role,
                    ]);
                // }
            } 
        } 
    }
    public function logout() { 
        Auth::user()->tokens()->delete();
        return response()->json([
            'status'=>200,
            'message'=>'Logged out Successfully',
        ]);
    }

    public function search(Request $request){
        $searchQuery = $request->query('query');
        $data = sanpham::where('TENSP', 'LIKE', "%$searchQuery%")->get();

        return response()->json([
            'data' => $data,
        ]);
    }
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
    public function infoCart(Request $request){
        $matk = $request->input('matk');
        $data_sanpham = DB::select("SELECT sanphams.MASP, TENSP, TONGGIA, SOLUONG, TENMAU, chitiet_giohangs.MASIZE, GIABAN  FROM chitiet_giohangs, sanphams, mausacs WHERE MATK = '$matk' AND chitiet_giohangs.MASP = sanphams.MASP AND mausacs.MAMAU = chitiet_giohangs.MAMAU");
        return response()->json([ 
            'data' => $data_sanpham,
        ]);
    } 
}

