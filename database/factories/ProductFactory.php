<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'barcode' => $this->faker->unique()->ean13(),
            'price' => $this->faker->randomFloat(2, 1, 100),
            'stock_quantity' => $this->faker->numberBetween(0, 200),
            'min_stock_level' => $this->faker->numberBetween(5, 20),
            'category_id' => Category::factory(),
            'is_active' => true,
        ];
    }
}