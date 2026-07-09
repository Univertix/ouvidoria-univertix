'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth';

export async function loginAction(usernameInput: string, passwordInput: string) {
  try {
    // 1. Limpa espaços invisíveis que podem vir do input
    const username = usernameInput.trim();
    const password = passwordInput.trim();

    // 2. Limpa espaços invisíveis que podem vir do arquivo .env
    const validUsername = process.env.ADMIN_USERNAME?.trim();
    let validPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim();

    console.log("=== DEBUG DE LOGIN ===");
    console.log("Tentando logar com:", username);
    console.log("Usuário no .env:", validUsername);

    if (!validUsername || !validPasswordHash) {
      console.log("❌ Faltam variaveis no .env");
      return { success: false, error: 'Credenciais nao configuradas no servidor.' };
    }

    if (username !== validUsername) {
      console.log("❌ Usuário não bateu.");
      return { success: false, error: 'Usuario ou senha invalidos.' };
    }

    // 3. Remove aspas caso o .env tenha lido elas como parte do texto
    validPasswordHash = validPasswordHash.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    
    console.log("Hash no .env limpo:", validPasswordHash);

    // 4. Compara a senha
    const senhaValida = await bcrypt.compare(password, validPasswordHash);
    console.log("A senha bate com o Hash?", senhaValida);

    if (!senhaValida) {
      console.log("❌ Hash da senha não bateu.");
      return { success: false, error: 'Usuario ou senha invalidos.' };
    }

    console.log("✅ Login aprovado! Criando sessao...");
    const token = await createSessionToken(username);
    const cookieStore = await cookies();
    
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('[LOGIN_ACTION_ERROR]', error);
    return { success: false, error: 'Erro interno ao processar o login.' };
  }
}