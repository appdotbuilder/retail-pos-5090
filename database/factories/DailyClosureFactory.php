<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DailyClosure>
 */
class DailyClosureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalSales = $this->faker->randomFloat(2, 100, 2000);
        $cashSales = $totalSales * 0.4;
        $cardSales = $totalSales * 0.5;
        $qrCodeSales = $totalSales * 0.1;

        return [
            'closure_date' => $this->faker->date(),
            'closed_by' => User::factory(),
            'total_sales' => $totalSales,
            'cash_sales' => $cashSales,
            'card_sales' => $cardSales,
            'qr_code_sales' => $qrCodeSales,
            'transaction_count' => $this->faker->numberBetween(10, 100),
            'sales_by_user' => [
                [
                    'user_name' => $this->faker->name(),
                    'transaction_count' => $this->faker->numberBetween(5, 20),
                    'total_sales' => $this->faker->randomFloat(2, 50, 500),
                ],
            ],
            'top_products' => [
                [
                    'product_name' => $this->faker->words(2, true),
                    'total_sold' => $this->faker->numberBetween(10, 50),
                    'revenue' => $this->faker->randomFloat(2, 100, 1000),
                ],
            ],
        ];
    }
}