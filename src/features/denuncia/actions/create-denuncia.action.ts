'use server'

import { DenunciaRepository } from '@/repositories/denuncia.repository';
// CORREÇÃO: Importamos o type DenunciaInput diretamente do schema!
import { denunciaSchema, type DenunciaInput } from '@/schemas/denuncia.schema'; 

const repository = new DenunciaRepository();

export async function createDenunciaAction(data: DenunciaInput) {
  try {
    const validData = denunciaSchema.parse(data);
    
    const protocolo = await repository.criar({
      anonima: validData.anonima,
      denunciante: validData.anonima ? null : {
        nome: validData.nome!,
        email: validData.email!,
        telefone: validData.telefone,
      },
      tipo: validData.tipo,
      local: validData.local,
      dataOcorrido: validData.dataOcorrido,
      pessoasEnvolvidas: validData.pessoasEnvolvidas,
      descricao: validData.descricao,
      anexos: validData.anexos,
    });

    return { sucesso: true, protocolo };
  } catch (error) {
    console.error("Erro de validação ou banco:", error);
    return { sucesso: false, erro: 'Erro ao criar denúncia. Verifique os dados preenchidos.' };
  }
}