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
        Schema::create('daily_closures', function (Blueprint $table) {
            $table->id();
            $table->date('closure_date');
            $table->foreignId('closed_by')->constrained('users')->onDelete('cascade');
            $table->decimal('total_sales', 10, 2);
            $table->decimal('cash_sales', 10, 2);
            $table->decimal('card_sales', 10, 2);
            $table->decimal('qr_code_sales', 10, 2);
            $table->integer('transaction_count');
            $table->json('sales_by_user');
            $table->json('top_products');
            $table->timestamps();
            
            $table->unique(['closure_date']);
            $table->index('closure_date');
            $table->index('closed_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_closures');
    }
};