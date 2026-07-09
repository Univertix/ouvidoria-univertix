'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '../actions/auth.actions';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logoutAction();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button onClick={handleLogout} disabled={loading} className="btn btn-glass" style={{ padding: '8px 16px' }}>
      {loading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
      Sair
    </button>
  );
}