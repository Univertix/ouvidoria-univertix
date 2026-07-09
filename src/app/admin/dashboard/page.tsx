import { getAdminDashboardData } from '@/features/admin/actions/admin.actions';
import { LogoutButton } from '@/features/admin/components/logout-button';
import Link from 'next/link';
import { ShieldCheck, FileText, Clock, CheckCircle2, Archive, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { metrics, denuncias } = await getAdminDashboardData();

  return (
    <div className="page-wrapper">
      <header className="admin-header">
        <div className="admin-header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--blue-600)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} color="#fff" />
            </div>
            <div>
              <h1 className="title-md" style={{ margin: 0, lineHeight: 1 }}>Painel Administrativo</h1>
              <span className="text-xs text-muted font-bold uppercase tracking-widest" style={{ color: 'var(--blue-100)' }}>Ouvidoria Univértix</span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="container animate-fade-in-up" style={{ padding: '40px 24px' }}>
        
        {/* CARDS DE MÉTRICAS */}
        <div className="metrics-grid">
          <div className="card metric-card">
            <div className="metric-icon" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}><FileText size={28} /></div>
            <div>
              <p className="form-label">Total</p>
              <h2 className="title-xl">{metrics.total}</h2>
            </div>
          </div>
          <div className="card metric-card">
            <div className="metric-icon" style={{ background: 'var(--amber-50)', color: 'var(--amber-600)' }}><Clock size={28} /></div>
            <div>
              <p className="form-label">Em Análise</p>
              <h2 className="title-xl">{metrics.emAnalise}</h2>
            </div>
          </div>
          <div className="card metric-card">
            <div className="metric-icon" style={{ background: 'var(--emerald-50)', color: 'var(--emerald-600)' }}><CheckCircle2 size={28} /></div>
            <div>
              <p className="form-label">Concluídas</p>
              <h2 className="title-xl">{metrics.concluidas}</h2>
            </div>
          </div>
          <div className="card metric-card">
            <div className="metric-icon" style={{ background: 'var(--slate-100)', color: 'var(--slate-600)' }}><Archive size={28} /></div>
            <div>
              <p className="form-label">Arquivadas</p>
              <h2 className="title-xl">{metrics.arquivadas}</h2>
            </div>
          </div>
        </div>

        {/* TABELA DE DENÚNCIAS */}
      {/* TABELA DE DENÚNCIAS */}
        <div className="card">
          <div style={{ padding: '24px', borderBottom: '1px solid var(--slate-100)', background: 'var(--slate-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="title-md">Últimas Manifestações</h2>
            <span className="text-sm font-bold text-muted">Total: {denuncias.length} registros</span>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Protocolo</th>
                  <th>Data de Registro</th>
                  <th>Tipo de Manifestação</th>
                  <th>Status Atual</th>
                  <th style={{ textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {denuncias.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '64px 24px' }}>
                      <FileText size={40} style={{ color: 'var(--slate-300)', margin: '0 auto 16px' }} />
                      <p className="text-muted font-bold">Nenhuma denúncia registrada ainda.</p>
                      <p className="text-sm text-muted">Quando novas manifestações chegarem, elas aparecerão aqui.</p>
                    </td>
                  </tr>
                ) : (
                  denuncias.map((denuncia) => {
                    // Lógica para cores semânticas de Status
                    const statusStr = denuncia.status.toUpperCase().replace(/_/g, ' ');
                    let badgeClass = "badge-slate";
                    if (statusStr.includes('CONCLU')) badgeClass = "badge-emerald";
                    else if (statusStr.includes('ANALISE')) badgeClass = "badge-amber";
                    else if (statusStr.includes('RECEBIDA')) badgeClass = "badge-blue";

                    // Lógica sutil para o Tipo
                    const tipoStr = denuncia.tipo.toUpperCase();
                    let tipoColor = "var(--slate-700)";
                    if (tipoStr === 'FRAUDE') tipoColor = "var(--red-600)";
                    else if (tipoStr === 'ASSEDIO') tipoColor = "var(--amber-700)";

                    return (
                      <tr key={denuncia.id} className="table-row-hover">
                        <td>
                          <span className="font-mono text-xs" style={{ background: 'var(--slate-100)', padding: '4px 8px', borderRadius: '4px', color: 'var(--slate-700)', fontWeight: '600' }}>
                            {denuncia.protocolo}
                          </span>
                        </td>
                        <td className="font-bold text-muted">
                          {new Date(denuncia.criadoEm).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="font-bold" style={{ color: tipoColor }}>
                          {denuncia.tipo}
                        </td>
                        <td>
                          <span className={`badge ${badgeClass}`}>
                            {statusStr}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link href={`/admin/dashboard/${denuncia.id}`} className="btn btn-action" style={{ padding: '6px 14px' }}>
                            <Eye size={16} /> <span className="action-text">Analisar</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}