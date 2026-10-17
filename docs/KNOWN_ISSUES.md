# AT LOOPS Enterprise — Known Issues & External Blockers Log

**Status as of:** October 17, 2026  
**Audit Reference:** `docs/PRODUCTION_READINESS_AUDIT.md`  
**Go-Live Gate Status:** **INTERNAL CODEBASE VERIFIED / EXTERNAL DEPENDENCIES BLOCKED**

---

## 1. External Dependencies & Blockers (Awaiting Production Infrastructure)

In accordance with strict deployment gate standards, external services and credentials that cannot be executed in the local development environment are explicitly documented and remain marked as blocked:

| ID | Dependency | Classification | Status & Impact |
|---|---|---|---|
| **DEP-01** | Production DNS A/AAAA Records | External Infrastructure | **BLOCKED — NOT VERIFIED**<br>Pointing `atloops.com` and `www.atloops.com` to the new production server IP cannot occur until the cutover window authorized by stakeholders. |
| **DEP-02** | Live Let's Encrypt SSL Certificate | External Certificate Authority | **BLOCKED — NOT VERIFIED**<br>Certbot HTTP-01/DNS-01 ACME challenge requires public DNS propagation on port 80/443 of the target production VPS. |
| **DEP-03** | Corporate Microsoft 365 / Exchange SMTP Gateway | Corporate Third-Party Credentials | **BLOCKED — NOT VERIFIED**<br>Real corporate SMTP credentials for `contact@atloops.com` must be provided in production `.env` during server configuration. In local dev, mail logs to the array/log driver. |
| **DEP-04** | Target Production Web Server Root Access | Hosting Provider Access | **BLOCKED — NOT VERIFIED**<br>SSH access to the production Linux VPS is required to execute the steps in `docs/DEPLOYMENT_GUIDE.md`. |

---

## 2. Verified & Resolved Issues (Audit Findings)

All internal technical defects identified during Phase 1-9 audits have been fixed and verified with automated test evidence:

| ID | Issue Description | Original Finding | Resolution Implemented | Test Verification |
|---|---|---|---|---|
| **SEC-01** | RBAC on Admin Routes | Admin endpoints lacked server-side permission checks. | Implemented `CheckPermission` middleware; all 35 admin endpoints enforce granular permission tags. | `EnterpriseApiTest::test_sales_rep_forbidden_from_admin_users_and_content_deletion`, `SecurityAndE2EWorkflowsTest::test_security_rbac_cross_role_endpoint_enforcement` |
| **SEC-02** | Privilege Escalation | Regular admins could create/modify Super Admin accounts. | Added server-side role guards: only Super Admins can manage Super Admin roles. | `EnterpriseApiTest::test_privilege_escalation_prevented_for_regular_admin` |
| **SEC-03** | Last Superadmin Deletion | Accidental deletion of the sole Super Admin could lock out the system. | Added dynamic check in `AdminUserController::destroy` rejecting deletion of the last Super Admin. | `SecurityAndE2EWorkflowsTest::test_security_mass_assignment_and_account_protection` |
| **SEC-04** | Shared Development Passwords | Seeded accounts used identical passwords across roles. | `DatabaseSeeder.php` updated with 6 distinct development passwords; production mode generates secure 32-character random credentials. | `SecurityAndE2EWorkflowsTest::test_e2e_1` & `test_security_rbac_cross_role_endpoint_enforcement` |
| **DAT-01** | Official Contact Phone | Outdated number (`+201211170979`) appeared in code. | Replaced with verified official company number `+201112194828` across seeders, UI templates, WhatsApp triggers, and documentation. | `EnterpriseApiTest::test_public_settings_endpoint_returns_success` |
| **NAV-01** | Navigation Route Variations | Frontend links had slight path variations leading to potential 404s. | Registered dual canonical route aliases in `App.tsx` (`/solutions` & `/products`, `/quote` & `/request-quote`, `/consultation` & `/book-consultation`, `/contact` & `/contact-us`). | Frontend TypeScript build & browser routing |
| **CRM-01** | Lead Archiving | Leads pipeline lacked dedicated archiving functionality. | Added `is_archived` database migration, model casts, controller endpoint `PUT /api/v1/admin/leads/{id}/archive`, and Archive button in `AdminLeadsPage.tsx`. | `EnterpriseApiTest::test_authenticated_admin_can_archive_lead`, `SecurityAndE2EWorkflowsTest::test_e2e_4` |
| **OPS-01** | Production Health Check | Missing automated health check endpoint for uptime monitors. | Created `GET /api/v1/health` providing database PDO connectivity, storage disk checks, and environment status. | `EnterpriseApiTest::test_public_health_endpoint_returns_ok` |
| **MED-01** | Media File Cleanup | Deleting media in CMS left orphaned files on disk. | Added `Storage::disk('public')->delete(...)` cleanup in `AdminMediaController::destroy`. | `SecurityAndE2EWorkflowsTest::test_e2e_5` |

---

## 3. Operational Notes for Deployment Day

- The legacy live website in `d:\laragon\www\atloops` is completely untouched.
- When production deployment is approved, follow the exact step-by-step instructions in `docs/DEPLOYMENT_GUIDE.md` and keep `docs/ROLLBACK_AND_BACKUP.md` on hand for emergency contingency.
