<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_steps', function (Blueprint $table) {
            $table->id(); // équivalent SERIAL
            
            $table->string('project_id', 50)->default('immo-guinee');
            $table->string('phase', 100);
            $table->string('step_number', 20)->unique();
            $table->string('title', 255);
            $table->text('description')->nullable();

            // Status avec CHECK constraint (PostgreSQL only)
            $table->string('status', 20)->default('pending');

            // Array PostgreSQL
            $table->json('depends_on')->nullable(); 
            // (Laravel ne supporte pas array PostgreSQL en natif → json est OK)

            $table->integer('priority')->default(0);
            $table->integer('estimated_time_minutes')->nullable();
            $table->integer('actual_time_minutes')->nullable();

            $table->text('file_path')->nullable();
            $table->longText('code_generated')->nullable();
            $table->longText('developer_notes')->nullable();
            $table->text('error_message')->nullable();

            $table->timestamp('completed_at')->nullable();

            $table->timestamps();
        });

        // Ajout du CHECK pour PostgreSQL
        DB::statement("
            ALTER TABLE project_steps
            ADD CONSTRAINT project_steps_status_check
            CHECK (status IN ('pending', 'in_progress', 'completed', 'error', 'blocked'));
        ");

        // Index
        DB::statement("CREATE INDEX idx_project_steps_status ON project_steps(status)");
        DB::statement("CREATE INDEX idx_project_steps_phase ON project_steps(phase)");
    }

    public function down(): void
    {
        Schema::dropIfExists('project_steps');
    }
};
