<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agents = User::where('role', 'agent')->get();
        $locations = Location::where('type', 'city')->get();
        $districts = Location::where('type', 'district')->get();

        $types = ['apartment', 'house', 'villa', 'land', 'office', 'shop'];
        $transactionTypes = ['sale', 'rent'];

        // Créer 50 propriétés
        for ($i = 1; $i <= 50; $i++) {
            $type = $types[array_rand($types)];
            $transactionType = $transactionTypes[array_rand($transactionTypes)];
            
            // Prix selon le type
            $basePrice = match($type) {
                'apartment' => $transactionType === 'sale' ? rand(50000, 200000) : rand(200, 800),
                'house' => $transactionType === 'sale' ? rand(80000, 300000) : rand(300, 1200),
                'villa' => $transactionType === 'sale' ? rand(150000, 500000) : rand(500, 2000),
                'land' => rand(10000, 100000),
                'office' => $transactionType === 'sale' ? rand(100000, 400000) : rand(400, 1500),
                'shop' => $transactionType === 'sale' ? rand(60000, 250000) : rand(250, 1000),
            };

            Property::create([
                'user_id' => $agents->random()->id,
                'location_id' => $districts->isNotEmpty() ? $districts->random()->id : $locations->random()->id,
                'title' => $this->generateTitle($type, $transactionType),
                'description' => $this->generateDescription($type),
                'type' => $type,
                'transaction_type' => $transactionType,
                'price' => $basePrice,
                'surface' => rand(50, 500),
                'bedrooms' => in_array($type, ['apartment', 'house', 'villa']) ? rand(1, 5) : null,
                'bathrooms' => in_array($type, ['apartment', 'house', 'villa']) ? rand(1, 4) : null,
                'address' => "Adresse exemple $i",
                'features' => $this->generateFeatures(),
                'status' => rand(0, 10) > 1 ? 'published' : 'draft', // 90% publiées
                'is_featured' => rand(0, 10) === 0, // 10% featured
                'views_count' => rand(0, 500),
            ]);
        }
    }

    private function generateTitle(string $type, string $transactionType): string
    {
        $titles = [
            'apartment' => ['Appartement', 'Studio', 'F2', 'F3', 'F4'],
            'house' => ['Maison', 'Villa', 'Résidence'],
            'villa' => ['Villa de luxe', 'Villa moderne', 'Villa avec piscine'],
            'land' => ['Terrain', 'Parcelle', 'Lotissement'],
            'office' => ['Bureau', 'Espace de travail', 'Local commercial'],
            'shop' => ['Boutique', 'Magasin', 'Commerce'],
        ];

        $typeTitles = $titles[$type] ?? ['Propriété'];
        $title = $typeTitles[array_rand($typeTitles)];
        $action = $transactionType === 'sale' ? 'à vendre' : 'à louer';

        return "$title $action";
    }

    private function generateDescription(string $type): string
    {
        $descriptions = [
            'apartment' => 'Bel appartement bien situé, proche des commodités. Lumineux et spacieux.',
            'house' => 'Maison familiale avec jardin, idéale pour une famille. Quartier calme et sécurisé.',
            'villa' => 'Villa de standing avec toutes les commodités modernes. Piscine et jardin paysager.',
            'land' => 'Terrain constructible, bien situé. Tous les documents en règle.',
            'office' => 'Espace de bureau moderne, idéal pour entreprise. Parking disponible.',
            'shop' => 'Local commercial bien situé, passage important. Idéal pour commerce.',
        ];

        return $descriptions[$type] ?? 'Propriété de qualité, bien entretenue.';
    }

    private function generateFeatures(): array
    {
        $allFeatures = ['parking', 'garden', 'pool', 'security', 'elevator', 'balcony', 'terrace', 'garage'];
        $count = rand(2, 5);
        
        return array_slice($allFeatures, 0, $count);
    }
}

