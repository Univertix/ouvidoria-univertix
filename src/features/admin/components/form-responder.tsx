'use client'

import { useState } from 'react';
import { atualizarStatusAction } from '@/features/admin/actions/atualizar-status.action';
import { StatusDenuncia } from '@/types';

export function FormResponderDenuncia({ id, statusAtual }: { id: string, statusAtual: string }) {
  const [status, setStatus] = useState<StatusDenuncia>(statusAtual as StatusDenuncia);
  const [mensagem, setMensagem] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await atualizarStatusAction(id, status, mensagem, observacao);
    
    if (res.sucesso) {
      alert('Denúncia atualizada com sucesso!');
      setMensagem('');
      setObservacao('');
    } else {
      alert('Erro ao atualizar denúncia.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2">Atualizar e Responder</h2>
      
      <div>
        <label className="block text-sm font-semibold mb-1">Novo Status</label>
        <select 
          className="w-full border rounded p-2 bg-slate-50"
          value={status} 
          onChange={(e) => setStatus(e.target.value as StatusDenuncia)}
        >
          <option value="RECEBIDA">Recebida</option>
          <option value="EM_ANALISE">Em Análise</option>
          <option value="EM_INVESTIGACAO">Em Investigação</option>
          <option value="AGUARDANDO_INFORMACOES">Aguardando Informações</option>
          <option value="CONCLUIDA">Concluída</option>
          <option value="ARQUIVADA">Arquivada</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Mensagem ao Denunciante (Pública)</label>
        <textarea
          required
          rows={3}
          className="w-full border rounded p-2"
          placeholder="Mensagem que o denunciante verá..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Observação Interna (Privada)</label>
        <textarea
          rows={2}
          className="w-full border rounded p-2 bg-yellow-50"
          placeholder="Anotações visíveis apenas para a equipe..."
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="mt-4 bg-slate-900 text-white font-bold py-2 px-4 rounded hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar Atualização'}
      </button>
    </form>
  );
}