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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            $table->enum('payment_method', ['cash', 'card', 'qr_code'])->default('cash');
            $table->decimal('amount_paid', 10, 2);
            $table->decimal('change_amount', 10, 2)->default(0);
            $table->enum('status', ['completed', 'pending', 'cancelled'])->default('completed');
            $table->string('customer_email')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index('receipt_number');
            $table->index('user_id');
            $table->index(['created_at', 'status']);
            $table->index('payment_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};