<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderPdfController extends Controller
{
    public function download(Order $pedido)
    {
        $pedido->load('items');

        // dompdf no puede resolver /storage ni rutas de Vite — se embebe el
        // logo como base64 directamente en el HTML para que siempre aparezca,
        // sin depender de un servidor corriendo al momento de generar el PDF.
        $logo = base64_encode(file_get_contents(resource_path('images/logo.png')));

        $pdf = Pdf::loadView('pdf.order', [
            'order' => $pedido,
            'logo' => $logo,
        ]);

        $fileName = 'pedido-'.str_replace('#', '', $pedido->order_number).'.pdf';

        return $pdf->download($fileName);
    }
}
