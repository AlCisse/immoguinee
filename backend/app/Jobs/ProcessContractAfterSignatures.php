<?php

namespace App\Jobs;

use App\Models\Contract;
use App\Services\ContractService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessContractAfterSignatures implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Contract $contract
    ) {}

    public function handle(ContractService $contractService): void
    {
        if ($this->contract->isFullySigned()) {
            $contractService->finalizeContract($this->contract);
        }
    }
}

