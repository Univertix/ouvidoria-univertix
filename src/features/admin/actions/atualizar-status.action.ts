'use server'

import { DenunciaRepository } from '@/repositories/denuncia.repository';
import { StatusDenuncia } from '@/types';
import { revalidatePath } from 'next/cache';

const repository = new DenunciaRepository();

export async function atualizarStatusAction(
  id: string, 
  status: StatusDenuncia, 
  mensagem: string, 
  observacao?: string
) {
  try {
    await repository.atualizarStatus(id, status, mensagem, observacao);
    revalidatePath(`/admin/dashboard/${id}`);
    revalidatePath('/admin/dashboard');
    return { sucesso: true };
  } catch (error) {
    return { sucesso: false, erro: 'Erro ao atualizar status.' };
  }
}