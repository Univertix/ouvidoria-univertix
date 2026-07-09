'use server';

import { DenunciaRepository } from '@/repositories/denuncia.repository';
import { StatusDenuncia } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getAdminDashboardData() {
  const repository = new DenunciaRepository();
  const todas = await repository.listarTodas();

  const metrics = todas.reduce(
    (acc, cur) => {
      acc.total++;
      if (cur.status === 'EM_ANALISE' || cur.status === 'RECEBIDA') acc.emAnalise++;
      if (cur.status === 'CONCLUIDA') acc.concluidas++;
      if (cur.status === 'ARQUIVADA') acc.arquivadas++;
      return acc;
    },
    { total: 0, emAnalise: 0, concluidas: 0, arquivadas: 0 }
  );

  return { metrics, denuncias: todas };
}

export async function updateDenunciaStatusAction(
  id: string, 
  status: StatusDenuncia, 
  mensagemPublica: string, 
  observacaoInterna?: string
) {
  try {
    const repository = new DenunciaRepository();
    await repository.atualizarStatus(id, status, mensagemPublica, observacaoInterna);
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error('[UPDATE_STATUS_ACTION_ERROR]', error);
    return { success: false, error: 'Falha ao atualizar movimentação da denúncia.' };
  }
}
export async function getDenunciaDetalhesAction(id: string) {
  try {
    const repository = new DenunciaRepository();
    const denuncia = await repository.buscarPorId(id);
    if (!denuncia) {
      return { success: false, error: 'Denúncia não encontrada.' };
    }
    return { success: true, denuncia };
  } catch (error) {
    console.error('[GET_DENUNCIA_DETALHES_ERROR]', error);
    return { success: false, error: 'Erro ao buscar detalhes da denúncia.' };
  }
}