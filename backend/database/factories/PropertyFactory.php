<?php

namespace Database\Factories;

use App\Models\Location;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = Property::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['apartment', 'house', 'villa', 'land', 'office', 'shop']);
        $transactionType = fake()->randomElement(['sale', 'rent']);
        
        $title = match($type) {
            'apartment' => fake()->randomElement(['Appartement', 'Studio', 'F2', 'F3']) . ' ' . ($transactionType === 'sale' ? 'à vendre' : 'à louer'),
            'house' => fake()->randomElement(['Maison', 'Villa']) . ' ' . ($transactionType === 'sale' ? 'à vendre' : 'à louer'),
            'villa' => 'Villa de luxe ' . ($transactionType === 'sale' ? 'à vendre' : 'à louer'),
            'land' => fake()->randomElement(['Terrain', 'Parcelle']) . ' à vendre',
            'office' => 'Bureau ' . ($transactionType === 'sale' ? 'à vendre' : 'à louer'),
            'shop' => fake()->randomElement(['Boutique', 'Magasin']) . ' ' . ($transactionType === 'sale' ? 'à vendre' : 'à louer'),
        };

        $basePrice = match($type) {
            'apartment' => $transactionType === 'sale' ? fake()->numberBetween(50000, 200000) : fake()->numberBetween(200, 800),
            'house' => $transactionType === 'sale' ? fake()->numberBetween(80000, 300000) : fake()->numberBetween(300, 1200),
            'villa' => $transactionType === 'sale' ? fake()->numberBetween(150000, 500000) : fake()->numberBetween(500, 2000),
            'land' => fake()->numberBetween(10000, 100000),
            'office' => $transactionType === 'sale' ? fake()->numberBetween(100000, 400000) : fake()->numberBetween(400, 1500),
            'shop' => $transactionType === 'sale' ? fake()->numberBetween(60000, 250000) : fake()->numberBetween(250, 1000),
        };

        return [
            'user_id' => User::factory(),
            'location_id' => Location::factory(),
            'title' => $title,
            'slug' => \Illuminate\Support\Str::slug($title) . '-' . fake()->unique()->numberBetween(1000, 9999),
            'description' => fake()->paragraphs(3, true),
            'type' => $type,
            'transaction_type' => $transactionType,
            'price' => $basePrice,
            'surface' => fake()->numberBetween(50, 500),
            'bedrooms' => in_array($type, ['apartment', 'house', 'villa']) ? fake()->numberBetween(1, 5) : null,
            'bathrooms' => in_array($type, ['apartment', 'house', 'villa']) ? fake()->numberBetween(1, 4) : null,
            'address' => fake()->address(),
            'features' => fake()->randomElements(['parking', 'garden', 'pool', 'security', 'elevator', 'balcony', 'terrace', 'garage'], fake()->numberBetween(2, 5)),
            'status' => fake()->randomElement(['draft', 'published', 'sold']),
            'is_featured' => fake()->boolean(10), // 10% chance
            'views_count' => fake()->numberBetween(0, 500),
        ];
    }

    /**
     * Indicate that the property is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    /**
     * Indicate that the property is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'status' => 'published',
        ]);
    }

    /**
     * Indicate that the property is for sale.
     */
    public function forSale(): static
    {
        return $this->state(fn (array $attributes) => [
            'transaction_type' => 'sale',
        ]);
    }

    /**
     * Indicate that the property is for rent.
     */
    public function forRent(): static
    {
        return $this->state(fn (array $attributes) => [
            'transaction_type' => 'rent',
        ]);
    }
}

