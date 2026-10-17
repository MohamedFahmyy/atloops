import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/layout/WhatsAppButton';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ServiceDetailPage } from './pages/public/ServiceDetailPage';
import { SolutionsPage } from './pages/public/SolutionsPage';
import { SolutionDetailPage } from './pages/public/SolutionDetailPage';
import { PortfolioPage } from './pages/public/PortfolioPage';
import { PortfolioDetailPage } from './pages/public/PortfolioDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { IndustriesPage } from './pages/public/IndustriesPage';
import { BlogPage } from './pages/public/BlogPage';
import { BlogDetailPage } from './pages/public/BlogDetailPage';
import { ContactPage } from './pages/public/ContactPage';
import { RequestQuotePage } from './pages/public/RequestQuotePage';
import { BookConsultationPage } from './pages/public/BookConsultationPage';
import { FaqPage } from './pages/public/FaqPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';
import { SearchResultsPage } from './pages/public/SearchResultsPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminPortfolioPage } from './pages/admin/AdminPortfolioPage';
import { AdminPageBuilderPage } from './pages/admin/AdminPageBuilderPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      retry: 1,
    },
  },
});

// Scroll to top on every route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Public Layout Wrapper
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              
              {/* --- PUBLIC ENTERPRISE ROUTES --- */}
              <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
              <Route path="/services/:slug" element={<PublicLayout><ServiceDetailPage /></PublicLayout>} />
              <Route path="/solutions" element={<PublicLayout><SolutionsPage /></PublicLayout>} />
              <Route path="/solutions/:slug" element={<PublicLayout><SolutionDetailPage /></PublicLayout>} />
              <Route path="/products" element={<PublicLayout><SolutionsPage /></PublicLayout>} />
              <Route path="/products/:slug" element={<PublicLayout><SolutionDetailPage /></PublicLayout>} />
              <Route path="/portfolio" element={<PublicLayout><PortfolioPage /></PublicLayout>} />
              <Route path="/portfolio/:slug" element={<PublicLayout><PortfolioDetailPage /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
              <Route path="/industries" element={<PublicLayout><IndustriesPage /></PublicLayout>} />
              <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
              <Route path="/blog/:slug" element={<PublicLayout><BlogDetailPage /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
              <Route path="/contact-us" element={<PublicLayout><ContactPage /></PublicLayout>} />
              <Route path="/quote" element={<PublicLayout><RequestQuotePage /></PublicLayout>} />
              <Route path="/request-quote" element={<PublicLayout><RequestQuotePage /></PublicLayout>} />
              <Route path="/consultation" element={<PublicLayout><BookConsultationPage /></PublicLayout>} />
              <Route path="/book-consultation" element={<PublicLayout><BookConsultationPage /></PublicLayout>} />
              <Route path="/faqs" element={<PublicLayout><FaqPage /></PublicLayout>} />
              <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
              <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
              <Route path="/search" element={<PublicLayout><SearchResultsPage /></PublicLayout>} />

              {/* --- ADMIN & CMS ROUTES --- */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="services" element={<AdminServicesPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="portfolio" element={<AdminPortfolioPage />} />
                <Route path="pages" element={<AdminPageBuilderPage />} />
                <Route path="leads" element={<AdminLeadsPage />} />
                <Route path="media" element={<AdminMediaPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
              </Route>

              {/* --- 404 CATCH-ALL --- */}
              <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />

            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
