import { getDenunciaDetalhesAction } from '@/features/admin/actions/admin.actions';
import { RespostaDenuncia } from '@/features/admin/components/resposta-denuncia';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DenunciaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getDenunciaDetalhesAction(id);

  if (!res.success || !res.denuncia) {
    return (
      <div className="page-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <AlertCircle size={48} color="var(--red-500)" style={{ marginBottom: '16px' }} />
        <h1 className="title-md">Denúncia não encontrada</h1>
        <p className="text-muted" style={{ marginBottom: '24px' }}>O protocolo que você está procurando não existe ou foi removido.</p>
        <Link href="/admin/dashboard" className="btn btn-primary">
          Voltar ao Painel
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ padding: '40px 24px' }}>
      <div className="container animate-fade-in-up">
        <Link href="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: 'var(--slate-500)', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Voltar ao Painel
        </Link>

        {/* Renderiza o Layout Interno */}
        <RespostaDenuncia denuncia={res.denuncia} />
      </div>
    </div>
  );
}