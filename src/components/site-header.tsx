import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-container">
        
        {/* Logo / Marca */}
        <Link href="/" className="brand-link">
          <div className="brand-icon">
            <ShieldAlert size={20} />
          </div>
          <div className="brand-text">
            <span className="brand-title">UNIVÉRTIX</span>
            <span className="brand-subtitle">Ouvidoria Geral</span>
          </div>
        </Link>
        
        {/* Navegação */}
        <nav className="header-nav">
          <Link 
            href="/acompanhar" 
            className="nav-link nav-link-desktop"
          >
            Acompanhar Protocolo
          </Link>
          
          <Link 
            href="/denunciar" 
            className="btn btn-dark"
            style={{ padding: '10px 20px' }}
          >
            Nova Denúncia
          </Link>
        </nav>
        
      </div>
    </header>
  );
}