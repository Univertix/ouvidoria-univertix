'use client';

import { useState } from 'react';
import { updateDenunciaStatusAction } from '../actions/admin.actions';
import { useRouter } from 'next/navigation';
import { Clock, Send, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';
import { StatusDenuncia } from '@/types'; 

const STATUS_OPTIONS = [
  { value: 'RECEBIDA', label: 'Recebida' },
  { value: 'EM_ANALISE', label: 'Em Análise' },
  { value: 'EM_INVESTIGACAO', label: 'Em Investigação' },
  { value: 'AGUARDANDO_INFORMACOES', label: 'Aguardando Informações' },
  { value: 'CONCLUIDA', label: 'Concluída' },
  { value: 'ARQUIVADA', label: 'Arquivada' },
];

export function RespostaDenuncia({ denuncia }: { denuncia: any }) {
  const router = useRouter();
  const [status, setStatus] = useState<StatusDenuncia>(denuncia.status);
  const [mensagem, setMensagem] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) {
      setErro('A mensagem pública de resposta é obrigatória.');
      return;
    }
    
    setLoading(true);
    setErro(null);
    setSucesso(false);

    const res = await updateDenunciaStatusAction(denuncia.id, status, mensagem.trim(), observacao.trim() || undefined);
    setLoading(false);

    if (res.success) {
      setSucesso(true);
      setMensagem('');
      setObservacao('');
      router.refresh(); 
    } else {
      setErro(res.error || 'Erro ao registrar resposta.');
    }
  };

  return (
    <div className="resposta-grid">
      
      {/* LADO ESQUERDO: Dados da Denúncia */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        <div className="card">
          <div style={{ padding: '24px', borderBottom: '1px solid var(--slate-200)', background: 'var(--slate-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p className="form-label">Protocolo</p>
              <h1 className="title-lg font-mono">{denuncia.protocolo}</h1>
            </div>
            <span className="badge badge-slate" style={{ background: '#fff', fontSize: '0.875rem' }}>
              {denuncia.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div style={{ padding: '32px' }}>
            <div className="details-grid">
              <div>
                <span className="form-label">Tipo da Ocorrência</span>
                <p className="font-bold">{denuncia.tipo}</p>
              </div>
              <div>
                <span className="form-label">Data do Registro</span>
                <p className="font-bold">{new Date(denuncia.criadoEm).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <span className="form-label">Local Informado</span>
                <p className="font-bold">{denuncia.local}</p>
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Relato da Denúncia</span>
              <div className="details-box" style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                {denuncia.descricao}
              </div>
            </div>

            <div className="details-box" style={{ background: '#fff', marginTop: '32px' }}>
              <h3 className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--slate-900)' }}>
                <ShieldAlert size={18} color="var(--blue-600)" /> Dados do Denunciante (Sigiloso)
              </h3>
              {denuncia.anonima ? (
                <p className="text-muted text-sm font-bold" style={{ fontStyle: 'italic', background: 'var(--slate-50)', padding: '16px', borderRadius: '8px' }}>
                  Manifestação registrada de forma anônima. Não há dados de contato disponíveis.
                </p>
              ) : (
                <div className="details-grid" style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: '8px', marginBottom: 0 }}>
                  <div><span className="form-label">NOME</span><span className="font-bold text-sm">{denuncia.nome}</span></div>
                  <div><span className="form-label">E-MAIL</span><span className="font-bold text-sm">{denuncia.email}</span></div>
                  <div><span className="form-label">TELEFONE</span><span className="font-bold text-sm">{denuncia.telefone || '-'}</span></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '16px', marginBottom: '16px' }}>
            <Clock size={20} color="var(--blue-600)" /> Histórico de Ações
          </h2>
          
          {denuncia.historico && denuncia.historico.length > 0 ? (
            <div className="timeline">
              {denuncia.historico.map((h: any, index: number) => {
                const isLast = index === denuncia.historico.length - 1;
                return (
                  <div key={h.id} className={`timeline-item ${isLast ? 'active' : ''}`}>
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span className={`badge ${isLast ? 'badge-blue' : 'badge-slate'}`}>
                            {h.status.replace(/_/g, ' ')}
                          </span>
                          <span className="badge badge-slate" style={{ background: 'var(--slate-50)' }}>POR: {h.criadoPor}</span>
                        </div>
                        <time className="text-xs font-bold text-muted">
                          {new Date(h.criadoEm).toLocaleString('pt-BR')}
                        </time>
                      </div>
                      
                      <div style={{ marginTop: '16px' }}>
                        <span className="form-label">Resposta Pública:</span>
                        <p className="text-sm font-bold mt-1">{h.mensagem}</p>
                      </div>
                      
                      {h.observacaoInterna && (
                        <div style={{ marginTop: '16px', background: 'var(--amber-50)', border: '1px solid var(--amber-200)', padding: '16px', borderRadius: '8px' }}>
                          <span className="form-label" style={{ color: 'var(--amber-700)' }}>Nota Interna (Admin):</span>
                          <p className="text-sm font-bold mt-1" style={{ color: 'var(--amber-900)' }}>{h.observacaoInterna}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted text-sm font-bold" style={{ fontStyle: 'italic' }}>Nenhuma ação registrada.</p>
          )}
        </div>
      </div>

      {/* LADO DIREITO: Formulário de Ação */}
      <div className="sticky-sidebar">
        <div className="card card-shadow-lg" style={{ background: 'var(--slate-900)', color: '#fff', padding: '32px' }}>
          <h2 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--slate-800)', paddingBottom: '20px', marginBottom: '24px' }}>
            <Send size={20} color="var(--blue-500)" /> Responder Protocolo
          </h2>

          {sucesso && (
            <div className="alert alert-success" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-500)' }}>
              <CheckCircle2 size={20} />
              <span>Status e resposta atualizados com sucesso!</span>
            </div>
          )}
          
          {erro && (
            <div className="alert alert-error" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--red-500)' }}>
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--slate-400)' }}>Modificar Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusDenuncia)}
                className="form-control form-control-dark"
                style={{ appearance: 'none' }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--slate-400)' }}>Resposta Pública <span style={{ color: 'var(--red-500)' }}>*</span></label>
              <textarea
                required
                rows={4}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Resposta que o denunciante lerá..."
                className="form-control form-control-dark"
                style={{ resize: 'none' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--amber-500)' }}>Nota Interna (Opcional)</label>
              <textarea
                rows={3}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Anotações para a equipe de ética..."
                className="form-control form-control-dark"
                style={{ resize: 'none', background: 'rgba(15, 23, 42, 0.5)' }}
              />
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--slate-800)' }}>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                {loading ? 'Salvando Alterações...' : 'Salvar e Enviar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}