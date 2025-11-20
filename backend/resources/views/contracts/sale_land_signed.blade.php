@include('contracts.sale_land')

<div class="section" style="margin-top: 50px;">
    <h2>SIGNATURES ÉLECTRONIQUES</h2>
    @foreach($signatures as $signature)
    <div class="signature">
        <p><strong>{{ $signature->signature_type === 'seller' ? 'VENDEUR' : 'ACHETEUR' }}</strong></p>
        <p>Nom : {{ $signature->user->name }}</p>
        <p>Signé le : {{ $signature->signed_at->format('d/m/Y à H:i') }}</p>
        <p>Hash : {{ substr($signature->hash, 0, 20) }}...</p>
    </div>
    @endforeach
</div>

