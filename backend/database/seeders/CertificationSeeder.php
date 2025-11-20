<?php

namespace Database\Seeders;

use App\Models\Certification;
use App\Models\User;
use Illuminate\Database\Seeder;

class CertificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer une certification bronze pour tous les utilisateurs existants
        User::chunk(100, function ($users) {
            foreach ($users as $user) {
                Certification::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'level' => 'bronze',
                        'points' => 0,
                        'transactions_count' => 0,
                        'average_rating' => 0,
                        'phone_verified' => !empty($user->phone),
                        'email_verified' => !empty($user->email_verified_at),
                        'identity_verified' => false,
                        'title_verified' => false,
                        'disputes_count' => 0,
                        'verified_at' => now(),
                    ]
                );
            }
        });
    }
}

