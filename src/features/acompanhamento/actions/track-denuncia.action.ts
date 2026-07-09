'use server'

import { DenunciaRepository } from '@/repositories/denuncia.repository';

const repository = new DenunciaRepository();

export async function buscarDenunciaAction(protocolo: string) {
  try {
    const denuncia = await repository.buscarPorProtocolo(protocolo);
    if (!denuncia) return { sucesso: false, erro: 'Protocolo não encontrado.' };
    return { sucesso: true, denuncia };
  } catch (error) {
    return { sucesso: false, erro: 'Erro ao buscar protocolo.' };
  }
}