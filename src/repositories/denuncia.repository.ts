import { prisma } from '@/lib/prisma';
import { Denuncia, StatusDenuncia } from '@/types';
import crypto from 'crypto';

export class DenunciaRepository {
  private gerarProtocolo(): string {
    const ano = new Date().getFullYear();
    const bytes = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `UVX-${ano}-${bytes}`;
  }

  async criar(data: Omit<Denuncia, 'id' | 'protocolo' | 'status' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
    const protocolo = this.gerarProtocolo();
    
    // 👇 ADICIONADO: Tempo limite (timeout) para evitar travamento do banco
    await prisma.$transaction(async (tx) => {
      const novaDenuncia = await tx.denuncia.create({
        data: {
          protocolo,
          anonima: data.anonima,
          nome: data.denunciante?.nome,
          email: data.denunciante?.email,
          telefone: data.denunciante?.telefone,
          tipo: data.tipo,
          local: data.local,
          dataOcorrido: data.dataOcorrido,
          pessoasEnvolvidas: data.pessoasEnvolvidas,
          descricao: data.descricao,
          // 👇 ADICIONADO: Conversão do array para qualquer tipo (any) para satisfazer o JSON do Prisma
          anexos: data.anexos ? (data.anexos as any) : null,
          status: 'RECEBIDA',
        },
      });
      
      await tx.historico.create({
        data: {
          denunciaId: novaDenuncia.id,
          status: 'RECEBIDA',
          mensagem: 'Denúncia registrada com sucesso no sistema da Univértix.',
          criadoPor: 'SISTEMA',
        },
      });
    }, {
      maxWait: 10000, // Aguarda até 10s para conseguir conectar
      timeout: 20000  // Permite que a transação dure até 20s
    });
    
    return protocolo;
  }

  async listarTodas(): Promise<any[]> {
    const denuncias = await prisma.denuncia.findMany({
      orderBy: { criadoEm: 'desc' }, // Traz as mais recentes primeiro
    });
    
    return denuncias.map((d) => ({
      ...d,
      criadoEm: d.criadoEm.toISOString(),
      atualizadoEm: d.atualizadoEm.toISOString(),
    }));
  }

  async buscarPorProtocolo(protocolo: string): Promise<any | null> {
    const denunciaRecord = await prisma.denuncia.findUnique({
      where: { protocolo },
      include: {
        historico: {
          orderBy: { criadoEm: 'asc' },
        },
      },
    });
    if (!denunciaRecord) return null;
    return {
      ...denunciaRecord,
      criadoEm: denunciaRecord.criadoEm.toISOString(),
      atualizadoEm: denunciaRecord.atualizadoEm.toISOString(),
      historico: denunciaRecord.historico.map((h) => ({
        ...h,
        criadoEm: h.criadoEm.toISOString(),
      })),
    };
  }

  async buscarPorId(id: string): Promise<any | null> {
    const denunciaRecord = await prisma.denuncia.findUnique({
      where: { id },
      include: {
        historico: {
          orderBy: { criadoEm: 'asc' },
        },
      },
    });
    if (!denunciaRecord) return null;
    return {
      ...denunciaRecord,
      criadoEm: denunciaRecord.criadoEm.toISOString(),
      atualizadoEm: denunciaRecord.atualizadoEm.toISOString(),
      historico: denunciaRecord.historico.map((h) => ({
        ...h,
        criadoEm: h.criadoEm.toISOString(),
      })),
    };
  }

  async atualizarStatus(id: string, novoStatus: StatusDenuncia, mensagemPublica: string, observacaoInterna?: string, autor: string = 'ADMIN'): Promise<void> {
    // 👇 Aplicando o mesmo timeout na transação de atualização também
    await prisma.$transaction(async (tx) => {
      await tx.denuncia.update({
        where: { id },
        data: { status: novoStatus },
      });
      await tx.historico.create({
        data: {
          denunciaId: id,
          status: novoStatus,
          mensagem: mensagemPublica,
          observacaoInterna,
          criadoPor: autor,
        },
      });
    }, {
      maxWait: 10000,
      timeout: 20000
    });
  }
}