<?php

use App\Http\Controllers\PayOnline;
use App\Http\Controllers\PayOnlineController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
//Home
Route::get('getInfoAtStartLoadingHome', [TestController::class, 'getInfoAtStartLoadingHome']);

//Login
Route::post('register', [TestController::class, 'register']);
Route::post('login', [TestController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function() {
    Route::post('logout', [TestController::class, 'logout']); 
});

//Search Product
Route::get('search', [TestController::class, 'search']);
Route::get('filterSearchProduct', [TestController::class, 'filterSearchProduct']);


//InfoProduct
Route::get('infoProduct', [TestController::class, 'infoProduct']);
Route::post('addToCart', [TestController::class, 'addToCart']);
// Route::get('infoPopupCart', [TestController::class, 'infoPopupCart']);
Route::post('updateQuantityProductInCart', [TestController::class, 'updateQuantityProductInCart']);

//Cart
Route::get('infoCart', [TestController::class, 'infoCart']);
Route::post('updateSelectedProperty', [TestController::class, 'updateSelectedProperty']);
Route::post('deleteItemCart', [TestController::class, 'deleteItemCart']);
Route::post('updateQuantityProperty', [TestController::class, 'updateQuantityProperty']);

//Payment + Payment Online VNPAY
Route::get('infoForPayment', [TestController::class, 'infoForPayment']);
Route::post('saveInfoForPayment', [TestController::class, 'saveInfoForPayment']);
Route::post('payOnline', [PayOnlineController::class, 'payOnline']);

//Payment Result
Route::post('processPaymentResult', [TestController::class, 'processPaymentResult']);

//Admin - AddProduct
Route::post('addProduct', [TestController::class, 'addProduct']);
Route::get('getInfoForAddProduct', [TestController::class, 'getInfoForAddProduct']);
Route::get('linkImageProduct', [TestController::class, 'linkImageProduct']);



//Admin - ManageOrder
Route::get('getQuantityOrderToDevidePage', [TestController::class, 'getQuantityOrderToDevidePage']);
Route::get('getInfoManageOrder', [TestController::class, 'getInfoManageOrder']);
Route::get('infoOrderDetail', [TestController::class, 'infoOrderDetail']);


Route::get('testtest', [TestController::class, 'testtest']);
Route::get('testlaythongtin', [TestController::class, 'testlaythongtin']);


//Admin - ManageProduct
Route::get('getQuantityProductToDevidePage', [TestController::class, 'getQuantityProductToDevidePage']);
Route::get('getInfoManageProduct', [TestController::class, 'getInfoManageProduct']);
Route::get('infoProductDetail', [TestController::class, 'infoProductDetail']);

//Admin - UpdateProduct
Route::post('updateProduct', [TestController::class, 'updateProduct']);
Route::post('updateProduct2', [TestController::class, 'updateProduct2']);
