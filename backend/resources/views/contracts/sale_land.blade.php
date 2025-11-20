<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Acte de Vente Terrain - {{ $data['property']['title'] }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.6; }
        h1 { text-align: center; color: #333; }
        h2 { color: #555; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
        .section { margin: 20px 0; }
        .parties { display: flex; justify-content: space-between; margin: 20px 0; }
        .party { width: 48%; }
        .signature { margin-top: 50px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        td { padding: 8px; border: 1px solid #ddd; }
        .footer { margin-top: 50px; font-size: 10px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <h1>ACTE DE VENTE DE TERRAIN</h1>
    
    <div class="section">
        <h2>1. PARTIES</h2>
        <div class="parties">
            <div class="party">
                <strong>VENDEUR</strong><br>
                Nom : {{ $data['seller']['name'] }}<br>
                Email : {{ $data['seller']['email'] }}<br>
                Téléphone : {{ $data['seller']['phone'] ?? 'N/A' }}
            </div>
            <div class="party">
                <strong>ACHETEUR</strong><br>
                Nom : {{ $data['buyer']['name'] }}<br>
                Email : {{ $data['buyer']['email'] }}<br>
                Téléphone : {{ $data['buyer']['phone'] ?? 'N/A' }}
            </div>
        </div>
    </div>

    <div class="section">
        <h2>2. DÉSIGNATION DU TERRAIN</h2>
        <p><strong>Adresse :</strong> {{ $data['property']['address'] }}</p>
        <p><strong>Surface :</strong> {{ $data['property']['surface'] }} m²</p>
        @if(!empty($data['terms']['title_deed_number']))
        <p><strong>Numéro titre foncier :</strong> {{ $data['terms']['title_deed_number'] }}</p>
        @endif
    </div>

    <div class="section">
        <h2>3. CONDITIONS DE VENTE</h2>
        <table>
            <tr>
                <td><strong>Prix de vente</strong></td>
                <td>{{ number_format($data['terms']['sale_price'], 0, ',', ' ') }} GNF</td>
            </tr>
            <tr>
                <td><strong>Arrhes versées</strong></td>
                <td>{{ number_format($data['terms']['deposit'] ?? 0, 0, ',', ' ') }} GNF</td>
            </tr>
            <tr>
                <td><strong>Modalités de paiement</strong></td>
                <td>{{ $data['terms']['payment_terms'] ?? 'Comptant' }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>4. GARANTIES</h2>
        <p>Le vendeur garantit être propriétaire du terrain et s'engage à transférer la propriété à l'acheteur.</p>
        <p>L'acheteur reconnaît avoir visité le terrain et l'accepter en l'état.</p>
    </div>

    <div class="section">
        <h2>5. SIGNATURES</h2>
        <div class="signature">
            <p>Le vendeur : _________________________</p>
            <p>Date : _______________</p>
        </div>
        <div class="signature">
            <p>L'acheteur : _________________________</p>
            <p>Date : _______________</p>
        </div>
    </div>

    <div class="footer">
        <p>Acte généré le {{ now()->format('d/m/Y à H:i') }} via Immo Guinée</p>
        <p>Pour valeur légale complète, enregistrement notarial recommandé</p>
    </div>
</body>
</html>

