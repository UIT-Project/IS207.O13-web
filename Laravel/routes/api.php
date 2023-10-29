<?php

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

Route::get('test', [TestController::class, 'test']);

Route::post('register', [TestController::class, 'register']);
Route::post('login', [TestController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function() {
    Route::post('logout', [TestController::class, 'logout']); 
});

Route::get('search', [TestController::class, 'search']);
Route::get('infoProduct', [TestController::class, 'infoProduct']);

Route::post('addToCart', [TestController::class, 'addToCart']);
// Route::get('infoPopupCart', [TestController::class, 'infoPopupCart']);

Route::get('infoCart', [TestController::class, 'infoCart']);