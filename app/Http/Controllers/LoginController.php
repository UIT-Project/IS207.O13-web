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

class LoginController extends Controller
{
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
}
