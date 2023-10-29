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
        Schema::dropIfExists('thongtingiaohangs');

        Schema::create('thongtingiaohangs', function (Blueprint $table) {
            $table->increments('MATTGH'); 
            $table->unsignedInteger('MATK');
            $table->string('DIACHI');
            $table->string('SDT');

            $table->foreign('MATK')->references('MATK')->on('taikhoans');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thongtingiaohangs');
    }
};
