<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureContentLength
{
    // El servidor embebido de PHP ("php artisan serve") no manda
    // Content-Length en respuestas dinámicas — se apoya en cerrar la
    // conexión (Connection: close) para marcar el final. Eso funciona en
    // conexión directa, pero un proxy/túnel de por medio (que le habla
    // HTTP/2 al navegador) no tiene cómo saber cuándo termina la
    // respuesta sin ese encabezado, y el navegador se queda esperando
    // para siempre aunque ya haya llegado todo el contenido.
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $response->headers->has('Content-Length')
            && ! $response->headers->has('Transfer-Encoding')
            && method_exists($response, 'getContent')
            && is_string($response->getContent())) {
            $response->headers->set('Content-Length', (string) strlen($response->getContent()));
        }

        return $response;
    }
}
