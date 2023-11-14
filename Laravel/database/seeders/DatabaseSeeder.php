<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\phanloai_sanpham::factory(3)->create(); 
        \App\Models\taikhoan::factory(1)->create();   
        // \App\Models\sanpham::factory(7)->create();
        \App\Models\mausac::factory(10)->create();    
        // \App\Models\size::factory(3)->create();  
        // \App\Models\sanpham_mausac_size::factory(10)->create();   
        \App\Models\thongtingiaohang::factory(3)->create();   
        \App\Models\voucher::factory(3)->create();   

        // insert into sizes values('S');
        // insert into sizes values('M');
        // insert into sizes values('L');
    }
}
