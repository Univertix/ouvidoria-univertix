import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { getAnexoStream, getAnexoMetadata } from '@/lib/google-drive';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const valido = await verifySessionToken(token);

  if (!valido) {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });
  }

  const { fileId } = await params;

  try {
    const [metadata, stream] = await Promise.all([
      getAnexoMetadata(fileId),
      getAnexoStream(fileId),
    ]);

    const nodeStream = stream as any;
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk: Buffer) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err: Error) => controller.error(err));
      },
    });

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': metadata.mimeType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${metadata.name || 'anexo'}"`,
      },
    });
  } catch (error) {
    console.error('[DOWNLOAD_ANEXO_ERROR]', error);
    return NextResponse.json({ erro: 'Arquivo não encontrado' }, { status: 404 });
  }
}