<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Villes principales de Guinée
        $cities = [
            ['name' => 'Conakry', 'type' => 'city', 'latitude' => 9.6412, 'longitude' => -13.5784],
            ['name' => 'Kankan', 'type' => 'city', 'latitude' => 10.3844, 'longitude' => -9.3056],
            ['name' => 'Kindia', 'type' => 'city', 'latitude' => 10.0569, 'longitude' => -12.8658],
            ['name' => 'Nzérékoré', 'type' => 'city', 'latitude' => 7.7472, 'longitude' => -8.8178],
            ['name' => 'Labé', 'type' => 'city', 'latitude' => 11.3167, 'longitude' => -12.2833],
            ['name' => 'Mamou', 'type' => 'city', 'latitude' => 10.3833, 'longitude' => -12.0833],
            ['name' => 'Boké', 'type' => 'city', 'latitude' => 10.9333, 'longitude' => -14.3000],
            ['name' => 'Siguiri', 'type' => 'city', 'latitude' => 11.4167, 'longitude' => -9.1667],
        ];

        foreach ($cities as $city) {
            Location::create($city);
        }

        // Quelques quartiers/districts de Conakry
        $conakry = Location::where('name', 'Conakry')->first();

        if ($conakry) {
            $districts = [
                ['name' => 'Kaloum', 'type' => 'district', 'parent_id' => $conakry->id],
                ['name' => 'Dixinn', 'type' => 'district', 'parent_id' => $conakry->id],
                ['name' => 'Ratoma', 'type' => 'district', 'parent_id' => $conakry->id],
                ['name' => 'Matam', 'type' => 'district', 'parent_id' => $conakry->id],
                ['name' => 'Matoto', 'type' => 'district', 'parent_id' => $conakry->id],
            ];

            foreach ($districts as $district) {
                Location::create($district);
            }
        }
    }
}

