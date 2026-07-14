'use server';

import { DenunciaRepository } from '@/repositories/denuncia.repository';
import { createDriveFolder, moveAndRenameAnexo } from '@/lib/google-drive';

const denunciaRepository = new DenunciaRepository();

export async function createDenunciaAction(data: any) {
  try {
    // 1. Salva no banco de dados primeiro e resgata o protocolo gerado
    const protocolo = await denunciaRepository.criar(data);

    // 2. Lógica para organizar o Google Drive se existirem arquivos
    if (data.anexos && data.anexos.length > 0) {
      try {
        // Cria a pasta no Google Drive com o número do protocolo
        const folderId = await createDriveFolder(protocolo);

        // Move cada anexo para dentro da nova pasta, renomeando com o protocolo na frente
        for (const anexo of data.anexos) {
          const novoNome = `${protocolo} - ${anexo.nome}`;
          await moveAndRenameAnexo(anexo.id, novoNome, folderId);
        }
      } catch (driveError) {
        // Usamos um try/catch interno aqui porque se houver qualquer instabilidade no 
        // Google Drive na hora de mover, NÃO queremos mostrar erro pro usuário, 
        // pois a denúncia e os anexos já estão salvos com segurança.
        console.error('[ERRO_ORGANIZAR_DRIVE]', driveError);
      }
    }

    return { sucesso: true, protocolo };
  } catch (error) {
    console.error('[ERRO_CRIAR_DENUNCIA]', error);
    return { 
      sucesso: false, 
      erro: 'Ocorreu um erro ao processar sua denúncia. Tente novamente.' 
    };
  }
}