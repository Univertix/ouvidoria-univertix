import Link from 'next/link';
import { ShieldCheck, Search, Lock, Eye, MessageSquareText, ChevronRight } from 'lucide-react';
import { SiteHeader } from '@/components/site-header'; // Assumindo que este já está ok

export default function HomePage() {
  return (
    <div className="page-wrapper">
      <SiteHeader />

      <main style={{ flex: 1 }}>
        {/* HERO SECTION */}
        <section className="hero animate-fade-in-up">
          <div className="hero-bg"></div>
          
          <div className="hero-content">
            <div className="hero-icon">
              <ShieldCheck size={48} />
            </div>
            
            <div>
              <h1 className="hero-title">Canal de Ouvidoria Segura</h1>
              <p className="hero-subtitle" style={{ marginTop: '24px' }}>
                Espaço confidencial da Univértix para reportar condutas antiéticas, fraudes ou sugestões. 
                Sua identidade é criptografada e totalmente protegida.
              </p>
            </div>

            <div className="hero-actions">
              <Link href="/denunciar" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
                Registrar Denúncia <ChevronRight size={20} />
              </Link>
              <Link href="/acompanhar" className="btn btn-glass" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
                <Search size={20} /> Acompanhar Protocolo
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="feature-icon" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}>
                <Eye size={28} />
              </div>
              <h3 className="title-md">Anonimato Garantido</h3>
              <p className="text-muted text-sm mt-2">Você escolhe se quer se identificar. Denúncias anônimas não rastreiam IP ou dados pessoais.</p>
            </div>
            
            <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon" style={{ background: 'var(--emerald-50)', color: 'var(--emerald-600)' }}>
                <Lock size={28} />
              </div>
              <h3 className="title-md">Ambiente Criptografado</h3>
              <p className="text-muted text-sm mt-2">Todas as informações são transmitidas em túnel seguro e restritas à comissão de ética.</p>
            </div>
            
            <div className="feature-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="feature-icon" style={{ background: 'var(--amber-50)', color: 'var(--amber-600)' }}>
                <MessageSquareText size={28} />
              </div>
              <h3 className="title-md">Transparência</h3>
              <p className="text-muted text-sm mt-2">Com seu protocolo em mãos, você dialoga com a equipe e acompanha as ações tomadas em tempo real.</p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '40px 24px', textAlign: 'center', background: '#fff', borderTop: '1px solid var(--slate-200)' }}>
        <p className="text-sm font-bold text-slate-400">&copy; {new Date().getFullYear()} Centro Universitário Univértix. Plataforma de Ética e Compliance.</p>
        <Link href="/admin/login" className="text-xs text-slate-300" style={{ display: 'inline-block', marginTop: '12px' }}>Acesso Restrito</Link>
      </footer>
    </div>
  );
}