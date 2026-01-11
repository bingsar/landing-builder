<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/pages', [PageController::class, 'index']);
Route::post('/pages', [PageController::class, 'store']);
Route::get('/pages/slug/{slug}', [PageController::class, 'showBySlug']);
Route::get('/pages/public/{slug}', [PageController::class, 'showPublic']);
Route::get('/pages/{page}', [PageController::class, 'show']);
Route::put('/pages/{page}', [PageController::class, 'update']);
Route::post('/pages/{page}/publish', [PageController::class, 'publish']);
Route::delete('/pages/{page}', [PageController::class, 'destroy']);
