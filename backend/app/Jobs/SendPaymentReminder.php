<?php

namespace App\Jobs;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendPaymentReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Transaction $transaction
    ) {}

    public function handle(): void
    {
        // TODO: Envoyer SMS/Email de rappel
        Log::info('Payment reminder', [
            'transaction_id' => $this->transaction->id,
            'user_id' => $this->transaction->user_id,
            'amount' => $this->transaction->amount,
        ]);

        // Marquer comme "due" si pas encore payé
        if ($this->transaction->status === 'pending' && $this->transaction->due_date && now()->isAfter($this->transaction->due_date)) {
            $this->transaction->update(['status' => 'due']);
        }

        // Marquer comme "overdue" après 7 jours
        if ($this->transaction->status === 'due' && $this->transaction->due_date && now()->isAfter($this->transaction->due_date->addDays(7))) {
            $this->transaction->update(['status' => 'overdue']);
        }
    }
}

