<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\taikhoan;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\thongtingiaohang>
 */
class thongtingiaohangFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = \App\Models\thongtingiaohang::class;

    public function definition(): array
    {
        $taikhoan = taikhoan::inRandomOrder()->first();

        return [
            'MATK' => $taikhoan->MATK,
            'DIACHI' => $this->faker->address(),
            'SDT' => $this->faker->e164PhoneNumber(),
        ];
    }
}
