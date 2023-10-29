<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\sanpham;
use App\Models\mausac;
use App\Models\size;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\sanpham_mausac_size>
 */
class sanpham_mausac_sizeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = \App\Models\sanpham_mausac_size::class;
    public function definition(): array
    {
        $sanpham = sanpham::inRandomOrder()->first();
        $mausac = mausac::inRandomOrder()->first();
        $size = size::inRandomOrder()->first();

        if ($sanpham->MASP > 10) { 
            return [
                'MASP' => $sanpham->MASP,
                'MAMAU' => $mausac->MAMAU,
                'MASIZE' => 'S',
                'SOLUONG' => $this->faker->randomNumber(2, false),
            ];
        }  
        else if($sanpham->MASP > 5){
            return [
                'MASP' => $sanpham->MASP,
                'MAMAU' => $mausac->MAMAU,
                'MASIZE' => 'L',
                'SOLUONG' => $this->faker->randomNumber(2, false),
            ];
        }
        else {
            return [
                'MASP' => $sanpham->MASP,
                'MAMAU' => $mausac->MAMAU,
                'MASIZE' => 'M',
                'SOLUONG' => $this->faker->randomNumber(2, false),
            ]; 
        }
        
        
    }
}
