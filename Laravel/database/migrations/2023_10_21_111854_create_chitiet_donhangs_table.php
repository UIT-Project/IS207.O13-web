<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('chitiet_donhangs');

        Schema::create('chitiet_donhangs', function (Blueprint $table) {
            $table->unsignedInteger('MADH');
            $table->unsignedInteger('MASP');


            $table->integer('TONGTIEN');
            $table->string('MASIZE');
            $table->string('MAUSAC');
            $table->integer('SOLUONG');

            $table->foreign('MADH')->references('MADH')->on('donhangs');
            $table->foreign('MASP')->references('MASP')->on('sanphams');

        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chitiet_donhangs');
    }
};
