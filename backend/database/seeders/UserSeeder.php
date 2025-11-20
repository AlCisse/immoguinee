<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@immoguinee.gn',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'is_verified' => true,
        ]);

        // Agents
        for ($i = 1; $i <= 5; $i++) {
            User::create([
                'name' => "Agent $i",
                'email' => "agent$i@immoguinee.gn",
                'password' => Hash::make('password'),
                'phone' => "+224 6" . str_pad($i, 7, '0', STR_PAD_LEFT),
                'role' => 'agent',
                'bio' => "Agent immobilier professionnel avec $i années d'expérience",
                'is_active' => true,
                'is_verified' => true,
            ]);
        }

        // Clients
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => "Client $i",
                'email' => "client$i@example.com",
                'password' => Hash::make('password'),
                'phone' => "+224 6" . str_pad($i + 5, 7, '0', STR_PAD_LEFT),
                'role' => 'client',
                'is_active' => true,
                'is_verified' => $i % 2 === 0, // 50% vérifiés
            ]);
        }
    }
}

