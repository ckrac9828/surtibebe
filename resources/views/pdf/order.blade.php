<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Pedido {{ $order->order_number }}</title>
    <style>
        @page { margin: 28px 36px; }
        body { font-family: 'Helvetica', sans-serif; color: #16202B; font-size: 12px; }

        table { width: 100%; border-collapse: collapse; }

        .header-table td { vertical-align: top; }
        /* El logo real es 1536×1024 (proporción 3:2) — se respeta esa
           proporción para que no se vea aplastado/angosto. */
        .logo { width: 110px; height: 73px; }
        .brand-name { font-size: 20px; font-weight: bold; color: #16324F; margin: 0; }
        .brand-tagline { font-size: 11px; color: #55636F; margin: 2px 0 0; }
        .order-title { font-size: 16px; font-weight: bold; color: #16324F; margin: 0; text-align: right; }
        .order-date { font-size: 11px; color: #55636F; margin: 2px 0 0; text-align: right; }

        .divider { border-top: 2px solid #EAF3FB; margin: 16px 0; }

        .section-title {
            font-size: 11px; font-weight: bold; text-transform: uppercase;
            letter-spacing: 0.06em; color: #55636F; margin: 0 0 8px;
        }

        .client-table td { padding: 3px 0; font-size: 12px; }
        .client-table td.label { color: #55636F; width: 90px; }
        .client-table td.value { color: #16202B; font-weight: bold; }

        .items-table { margin-top: 8px; }
        .items-table th {
            background: #16324F; color: #ffffff; font-size: 10px; text-transform: uppercase;
            letter-spacing: 0.04em; padding: 8px 10px; text-align: left;
        }
        .items-table td { padding: 8px 10px; border-bottom: 1px solid #EAF3FB; font-size: 12px; }
        .items-table .num { text-align: right; }

        .totals-table { width: 260px; margin-left: auto; margin-top: 12px; }
        .totals-table td { padding: 4px 0; font-size: 12px; }
        .totals-table td.num { text-align: right; }
        .totals-table .total-row td { font-size: 15px; font-weight: bold; color: #16324F; border-top: 1px solid #D7DEE4; padding-top: 8px; }

        .footer { margin-top: 40px; font-size: 10px; color: #96A5B2; text-align: center; }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td style="width: 110px;">
                <img class="logo" src="data:image/png;base64,{{ $logo }}" alt="Surtibebé">
            </td>
            <td style="padding-left: 12px;">
                <p class="brand-name">Surtibebé</p>
                <p class="brand-tagline">Tu aliado en tu negocio</p>
            </td>
            <td>
                <p class="order-title">Pedido {{ $order->order_number }}</p>
                <p class="order-date">{{ $order->created_at->format('d/m/Y') }}</p>
            </td>
        </tr>
    </table>

    <div class="divider"></div>

    <p class="section-title">Datos del cliente</p>
    <table class="client-table">
        <tr>
            <td class="label">Empresa</td>
            <td class="value">{{ $order->company_name }}</td>
        </tr>
        <tr>
            <td class="label">NIT</td>
            <td class="value">{{ $order->nit }}</td>
        </tr>
        <tr>
            <td class="label">Dirección</td>
            <td class="value">{{ $order->address }}</td>
        </tr>
        <tr>
            <td class="label">Teléfono</td>
            <td class="value">{{ $order->phone }}</td>
        </tr>
        @if ($order->observations)
            <tr>
                <td class="label">Observaciones</td>
                <td class="value">{{ $order->observations }}</td>
            </tr>
        @endif
    </table>

    <p class="section-title" style="margin-top: 20px;">Productos pedidos</p>
    <table class="items-table">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Color</th>
                <th class="num">Precio</th>
                <th class="num">Cantidad</th>
                <th class="num">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($order->items as $item)
                <tr>
                    <td>{{ $item->product_name }}</td>
                    <td>{{ $item->color ?? '—' }}</td>
                    <td class="num">$ {{ number_format($item->price, 0, ',', '.') }}</td>
                    <td class="num">{{ $item->quantity }}</td>
                    <td class="num">$ {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals-table">
        <tr>
            <td>Subtotal</td>
            <td class="num">$ {{ number_format($order->subtotal, 0, ',', '.') }}</td>
        </tr>
        <tr class="total-row">
            <td>Total</td>
            <td class="num">$ {{ number_format($order->total, 0, ',', '.') }}</td>
        </tr>
    </table>

    <p class="footer">Surtibebé · Documento generado automáticamente a partir del pedido {{ $order->order_number }}</p>
</body>
</html>
