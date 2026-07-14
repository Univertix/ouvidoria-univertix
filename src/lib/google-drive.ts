import { google } from 'googleapis';
import { Readable } from 'stream';

function getOAuthClient() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  return client;
}

function getDriveClient() {
  const auth = getOAuthClient();
  return google.drive({ version: 'v3', auth });
}

export interface AnexoUploaded {
  id: string;
  nome: string;
  tamanho: number;
  tipo: string;
}

export async function uploadAnexoToDrive(file: File): Promise<AnexoUploaded> {
  const drive = getDriveClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  const response = await drive.files.create({
    requestBody: {
      name: `${Date.now()}_${file.name}`,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    },
    media: {
      mimeType: file.type,
      body: stream,
    },
    fields: 'id, name, size, mimeType',
  });

  return {
    id: response.data.id!,
    nome: file.name,
    tamanho: file.size,
    tipo: file.type,
  };
}

export async function getAnexoMetadata(fileId: string) {
  const drive = getDriveClient();
  const res = await drive.files.get({
    fileId,
    fields: 'id, name, mimeType, size',
  });
  return res.data;
}

export async function getAnexoStream(fileId: string) {
  const drive = getDriveClient();
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );
  return res.data as unknown as NodeJS.ReadableStream;
}

export async function deleteAnexoFromDrive(fileId: string) {
  const drive = getDriveClient();
  await drive.files.delete({ fileId });
}

// ==========================================
// NOVAS FUNÇÕES PARA ORGANIZAR PASTAS
// ==========================================

export async function createDriveFolder(folderName: string): Promise<string> {
  const drive = getDriveClient();
  
  const response = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    },
    fields: 'id',
  });
  
  return response.data.id!;
}

export async function moveAndRenameAnexo(fileId: string, newName: string, newFolderId: string) {
  const drive = getDriveClient();
  
  // 1. Pega os metadados para descobrir a pasta atual
  const file = await drive.files.get({
    fileId: fileId,
    fields: 'parents'
  });
  const previousParents = file.data.parents?.join(',') || '';

  // 2. Move para a nova pasta e renomeia
  await drive.files.update({
    fileId: fileId,
    addParents: newFolderId,
    removeParents: previousParents,
    requestBody: {
      name: newName,
    },
  });
}