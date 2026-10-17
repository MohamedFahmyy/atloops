<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Extend users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('sales_rep')->after('email');
            $table->string('phone')->nullable()->after('role');
            $table->string('avatar')->nullable()->after('phone');
            $table->boolean('is_active')->default(true)->after('avatar');
            $table->json('custom_permissions')->nullable()->after('is_active');
        });

        // 2. Services table
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('icon')->default('Briefcase');
            $table->string('category')->default('software');
            $table->string('title_en');
            $table->string('title_ar');
            $table->text('short_desc_en');
            $table->text('short_desc_ar');
            $table->longText('description_en');
            $table->longText('description_ar');
            $table->json('benefits_en')->nullable();
            $table->json('benefits_ar')->nullable();
            $table->json('capabilities_en')->nullable();
            $table->json('capabilities_ar')->nullable();
            $table->json('process_steps_en')->nullable();
            $table->json('process_steps_ar')->nullable();
            $table->json('faqs')->nullable();
            $table->string('meta_title_en')->nullable();
            $table->string('meta_title_ar')->nullable();
            $table->text('meta_description_en')->nullable();
            $table->text('meta_description_ar')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 3. Product Categories
        Schema::create('product_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name_en');
            $table->string('name_ar');
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 4. Products / Software Solutions
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('product_categories')->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('name_en');
            $table->string('name_ar');
            $table->string('tagline_en')->nullable();
            $table->string('tagline_ar')->nullable();
            $table->text('short_desc_en');
            $table->text('short_desc_ar');
            $table->longText('description_en');
            $table->longText('description_ar');
            $table->json('features_en')->nullable();
            $table->json('features_ar')->nullable();
            $table->string('badge')->nullable(); // e.g., Best Selling, New, 20% OFF
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('original_price', 10, 2)->nullable();
            $table->string('pricing_model')->default('one_time'); // subscription, one_time, quote
            $table->string('demo_url')->nullable();
            $table->string('thumbnail')->nullable();
            $table->json('gallery')->nullable();
            $table->json('supported_platforms')->nullable(); // Web, iOS, Android, Cloud, Desktop
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 5. Portfolio Projects
        Schema::create('portfolio_projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title_en');
            $table->string('title_ar');
            $table->string('client_name_en')->nullable();
            $table->string('client_name_ar')->nullable();
            $table->string('industry_en');
            $table->string('industry_ar');
            $table->text('short_desc_en');
            $table->text('short_desc_ar');
            $table->longText('description_en');
            $table->longText('description_ar');
            $table->longText('challenge_en')->nullable();
            $table->longText('challenge_ar')->nullable();
            $table->longText('solution_en')->nullable();
            $table->longText('solution_ar')->nullable();
            $table->json('results_en')->nullable();
            $table->json('results_ar')->nullable();
            $table->json('tech_stack')->nullable(); // e.g., ['Laravel', 'React', 'MySQL', 'Tailwind']
            $table->string('thumbnail')->nullable();
            $table->json('gallery')->nullable();
            $table->string('live_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 6. Blog Categories & Blog Posts
        Schema::create('blog_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name_en');
            $table->string('name_ar');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('blog_categories')->nullOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('title_en');
            $table->string('title_ar');
            $table->text('excerpt_en');
            $table->text('excerpt_ar');
            $table->longText('content_en');
            $table->longText('content_ar');
            $table->string('thumbnail')->nullable();
            $table->integer('reading_time')->default(5);
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->unsignedBigInteger('view_count')->default(0);
            $table->string('meta_title_en')->nullable();
            $table->string('meta_title_ar')->nullable();
            $table->text('meta_description_en')->nullable();
            $table->text('meta_description_ar')->nullable();
            $table->timestamps();
        });

        // 7. Pages, Page Sections (Block Builder), and Revisions
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title_en');
            $table->string('title_ar');
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->string('meta_title_en')->nullable();
            $table->string('meta_title_ar')->nullable();
            $table->text('meta_description_en')->nullable();
            $table->text('meta_description_ar')->nullable();
            $table->timestamps();
        });

        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained('pages')->cascadeOnDelete();
            $table->string('block_type'); // hero, services_grid, solutions_catalog, portfolio_grid, stats_counter, testimonials_slider, faq_accordion, rich_text, cta_banner, contact_form
            $table->integer('sort_order')->default(0);
            $table->json('content_en');
            $table->json('content_ar');
            $table->json('settings')->nullable(); // background, padding, alignment
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('page_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained('pages')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('revision_title')->nullable();
            $table->json('snapshot');
            $table->timestamps();
        });

        // 8. CRM Leads, Lead Notes, and Lead Activities
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('email');
            $table->string('phone');
            $table->string('country')->nullable();
            $table->string('service_of_interest')->nullable();
            $table->string('estimated_budget')->nullable();
            $table->text('message');
            $table->string('source_page')->nullable();
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'])->default('new');
            $table->timestamps();
        });

        Schema::create('lead_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained('leads')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('note');
            $table->timestamps();
        });

        Schema::create('lead_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained('leads')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action'); // status_changed, note_added, assigned, created
            $table->text('description');
            $table->timestamps();
        });

        // 9. Testimonials & FAQs
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('client_name_en');
            $table->string('client_name_ar');
            $table->string('client_role_en');
            $table->string('client_role_ar');
            $table->string('company_en');
            $table->string('company_ar');
            $table->text('content_en');
            $table->text('content_ar');
            $table->integer('rating')->default(5);
            $table->string('avatar')->nullable();
            $table->boolean('is_featured')->default(true);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('category')->default('general');
            $table->text('question_en');
            $table->text('question_ar');
            $table->longText('answer_en');
            $table->longText('answer_ar');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 10. Media Assets
        Schema::create('media_assets', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->string('original_name');
            $table->string('mime_type');
            $table->unsignedBigInteger('file_size');
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->string('path');
            $table->string('alt_text_en')->nullable();
            $table->string('alt_text_ar')->nullable();
            $table->foreignId('uploader_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 11. Global Settings
        Schema::create('global_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value');
            $table->string('group')->default('general'); // branding, contact, social, seo
            $table->timestamps();
        });

        // 12. Redirects
        Schema::create('redirects', function (Blueprint $table) {
            $table->id();
            $table->string('source_path')->unique();
            $table->string('target_path');
            $table->integer('status_code')->default(301);
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('hit_count')->default(0);
            $table->timestamps();
        });

        // 13. Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action'); // login, create, update, delete, publish
            $table->string('entity_type')->nullable();
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->json('details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('redirects');
        Schema::dropIfExists('global_settings');
        Schema::dropIfExists('media_assets');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('lead_activities');
        Schema::dropIfExists('lead_notes');
        Schema::dropIfExists('leads');
        Schema::dropIfExists('page_revisions');
        Schema::dropIfExists('page_sections');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('blog_categories');
        Schema::dropIfExists('portfolio_projects');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_categories');
        Schema::dropIfExists('services');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'avatar', 'is_active', 'custom_permissions']);
        });
    }
};
