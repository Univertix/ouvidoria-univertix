import Link from 'next/link';
import Image from 'next/image';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-container">
        
        {/* Logo / Marca - Apenas a Imagem */}
        <Link href="/" className="brand-link">
          <div className="">
            <Image 
              src="/Logo01.png" 
              alt="Logo Univértix" 
              width={180} // Aumentei o tamanho aqui
              height={80} // Ajuste esses números se achar que precisa ficar maior/menor
              style={{ objectFit: 'contain' }}
              priority 
            />
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