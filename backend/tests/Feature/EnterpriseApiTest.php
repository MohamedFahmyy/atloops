<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Service;
use App\Models\Product;
use App\Models\PortfolioProject;
use App\Models\Page;
use App\Models\Lead;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class EnterpriseApiTest extends TestCase
{
    public function test_public_health_endpoint_returns_ok(): void
    {
        $response = $this->getJson('/api/v1/health');
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'checks' => [
                    'database' => 'healthy',
                ],
            ]);
    }

    public function test_public_settings_endpoint_returns_success(): void
    {
        $response = $this->getJson('/api/v1/settings');
        $response->assertStatus(200)
            ->assertJsonStructure(['status', 'data']);
    }

    public function test_public_services_endpoint_returns_data(): void
    {
        $response = $this->getJson('/api/v1/services');
        $response->assertStatus(200)
            ->assertJsonStructure(['status', 'data' => [
                '*' => ['id', 'slug', 'title_en', 'title_ar', 'category']
            ]]);
    }

    public function test_public_products_endpoint_returns_data(): void
    {
        $response = $this->getJson('/api/v1/products');
        $response->assertStatus(200)
            ->assertJsonStructure(['status', 'data' => [
                '*' => ['id', 'slug', 'name_en', 'name_ar', 'category_id']
            ]]);
    }

    public function test_public_portfolio_endpoint_returns_data(): void
    {
        $response = $this->getJson('/api/v1/portfolio');
        $response->assertStatus(200)
            ->assertJsonStructure(['status', 'data' => [
                '*' => ['id', 'slug', 'title_en', 'title_ar']
            ]]);
    }

    public function test_public_page_builder_returns_home_page_with_sections(): void
    {
        $response = $this->getJson('/api/v1/pages/home');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'id',
                    'slug',
                    'title_en',
                    'sections' => [
                        '*' => ['id', 'block_type', 'sort_order', 'content_en', 'content_ar']
                    ]
                ]
            ]);
    }

    public function test_crm_lead_submission_with_validation(): void
    {
        $payload = [
            'name' => 'Dr. Khaled Mostafa',
            'company' => 'Nile Medical Supplies',
            'email' => 'k.mostafa@nilemed.eg',
            'phone' => '+201112194828',
            'country' => 'Egypt',
            'service_of_interest' => 'ERP Systems',
            'estimated_budget' => '$10,000 - $25,000',
            'message' => 'We require a customized enterprise ERP system for inventory and supply chain tracking.',
            'source_page' => '/services/erp-systems',
        ];

        $response = $this->postJson('/api/v1/leads', $payload);
        $response->assertStatus(201)
            ->assertJson(['status' => 'success'])
            ->assertJsonStructure(['status', 'message', 'lead_id']);

        $this->assertDatabaseHas('leads', [
            'email' => 'k.mostafa@nilemed.eg',
            'status' => 'new'
        ]);
    }

    public function test_crm_lead_submission_honeypot_ignores_bot(): void
    {
        $payload = [
            'name' => 'Spam Bot',
            'email' => 'spambot@auto.ru',
            'phone' => '123456789',
            'message' => 'Spam link content',
            'website_hp' => 'http://spam-link.ru', // honeypot triggered
        ];

        $response = $this->postJson('/api/v1/leads', $payload);
        $response->assertStatus(200);

        // Verify lead was NOT inserted into database
        $this->assertDatabaseMissing('leads', [
            'email' => 'spambot@auto.ru'
        ]);
    }

    public function test_crm_lead_submission_requires_valid_email(): void
    {
        $payload = [
            'name' => 'Incomplete Lead',
            'email' => 'not-an-email',
            'phone' => '12345',
            'message' => 'Short message'
        ];

        $response = $this->postJson('/api/v1/leads', $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_admin_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'superadmin@atloops.com',
            'password' => 'SuperAdmin@2026!Secured',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'token',
                'user' => ['id', 'name', 'email', 'role']
            ]);
    }

    public function test_admin_login_rejects_invalid_credentials(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'superadmin@atloops.com',
            'password' => 'WrongPassword!123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_protected_admin_routes_require_authentication(): void
    {
        $response = $this->getJson('/api/v1/admin/dashboard/metrics');
        $response->assertStatus(401);
    }

    public function test_authenticated_superadmin_can_access_metrics(): void
    {
        $admin = User::where('role', 'superadmin')->first();
        $this->assertNotNull($admin, 'Superadmin user should exist in seeded database');

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/dashboard/metrics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'counts' => [
                        'services', 'products', 'projects', 'leads_total', 'leads_new'
                    ],
                    'pipeline',
                    'recent_leads',
                    'recent_logs'
                ]
            ]);
    }

    public function test_sales_rep_forbidden_from_admin_users_and_content_deletion(): void
    {
        $salesRep = User::where('role', 'sales_rep')->first();
        $this->assertNotNull($salesRep, 'Sales rep user should exist in seeded database');

        // Attempt to view users list (requires users.manage permission)
        $responseUsers = $this->actingAs($salesRep, 'sanctum')
            ->getJson('/api/v1/admin/users');
        $responseUsers->assertStatus(403);

        // Attempt to delete a service (requires content.delete permission)
        $responseDeleteService = $this->actingAs($salesRep, 'sanctum')
            ->deleteJson('/api/v1/admin/services/1');
        $responseDeleteService->assertStatus(403);
    }

    public function test_privilege_escalation_prevented_for_regular_admin(): void
    {
        $admin = User::where('role', 'admin')->first();
        $this->assertNotNull($admin, 'Admin user should exist in seeded database');

        // An admin attempts to create a Super Admin user
        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/users', [
                'name' => 'Hacked Superadmin',
                'email' => 'hacked@atloops.com',
                'password' => 'Hacked@2026!Secured',
                'role' => 'superadmin',
            ]);

        $response->assertStatus(403)
            ->assertJson(['status' => 'error']);
    }

    public function test_authenticated_admin_can_archive_lead(): void
    {
        $lead = Lead::first();
        $this->assertNotNull($lead, 'Lead should exist in database');

        $admin = User::where('role', 'superadmin')->first();

        $response = $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/admin/leads/{$lead->id}/archive");

        $response->assertStatus(200)
            ->assertJson(['status' => 'success']);

        $this->assertDatabaseHas('leads', [
            'id' => $lead->id,
            'is_archived' => true,
        ]);
    }

    public function test_media_upload_validation_rejects_executable_files(): void
    {
        Storage::fake('public');

        $admin = User::where('role', 'superadmin')->first();
        $badFile = UploadedFile::fake()->create('malicious.php', 100, 'application/x-php');

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/media/upload', [
                'file' => $badFile,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_page_builder_saves_sections_and_creates_revision(): void
    {
        $admin = User::where('role', 'superadmin')->first();
        $page = Page::where('slug', 'home')->first();
        $this->assertNotNull($page, 'Home page should exist');

        $payload = [
            'revision_note' => 'Automated test section update',
            'sections' => [
                [
                    'block_type' => 'hero',
                    'sort_order' => 0,
                    'is_active' => true,
                    'content_en' => [
                        'headline' => 'Updated Test Headline',
                        'subheadline' => 'Updated Test Subheadline',
                    ],
                    'content_ar' => [
                        'headline' => 'عنوان تجريبي محدث',
                        'subheadline' => 'وصف تجريبي محدث',
                    ],
                ]
            ]
        ];

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/pages/{$page->id}/sections", $payload);

        $response->assertStatus(200)
            ->assertJson(['status' => 'success']);

        // Verify page revision was recorded
        $this->assertDatabaseHas('page_revisions', [
            'page_id' => $page->id,
            'revision_title' => 'Automated test section update',
        ]);
    }
}
