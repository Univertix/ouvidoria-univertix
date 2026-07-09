'use client'

import { useState } from 'react';
import './form-cadastro.css'; // Importando o CSS
import { createDenunciaAction } from '@/features/denuncia/actions/create-denuncia.action';
import { TipoDenuncia } from '@/types';
import {
  ShieldCheck,
  UserX,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  EyeOff,
  Info
} from 'lucide-react';

const TIPOS_OCORRENCIA = [
  { value: 'ASSEDIO', label: 'Assédio Moral ou Sexual' },
  { value: 'FRAUDE', label: 'Fraude' },
  { value: 'CORRUPCAO', label: 'Corrupção' },
  { value: 'DISCRIMINACAO', label: 'Discriminação' },
  { value: 'INFRAESTRUTURA', label: 'Infraestrutura' },
  { value: 'OUTROS', label: 'Outros Assuntos' },
];

const DESCRICAO_MAX = 2000;

export function FormCadastro() {
  const [isAnonimo, setIsAnonimo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [descricao, setDescricao] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    if (!termosAceitos) {
      setErro('Você precisa confirmar a declaração de veracidade no fim do formulário.');
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    const data = {
      anonima: isAnonimo,
      nome: isAnonimo ? undefined : (formData.get('nome') as string),
      email: isAnonimo ? undefined : (formData.get('email') as string),
      telefone: isAnonimo ? undefined : (formData.get('telefone') as string),
      tipo: formData.get('tipo') as TipoDenuncia,
      local: formData.get('local') as string,
      dataOcorrido: formData.get('dataOcorrido') as string,
      pessoasEnvolvidas: formData.get('pessoasEnvolvidas') as string,
      descricao: formData.get('descricao') as string,
      anexos: [],
      termosAceitos: true as const,
    };

    try {
      const res = await createDenunciaAction(data);
      if (res.sucesso) {
        setSucesso(res.protocolo as string);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErro((res.erro as string) || 'Ocorreu um erro ao processar sua denúncia.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setErro('Erro de conexão. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Visão de Sucesso
  if (sucesso) {
    return (
      <div className="ouvidoria-wrapper wrapper-sm">
        <div className="card success-container">
          <div className="success-line"></div>
          
          <div className="success-icon-wrap">
            <CheckCircle2 size={32} className="success-icon" />
          </div>
          
          <h2 className="success-title">Manifestação Registrada</h2>
          <p className="success-desc">
            Sua denúncia foi enviada com sucesso e já está em nossa base segura. 
            Utilize o código abaixo para consultar o andamento.
          </p>

          <div className="protocol-box">
            <span className="protocol-label">Número do Protocolo</span>
            <span className="protocol-code">{sucesso}</span>
          </div>

          <div className="protocol-warning">
            <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              Guarde este código em um local seguro. Por motivos de segurança e anonimato, 
              ele não poderá ser recuperado se for perdido.
            </span>
          </div>

          <button
            onClick={() => {
              setSucesso(null);
              setIsAnonimo(true);
              setTermosAceitos(false);
              setDescricao('');
            }}
            className="btn-secondary"
          >
            Registrar nova manifestação
          </button>
        </div>
      </div>
    );
  }

  // Visão do Formulário
  return (
    <div className="ouvidoria-wrapper">
      
      {/* Cabeçalho */}
      <div className="header">
        <div className="header-top">
          <div>
            <div className="header-tag">
              <ShieldCheck size={20} />
              Canal de Ouvidoria
            </div>
            <h1 className="header-title">Nova Manifestação</h1>
            <p className="header-subtitle">
              Ambiente seguro e sigiloso para relatos. Suas informações são protegidas de ponta a ponta.
            </p>
          </div>
          <div className="trust-badges">
            <div className="badge">
              <Lock size={14} className="badge-icon" /> Criptografia 256-bit
            </div>
            <div className="badge">
              <EyeOff size={14} className="badge-icon" /> Sigilo Absoluto
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          
          {/* Mensagem de Erro */}
          {erro && (
            <div className="alert-error">
              <AlertCircle size={20} className="alert-icon" />
              <span>{erro}</span>
            </div>
          )}

          {/* Seção 1: Identificação */}
          <section className="form-section section-bg-alt">
            <div className="section-header">
              <h2 className="section-title">1. Tipo de Identificação</h2>
              <p className="section-subtitle">Escolha como deseja se apresentar nesta manifestação.</p>
            </div>

            <div className="identity-grid">
              <div 
                className={`identity-card ${isAnonimo ? 'active' : ''}`}
                onClick={() => setIsAnonimo(true)}
              >
                <div className="identity-header">
                  <div className="identity-icon-wrap">
                    <UserX size={20} />
                  </div>
                  {isAnonimo && <CheckCircle2 size={20} className="check-icon" />}
                </div>
                <h3 className="identity-title">Relato Anônimo</h3>
                <p className="identity-desc">
                  Nenhum dado pessoal será armazenado. O acompanhamento é feito exclusivamente via protocolo.
                </p>
              </div>

              <div 
                className={`identity-card ${!isAnonimo ? 'active' : ''}`}
                onClick={() => setIsAnonimo(false)}
              >
                <div className="identity-header">
                  <div className="identity-icon-wrap">
                    <UserCheck size={20} />
                  </div>
                  {!isAnonimo && <CheckCircle2 size={20} className="check-icon" />}
                </div>
                <h3 className="identity-title">Relato Identificado</h3>
                <p className="identity-desc">
                  Seus dados serão solicitados, porém mantidos em absoluto sigilo pela equipe da ouvidoria.
                </p>
              </div>
            </div>

            {/* Campos caso escolha se identificar */}
            {!isAnonimo && (
              <div className="form-grid-2" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                <div className="form-group form-grid-full">
                  <label htmlFor="nome" className="form-label">Nome Completo <span className="required-mark">*</span></label>
                  <input 
                    id="nome" 
                    name="nome" 
                    type="text" 
                    required={!isAnonimo} 
                    placeholder="Ex: João da Silva" 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">E-mail <span className="required-mark">*</span></label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required={!isAnonimo} 
                    placeholder="joao@exemplo.com" 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefone" className="form-label">Telefone / WhatsApp</label>
                  <input 
                    id="telefone" 
                    name="telefone" 
                    type="tel" 
                    placeholder="(00) 00000-0000" 
                    className="form-control"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Seção 2: Detalhes da Ocorrência */}
          <section className="form-section">
            <div className="section-header">
              <h2 className="section-title">2. Detalhes da Ocorrência</h2>
              <p className="section-subtitle">Forneça o máximo de informações para facilitar a apuração.</p>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="tipo" className="form-label">Classificação do Assunto <span className="required-mark">*</span></label>
                <select id="tipo" name="tipo" required defaultValue="" className="form-control">
                  <option value="" disabled>Selecione uma categoria...</option>
                  {TIPOS_OCORRENCIA.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="dataOcorrido" className="form-label">Data do Fato (Aproximada) <span className="required-mark">*</span></label>
                <input 
                  id="dataOcorrido" 
                  name="dataOcorrido" 
                  type="date" 
                  required 
                  max={new Date().toISOString().split('T')[0]} 
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="local" className="form-label">Local Específico <span className="required-mark">*</span></label>
                <input 
                  id="local" 
                  name="local" 
                  type="text"
                  required 
                  placeholder="Ex: Refeitório, Almoxarifado..." 
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pessoasEnvolvidas" className="form-label">Envolvidos e/ou Testemunhas</label>
                <input 
                  id="pessoasEnvolvidas" 
                  name="pessoasEnvolvidas" 
                  type="text"
                  placeholder="Cargos, setores ou nomes..." 
                  className="form-control"
                />
              </div>

              <div className="form-group form-grid-full">
                <div className="form-label-header">
                  <label htmlFor="descricao" className="form-label" style={{ marginBottom: 0 }}>
                    Relato Detalhado <span className="required-mark">*</span>
                  </label>
                  <span className={`char-count ${descricao.length > DESCRICAO_MAX - 50 ? 'limit-reached' : ''}`}>
                    {descricao.length} / {DESCRICAO_MAX}
                  </span>
                </div>
                <textarea
                  id="descricao"
                  name="descricao"
                  required
                  maxLength={DESCRICAO_MAX}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o que aconteceu, quando, onde, quem participou e outros detalhes relevantes..."
                  className="form-control"
                />
              </div>
            </div>
          </section>

          {/* Seção 3: Termos e Envio */}
          <section className="form-section footer-section">
            <label className="terms-label">
              <input
                type="checkbox"
                checked={termosAceitos}
                onChange={(e) => setTermosAceitos(e.target.checked)}
                className="checkbox-custom"
              />
              <div className="terms-text-wrap">
                <span className="terms-title">Declaração de Boa-Fé e Veracidade</span>
                <span className="terms-desc">
                  Confirmo que as informações prestadas são verdadeiras e estou ciente de que falsas acusações 
                  constituem infração às normas internas da instituição.
                </span>
              </div>
            </label>

            <div className="action-row">
              <p className="action-disclaimer">
                Ao clicar em enviar, você concorda com o envio seguro e criptografado destas informações para a equipe de ética.
              </p>
              
              <button type="submit" disabled={loading} className="btn-submit">
                {loading && <Loader2 size={16} className="spinner" />}
                {loading ? 'Registrando...' : 'Finalizar Manifestação'}
              </button>
            </div>
          </section>

        </form>
      </div>
    </div>
  );
}