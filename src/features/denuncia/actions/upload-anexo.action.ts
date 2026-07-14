'use server'

import { uploadAnexoToDrive } from '@/lib/google-drive';
import { validarAnexo, ANEXO_MAX_ARQUIVOS } from '@/lib/upload-config';

export interface AnexoUploaded {
  id: string;
  nome: string;
  tamanho: number;
  tipo: string;
}

export async function uploadAnexosAction(formData: FormData): Promise<{ sucesso: boolean; anexos?: AnexoUploaded[]; erro?: string }> {
  try {
    const files = formData.getAll('anexos') as File[];

    if (files.length > ANEXO_MAX_ARQUIVOS) {
      return { sucesso: false, erro: `Máximo de ${ANEXO_MAX_ARQUIVOS} arquivos permitidos.` };
    }

    for (const file of files) {
      const erro = validarAnexo(file);
      if (erro) return { sucesso: false, erro };
    }

    const uploads = await Promise.all(files.map((f) => uploadAnexoToDrive(f)));
    return { sucesso: true, anexos: uploads };
  } catch (error) {
    console.error('[UPLOAD_ANEXO_ERROR]', error);
    return { sucesso: false, erro: 'Erro ao enviar arquivo(s). Tente novamente.' };
  }
}