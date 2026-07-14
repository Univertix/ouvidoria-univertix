import { z } from 'zod';

export const anexoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  tamanho: z.number(),
  tipo: z.string(),
});

export const denunciaSchema = z.object({
  anonima: z.boolean(),
  nome: z.string().optional(),
  email: z.string().optional(),
  telefone: z.string().optional(),
  tipo: z.enum(['ASSEDIO', 'FRAUDE', 'CORRUPCAO', 'DISCRIMINACAO', 'INFRAESTRUTURA', 'OUTROS'], {
    message: 'Selecione um tipo de denúncia válido.',
  }),
  local: z.string().min(3, 'O local deve ser informado com mais detalhes.'),
  dataOcorrido: z.string().min(1, 'A data do ocorrido é obrigatória.'),
  pessoasEnvolvidas: z.string().optional(),
  descricao: z.string().min(20, 'Forneça uma descrição detalhada de no mínimo 20 caracteres.'),
  anexos: z.array(anexoSchema).default([]),
  termosAceitos: z.literal(true, {
    error: 'Você precisa aceitar os termos de confidencialidade.',
  }),
}).superRefine((data, ctx) => {
  if (!data.anonima) {
    if (!data.nome || data.nome.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nome'],
        message: 'O nome é obrigatório para denúncias identificadas.',
      });
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['email'],
        message: 'Um e-mail válido é obrigatório para denúncias identificadas.',
      });
    }
  }
});

export type DenunciaInput = z.infer<typeof denunciaSchema>;