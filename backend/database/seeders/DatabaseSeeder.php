<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Service;
use App\Models\ProductCategory;
use App\Models\Product;
use App\Models\PortfolioProject;
use App\Models\Testimonial;
use App\Models\Faq;
use App\Models\GlobalSetting;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Lead;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users & RBAC (Distinct passwords for all roles; production-safe)
        $isProd = app()->environment('production');

        User::updateOrCreate(
            ['email' => 'superadmin@atloops.com'],
            [
                'name' => 'AT Loops Superadmin',
                'password' => Hash::make(env('ADMIN_INITIAL_PASSWORD') ?: ($isProd ? \Illuminate\Support\Str::random(32) : 'SuperAdmin@2026!Secured')),
                'role' => 'superadmin',
                'phone' => '+201112194828',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@atloops.com'],
            [
                'name' => 'General Operations Manager',
                'password' => Hash::make($isProd ? \Illuminate\Support\Str::random(32) : 'Admin@2026!Pass'),
                'role' => 'admin',
                'phone' => '+201112194828',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'editor@atloops.com'],
            [
                'name' => 'Senior Content Editor',
                'password' => Hash::make($isProd ? \Illuminate\Support\Str::random(32) : 'Editor@2026!Pass'),
                'role' => 'content_manager',
                'phone' => '+201112194828',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'sales@atloops.com'],
            [
                'name' => 'Enterprise Sales Lead',
                'password' => Hash::make($isProd ? \Illuminate\Support\Str::random(32) : 'Sales@2026!Pass'),
                'role' => 'sales_rep',
                'phone' => '+201112194828',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'support@atloops.com'],
            [
                'name' => 'Customer Support Lead',
                'password' => Hash::make($isProd ? \Illuminate\Support\Str::random(32) : 'Support@2026!Pass'),
                'role' => 'support_agent',
                'phone' => '+201112194828',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'analyst@atloops.com'],
            [
                'name' => 'Read-Only Business Analyst',
                'password' => Hash::make($isProd ? \Illuminate\Support\Str::random(32) : 'Analyst@2026!Pass'),
                'role' => 'analyst',
                'phone' => '+201112194828',
                'is_active' => true,
            ]
        );

        // 2. Global Settings
        $settings = [
            'site_name' => 'AT Loops | ات لوبس',
            'tagline_en' => 'Technology Without Mazes',
            'tagline_ar' => 'تكنولوجيا بدون متاهات',
            'contact_email' => 'contact@atloops.com',
            'contact_phone' => '+201112194828',
            'whatsapp_number' => '+201112194828',
            'office_address_en' => '72 Arab League Street - Agouza - Giza, Egypt',
            'office_address_ar' => '٧٢ شارع جامعة الدول العربية - العجوزة - الجيزة، مصر',
            'primary_color' => '#1C54F2',
            'secondary_color' => '#0B132B',
            'meta_description_en' => 'AT Loops: Enterprise software development, custom ERP/CRM, cloud infrastructure, web & mobile applications, and complete IT support across Egypt and the Gulf.',
            'meta_description_ar' => 'شركة ات لوبس للبرمجيات والتحول الرقمي: متخصصون في تطوير البرمجيات المخصصة، أنظمة ERP و CRM، البنية التحتية السحابية والدعم الفني المتكامل للشركات والمصانع.',
        ];

        foreach ($settings as $key => $val) {
            GlobalSetting::updateOrCreate(['key' => $key], ['value' => $val, 'group' => 'general']);
        }

        // 3. Services
        $services = [
            [
                'slug' => 'custom-software-development',
                'icon' => 'Code2',
                'category' => 'software',
                'title_en' => 'Custom Software Development',
                'title_ar' => 'تطوير البرمجيات المخصصة',
                'short_desc_en' => 'Tailored software architectures designed specifically around your exact operational workflows and business logic.',
                'short_desc_ar' => 'تصميم وبرمجة أنظمة وحلول برمجية متخصصة ومبنية بدقة حول دورات عمل شركتك واحتياجاتك الفريدة.',
                'description_en' => 'Off-the-shelf software rarely fits intricate enterprise operations. We architect resilient, scalable bespoke systems that streamline complex tasks, eliminate manual friction, and adapt as your enterprise scales.',
                'description_ar' => 'البرمجيات الجاهزة نادراً ما تتطابق مع تفاصيل العمل اليومي للشركات الكبرى. نحن نبني أنظمة برمجية مرنة وموثوقة تسهل العمليات المعقدة، وتقضي على الأخطاء اليدوية، وتتوسع مع نمو أعمالك.',
                'benefits_en' => ['Full source code ownership', 'Unlimited architectural flexibility', 'Seamless legacy migration', 'Military-grade data confidentiality'],
                'benefits_ar' => ['ملكية كاملة للكود البرمجي', 'مرونة غير محدودة في التوسع', 'تكامل سلس مع الأنظمة الحالية', 'سرية وأمان بيانات على أعلى مستوى'],
                'capabilities_en' => ['Domain-Driven Design', 'Microservices Architecture', 'High-throughput relational databases', 'Automated CI/CD pipelines'],
                'capabilities_ar' => ['تصميم النطاقات البرمجية DDD', 'بنية الخدمات المصغرة والأنظمة الموزعة', 'قواعد بيانات سريعة وعالية الاستيعاب', 'نظم نشر وتحديث برمجية مؤتمتة بالكامل'],
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'slug' => 'erp-systems',
                'icon' => 'Layers',
                'category' => 'enterprise',
                'title_en' => 'Enterprise ERP Systems',
                'title_ar' => 'أنظمة تخطيط الموارد ERP',
                'short_desc_en' => 'Comprehensive ERP platforms integrating accounting, procurement, manufacturing, HR, and analytics into a unified dashboard.',
                'short_desc_ar' => 'أنظمة متكاملة لربط كافة إدارات شركتك: المحاسبة، المشتريات، المخازن، التصنيع، والموارد البشرية في منصة موحدة.',
                'description_en' => 'Eliminate departmental silos with AT Loops ERP. Connect financial books, inventory balances, supply chain logistics, and employee attendance in real time with localized tax compliance (including Egyptian E-Invoicing).',
                'description_ar' => 'تخلص من جزر البيانات المنعزلة عبر نظام ات لوبس ERP. اربط الدفاتر المحاسبية، أرصدة المخازن، سلاسل الإمداد، وحضور الموظفين لحظياً مع التوافق التام مع منظومة الفاتورة الإلكترونية المصرية والخليجية.',
                'benefits_en' => ['Egyptian Tax Authority E-Invoicing compliance', 'Real-time multi-branch financial reporting', 'Automated cost accounting for factories', 'Fine-grained role permissions and approval workflows'],
                'benefits_ar' => ['ربط مباشر مع منظومة الفاتورة والإيصال الإلكتروني', 'تقارير مالية مجمعة للفروع والشركات القابضة', 'حساب تكاليف التصنيع والمقايسات بدقة', 'مصفوفات صلاحيات وموافقات إدارية محكمة'],
                'capabilities_en' => ['General Ledger & Chart of Accounts', 'Inventory Control & Bill of Materials', 'HR, Payroll & Social Insurance', 'Sales Pipeline & Purchasing Automation'],
                'capabilities_ar' => ['شجرة الحسابات ودفتر الأستاذ العام', 'إدارة المخزون وتكاليف المواد والإنتاج BOM', 'الرواتب والتأمينات وإدارة شؤون الموظفين', 'أتمتة أوامر الشراء وعروض الأسعار'],
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'slug' => 'pos-systems',
                'icon' => 'ShoppingCart',
                'category' => 'retail',
                'title_en' => 'Cloud POS & Retail Systems',
                'title_ar' => 'أنظمة نقاط البيع POS للمحلات والمطاعم',
                'short_desc_en' => 'Lightning-fast point of sale terminals with offline capability, barcode scanner sync, and automated inventory depletion.',
                'short_desc_ar' => 'كاشير ونقاط بيع فائقة السرعة تعمل أوفلاين وأونلاين، مع دعم قارئ الباركود وميزان الباركود والخصم التلقائي من المخزن.',
                'description_en' => 'Keep checkout lines moving quickly while maintaining strict cash control. Supports multi-store sync, kitchen display systems, digital receipts, and customer loyalty rewards.',
                'description_ar' => 'حافظ على سرعة خدمة العملاء ودقة الجرد النقدي ومبيعات الورديات. يدعم ربط الفروع المتعددة، شاشات المطبخ، الفواتير الإلكترونية، ونقاط ولاء العملاء.',
                'benefits_en' => ['Offline mode prevents checkout downtime', 'Instant split-bill and multi-payment tenders', 'Direct thermal printer and cash drawer integration', 'Shift closing & blind cash reconciliation'],
                'benefits_ar' => ['عمل مستمر بدون انقطاع حتى عند توقف الإنترنت', 'تقسيم الحسابات والدفع بطرق متعددة نقد / بطاقة', 'ربط مباشر بطابعات الإيصالات وأدراج النقدية', 'إقفال الورديات والجرد الأعمى للعهدة'],
                'capabilities_en' => ['Touchscreen optimization', 'Weight scale integration', 'Real-time stock alerts', 'Kitchen Display & Order Dispatch'],
                'capabilities_ar' => ['شاشات لمس تفاعلية وسريعة', 'دعم موازين الباركود للأغذية والسوبرماركت', 'تنبيهات فورية عند وصول الصنف للحد الأدنى', 'شاشات عرض الطلبات بالمطبخ ومتابعة التسليم'],
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'slug' => 'crm-workflow-automation',
                'icon' => 'UserCheck',
                'category' => 'enterprise',
                'title_en' => 'CRM & Workflow Automation',
                'title_ar' => 'إدارة علاقات العملاء وأتمتة مسارات العمل',
                'short_desc_en' => 'Empower sales and support teams to convert leads, track customer lifetime value, and automate repetitive tasks.',
                'short_desc_ar' => 'مكّن فريق المبيعات وخدمة العملاء من متابعة العملاء المحتملين، زيادة المبيعات، وأتمتة المهام اليومية المتكررة.',
                'description_en' => 'Stop leads from slipping through the cracks. Automate follow-up reminders, WhatsApp notifications, proposal generation, and pipeline status updates with custom CRM implementations.',
                'description_ar' => 'لا تفقد أي عميل محتمل مجدداً. نظّم اتصالات فريق المبيعات، أرسل رسائل الواتساب التلقائية، واستخرج عروض الأسعار والتقارير بنقرة واحدة.',
                'benefits_en' => ['30%+ boost in sales response speed', 'Omnichannel inbox for WhatsApp, Email & Web forms', 'Automatic deal progression tracking', 'Sales quota & commission analytics'],
                'benefits_ar' => ['زيادة سرعة الرد على العملاء بنسبة تتجاوز 30%', 'صندوق وارد موحد للواتساب والبريد ونماذج الموقع', 'متابعة مراحل الصفقات ومؤشرات إغلاق البيع', 'تحليلات أداء المبيعات والعمولات'],
                'capabilities_en' => ['Visual Kanban pipeline', 'WhatsApp Cloud API integration', 'Automated email sequences', 'SLA and ticket assignment'],
                'capabilities_ar' => ['لوحات كانبان مرئية لمراحل الصفقات', 'ربط مباشر مع واتساب الأعمال الرسمي', 'رسائل بريد تذكيرية ومجدولة', 'إدارة تذاكر الدعم الفني وتوزيع المسؤوليات'],
                'is_featured' => true,
                'sort_order' => 4,
            ],
            [
                'slug' => 'web-development',
                'icon' => 'Globe',
                'category' => 'web',
                'title_en' => 'Modern Web Applications & Portals',
                'title_ar' => 'تصميم وتطوير المواقع والمنصات التفاعلية',
                'short_desc_en' => 'High-conversion, lightning-fast enterprise web platforms crafted with modern design, responsive UX, and SEO dominance.',
                'short_desc_ar' => 'بناء مواقع وبوابات رقمية فائقة السرعة والتفاعلية تعكس قوة علامتك التجارية وتحول الزوار إلى عملاء فعليين.',
                'description_en' => 'We create exceptional corporate websites and web apps that deliver speed, accessibility, top-tier Core Web Vitals, and seamless bilingual Arabic/English experiences.',
                'description_ar' => 'نطور واجهات رقمية رفيعة المستوى تجمع بين سرعة التحميل القياسية، تجربة المستخدم السلسة، ودعم كامل للغتين العربية والإنجليزية مع معايير SEO عالمية.',
                'benefits_en' => ['Sub-second page load times', 'Rank higher on Google searches with semantic SEO', 'Flawless responsive layouts on mobile, tablet & desktop', 'Enterprise CMS for easy in-house updates'],
                'benefits_ar' => ['سرعة تحميل قياسية تحسن بقاء الزائر', 'تصدر نتائج محركات البحث بمعايير SEO تقنية', 'توافق مثالي مع الهواتف والشاشات الذكية', 'لوحة تحكم مرنة لإدارة المحتوى دون الحاجة لمبرمج'],
                'capabilities_en' => ['Next.js / React / Vite architecture', 'Bilingual RTL/LTR typography', 'Headless CMS integrations', 'High-security SSL & Web Application Firewalls'],
                'capabilities_ar' => ['أحدث تقنيات React و Vite المعاصرة', 'طباعة عربية مريحة ومتناسقة مع الإنجليزية', 'ربط مع أنظمة إدارة المحتوى وقواعد البيانات', 'حماية متقدمة ضد هجمات الاختراق وحقن البيانات'],
                'is_featured' => true,
                'sort_order' => 5,
            ],
            [
                'slug' => 'cloud-infrastructure',
                'icon' => 'Cloud',
                'category' => 'infrastructure',
                'title_en' => 'Cloud Infrastructure & Managed IT',
                'title_ar' => 'البنية التحتية السحابية والدعم الفني',
                'short_desc_en' => 'Enterprise server deployments, automated backup routines, 24/7 uptime monitoring, and network architecture.',
                'short_desc_ar' => 'إدارة متكاملة للسيرفرات السحابية والشبكات، مع خطط نسخ احتياطي مؤتمتة ومراقبة مستمرة على مدار الساعة.',
                'description_en' => 'Ensure continuous business operations with certified cloud engineering. From Linux server hardening to automated database snapshots and disaster recovery, your systems stay bulletproof.',
                'description_ar' => 'نضمن استمرارية أعمالك وأمان بياناتك من خلال هندسة سحابية احترافية، تأمين خوادم لينكس، النسخ الاحتياطي التلقائي، والتدخل السريع عند أي طارئ.',
                'benefits_en' => ['99.9% uptime SLA commitments', 'Automated off-site database backups', 'Instant failover and load balancing', 'Reduced IT maintenance overhead'],
                'benefits_ar' => ['التزام بنسبة توفر واستقرار 99.9%', 'نسخ احتياطي يومي مشفر في مواقع منفصلة', 'توزيع أحمال السيرفرات وتحمل الضغط العالي', 'توفير تكاليف شراء وصيانة الخوادم الباهظة'],
                'capabilities_en' => ['AWS / GCP / Hetzner cloud architecture', 'Docker & Kubernetes containerization', 'Cloudflare CDN & DDoS mitigation', '24/7 server metrics & uptime pingers'],
                'capabilities_ar' => ['إعداد خوادم AWS و Google Cloud و Hetzner', 'بيئات عمل الحاويات المعزولة Docker', 'حماية Cloudflare ضد هجمات حجب الخدمة DDoS', 'لوحات مراقبة حية لأداء المعالج والذاكرة والشبكة'],
                'is_featured' => true,
                'sort_order' => 6,
            ],
            [
                'slug' => 'security-cctv-systems',
                'icon' => 'ShieldCheck',
                'category' => 'hardware',
                'title_en' => 'Security Systems, CCTV & Access Control',
                'title_ar' => 'الأنظمة الأمنية، كاميرات المراقبة، وأجهزة الحضور',
                'short_desc_en' => 'Complete hardware and cabling supply, IP CCTV camera installation, biometric attendance, and smart access control.',
                'short_desc_ar' => 'توريد وتركيب كاميرات المراقبة IP عالية الدقة، أجهزة الحضور بالبصمة والوجه، وأنظمة الأبواب الإلكترونية الذكية.',
                'description_en' => 'Protect your facilities, warehouses, and corporate headquarters with advanced surveillance and biometric access systems fully synced with your HR and payroll database.',
                'description_ar' => 'تأمين مقرات الشركات والمصانع والمخازن بأحدث كاميرات المراقبة الليلية والرقمية، مع ربط أجهزة الحضور والانصراف مباشرة ببرنامج المرتبات.',
                'benefits_en' => ['High definition 4K night vision surveillance', 'Remote mobile live streaming and playback', 'Automated sync with employee attendance logs', 'Physical door lock scheduling and RFID cards'],
                'benefits_ar' => ['تصوير فائق الدقة 4K مع رؤية ليلية متطورة', 'متابعة الكاميرات مباشرة من هاتفك من أي مكان', 'تفريغ حركات الحضور تلقائياً لشؤون الموظفين', 'تحكم في صلاحيات فتح الأبواب بالكارت والبصمة'],
                'capabilities_en' => ['NVR / DVR storage servers', 'Facial recognition & biometric terminals', 'Structured network cabling', 'Intercom and smart barrier gates'],
                'capabilities_ar' => ['سيرفرات تسجيل وفيديو NVR بسعات ضخمة', 'أجهزة التعرف على الوجه وبصمة الإصبع والكارت', 'تمديد شبكات الداتا وكابلات الألياف الضوئية', 'أنظمة الإنتركم والبوابات الإلكترونية للسيارات'],
                'is_featured' => false,
                'sort_order' => 7,
            ],
            [
                'slug' => 'business-email-domains',
                'icon' => 'Mail',
                'category' => 'infrastructure',
                'title_en' => 'Business Email & Domain Infrastructure',
                'title_ar' => 'خدمات البريد الإلكتروني والنطاقات الرسمية',
                'short_desc_en' => 'Professional corporate email setups (Google Workspace / Microsoft 365 / Private Zimbra) with DKIM, SPF, and DMARC verification.',
                'short_desc_ar' => 'إنشاء وإدارة إيميلات رسمية باسم شركتك (Google Workspace / Microsoft 365) مع ضبط حماية البريد ومنع الاسبام.',
                'description_en' => 'Build customer confidence with branded corporate email addresses. We configure enterprise security standards to guarantee inbox deliverability and prevent email spoofing.',
                'description_ar' => 'عزز ثقة عملائك بمراسلات رسمية تحمل اسم موقعك. نضبط سجلات الأمان SPF و DKIM و DMARC لضمان وصول رسائلك لصندوق الوارد وتفادي الرسائل المزعجة.',
                'benefits_en' => ['100% Inbox delivery with verified security records', 'Spam protection and phishing filters', 'Outlook, iPhone, and Android seamless setup', 'Centralized corporate mailbox administration'],
                'benefits_ar' => ['وصول مضمون لرسائل البريد دون تصنيفها كـ Spam', 'فلاتر ذكية ضد محاولات الاحتيال والفيروسات', 'سهولة الربط مع الأوتلوك والهواتف الذكية', 'لوحة تحكم لإضافة وتعديل حسابات الموظفين'],
                'capabilities_en' => ['DNS record configuration (SPF/DKIM/DMARC)', 'Mailbox migration without downtime', 'Encrypted TLS transmission', 'Calendar & Contacts sharing'],
                'capabilities_ar' => ['إعداد سجلات الحماية والتوجيه بالكامل', 'نقل إيميلاتك القديمة بدون فقدان أي رسالة', 'تشفير تام للمراسلات وحماية المرفقات', 'مشاركة المواعيد والتقويمات وقوائم الاتصال'],
                'is_featured' => false,
                'sort_order' => 8,
            ],
        ];

        foreach ($services as $srv) {
            Service::updateOrCreate(['slug' => $srv['slug']], $srv);
        }

        // 4. Product Categories
        $catErp = ProductCategory::updateOrCreate(
            ['slug' => 'erp-business-systems'],
            [
                'name_en' => 'ERP & Business Systems',
                'name_ar' => 'أنظمة ERP وإدارة الأعمال',
                'description_en' => 'All-in-one business management platforms for factories and trading firms.',
                'description_ar' => 'أنظمة إدارة متكاملة تلبي متطلبات المصانع والشركات التجارية.',
                'sort_order' => 1,
            ]
        );

        $catRetail = ProductCategory::updateOrCreate(
            ['slug' => 'retail-pos-solutions'],
            [
                'name_en' => 'Retail & POS Solutions',
                'name_ar' => 'حلول نقاط البيع والمتاجر',
                'description_en' => 'Retail counter systems, inventory scanners, and store management.',
                'description_ar' => 'أنظمة نقاط البيع للكاشير وإدارة المخازن بالباركود والمحلات.',
                'sort_order' => 2,
            ]
        );

        $catEducation = ProductCategory::updateOrCreate(
            ['slug' => 'education-lms'],
            [
                'name_en' => 'Education & LMS Platforms',
                'name_ar' => 'منصات التعليم الإلكتروني LMS',
                'description_en' => 'Online academies, student information systems, and course platforms.',
                'description_ar' => 'منصات الأكاديميات التعليمية، إدارة الطلاب والمدرسين، والدروس.',
                'sort_order' => 3,
            ]
        );

        $catEcommerce = ProductCategory::updateOrCreate(
            ['slug' => 'ecommerce-marketplaces'],
            [
                'name_en' => 'E-Commerce & Marketplaces',
                'name_ar' => 'التجارة الإلكترونية والتطبيقات',
                'description_en' => 'Multi-vendor shopping apps, delivery platforms, and digital storefronts.',
                'description_ar' => 'متاجر إلكترونية متعددة التجار، تطبيقات التوصيل، وبوابات الدفع.',
                'sort_order' => 4,
            ]
        );

        // 5. Products
        $products = [
            [
                'category_id' => $catErp->id,
                'slug' => 'atloops-erp-core',
                'name_en' => 'AT Loops ERP Core Suite',
                'name_ar' => 'نظام ات لوبس ERP المتكامل',
                'tagline_en' => 'Unified corporate finance, inventory, and supply chain control.',
                'tagline_ar' => 'المنظومة المالية والإدارية الشاملة لإدارة الشركات والمصانع.',
                'short_desc_en' => 'A modular ERP system equipped with automated double-entry accounting, purchasing workflows, inventory tracking, and electronic invoicing.',
                'short_desc_ar' => 'برنامج محاسبي وإداري متكامل معتمد للفاتورة الإلكترونية، يدير الحسابات العامة، المخازن، المشتريات، والمبيعات بدقة متناهية.',
                'description_en' => 'Built for mid-sized and large enterprises. Features multi-warehouse transfers, cost-center allocations, payroll deductions, and automated bank reconciliation.',
                'description_ar' => 'مصمم خصيصاً للشركات والمصانع الكبرى في مصر والخليج. يدعم تعدد المخازن، مراكز التكلفة، حسابات الأرباح والخسائر، وشجرة حسابات قابلة للتخصيص الكامل.',
                'features_en' => ['Compliant with Egyptian Tax Authority (ETA)', 'Multi-currency and multi-branch consolidation', 'Custom quotation and purchase order workflows', 'Excel bulk imports and audit trail logging'],
                'features_ar' => ['توافق تام مع مصلحة الضرائب المصرية والفاتورة الإلكترونية', 'دعم تعدد العملات والفروع والقوائم المالية المجمعة', 'دورات مستندية مخصصة لعروض الأسعار وأوامر الشراء', 'استيراد وتصدير البيانات لإكسيل وسجل تدقيق شامل'],
                'badge' => 'Enterprise Grade',
                'price' => 1499.00,
                'original_price' => 1899.00,
                'pricing_model' => 'quote',
                'supported_platforms' => ['Web', 'Cloud', 'Windows Desktop', 'Mobile Responsive'],
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'category_id' => $catRetail->id,
                'slug' => 'smart-inventory-pos',
                'name_en' => 'Smart Inventory & POS Terminal',
                'name_ar' => 'نظام سمارت لإدارة المبيعات ونقاط البيع',
                'tagline_en' => 'Speed, accuracy, and offline resilience for retail businesses.',
                'tagline_ar' => 'سرعة ودقة واستقرار لنقاط البيع والمخازن مع دعم العمل بدون إنترنت.',
                'short_desc_en' => 'Interactive POS terminal with instant barcode scanning, stock alerts, thermal printing, and day-end cash settlement.',
                'short_desc_ar' => 'سيستم كاشير ومبيعات سريع يدعم قارئ الباركود، طابعات الفواتير، تنبيهات نواقص المخزن، وإغلاق الورديات.',
                'description_en' => 'Handles high transaction volume with zero stutter. Integrates seamlessly with handheld barcode scanners, electronic cash drawers, customer displays, and weight scales.',
                'description_ar' => 'يتحمل ضغط المبيعات الكثيف في المحلات والسوبرماركت ومحلات الملابس وقطع الغيار. يدعم الموازين الإلكترونية وأدراج النقدية.',
                'features_en' => ['Offline local database with automatic cloud sync', 'Multi-tier pricing and discount management', 'Employee shift reconciliation and cash variance logs', 'Customer loyalty points and gift cards'],
                'features_ar' => ['قاعدة بيانات محلية تعمل عند انقطاع النت وتتزامن تلقائياً', 'أسعار جملة وقطاعي وخصومات مخصصة للعملاء', 'إقفال الوردية وكشف عجز وزيادة الخزينة', 'برامج ولاء العملاء وكروت الخصم'],
                'badge' => 'Best Seller',
                'price' => 599.00,
                'original_price' => 749.00,
                'pricing_model' => 'one_time',
                'supported_platforms' => ['Web', 'Windows', 'Android Tablet'],
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'category_id' => $catEducation->id,
                'slug' => 'osoul-academy-lms',
                'name_en' => 'Academy LMS & Online School Platform',
                'name_ar' => 'منصة أكاديميا للتعليم الإلكتروني والمدارس',
                'tagline_en' => 'Virtual classrooms, automated exam engines, and subscription billing.',
                'tagline_ar' => 'فصول افتراضية، اختبارات إلكترونية ذكية، وإدارة اشتراكات الطلاب والمدرسين.',
                'short_desc_en' => 'A complete e-learning infrastructure supporting video lessons with DRM protection, student progress tracking, live sessions, and payment gateways.',
                'short_desc_ar' => 'منصة متكاملة للأكاديميات ومراكز التدريب، تدعم حماية الفيديوهات من التحميل، متابعة مستوى الطلاب، والبث المباشر.',
                'description_en' => 'Empowers educators, language centers, and Quran academies to launch branded web and mobile experiences with integrated Fawry, Paymob, and credit card payments.',
                'description_ar' => 'مبنية على تجارب نجاح حقيقية مثل أكاديمية أصول ومدرسة القرآن للجميع. تدعم بوابات الدفع المصرية كفوري وباي موب والبطاقات البنكية.',
                'features_en' => ['Anti-screen recording watermark protection', 'Interactive quizzes with automatic grading', 'Student certificate generator with QR verification', 'Zoom and Google Meet integration'],
                'features_ar' => ['علامات مائية ديناميكية لمنع تصوير الشاشة وسرقة المحتوى', 'اختبارات ذكية وتصحيح تلقائي وإظهار النتائج لحظياً', 'إصدار شهادات إلكترونية مع كود QR للتحقق من صحتها', 'ربط مباشر مع منصات زوم وجوجل ميت للمحاضرات الحية'],
                'badge' => 'Verified Solution',
                'price' => 899.00,
                'original_price' => 1199.00,
                'pricing_model' => 'one_time',
                'supported_platforms' => ['Web', 'iOS App', 'Android App'],
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'category_id' => $catEcommerce->id,
                'slug' => 'souq-marketplace-engine',
                'name_en' => 'Souq Multi-Vendor Marketplace & Delivery App',
                'name_ar' => 'منصة سوق للتجارة والتوصيل متعددة المتاجر',
                'tagline_en' => 'Complete marketplace platform with vendor portals and courier apps.',
                'tagline_ar' => 'منصة تجارة إلكترونية كاملة مع لوحات تحكم للتجار وتطبيق لمندوبي التوصيل.',
                'short_desc_en' => 'A scalable multi-vendor shopping ecosystem modeled after proven platforms like Aswaq Basra, complete with GPS live delivery tracking.',
                'short_desc_ar' => 'نظام تجارة متعدد التجار مستوحى من تجربة نجاح أسواق البصرة، يشمل متجر الزبائن، لوحة التاجر، وتطبيق كابتن التوصيل مع الخرائط.',
                'description_en' => 'Includes vendor product approvals, commission splitting, automated courier dispatch, customer push notifications, and promo code engines.',
                'description_ar' => 'يتيح للتجار عرض منتجاتهم مع خصم عمولة المنصة تلقائياً، وتوجيه أقرب مندوب توصيل عبر الخريطة مع إشعارات حية للعميل.',
                'features_en' => ['Real-time Google Maps courier tracking', 'Multi-vendor split payouts & digital wallets', 'Customer push notifications via Firebase', 'Product variations support'],
                'features_ar' => ['تتبع حي لمندوب التوصيل عبر خرائط جوجل', 'محافظ إلكترونية وتقسيم تلقائي لأرباح التجار', 'إشعارات فورية عبر فايربيس للموبايل', 'دعم خصائص المنتجات المتقدمة كالمقاسات والألوان'],
                'badge' => 'Popular',
                'price' => 1299.00,
                'original_price' => 1599.00,
                'pricing_model' => 'one_time',
                'supported_platforms' => ['Web', 'iOS', 'Android'],
                'is_featured' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($products as $prod) {
            Product::updateOrCreate(['slug' => $prod['slug']], $prod);
        }

        // 6. Portfolio Projects
        $projects = [
            [
                'slug' => 'aswaq-basra',
                'title_en' => 'Aswaq Basra Multi-Vendor E-Commerce Platform',
                'title_ar' => 'منصة وتطبيق أسواق البصرة للتجارة الإلكترونية',
                'client_name_en' => 'Aswaq Basra Trading Group',
                'client_name_ar' => 'مجموعة أسواق البصرة التجارية',
                'industry_en' => 'E-Commerce & Retail',
                'industry_ar' => 'التجارة الإلكترونية والتجزئة',
                'short_desc_en' => 'A comprehensive shopping marketplace and mobile application serving thousands of shoppers with high-speed browsing and reliable delivery logistics.',
                'short_desc_ar' => 'تطبيق ومنصة تسوق إلكتروني متكاملة تتيح للمستخدمين استكشاف العروض والمنتجات والشراء مع نظام إدارة طلبات سريع.',
                'description_en' => 'AT Loops architected the entire Aswaq Basra shopping ecosystem: native mobile applications, merchant onboarding dashboards, and an automated logistics dispatch console.',
                'description_ar' => 'قامت شركة ات لوبس بتطوير المنظومة التقنية الكاملة لأسواق البصرة، شاملة تطبيقات الهواتف الذكية للعملاء والمندوبين، ولوحات تحكم متقدمة لإدارة المخزون والتسليم.',
                'challenge_en' => 'Handling tens of thousands of simultaneous flash sales while synchronizing physical retail store stock with digital orders in real time.',
                'challenge_ar' => 'استيعاب آلاف المستخدمين خلال أوقات العروض الحصرية مع مزامنة أرصدة المستودعات والمحلات في نفس اللحظة لمنع بيع أصناف نافدة.',
                'solution_en' => 'Engineered a high-concurrency Laravel and Redis microservice backend paired with optimized React Native mobile interfaces.',
                'solution_ar' => 'بناء بنية تحتية سحابية تعتمد على لارافيل وريديس لمعالجة الطوابير والطلبات، مع واجهات موبايل سريعة وسهلة الاستخدام.',
                'results_en' => ['99.98% platform uptime during major holiday sales', '45% reduction in customer order checkout time', 'Over 50,000 satisfied mobile app shoppers'],
                'results_ar' => ['استقرار بنسبة 99.98% أثناء مواسم التخفيضات الكبرى', 'تقليص زمن إتمام الطلب بنسبة 45%', 'أكثر من 50 ألف متسوق نشط عبر التطبيق'],
                'tech_stack' => ['Laravel', 'React Native', 'MySQL', 'Redis', 'Firebase', 'Google Maps API'],
                'live_url' => 'https://atloops.com/',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'slug' => 'geshta-contracting-erp',
                'title_en' => 'Geshta Contracting Corporate ERP & Project Manager',
                'title_ar' => 'سيستم إدارة المشاريع والعمليات لشركة قشطة للمقاولات',
                'client_name_en' => 'Geshta Contracting Co.',
                'client_name_ar' => 'شركة قشطة للمقاولات العامة',
                'industry_en' => 'Construction & Contracting',
                'industry_ar' => 'المقاولات والتشييد',
                'short_desc_en' => 'Web application controlling project milestones, subcontractor billings, material procurement, and engineering manpower across job sites.',
                'short_desc_ar' => 'تطبيق ويب لإدارة معظم إدارات الشركة، متابعة العمل بمواقع المقاولات، المستخلصات المالية، ومشتريات مواد البناء.',
                'description_en' => 'Construction sites require disciplined tracking of cement, steel, machinery hours, and subcontractor progress. AT Loops deployed an end-to-end ERP that connected field engineers with corporate accounting.',
                'description_ar' => 'صممت ات لوبس منصة سحابية تربط المهندسين في مواقع المشاريع مع الإدارة المالية بالمقر الرئيسي، لمتابعة نسب الإنجاز والمستخلصات وصرف المواد بدقة.',
                'challenge_en' => 'Dispersed project locations with inconsistent network connectivity and complex cost variances between project bids and actual execution.',
                'challenge_ar' => 'تشتت مواقع العمل في محافظات متعددة وصعوبة مطابقة تكاليف المقايسات مع المنصرف الفعلي في المواقع.',
                'solution_en' => 'Created an intuitive web portal with role-based field reporting, automated cost reconciliation, and instant executive dashboards.',
                'solution_ar' => 'تطوير منصة تتيح للمشرفين إدخال تقارير الإنجاز اليومية مع مطابقة تلقائية لتكاليف التوريدات واعتماد المستخلصات رقمياً.',
                'results_en' => ['Eliminated manual paperwork delays by 70%', 'Real-time visibility on project profit margins', '100% audit-ready financial subcontractor records'],
                'results_ar' => ['خفض زمن معالجة المستخلصات بنسبة 70%', 'رؤية لحظية لهوامش أرباح وتكاليف كل مشروع', 'سجلات مالية وإدارية دقيقة لجميع مقاولي الباطن'],
                'tech_stack' => ['Laravel', 'Tailwind CSS', 'MySQL', 'Chart.js'],
                'live_url' => 'https://atloops.com/',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'slug' => 'ghazi-land-food-industries',
                'title_en' => 'Ghazi Land Food Industries Corporate Platform',
                'title_ar' => 'المنصة الرسمية لمصنع غازي لاند للمنتجات الغذائية',
                'client_name_en' => 'Ghazi Land Food Industries',
                'client_name_ar' => 'مصنع غازي لاند للمنتجات الغذائية',
                'industry_en' => 'Manufacturing & FMCG',
                'industry_ar' => 'التصنيع والصناعات الغذائية',
                'short_desc_en' => 'Official industrial web platform and digital product catalog showcasing international food production lines and distributor networks.',
                'short_desc_ar' => 'تصميم وبرمجة المنصة الرسمية لمصنع غازي لاند للمنتجات الغذائية لعرض خطوط الإنتاج وشبكة الموزعين.',
                'description_en' => 'Developed an authoritative, bilingual corporate website communicating industrial capacity, ISO certifications, and wholesale distributor acquisition.',
                'description_ar' => 'قامت ات لوبس بتطوير موقع رسمي رفيع المستوى يعكس الجودة التصنيعية وحصول المصنع على شهادات الجودة العالمية، ويسهل طلبات التوزيع المعتمد.',
                'challenge_en' => 'Presenting heavy industrial machinery and food product specifications in an elegant, fast-loading digital format.',
                'challenge_ar' => 'عرض مواصفات المنتجات الغذائية وخطوط الإنتاج بشكل جذاب وسريع التحميل على الأجهزة المختلفة.',
                'solution_en' => 'Engineered a modern responsive web portal with bilingual product sheets and automated distributor inquiry pipelines.',
                'solution_ar' => 'بناء موقع متجاوب يدعم الكتالوج الإلكتروني التفاعلي ونظام تلقي عروض التوريد وطلبات الوكالة التجارية.',
                'results_en' => ['Expanded wholesale distributor leads across Egypt and Arab markets', '100% responsive experience on all mobile devices', 'Direct client endorsement and 3+ year partnership'],
                'results_ar' => ['زيادة طلبات الوكلاء والموزعين في مصر والأسواق العربية', 'موقع احترافي وسريع يعمل بكفاءة على كافة الشاشات', 'شراكة مستمرة لأكثر من 3 سنوات مع ات لوبس'],
                'tech_stack' => ['Laravel', 'Vite', 'Tailwind CSS', 'MySQL'],
                'live_url' => 'https://atloops.com/',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'slug' => 'quran-for-all-school',
                'title_en' => 'Quran For All School Global Learning Academy',
                'title_ar' => 'منصة مدرسة القرآن للجميع التعليمية العالمية',
                'client_name_en' => 'Quran For All International School',
                'client_name_ar' => 'مدرسة القرآن للجميع الدولية',
                'industry_en' => 'EdTech & Online Learning',
                'industry_ar' => 'تكنولوجيا التعليم والتعليم عن بعد',
                'short_desc_en' => 'Global online educational platform connecting international students with certified teachers for one-on-one and group learning sessions.',
                'short_desc_ar' => 'منصة تعليمية إلكترونية متخصصة في تعليم القرآن الكريم واللغة العربية للطلاب والدارسين حول العالم.',
                'description_en' => 'AT Loops engineered a high-reliability learning portal with interactive scheduling, teacher-student matching, time zone automation, and multi-currency billing.',
                'description_ar' => 'أنشأت ات لوبس منصة تعليمية تخدم آلاف الطلاب عبر القارات مع ضبط تلقائي للمواعيد وفق فروق التوقيت الدولي، ولوحات للمدرسين والإدارة.',
                'challenge_en' => 'Coordinating thousands of live private class slots across North America, Europe, and the Middle East with zero booking conflicts.',
                'challenge_ar' => 'جدولة الحصص المباشرة بدقة للطلاب من مختلف القارات دون حدوث تضارب في المواعيد مع المعلمين.',
                'solution_en' => 'Implemented automated time-zone synchronization algorithms and integrated payment gateways with recurring class subscriptions.',
                'solution_ar' => 'برمجة خوارزميات جدولة ذكية تحول المواعيد تلقائياً لتوقيت الطالب المحلي مع نظام اشتراكات شهري ميسر.',
                'results_en' => ['Over 12,000 completed student lesson hours monthly', 'Global student base across 20+ countries', 'Seamless automated parent reporting'],
                'results_ar' => ['أكثر من 12 ألف ساعة تعليمية منجزة شهرياً', 'طلاب يدرسون من أكثر من 20 دولة حول العالم', 'تقارير دورية تلقائية لأولياء الأمور عن تقدم الطالب'],
                'tech_stack' => ['Laravel', 'React', 'MySQL', 'Stripe'],
                'live_url' => 'https://atloops.com/',
                'is_featured' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($projects as $proj) {
            PortfolioProject::updateOrCreate(['slug' => $proj['slug']], $proj);
        }

        // 7. Testimonials
        $testimonials = [
            [
                'client_name_en' => 'Ahmed Ghazi',
                'client_name_ar' => 'أحمد غازي',
                'client_role_en' => 'Chairman & Managing Director',
                'client_role_ar' => 'رئيس مجلس الإدارة',
                'company_en' => 'Ghazi Land Food Industries',
                'company_ar' => 'مصنع غازي لاند للمنتجات الغذائية',
                'content_en' => 'We have been working with AT Loops for more than three years. We experience absolute security and seamless collaboration. Their response speed and ability to engineer tailored technical solutions for our factories have been remarkable.',
                'content_ar' => 'التعامل مع ات لوبس منذ أكثر من ثلاث سنوات وأشعر بالأمان والسلاسة في التعامل، حيث سرعة الاستجابة وإيجاد الحلول التقنية المبتكرة التي تتناسب بدقة مع احتياجات مصانعنا.',
                'rating' => 5,
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'client_name_en' => 'Eng. Tarek Geshta',
                'client_name_ar' => 'م. طارق قشطة',
                'client_role_en' => 'Operations Director',
                'client_role_ar' => 'مدير العمليات والمشاريع',
                'company_en' => 'Geshta Contracting Co.',
                'company_ar' => 'شركة قشطة للمقاولات العامة',
                'content_en' => 'The custom ERP system designed by AT Loops completely transformed how our job sites report progress and handle material procurement. They truly know how to convert complex mazes into simple digital workflows.',
                'content_ar' => 'نظام إدارة المشاريع الذي طورته ات لوبس أحدث نقلة نوعية في متابعة مواقع البناء والمستخلصات والمخازن. فريقهم يستحق لقب دليل التكنولوجيا عن جدارة.',
                'rating' => 5,
                'is_featured' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($testimonials as $t) {
            Testimonial::updateOrCreate(['client_name_en' => $t['client_name_en']], $t);
        }

        // 8. FAQs
        $faqs = [
            [
                'category' => 'general',
                'question_en' => 'Why choose AT Loops for enterprise software development?',
                'question_ar' => 'لماذا تختار شركة ات لوبس لتطوير برمجيات شركتك؟',
                'answer_en' => 'AT Loops acts as your dedicated technology partner ("Technology Without Mazes"). We build custom solutions specifically tailored to your exact business rules, provide full source code transparency, guarantee continuous support, and possess deep domain experience in Egypt and Gulf markets.',
                'answer_ar' => 'في ات لوبس نحن شريكك التقني المتكامل "تكنولوجيا بدون متاهات". لا نبيع قوالب جاهزة غير ملائمة، بل نبني أنظمة مفصلة على دورة عملك الخاصة، مع دعم فني مستمر، وسرعة استجابة، وخبرة عميقة بالسوق المصري والخليجي.',
                'sort_order' => 1,
            ],
            [
                'category' => 'implementation',
                'question_en' => 'Are your ERP and POS systems compliant with Egyptian E-Invoicing?',
                'question_ar' => 'هل أنظمة ERP و POS متوافقة مع منظومة الفاتورة والإيصال الإلكتروني؟',
                'answer_en' => 'Yes, 100%. Our ERP and retail POS platforms integrate directly with the Egyptian Tax Authority (ETA) SDK, validating digital signatures and transmitting B2B electronic invoices and B2C electronic receipts seamlessly.',
                'answer_ar' => 'نعم، بنسبة 100%. برامجنا متوافقة ومعتمدة للربط المباشر مع منظومة الفاتورة الإلكترونية والإيصال الإلكتروني لمصلحة الضرائب المصرية بالتوثيق الرقمي اللحظي.',
                'sort_order' => 2,
            ],
            [
                'category' => 'support',
                'question_en' => 'What type of ongoing technical support does AT Loops offer?',
                'question_ar' => 'ما نوع الدعم الفني وخدمات ما بعد البيع التي تقدمها ات لوبس؟',
                'answer_en' => 'We provide comprehensive Service Level Agreements (SLAs), including server monitoring, automated daily cloud backups, emergency on-site assistance for networks/hardware in Egypt, and direct engineering response channels.',
                'answer_ar' => 'نقدم عقود دعم فني متكاملة (SLA) تشمل مراقبة الخوادم 24/7، النسخ الاحتياطي التلقائي للبيانات، الصيانة الدورية، والتدخل السريع للأعطال الطارئة سواء عن بُعد أو في مقر شركتك.',
                'sort_order' => 3,
            ],
        ];

        foreach ($faqs as $f) {
            Faq::updateOrCreate(['question_en' => $f['question_en']], $f);
        }

        // 9. Initial CRM Leads
        Lead::updateOrCreate(
            ['email' => 'm.shenawy@deltasteel.com.eg'],
            [
                'name' => 'Mohamed El-Shenawy',
                'company' => 'Delta Steel Industries',
                'phone' => '+201009876543',
                'country' => 'Egypt',
                'service_of_interest' => 'Enterprise ERP Systems',
                'estimated_budget' => '$5,000 - $10,000',
                'message' => 'We are looking to implement a complete factory ERP linking our rolling mills, raw scrap inventory, and Egyptian E-Invoicing.',
                'source_page' => '/services/erp-systems',
                'priority' => 'high',
                'status' => 'new',
            ]
        );

        Lead::updateOrCreate(
            ['email' => 'khalid@gulfretail.sa'],
            [
                'name' => 'Khalid Al-Mansoor',
                'company' => 'Gulf Retail Group',
                'phone' => '+966501234567',
                'country' => 'Saudi Arabia',
                'service_of_interest' => 'Cloud POS & Retail Systems',
                'estimated_budget' => '$10,000 - $25,000',
                'message' => 'Inquiring about deploying AT Loops POS across 14 supermarket branches with multi-store inventory sync.',
                'source_page' => '/products/smart-inventory-pos',
                'priority' => 'urgent',
                'status' => 'contacted',
            ]
        );

        // 10. Default Home Page with Builder Blocks
        $home = Page::updateOrCreate(
            ['slug' => 'home'],
            [
                'title_en' => 'Home',
                'title_ar' => 'الرئيسية',
                'is_published' => true,
                'published_at' => now(),
                'meta_title_en' => 'AT Loops | Enterprise Software, Cloud Infrastructure & IT Support',
                'meta_title_ar' => 'ات لوبس | البرمجيات المخصصة، البنية التحتية السحابية والدعم الفني',
                'meta_description_en' => 'AT Loops: Technology without mazes. Custom ERP, POS, web development, cloud servers, and managed IT services across Egypt & Gulf markets.',
                'meta_description_ar' => 'ات لوبس.. تكنولوجيا بدون متاهات. شريكك التقني المتكامل لتطوير البرمجيات المخصصة، أنظمة ERP، وتأمين البنية التحتية للمؤسسات.',
            ]
        );

        PageSection::updateOrCreate(
            ['page_id' => $home->id, 'sort_order' => 1],
            [
                'block_type' => 'hero',
                'content_en' => [
                    'badge' => 'Technology Without Mazes',
                    'title' => 'Empowering Enterprise Operations With Custom Software & Cloud Solutions',
                    'subtitle' => 'Your end-to-end technology partner in Egypt and the Gulf. We architect tailored ERP systems, high-speed web platforms, cloud infrastructure, and 24/7 managed IT support so you can focus on scaling your business.',
                    'primary_cta_text' => 'Request Consultation',
                    'primary_cta_link' => '/contact-us',
                    'secondary_cta_text' => 'Explore Solutions',
                    'secondary_cta_link' => '/products',
                ],
                'content_ar' => [
                    'badge' => 'تكنولوجيا بدون متاهات',
                    'title' => 'نطور برمجيات ذكية وحلول سحابية تقود نمو أعمالك ومؤسستك',
                    'subtitle' => 'شريكك التقني المتكامل في مصر والخليج لتطوير البرمجيات المخصصة، أنظمة ERP، تصميم المنصات، والدعم الفني الشامل. نُدير لك التكنولوجيا لتتفرغ للتوسع والريادة.',
                    'primary_cta_text' => 'اطلب استشارة مجانية',
                    'primary_cta_link' => '/contact-us',
                    'secondary_cta_text' => 'استكشف الحلول البرمجية',
                    'secondary_cta_link' => '/products',
                ],
                'settings' => ['layout' => 'centered', 'bg_theme' => 'dark_navy'],
                'is_active' => true,
            ]
        );

        PageSection::updateOrCreate(
            ['page_id' => $home->id, 'sort_order' => 2],
            [
                'block_type' => 'stats_counter',
                'content_en' => [
                    'items' => [
                        ['number' => '100+', 'label' => 'Enterprise Deployments'],
                        ['number' => '99.9%', 'label' => 'System Uptime SLA'],
                        ['number' => '3+ Years', 'label' => 'Average Client Retention'],
                        ['number' => '24/7', 'label' => 'Dedicated Technical Support'],
                    ]
                ],
                'content_ar' => [
                    'items' => [
                        ['number' => '+١٠٠', 'label' => 'مشروع وأنظمة منفذة'],
                        ['number' => '٩٩.٩٪', 'label' => 'نسبة استقرار وجاهزية الأنظمة'],
                        ['number' => '+٣ سنوات', 'label' => 'متوسط استمرارية شراكات العملاء'],
                        ['number' => '٢٤/٧', 'label' => 'دعم فني واستجابة مباشرة'],
                    ]
                ],
                'settings' => ['bg_theme' => 'slate_glow'],
                'is_active' => true,
            ]
        );
    }
}
