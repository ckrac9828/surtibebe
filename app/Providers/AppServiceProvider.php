<?php

namespace App\Providers;

use Illuminate\Mail\Events\MessageSending;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\Mime\Part\File;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // El logo del header de los correos (resources/views/vendor/mail/html/header.blade.php)
        // se referencia como "cid:surtibebe-logo@surtibebe". Un data:URI en base64 no sirve
        // porque Gmail lo bloquea en el HTML recibido; un adjunto inline con Content-ID sí
        // lo muestra en todos los clientes. Esto se engancha una sola vez aquí para que
        // aplique a cualquier notificación/correo que use la plantilla, sin repetirlo en
        // cada clase de notificación.
        Event::listen(MessageSending::class, function (MessageSending $event) {
            $path = resource_path('images/logo-email.png');

            if (! file_exists($path)) {
                return;
            }

            $logo = (new DataPart(new File($path), 'logo.png', 'image/png'))->asInline();
            $logo->setContentId('surtibebe-logo@surtibebe');

            $event->message->addPart($logo);
        });
    }
}
