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
            ['name' => 'Conakry',  'slug' => "city-district1", 'type' => 'city', 'latitude' => 9.6412, 'longitude' => -13.5784],
            ['name' => 'Kankan', 'slug' => "city-district2", 'type' => 'city', 'latitude' => 10.3844, 'longitude' => -9.3056],
            ['name' => 'Kindia', 'slug' => "city-district3", 'type' => 'city', 'latitude' => 10.0569, 'longitude' => -12.8658],
            ['name' => 'Nzérékoré', 'slug' => "city-district4", 'type' => 'city', 'latitude' => 7.7472, 'longitude' => -8.8178],
            ['name' => 'Labé', 'slug' => "city-district5", 'type' => 'city', 'latitude' => 11.3167, 'longitude' => -12.2833],
            ['name' => 'Mamou', 'slug' => "city-district6", 'type' => 'city', 'latitude' => 10.3833, 'longitude' => -12.0833],
            ['name' => 'Boké', 'slug' => "city-district7", 'type' => 'city', 'latitude' => 10.9333, 'longitude' => -14.3000],
            ['name' => 'Siguiri', 'slug' => "city-district8", 'type' => 'city', 'latitude' => 11.4167, 'longitude' => -9.1667],
        ];

        foreach ($cities as $city) {
            Location::create($city);
        }

        // Quelques quartiers/districts de Conakry
        $conakry = Location::where('name', 'Conakry')->first();

        if ($conakry) {
            $districts = [
                ['name' => 'Kaloum', 'slug' => "city-district9", 'type' => 'district', 'parent_id' => $conakry->id],
                ['name' => 'Dixinn', 'slug' => "city-district10", 'type' => 'district', 'parent_id' => $conakry->id],
                ['name' => 'Ratoma', 'slug' => "city-district11", 'type' => 'district', 'parent_id' => $conakry->id],
                ['name' => 'Matam',  'slug' => "city-district02",'type' => 'district', 'parent_id' => $conakry->id],
                ['name' => 'Matoto', 'slug' => "city-district03", 'type' => 'district', 'parent_id' => $conakry->id],
            ];

            foreach ($districts as $district) {
                Location::create($district);
            }
        }
    }
}

