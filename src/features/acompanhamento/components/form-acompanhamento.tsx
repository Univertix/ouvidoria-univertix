'use client'

import { useState } from 'react';
import { buscarDenunciaAction } from '../../acompanhamento/actions/track-denuncia.action';
import { Search, Loader2, FileSearch, Clock } from 'lucide-react';

export function FormAcompanhamento() {
  const [protocolo, setProtocolo] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setResultado(null);

    const res = await buscarDenunciaAction(protocolo.trim());
    
    if (res.sucesso) {
      setResultado(res.denuncia);
    } else {
      setErro(res.erro || 'Nenhum registro encontrado para este protocolo.');
    }
    setLoading(false);
  };

  return (
    <div className="container container-sm animate-fade-in" style={{ padding: '60px 24px' }}>
      
      {/* Box de Busca */}
      <div className="card card-shadow-lg" style={{ padding: '48px 32px', textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ width: '64px', height: '64px', background: 'var(--blue-50)', color: 'var(--blue-600)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <FileSearch size={32} />
        </div>
        <h2 className="title-xl" style={{ marginBottom: '8px' }}>Acompanhar Protocolo</h2>
        <p className="text-muted" style={{ marginBottom: '32px' }}>
          Digite o código recebido no ato da denúncia para verificar as atualizações da ouvidoria.
        </p>

        <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '12px', maxWidth: '500px', margin: '0 auto' }}>
          <div className="input-icon-wrapper" style={{ flex: 1 }}>
            <Search className="input-icon" size={20} />
            <input
              type="text"
              placeholder="Ex: UVX-2026-ABCDEF"
              className="form-control input-with-icon font-mono font-bold"
              style={{ fontSize: '1rem', padding: '16px 16px 16px 48px' }}
              value={protocolo}
              onChange={(e) => setProtocolo(e.target.value.toUpperCase())}
              required
            />
          </div>
          <button type="submit" disabled={loading || !protocolo} className="btn btn-dark" style={{ padding: '0 32px' }}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Buscar'}
          </button>
        </form>

        {erro && (
          <div className="alert alert-error" style={{ maxWidth: '500px', margin: '24px auto 0', justifyContent: 'center' }}>
            {erro}
          </div>
        )}
      </div>

      {/* Resultados da Busca (Timeline) */}
      {resultado && (
        <div className="card card-shadow-lg animate-fade-in" style={{ padding: '40px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-100)', paddingBottom: '24px', marginBottom: '32px' }}>
            <div>
              <p className="form-label">Status do Protocolo</p>
              <h3 className="title-lg font-mono">{resultado.protocolo}</h3>
            </div>
            <span className="badge badge-slate">
              {resultado.status.replace(/_/g, ' ')}
            </span>
          </div>
          
          <h4 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Clock size={24} color="var(--blue-600)" /> Histórico de Tramitação
          </h4>
          
          <div className="timeline">
            {resultado.historico.map((hist: any, index: number) => {
              const isLast = index === resultado.historico.length - 1;
              return (
                <div key={index} className={`timeline-item ${isLast ? 'active' : ''}`}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className={`badge ${isLast ? 'badge-blue' : 'badge-slate'}`}>
                        {hist.status.replace(/_/g, ' ')}
                      </span>
                      <time className="text-xs font-bold text-muted">
                        {new Date(hist.criadoEm).toLocaleString('pt-BR')}
                      </time>
                    </div>
                    <p className={`text-sm ${isLast ? 'font-bold' : ''}`}>
                      {hist.mensagem}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}