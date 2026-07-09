'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { loginAction } from '@/features/admin/actions/auth.actions';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    const formData = new FormData(e.currentTarget);
    const usuario = formData.get('usuario') as string;
    const senha = formData.get('senha') as string;

    try {
      const res = await loginAction(usuario, senha);

      if (res.success) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setErro(res.error || 'Usuário ou senha inválidos.');
        setLoading(false);
      }
    } catch (err) {
      setErro('Erro de conexão ao tentar fazer login.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-fade-in-up">
        
        <div style={{ height: '8px', width: '100%', background: 'var(--blue-600)' }}></div>

        <div className="auth-header">
          <div style={{ width: '64px', height: '64px', background: 'var(--blue-50)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <ShieldCheck size={32} color="var(--blue-600)" />
          </div>
          <h1 className="title-lg">Painel Administrativo</h1>
          <p className="text-muted text-sm font-bold mt-1">Ouvidoria Univértix — Acesso Restrito</p>
        </div>

        <div className="auth-body">
          {erro && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Usuário</label>
              <div className="input-icon-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  name="usuario"
                  required
                  disabled={loading}
                  placeholder="admin"
                  className="form-control input-with-icon"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className="input-icon-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type="password"
                  name="senha"
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="form-control input-with-icon"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '16px' }}>
              {loading ? (
                <><Loader2 size={20} className="animate-spin" /> Autenticando...</>
              ) : (
                <>Entrar no Sistema <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          <p className="text-xs text-muted font-bold">
            &copy; {new Date().getFullYear()} Centro Universitário Univértix <br /> Acesso monitorado.
          </p>
        </div>
      </div>
    </div>
  );
}