<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PosTest extends TestCase
{
    use RefreshDatabase;

    public function test_pos_index_displays_products_and_categories(): void
    {
        $category = Category::factory()->create(['name' => 'Electronics']);
        $product = Product::factory()->create([
            'name' => 'Test Product',
            'price' => 25.99,
            'category_id' => $category->id,
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('pos')
                ->has('products.0', fn ($product) => 
                    $product->where('name', 'Test Product')
                           ->where('price', '25.99')
                           ->etc()
                )
                ->has('categories.0', fn ($category) => 
                    $category->where('name', 'Electronics')
                            ->etc()
                )
        );
    }

    public function test_can_create_sale_with_valid_data(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price' => 10.00,
            'stock_quantity' => 50,
        ]);

        $saleData = [
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                ]
            ],
            'payment_method' => 'cash',
            'amount_paid' => 25.00,
        ];

        $response = $this->actingAs($user)->post('/pos', $saleData);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('sales', [
            'user_id' => $user->id,
            'payment_method' => 'cash',
            'subtotal' => 20.00,
            'total_amount' => 22.00, // includes 10% tax
        ]);

        $this->assertDatabaseHas('sale_items', [
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => 10.00,
            'total_price' => 20.00,
        ]);

        // Check stock was reduced
        $product->refresh();
        $this->assertEquals(48, $product->stock_quantity);
    }

    public function test_cannot_create_sale_with_insufficient_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price' => 10.00,
            'stock_quantity' => 1,
        ]);

        $saleData = [
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 5, // More than available stock
                ]
            ],
            'payment_method' => 'cash',
            'amount_paid' => 60.00,
        ];

        $response = $this->actingAs($user)->post('/pos', $saleData);

        $response->assertSessionHasErrors('error');
        $this->assertDatabaseMissing('sales', [
            'user_id' => $user->id,
        ]);
    }

    public function test_cannot_create_sale_with_insufficient_payment(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price' => 10.00,
            'stock_quantity' => 50,
        ]);

        $saleData = [
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                ]
            ],
            'payment_method' => 'cash',
            'amount_paid' => 15.00, // Less than total (22.00 with tax)
        ];

        $response = $this->actingAs($user)->post('/pos', $saleData);

        $response->assertSessionHasErrors('error');
        $this->assertDatabaseMissing('sales', [
            'user_id' => $user->id,
        ]);
    }

    public function test_receipt_number_is_generated_correctly(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price' => 10.00,
            'stock_quantity' => 50,
        ]);

        $saleData = [
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                ]
            ],
            'payment_method' => 'cash',
            'amount_paid' => 15.00,
        ];

        $response = $this->actingAs($user)->post('/pos', $saleData);

        $sale = Sale::first();
        $expectedPrefix = 'RC-' . now()->format('Ymd') . '-';
        
        $this->assertStringStartsWith($expectedPrefix, $sale->receipt_number);
    }

    public function test_search_returns_matching_products(): void
    {
        $category = Category::factory()->create();
        $product1 = Product::factory()->create([
            'name' => 'iPhone 12',
            'barcode' => '1234567890',
            'category_id' => $category->id,
        ]);
        $product2 = Product::factory()->create([
            'name' => 'Samsung Phone',
            'barcode' => '0987654321',
            'category_id' => $category->id,
        ]);

        // Search by name
        $response = $this->get('/product-search?q=iPhone');
        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'iPhone 12']);
        $response->assertJsonMissing(['name' => 'Samsung Phone']);

        // Search by barcode
        $response = $this->get('/product-search?q=1234567890');
        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'iPhone 12']);
    }
}