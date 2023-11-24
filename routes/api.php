<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\ManageProductController; 
use App\Http\Controllers\PayOnlineController;
use App\Http\Controllers\AddProductController;
use App\Http\Controllers\AdminManageOrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InfoProductController;
use App\Http\Controllers\PaymentController;
 
use App\Http\Controllers\SearchProductController;
use App\Http\Controllers\UpdateProductController;
use App\Http\Controllers\LoginController;


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
Route::get('getInfoAtStartLoadingHome', [HomeController::class, 'getInfoAtStartLoadingHome']);

//Login
Route::post('register', [LoginController::class, 'register']);
Route::post('login', [LoginController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function() {
    Route::post('logout', [LoginController::class, 'logout']); 
});

//Search Product
Route::get('search', [SearchProductController::class, 'search']);
Route::get('filterSearchProduct', [SearchProductController::class, 'filterSearchProduct']);


//InfoProduct
Route::get('infoProduct', [InfoProductController::class, 'infoProduct']);
Route::post('addToCart', [InfoProductController::class, 'addToCart']);
// Route::get('infoPopupCart', [TestController::class, 'infoPopupCart']);
Route::post('updateQuantityProductInCart', [InfoProductController::class, 'updateQuantityProductInCart']);

//Cart
Route::get('infoCart', [CartController::class, 'infoCart']);
Route::post('updateSelectedProperty', [CartController::class, 'updateSelectedProperty']);
Route::post('deleteItemCart', [CartController::class, 'deleteItemCart']);
Route::post('updateQuantityProperty', [CartController::class, 'updateQuantityProperty']);

//Payment + Payment Online VNPAY
Route::get('infoForPayment', [PaymentController::class, 'infoForPayment']);
Route::post('saveInfoForPayment', [PaymentController::class, 'saveInfoForPayment']);
Route::post('payOnline', [PayOnlineController::class, 'payOnline']);

//Payment Result
Route::post('processPaymentResult', [PaymentController::class, 'processPaymentResult']);

//Admin - AddProduct
Route::post('addProduct', [AddProductController::class, 'addProduct']);
Route::get('getInfoForAddProduct', [AddProductController::class, 'getInfoForAddProduct']);
Route::get('linkImageProduct', [AddProductController::class, 'linkImageProduct']);
Route::get('updateQuantity', [AddProductController::class, 'updateQuantity']);



//Admin - ManageOrder
Route::get('getQuantityOrderToDevidePage', [AdminManageOrderController::class, 'getQuantityOrderToDevidePage']);
Route::get('getInfoManageOrder', [AdminManageOrderController::class, 'getInfoManageOrder']);
Route::get('infoOrderDetail', [AdminManageOrderController::class, 'infoOrderDetail']);
Route::post('saveNote', [AdminManageOrderController::class, 'saveNote']);
Route::post('updateOrderStatus', [AdminManageOrderController::class, 'updateOrderStatus']);

//Admin - SearchOrder
Route::get('getInfoSearchOrder', [AdminManageOrderController::class, 'getInfoSearchOrder']);
Route::get('getQuantityOrderToDevidePage_Search', [AdminManageOrderController::class, 'getQuantityOrderToDevidePage_Search']);


Route::get('testtest', [TestController::class, 'testtest']);
Route::get('testlaythongtin', [TestController::class, 'testlaythongtin']);


//Admin - ManageProduct
Route::get('getQuantityProductToDevidePage', [ManageProductController::class, 'getQuantityProductToDevidePage']);
Route::get('getInfoManageProduct', [ManageProductController::class, 'getInfoManageProduct']);
Route::get('infoProductDetail', [ManageProductController::class, 'infoProductDetail']);
Route::post('deleteProduct', [ManageProductController::class, 'deleteProduct']);

//Admin - SearchProduct
Route::get('getInfoSearchProductAdmin', [ManageProductController::class, 'getInfoSearchProductAdmin']);
Route::get('getQuantityProductToDevidePage_SearchProductAdmin', [ManageProductController::class, 'getQuantityProductToDevidePage_SearchProductAdmin']);
 
//Admin - UpdateProduct
Route::post('updateProduct', [UpdateProductController::class, 'updateProduct']);
Route::post('updateProduct2', [UpdateProductController::class, 'updateProduct2']);
