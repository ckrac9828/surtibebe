<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\EnsureContentLength::class,
        ]);

        // Sin esto, Laravel genera las URLs de assets/rutas con el host
        // literal que ve el servidor local (127.0.0.1:8000) en vez del
        // dominio público real — rompe cualquier proxy delante de la app
        // (túneles de desarrollo tipo VS Code Port Forwarding/ngrok, y
        // también un balanceador/CDN el día de producción en Hostinger).
        // "*" confía en cualquier proxy porque en local no se sabe de
        // antemano la IP del túnel; en un servidor propio con proxy fijo
        // convendría restringirlo a esa IP en vez de "*".
        $middleware->trustProxies(at: '*');

        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
