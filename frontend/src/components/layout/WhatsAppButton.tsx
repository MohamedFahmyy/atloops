import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { locale } = useLanguage();
  const phone = '201112194828';
  const message = locale === 'ar'
    ? 'مرحباً شركة ات لوبس، أرغب في الاستفسار عن حلولكم البرمجية وخدمات التحول الرقمي.'
    : 'Hello AT Loops team, I would like to inquire about your enterprise software and digital solutions.';

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label="Customer Support">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 end-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-transform hover:scale-105 group border-2 border-white/40"
        aria-label="Direct WhatsApp Contact"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline-block font-bold text-xs pr-1">
          {locale === 'ar' ? 'تواصل معنا واتساب' : 'WhatsApp Us'}
        </span>
      </a>
    </aside>
  );
};
