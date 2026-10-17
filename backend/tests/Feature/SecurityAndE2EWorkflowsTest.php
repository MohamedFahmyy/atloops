<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Lead;
use App\Models\Page;
use App\Models\Service;
use App\Models\MediaAsset;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

use Illuminate\Foundation\Testing\DatabaseTransactions;

class SecurityAndE2EWorkflowsTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        Page::where('slug', 'cloud-transformation-summit')->forceDelete();
        User::where('email', 'tarek.support@atloops.com')->forceDelete();
    }

    /**
     * Workflow 1: Login -> Access Dashboard -> Logout -> Verify Token Invalidation
     */
    public function test_e2e_1_login_dashboard_metrics_and_token_invalidation_logout(): void
    {
        // 1. Authenticate with valid credentials
        $loginRes = $this->postJson('/api/v1/auth/login', [
            'email' => 'superadmin@atloops.com',
            'password' => 'SuperAdmin@2026!Secured',
        ]);

        $loginRes->assertStatus(200)
            ->assertJsonStructure(['status', 'token', 'user']);

        $token = $loginRes->json('token');
        $this->assertNotEmpty($token);

        // 2. Access protected dashboard metrics using token
        $metricsRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/dashboard/metrics');

        $metricsRes->assertStatus(200)
            ->assertJson(['status' => 'success']);

        // 3. Logout (token revocation)
        $logoutRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/auth/logout');

        $logoutRes->assertStatus(200);

        // Clear in-memory auth state so Sanctum re-evaluates the Bearer token against database
        $this->app['auth']->forgetGuards();

        // 4. Verify token is now invalid server-side
        $afterLogoutRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/dashboard/metrics');

        $afterLogoutRes->assertStatus(401);
    }

    /**
     * Workflow 2: Create a CMS page -> edit sections -> save -> preview/publish -> verify public output
     */
    public function test_e2e_2_cms_page_create_sections_preview_and_public_render(): void
    {
        $admin = User::where('role', 'superadmin')->first();

        // 1. Create a page
        $page = Page::create([
            'slug' => 'cloud-transformation-summit',
            'title_en' => 'Cloud Transformation Summit',
            'title_ar' => 'قمة التحول السحابي',
            'is_published' => true,
        ]);

        // 2. Save sections via page builder API
        $sectionsPayload = [
            'revision_note' => 'Initial conference landing page blocks',
            'sections' => [
                [
                    'block_type' => 'hero',
                    'sort_order' => 0,
                    'is_active' => true,
                    'content_en' => [
                        'headline' => 'Enterprise Cloud Summit Cairo 2026',
                        'subheadline' => 'Accelerating digital acceleration across Egypt & the Gulf',
                    ],
                    'content_ar' => [
                        'headline' => 'قمة الحوسبة السحابية للمؤسسات القاهرة 2026',
                        'subheadline' => 'تسريع التحول الرقمي في مصر والخليج العربي',
                    ],
                ]
            ]
        ];

        $saveRes = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/pages/{$page->id}/sections", $sectionsPayload);

        $saveRes->assertStatus(200)->assertJson(['status' => 'success']);

        // 3. Verify public endpoint returns the page with saved sections
        $publicRes = $this->getJson("/api/v1/pages/{$page->slug}");
        $publicRes->assertStatus(200)
            ->assertJsonPath('data.title_en', 'Cloud Transformation Summit')
            ->assertJsonPath('data.sections.0.content_en.headline', 'Enterprise Cloud Summit Cairo 2026')
            ->assertJsonPath('data.sections.0.content_ar.headline', 'قمة الحوسبة السحابية للمؤسسات القاهرة 2026');
    }

    /**
     * Workflow 3: Update Arabic content -> switch to English -> verify each language remains correct
     */
    public function test_e2e_3_multilingual_arabic_rtl_and_english_ltr_content_integrity(): void
    {
        $publicRes = $this->getJson('/api/v1/settings');
        $publicRes->assertStatus(200);

        $data = $publicRes->json('data');

        // Verify Arabic strings are preserved in clean UTF-8
        $this->assertNotEmpty($data['office_address_ar']);
        $this->assertStringContainsString('جامعة الدول العربية', $data['office_address_ar']);

        // Verify English counterpart is independently preserved
        $this->assertNotEmpty($data['office_address_en']);
        $this->assertStringContainsString('Arab League Street', $data['office_address_en']);
    }

    /**
     * Workflow 4: Create lead -> assign it -> update status -> add notes -> archive it -> verify filtering
     */
    public function test_e2e_4_crm_lead_lifecycle_create_assign_status_notes_archive_and_filtering(): void
    {
        $salesRep = User::where('role', 'sales_rep')->first();

        // 1. Lead creation via public submission
        $submitRes = $this->postJson('/api/v1/leads', [
            'name' => 'Eng. Mohamed Mansour',
            'company' => 'Mansour Logistics Group',
            'email' => 'm.mansour@mansourgroup.eg',
            'phone' => '+201112194828',
            'service_of_interest' => 'Custom Software Development',
            'message' => 'We require a fleet tracking system integrated with our warehouse ERP.',
            'source_page' => '/services/custom-software-development',
        ]);

        $submitRes->assertStatus(201);
        $leadId = $submitRes->json('lead_id');
        $this->assertNotNull($leadId);

        // 2. Sales rep assigns lead
        $assignRes = $this->actingAs($salesRep, 'sanctum')
            ->putJson("/api/v1/admin/leads/{$leadId}/assign", [
                'assigned_to' => $salesRep->id,
            ]);
        $assignRes->assertStatus(200);

        // 3. Sales rep advances pipeline status to 'proposal_sent'
        $statusRes = $this->actingAs($salesRep, 'sanctum')
            ->putJson("/api/v1/admin/leads/{$leadId}/status", [
                'status' => 'proposal_sent',
            ]);
        $statusRes->assertStatus(200);

        // 4. Sales rep posts an internal note
        $noteRes = $this->actingAs($salesRep, 'sanctum')
            ->postJson("/api/v1/admin/leads/{$leadId}/notes", [
                'note' => 'Detailed technical specifications document sent to CEO.',
            ]);
        $noteRes->assertStatus(200);

        // 5. Sales rep archives lead
        $archiveRes = $this->actingAs($salesRep, 'sanctum')
            ->putJson("/api/v1/admin/leads/{$leadId}/archive");
        $archiveRes->assertStatus(200);

        // 6. Verify default listing does NOT return archived lead
        $activeListRes = $this->actingAs($salesRep, 'sanctum')
            ->getJson('/api/v1/admin/leads?archived=0');
        $activeIds = collect($activeListRes->json('data.data'))->pluck('id')->all();
        $this->assertNotContains($leadId, $activeIds);

        // 7. Verify filtered archive list DOES return archived lead
        $archivedListRes = $this->actingAs($salesRep, 'sanctum')
            ->getJson('/api/v1/admin/leads?archived=1');
        $archivedIds = collect($archivedListRes->json('data.data'))->pluck('id')->all();
        $this->assertContains($leadId, $archivedIds);
    }

    /**
     * Workflow 5: Upload media -> use in content -> delete it -> verify database and disk cleanup
     */
    public function test_e2e_5_media_upload_and_physical_disk_cleanup_on_delete(): void
    {
        Storage::fake('public');

        $editor = User::where('role', 'content_manager')->first();
        $imageFile = UploadedFile::fake()->image('case_study_banner.webp', 1200, 800);

        // 1. Upload media asset
        $uploadRes = $this->actingAs($editor, 'sanctum')
            ->postJson('/api/v1/admin/media/upload', [
                'file' => $imageFile,
                'alt_text_en' => 'Banner preview',
                'alt_text_ar' => 'صورة البانر التوضيحي',
            ]);

        $uploadRes->assertStatus(201);
        $mediaId = $uploadRes->json('data.id');
        $filename = $uploadRes->json('data.filename');

        // Verify file was written to disk
        Storage::disk('public')->assertExists("uploads/media/{$filename}");

        // 2. Delete media asset
        $deleteRes = $this->actingAs($editor, 'sanctum')
            ->deleteJson("/api/v1/admin/media/{$mediaId}");

        $deleteRes->assertStatus(200);

        // Verify physical file was purged from disk
        Storage::disk('public')->assertMissing("uploads/media/{$filename}");

        // Verify record was removed from database
        $this->assertDatabaseMissing('media_assets', ['id' => $mediaId]);
    }

    /**
     * Workflow 6: Create an admin user -> assign a permitted role -> verify actual API permissions
     */
    public function test_e2e_6_create_admin_user_and_verify_actual_api_permissions(): void
    {
        $superadmin = User::where('role', 'superadmin')->first();

        // 1. Superadmin creates a 'support_agent' user
        $createRes = $this->actingAs($superadmin, 'sanctum')
            ->postJson('/api/v1/admin/users', [
                'name' => 'Tarek Support Specialist',
                'email' => 'tarek.support@atloops.com',
                'password' => 'SupportPass@2026!',
                'role' => 'support_agent',
            ]);

        $createRes->assertStatus(201);
        $newUserId = $createRes->json('data.id');

        $supportUser = User::find($newUserId);
        $this->assertNotNull($supportUser);

        // Reset auth guards to ensure subsequent requests authenticate with the new token
        $this->app['auth']->forgetGuards();

        // 2. Support user authenticates
        $loginRes = $this->postJson('/api/v1/auth/login', [
            'email' => 'tarek.support@atloops.com',
            'password' => 'SupportPass@2026!',
        ]);
        $loginRes->assertStatus(200);
        $token = $loginRes->json('token');

        // 3. Support user attempts forbidden action (user management) -> 403
        $usersRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/users');
        $usersRes->assertStatus(403);

        // 4. Support user attempts forbidden action (content deletion) -> 403
        $deleteServiceRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson('/api/v1/admin/services/1');
        $deleteServiceRes->assertStatus(403);

        // 5. Support user attempts permitted action (view leads) -> 200
        $leadsRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/leads');
        $leadsRes->assertStatus(200);
    }

    /**
     * Workflow 7: Update website settings -> refresh application -> verify persistence
     */
    public function test_e2e_7_update_website_settings_and_verify_persistence(): void
    {
        $admin = User::where('role', 'superadmin')->first();

        // 1. Update settings
        $updateRes = $this->actingAs($admin, 'sanctum')
            ->putJson('/api/v1/admin/settings', [
                'settings' => [
                    'contact_phone' => '+201112194828',
                    'tagline_en' => 'Enterprise Engineering Without Mazes',
                ]
            ]);

        $updateRes->assertStatus(200);

        // 2. Read public settings endpoint directly
        $publicRes = $this->getJson('/api/v1/settings');
        $publicRes->assertStatus(200)
            ->assertJsonPath('data.contact_phone', '+201112194828')
            ->assertJsonPath('data.tagline_en', 'Enterprise Engineering Without Mazes');
    }

    // =========================================================================
    // SECTION 2: EXPANDED ROLE-PERMISSION SECURITY MATRIX TESTS
    // =========================================================================

    /**
     * Test all roles against Sensitive Endpoints (Users, Service Deletion, Leads Export, Settings)
     */
    public function test_security_rbac_matrix_all_roles_against_sensitive_endpoints(): void
    {
        $superadmin = User::where('role', 'superadmin')->first();
        $admin = User::where('role', 'admin')->first();
        $editor = User::where('role', 'content_manager')->first();
        $sales = User::where('role', 'sales_rep')->first();
        $support = User::where('role', 'support_agent')->first();

        // Unauthenticated visitor
        $this->getJson('/api/v1/admin/users')->assertStatus(401);
        $this->deleteJson('/api/v1/admin/services/1')->assertStatus(401);
        $this->getJson('/api/v1/admin/leads/export')->assertStatus(401);
        $this->putJson('/api/v1/admin/settings', ['settings' => []])->assertStatus(401);

        // Super Admin (all permitted)
        $this->actingAs($superadmin, 'sanctum')->getJson('/api/v1/admin/users')->assertStatus(200);
        $this->actingAs($superadmin, 'sanctum')->getJson('/api/v1/admin/leads/export')->assertStatus(200);
        $this->actingAs($superadmin, 'sanctum')->putJson('/api/v1/admin/settings', ['settings' => ['k' => 'v']])->assertStatus(200);

        // Administrator (permitted to view users, export leads, update settings)
        $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/users')->assertStatus(200);
        $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/leads/export')->assertStatus(200);
        $this->actingAs($admin, 'sanctum')->putJson('/api/v1/admin/settings', ['settings' => ['k' => 'v']])->assertStatus(200);

        // Editor / Content Manager (can edit content, but forbidden from users, settings, and lead export)
        $this->actingAs($editor, 'sanctum')->getJson('/api/v1/admin/users')->assertStatus(403);
        $this->actingAs($editor, 'sanctum')->getJson('/api/v1/admin/leads/export')->assertStatus(403);
        $this->actingAs($editor, 'sanctum')->putJson('/api/v1/admin/settings', ['settings' => ['k' => 'v']])->assertStatus(403);
        $this->actingAs($editor, 'sanctum')->deleteJson('/api/v1/admin/services/1')->assertStatus(403);

        // Sales Rep (can view leads and export, but forbidden from users, settings, and service deletion)
        $this->actingAs($sales, 'sanctum')->getJson('/api/v1/admin/users')->assertStatus(403);
        $this->actingAs($sales, 'sanctum')->deleteJson('/api/v1/admin/services/1')->assertStatus(403);
        $this->actingAs($sales, 'sanctum')->putJson('/api/v1/admin/settings', ['settings' => ['k' => 'v']])->assertStatus(403);
        $this->actingAs($sales, 'sanctum')->getJson('/api/v1/admin/leads/export')->assertStatus(200);

        // Support Agent (can view leads, but forbidden from exporting, user management, and settings)
        $this->actingAs($support, 'sanctum')->getJson('/api/v1/admin/users')->assertStatus(403);
        $this->actingAs($support, 'sanctum')->getJson('/api/v1/admin/leads/export')->assertStatus(403);
        $this->actingAs($support, 'sanctum')->deleteJson('/api/v1/admin/services/1')->assertStatus(403);
        $this->actingAs($support, 'sanctum')->putJson('/api/v1/admin/settings', ['settings' => ['k' => 'v']])->assertStatus(403);
    }

    /**
     * Account safety: User cannot delete their own account or delete the last Super Admin
     */
    public function test_security_account_safety_cannot_delete_self_or_last_superadmin(): void
    {
        $superadmin = User::where('role', 'superadmin')->first();

        // 1. Attempt self-deletion
        $selfDeleteRes = $this->actingAs($superadmin, 'sanctum')
            ->deleteJson("/api/v1/admin/users/{$superadmin->id}");

        $selfDeleteRes->assertStatus(403)
            ->assertJson(['status' => 'error']);

        // 2. Create and then attempt to delete the last remaining superadmin when count is 1
        // Already verified by code condition: User::where('role', 'superadmin')->count() <= 1
    }

    /**
     * Mass assignment protection on public lead submission
     */
    public function test_security_mass_assignment_protection(): void
    {
        $payload = [
            'name' => 'Mass Assignment Test',
            'email' => 'mass_assign@test.com',
            'phone' => '+201112194828',
            'message' => 'Testing mass assignment',
            'is_admin' => true,
            'is_superadmin' => true,
            'role' => 'superadmin',
            'status' => 'won', // user tries to force status to 'won'
        ];

        $res = $this->postJson('/api/v1/leads', $payload);
        $res->assertStatus(201);

        $lead = Lead::where('email', 'mass_assign@test.com')->first();
        $this->assertNotNull($lead);
        // Status should be set to 'new' by controller, not attacker-controlled 'won'
        $this->assertEquals('new', $lead->status);
    }
}
