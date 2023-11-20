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
        Schema::dropIfExists('donhangs');

        Schema::dropIfExists('vouchers');

        Schema::create('vouchers', function (Blueprint $table) {
            $table->string('MAVOUCHER', 50)->primary();
            $table->string('TEN');
            $table->integer('SOLUONG');
            $table->date('THOIGIANBD');
            $table->date('THOIGIANKT');
            $table->longText('MOTA');
            $table->decimal('GIATRIGIAM', 3, 2);
            
            $table->timestamp('updated_at')->nullable(); 
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
