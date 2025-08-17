<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 10, 500);
        $taxAmount = $subtotal * 0.10;
        $totalAmount = $subtotal + $taxAmount;
        
        return [
            'receipt_number' => 'RC-' . now()->format('Ymd') . '-' . $this->faker->unique()->numberBetween(1000, 9999),
            'user_id' => User::factory(),
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
            'payment_method' => $this->faker->randomElement(['cash', 'card', 'qr_code']),
            'amount_paid' => $totalAmount + $this->faker->randomFloat(2, 0, 20),
            'change_amount' => $this->faker->randomFloat(2, 0, 20),
            'status' => 'completed',
            'customer_email' => $this->faker->optional()->email(),
        ];
    }
}