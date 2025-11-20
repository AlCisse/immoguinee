<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contrat de Location - {{ $data['property']['title'] }}</title>
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
    <h1>CONTRAT DE LOCATION</h1>
    
    <div class="section">
        <h2>1. PARTIES</h2>
        <div class="parties">
            <div class="party">
                <strong>BAILLEUR (Propriétaire)</strong><br>
                Nom : {{ $data['landlord']['name'] }}<br>
                Email : {{ $data['landlord']['email'] }}<br>
                Téléphone : {{ $data['landlord']['phone'] ?? 'N/A' }}<br>
                Adresse : {{ $data['landlord']['address'] ?? 'N/A' }}
            </div>
            <div class="party">
                <strong>LOCATAIRE</strong><br>
                Nom : {{ $data['tenant']['name'] }}<br>
                Email : {{ $data['tenant']['email'] }}<br>
                Téléphone : {{ $data['tenant']['phone'] ?? 'N/A' }}<br>
                Adresse : {{ $data['tenant']['address'] ?? 'N/A' }}
            </div>
        </div>
    </div>

    <div class="section">
        <h2>2. DÉSIGNATION DU BIEN</h2>
        <p><strong>Type :</strong> {{ ucfirst($data['property']['type']) }}</p>
        <p><strong>Adresse :</strong> {{ $data['property']['address'] }}</p>
        <p><strong>Surface :</strong> {{ $data['property']['surface'] }} m²</p>
        <p><strong>Nombre de pièces :</strong> {{ $data['property']['bedrooms'] ?? 'N/A' }} chambres, {{ $data['property']['bathrooms'] ?? 'N/A' }} salles de bain</p>
        <p><strong>Équipements :</strong> {{ implode(', ', $data['property']['features'] ?? []) }}</p>
    </div>

    <div class="section">
        <h2>3. CONDITIONS FINANCIÈRES</h2>
        <table>
            <tr>
                <td><strong>Loyer mensuel</strong></td>
                <td>{{ number_format($data['terms']['rent_amount'], 0, ',', ' ') }} GNF</td>
            </tr>
            <tr>
                <td><strong>Caution</strong></td>
                <td>{{ number_format($data['terms']['deposit'], 0, ',', ' ') }} GNF</td>
            </tr>
            <tr>
                <td><strong>Charges</strong></td>
                <td>{{ $data['terms']['charges_included'] ? 'Incluses dans le loyer' : 'Séparées' }}</td>
            </tr>
            <tr>
                <td><strong>Jour de paiement</strong></td>
                <td>Le {{ $data['terms']['payment_day'] }} de chaque mois</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>4. DURÉE ET RENOUVELLEMENT</h2>
        <p><strong>Date de début :</strong> {{ \Carbon\Carbon::parse($data['terms']['start_date'])->format('d/m/Y') }}</p>
        <p><strong>Durée :</strong> {{ $data['terms']['duration_months'] }} mois</p>
        <p><strong>Reconduction :</strong> {{ $data['terms']['renewal_type'] === 'tacite' ? 'Tacite' : 'Expresse' }}</p>
        <p><strong>Préavis :</strong> {{ $data['terms']['notice_period_months'] ?? 3 }} mois</p>
    </div>

    <div class="section">
        <h2>5. OBLIGATIONS</h2>
        <p><strong>Obligations du bailleur :</strong> Délivrer le logement en bon état, effectuer les réparations lourdes, garantir la jouissance paisible.</p>
        <p><strong>Obligations du locataire :</strong> Payer le loyer ponctuellement, entretenir le logement, souscrire une assurance habitation, respecter le voisinage.</p>
    </div>

    @if(!empty($data['additional_terms']))
    <div class="section">
        <h2>6. CLAUSES SPÉCIFIQUES</h2>
        @foreach($data['additional_terms'] as $term)
        <p>{{ $term }}</p>
        @endforeach
    </div>
    @endif

    <div class="section">
        <h2>7. SIGNATURES</h2>
        <div class="signature">
            <p>Le bailleur : _________________________</p>
            <p>Date : _______________</p>
        </div>
        <div class="signature">
            <p>Le locataire : _________________________</p>
            <p>Date : _______________</p>
        </div>
    </div>

    <div class="footer">
        <p>Contrat généré le {{ now()->format('d/m/Y à H:i') }} via Immo Guinée</p>
        <p>Ce contrat est légalement valable selon la loi guinéenne</p>
    </div>
</body>
</html>

