<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens; 


class taikhoan extends Model
{
    use HasFactory, HasApiTokens;
    protected $primaryKey = 'MATK';


    protected $fillable = [
        'ten',
        'email',
        'password',
    ];
}
