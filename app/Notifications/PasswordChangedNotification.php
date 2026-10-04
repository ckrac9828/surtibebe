<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordChangedNotification extends Notification
{
    use Queueable;

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Tu contraseña fue actualizada')
            ->line('La contraseña de tu cuenta de administrador en Surtibebé se actualizó correctamente.')
            ->line('Fecha: '.now()->timezone(config('app.timezone'))->translatedFormat('d \d\e F \d\e Y, h:i a'))
            ->line('Si no fuiste tú quien hizo este cambio, contacta de inmediato al equipo técnico.');
    }
}
