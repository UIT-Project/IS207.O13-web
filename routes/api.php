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

Route::get('getInfoAtStartLoadingHome', [TestController::class, 'getInfoAtStartLoadingHome']);

Route::post('register', [TestController::class, 'register']);
Route::post('login', [TestController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function() {
    Route::post('logout', [TestController::class, 'logout']); 
});

Route::get('search', [TestController::class, 'search']);
Route::get('infoProduct', [TestController::class, 'infoProduct']);

Route::post('addToCart', [TestController::class, 'addToCart']);
// Route::get('infoPopupCart', [TestController::class, 'infoPopupCart']);
Route::post('updateQuantityProductInCart', [TestController::class, 'updateQuantityProductInCart']);


Route::get('infoCart', [TestController::class, 'infoCart']);
Route::post('updateSelectedProperty', [TestController::class, 'updateSelectedProperty']);

Route::post('deleteItemCart', [TestController::class, 'deleteItemCart']);
Route::post('updateQuantityProperty', [TestController::class, 'updateQuantityProperty']);

Route::get('infoForPayment', [TestController::class, 'infoForPayment']);
Route::post('saveInfoForPayment', [TestController::class, 'saveInfoForPayment']);

Route::post('payOnline', [PayOnlineController::class, 'payOnline']);
Route::post('addProduct', [TestController::class, 'addProduct']);

Route::get('getInfoForAddProduct', [TestController::class, 'getInfoForAddProduct']);
Route::get('filterSearchProduct', [TestController::class, 'filterSearchProduct']);


Route::get('testtest', [TestController::class, 'testtest']);
Route::post('processPaymentResult', [TestController::class, 'processPaymentResult']);

Route::get('linkImageProduct', [TestController::class, 'linkImageProduct']);