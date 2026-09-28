<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['category' => 'Juguetes', 'name' => 'Peluche Oso', 'description' => 'Peluche suave y seguro para los más pequeños.', 'price' => 25000, 'stock' => 50, 'min_purchase' => 6, 'colors' => [
                ['name' => 'Café', 'hex' => '#8B5E3C'],
                ['name' => 'Rosado', 'hex' => '#F4A6C6'],
                ['name' => 'Blanco', 'hex' => '#FFFFFF'],
            ]],
            ['category' => 'Juguetes', 'name' => 'Carro Didáctico', 'description' => 'Carro colorido que estimula la coordinación motriz.', 'price' => 32000, 'stock' => 30, 'min_purchase' => 6, 'colors' => [
                ['name' => 'Rojo', 'hex' => '#E5484D'],
                ['name' => 'Azul', 'hex' => '#2D6FA3'],
                ['name' => 'Amarillo', 'hex' => '#F5A623'],
            ]],
            ['category' => 'Juguetes', 'name' => 'Juguete Musical', 'description' => 'Emite sonidos y melodías para estimular al bebé.', 'price' => 26000, 'stock' => 45, 'min_purchase' => 6],
            ['category' => 'Juguetes', 'name' => 'Muñeca de Tela', 'description' => 'Muñeca suave hecha en tela antialérgica.', 'price' => 28000, 'stock' => 20, 'min_purchase' => 6, 'colors' => [
                ['name' => 'Rosado', 'hex' => '#F4A6C6'],
                ['name' => 'Beige', 'hex' => '#E8D5C4'],
            ]],
            ['category' => 'Juguetes', 'name' => 'Pelota Sensorial', 'description' => 'Pelota con texturas para estimular el tacto.', 'price' => 15000, 'stock' => 60, 'min_purchase' => 12],

            ['category' => 'Bebés', 'name' => 'Sonajero', 'description' => 'Sonajero liviano ideal para las primeras semanas.', 'price' => 16000, 'stock' => 80, 'min_purchase' => 12],
            ['category' => 'Bebés', 'name' => 'Mordedor', 'description' => 'Mordedor de silicona libre de BPA.', 'price' => 14000, 'stock' => 70, 'min_purchase' => 12],
            ['category' => 'Bebés', 'name' => 'Chupete Ortodóntico', 'description' => 'Diseño ortodóntico que respeta el paladar del bebé.', 'price' => 8000, 'stock' => 100, 'min_purchase' => 24],
            ['category' => 'Bebés', 'name' => 'Móvil para Cuna', 'description' => 'Móvil giratorio con melodías relajantes.', 'price' => 45000, 'stock' => 15, 'min_purchase' => 3],

            ['category' => 'Accesorios', 'name' => 'Set de Baberos x3', 'description' => 'Set de 3 baberos impermeables.', 'price' => 12000, 'stock' => 90, 'min_purchase' => 12],
            ['category' => 'Accesorios', 'name' => 'Cobija Suave', 'description' => 'Cobija de algodón suave para cuna.', 'price' => 30000, 'stock' => 25, 'min_purchase' => 6, 'colors' => [
                ['name' => 'Celeste', 'hex' => '#A8D8EA'],
                ['name' => 'Rosado', 'hex' => '#F4A6C6'],
                ['name' => 'Gris', 'hex' => '#C4C4C4'],
            ]],
            ['category' => 'Accesorios', 'name' => 'Set de Toallas', 'description' => 'Toallas absorbentes con capucha.', 'price' => 22000, 'stock' => 35, 'min_purchase' => 6],
            ['category' => 'Accesorios', 'name' => 'Organizador de Pañales', 'description' => 'Organizador portátil para pañales y toallitas.', 'price' => 35000, 'stock' => 20, 'min_purchase' => 6],

            ['category' => 'Didácticos', 'name' => 'Set de Bloques', 'description' => 'Bloques de encaje para desarrollar la motricidad.', 'price' => 18000, 'stock' => 60, 'min_purchase' => 6],
            ['category' => 'Didácticos', 'name' => 'Libro de Tela', 'description' => 'Libro interactivo de tela con texturas y sonidos.', 'price' => 20000, 'stock' => 40, 'min_purchase' => 12],
            ['category' => 'Didácticos', 'name' => 'Rompecabezas de Madera', 'description' => 'Rompecabezas de madera con figuras de animales.', 'price' => 24000, 'stock' => 30, 'min_purchase' => 6],
            ['category' => 'Didácticos', 'name' => 'Tablero de Actividades', 'description' => 'Tablero con actividades sensoriales variadas.', 'price' => 38000, 'stock' => 18, 'min_purchase' => 3],

            ['category' => 'Otros', 'name' => 'Caja de Música', 'description' => 'Caja musical decorativa para la habitación del bebé.', 'price' => 33000, 'stock' => 22, 'min_purchase' => 6],
            ['category' => 'Otros', 'name' => 'Kit de Baño', 'description' => 'Kit con esponja, toalla y jabonera.', 'price' => 27000, 'stock' => 28, 'min_purchase' => 6],
            ['category' => 'Otros', 'name' => 'Set de Mordedores', 'description' => 'Set de 3 mordedores de distintas formas.', 'price' => 19000, 'stock' => 50, 'min_purchase' => 12],
        ];

        // Los últimos 3 del listado se dejan con fecha de creación real (hoy)
        // para que se vean como "nuevos"; el resto se "envejece" a 30 días
        // atrás para simular un catálogo ya establecido — así se puede ver
        // de una vez cómo luce cada situación, sin esperar 14 días de verdad.
        $recentCount = 3;
        $total = count($products);

        foreach ($products as $index => $data) {
            $category = Category::where('name', $data['category'])->first();

            $product = Product::create([
                'category_id' => $category->id,
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'description' => $data['description'],
                'price' => $data['price'],
                'stock' => $data['stock'],
                'min_purchase' => $data['min_purchase'],
                'status' => 'active',
            ]);

            foreach ($data['colors'] ?? [] as $sortOrder => $color) {
                $product->colors()->create([
                    'name' => $color['name'],
                    'hex_value' => $color['hex'],
                    'sort_order' => $sortOrder,
                ]);
            }

            if ($index < $total - $recentCount) {
                $product->forceFill([
                    'created_at' => now()->subDays(30),
                    'updated_at' => now()->subDays(30),
                ])->save();
            }
        }
    }
}