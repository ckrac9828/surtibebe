<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Contraseña de desarrollo fija ("password") — solo para cuando se
        // resetea la base local con migrate:fresh --seed. En producción, el
        // administrador real siempre debe cambiarla de inmediato (o entrar
        // por "¿olvidaste tu contraseña?") en vez de dejar esta por defecto.
        User::factory()->create([
            'name' => 'Administrador Surtibebé',
            'email' => config('app.admin_email', 'admin@example.com'),
        ]);

         $this->call([
        CategorySeeder::class,
        ProductSeeder::class,
    ]);
    }
}
