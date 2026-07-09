import { FormAcompanhamento } from '@/features/acompanhamento/components/form-acompanhamento';
import { SiteHeader } from '@/components/site-header';

export default function AcompanharPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <div className="py-10 px-4">
        <FormAcompanhamento />
      </div>
    </div>
  );
}