export const ANEXO_MAX_SIZE = 10 * 1024 * 1024; // 10MB
export const ANEXO_TIPOS_PERMITIDOS = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const ANEXO_MAX_ARQUIVOS = 5;

export function validarAnexo(file: File): string | null {
  if (file.size > ANEXO_MAX_SIZE) return `${file.name} excede o limite de 10MB.`;
  if (!ANEXO_TIPOS_PERMITIDOS.includes(file.type)) return `${file.name} tem um formato não permitido.`;
  return null;
}