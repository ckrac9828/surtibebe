<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Order $order)
    {
        //
    }

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
        $message = (new MailMessage)
            ->subject("Nuevo pedido {$this->order->order_number}")
            ->line("Ha llegado un nuevo pedido de \"{$this->order->company_name}\".")
            ->line("Número de pedido: {$this->order->order_number}")
            ->line('')
            ->line('**Datos del cliente**')
            ->line("Empresa: {$this->order->company_name}")
            ->line("NIT: {$this->order->nit}")
            ->line("Dirección: {$this->order->address}")
            ->line("Teléfono: {$this->order->phone}");

        if ($this->order->observations) {
            $message->line("Observaciones: {$this->order->observations}");
        }

        $message->line('')->line('**Productos pedidos**');

        foreach ($this->order->items as $item) {
            $detail = $item->product_name;
            if ($item->color) {
                $detail .= " — color {$item->color}";
            }

            $message->line("{$item->quantity} x {$detail} (\$".number_format($item->subtotal, 0, ',', '.').')');
        }

        return $message
            ->line('Total: $'.number_format($this->order->total, 0, ',', '.'))
            ->action('Ver pedido', url("/admin/pedidos/{$this->order->id}"))
            ->line('Este es un aviso automático de Surtibebé.');
    }
}
