import { FormCadastro } from '@/features/denuncia/components/form-cadastro';
import { SiteHeader } from '@/components/site-header';

export default function DenunciarPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <div className="py-10 px-4">
        <FormCadastro />
      </div>
    </div>
  );
}