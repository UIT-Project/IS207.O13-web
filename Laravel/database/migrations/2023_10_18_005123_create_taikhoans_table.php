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
        // Schema::dropIfExists('taikhoans'); 
        Schema::create('taikhoans', function (Blueprint $table) {
            $table->increments('MATK');
            $table->string('TEN');
            $table->string('EMAIL');
            $table->string('PASSWORD');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taikhoans');
    }
};
