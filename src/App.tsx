import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Filter,
  Home,
  LineChart,
  MapPin,
  MessageCircle,
  MousePointerClick,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
  UserRoundCheck,
  X,
} from 'lucide-react';
import { copilotKnowledge, defaultRoiInputs, demoProperties } from './data';
import { fetchProperties, submitPropertyLead } from './propertiesApi';
import { calculateRoi, money } from './roi';
import { appConfig, bindGlobalClickTracking, bindScrollDepthTracking, getCookieConsent, setCookieConsent, submitLead, track } from './marketing';
import { useLocale } from './i18n/LocaleContext';
import type { Locale } from './i18n/messages';
import type { CopilotMessage, OperationType, Property, RoiInputs } from './types';
import type { LucideIcon } from 'lucide-react';

const quickFilters = [
  { labelKey: 'featured', featuredOnly: true },
  { labelKey: 'saleCaba', operationType: 'SALE', city: 'Ciudad Autonoma de Buenos Aires' },
  { labelKey: 'rent', operationType: 'RENT' },
  { labelKey: 'premiumHomes', propertyType: 'Casa' },
  { labelKey: 'temporary', operationType: 'TEMPORARY_RENT' },
];

function normalize(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function formatPrice(property: Property) {
  if (!property.price) return 'Consultar';
  return money(property.price, property.currency);
}

function localeLabel(...parts: string[]) {
  return parts.filter(Boolean).join(' ');
}

const demoPropertyI18n: Record<string, Partial<Record<Locale, Partial<Property>>>> = {
  'demo-palermo-duplex': {
    en: { title: 'Premium duplex with terrace in Palermo Hollywood', propertyType: 'Apartment', zone: 'Palermo', neighborhood: 'Palermo Hollywood', city: 'Buenos Aires City', amenities: ['Terrace', 'Grill', 'Parking', 'Storage', 'Mortgage ready'], description: 'Unit ready to publish and sell with professional listing, inquiry follow-up, reservation and commercial documentation.', caseStage: 'Reservation under review', documentStage: 'Base purchase agreement generated' },
    pt: { title: 'Duplex premium com terraço em Palermo Hollywood', propertyType: 'Apartamento', zone: 'Palermo', neighborhood: 'Palermo Hollywood', city: 'Cidade Autônoma de Buenos Aires', amenities: ['Terraço', 'Churrasqueira', 'Garagem', 'Depósito', 'Apto financiamento'], description: 'Unidade pronta para publicar e vender com ficha profissional, acompanhamento de consultas, reserva e documentação comercial.', caseStage: 'Reserva em revisão', documentStage: 'Contrato base gerado' },
  },
  'demo-nordelta-casa': {
    en: { title: 'Lakefront house with pool and master suite', propertyType: 'House', zone: 'Nordelta', neighborhood: 'Los Lagos', amenities: ['Lake view', 'Pool', 'Security', 'Grill', 'Service room'], description: 'High-value property with prospect follow-up, visits and operation documentation.', caseStage: 'Commercial folder opened', documentStage: 'Sale authorization pending' },
    pt: { title: 'Casa no lago com piscina e suíte master', propertyType: 'Casa', zone: 'Nordelta', neighborhood: 'Los Lagos', amenities: ['Vista para o lago', 'Piscina', 'Segurança', 'Churrasqueira', 'Dependência'], description: 'Imóvel de alto valor com acompanhamento de interessados, visitas e documentação da operação.', caseStage: 'Pasta comercial aberta', documentStage: 'Autorização de venda pendente' },
  },
  'demo-belgrano-alquiler': {
    en: { title: 'Furnished apartment in Belgrano R', propertyType: 'Apartment', zone: 'Belgrano', neighborhood: 'Belgrano R', city: 'Buenos Aires City', amenities: ['Furnished', 'Balcony', 'Parking', 'Pets', 'Laundry'], description: 'Listing ready for rent, inquiry capture, prospect screening and editable base contract.', caseStage: 'Contract in draft', documentStage: 'Rental contract generated' },
    pt: { title: 'Apartamento mobiliado em Belgrano R', propertyType: 'Apartamento', zone: 'Belgrano', neighborhood: 'Belgrano R', city: 'Cidade Autônoma de Buenos Aires', amenities: ['Mobiliado', 'Sacada', 'Garagem', 'Pets', 'Lavanderia'], description: 'Ficha pronta para aluguel, captura de consultas, pré-seleção e contrato base editável.', caseStage: 'Contrato em rascunho', documentStage: 'Contrato de aluguel gerado' },
  },
  'demo-canning-lote': {
    en: { title: 'Internal lot in private neighborhood in Canning', propertyType: 'Lot', zone: 'Canning', neighborhood: 'Private neighborhood', amenities: ['Security', 'Club house', 'Lagoon', 'Utilities', 'Financing'], caseStage: 'Offer received', documentStage: 'Reservation prepared' },
    pt: { title: 'Lote interno em condomínio fechado em Canning', propertyType: 'Lote', zone: 'Canning', neighborhood: 'Condomínio fechado', amenities: ['Segurança', 'Club house', 'Lagoa', 'Serviços', 'Financiamento'], caseStage: 'Oferta recebida', documentStage: 'Reserva preparada' },
  },
  'demo-san-isidro-oficina': {
    en: { title: 'Corporate office in San Isidro', propertyType: 'Office', zone: 'Downtown', neighborhood: 'San Isidro', amenities: ['Parking', 'Security', 'Meeting room', 'Central AC', '24h access'], caseStage: 'Active negotiation', documentStage: 'Corporate contract under review' },
    pt: { title: 'Escritório corporativo em San Isidro', propertyType: 'Escritório', zone: 'Centro', neighborhood: 'San Isidro', amenities: ['Garagem', 'Segurança', 'Sala de reunião', 'Ar central', 'Acesso 24h'], caseStage: 'Negociação ativa', documentStage: 'Contrato corporativo em revisão' },
  },
  'demo-mar-del-plata-temporario': {
    en: { title: 'Short-term rental facing the sea in Playa Grande', propertyType: 'Apartment', zone: 'Playa Grande', neighborhood: 'Playa Grande', amenities: ['Sea view', 'Parking', 'Furnished', 'WiFi', 'Digital check-in'], caseStage: 'Availability confirmed', documentStage: 'Short-term contract ready' },
    pt: { title: 'Temporada frente ao mar em Playa Grande', propertyType: 'Apartamento', zone: 'Playa Grande', neighborhood: 'Playa Grande', amenities: ['Vista para o mar', 'Garagem', 'Mobiliado', 'WiFi', 'Check-in digital'], caseStage: 'Disponibilidade confirmada', documentStage: 'Contrato de temporada pronto' },
  },
};

function localizedProperty(property: Property, locale: Locale): Property {
  if (locale === 'es') return property;
  return { ...property, ...(demoPropertyI18n[property.id]?.[locale] ?? {}) };
}

function specLabels(locale: Locale) {
  if (locale === 'en') return { rooms: 'rooms', bedrooms: 'beds', bathrooms: 'baths', garages: 'parking' };
  if (locale === 'pt') return { rooms: 'amb.', bedrooms: 'quartos', bathrooms: 'banhos', garages: 'vagas' };
  return { rooms: 'amb.', bedrooms: 'dorm.', bathrooms: 'baños', garages: 'coch.' };
}

function localizedPath(locale: Locale, path: string) {
  return locale === 'es' ? path : `/${locale}${path === '/' ? '' : path}`;
}

function renderDocumentText(text: string) {
  const parts = text.split(/(\{\{[^}]+\}\})/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith('{{') && part.endsWith('}}')) {
      return <mark key={`${part}-${index}`}>{part}</mark>;
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

type DocumentTemplatePreview = {
  code: string;
  label: string;
  tag: string;
  title: string;
  paragraphs: string[];
  signatures: string[];
};

function DocumentPreview({
  company,
  meta,
  template,
}: {
  company: string;
  meta: string;
  template: DocumentTemplatePreview;
}) {
  return (
    <article className="document-preview" aria-label={template.title}>
      <div className="document-head">
        <span>{company}</span>
        <small>{meta}</small>
      </div>
      <h3>{template.title}</h3>
      {template.paragraphs.map((paragraph) => (
        <p key={paragraph}>{renderDocumentText(paragraph)}</p>
      ))}
      <div className="signature-row">
        {template.signatures.map((signature) => <span key={signature}>{signature}</span>)}
      </div>
    </article>
  );
}

function Logo() {
  const { t } = useLocale();
  return (
    <a href="#inicio" className="brand" data-track="nav_logo" data-track-category="NAV">
      <span className="brand-mark">
        <span />
        <span />
      </span>
      <span>
        <strong>Inmo</strong>Pub
        <small>{t.footer.body.includes('imobili') ? 'by DiceProjects' : 'by DiceProjects'}</small>
      </span>
    </a>
  );
}

function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="language-selector" aria-label="Language selector">
      {(['es', 'en', 'pt'] as Locale[]).map((item) => (
        <button key={item} type="button" className={locale === item ? 'active' : ''} onClick={() => setLocale(item)}>
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function PropertyCard({ property, onSelect }: { property: Property; onSelect: (property: Property) => void }) {
  const { locale, t } = useLocale();
  const view = localizedProperty(property, locale);
  const specs = specLabels(locale);
  const operationLabels: Record<OperationType, string> = {
    SALE: t.catalog.sale,
    RENT: t.catalog.rent,
    TEMPORARY_RENT: t.catalog.temporary,
  };
  return (
    <article className="property-card">
      <button
        type="button"
        className="property-image"
        onClick={() => onSelect(property)}
        data-track="property_image_open"
        data-track-category="CATALOG"
        data-track-label={view.title}
      >
        <img src={view.imageUrl} alt={view.title} loading="lazy" />
        <span className="property-badge">{operationLabels[view.operationType]}</span>
        {view.featured && <span className="property-featured">{t.catalog.featured}</span>}
      </button>
      <div className="property-body">
        <div>
          <p className="property-type">{view.propertyType} · {view.zone}</p>
          <h3>{view.title}</h3>
          <p className="property-location"><MapPin size={15} /> {view.neighborhood}, {view.city}</p>
        </div>
        <div className="property-price-row">
          <strong>{formatPrice(view)}</strong>
          <span>{view.coveredArea || view.totalArea} m2</span>
        </div>
        <div className="property-specs">
          <span>{view.rooms || '-'} {specs.rooms}</span>
          <span>{view.bedrooms || '-'} {specs.bedrooms}</span>
          <span>{view.bathrooms || '-'} {specs.bathrooms}</span>
          <span>{view.garages || 0} {specs.garages}</span>
        </div>
        <div className="property-tags">
          {view.amenities.slice(0, 4).map((amenity) => <span key={amenity}>{amenity}</span>)}
        </div>
        <div className="property-flow">
          <span><ClipboardCheck size={14} /> {view.caseStage}</span>
          <span><FileText size={14} /> {view.documentStage}</span>
        </div>
        <button
          type="button"
          className="link-button"
          onClick={() => onSelect(property)}
          data-track="property_open"
          data-track-category="CATALOG"
          data-track-label={view.title}
        >
          {t.catalog.openCard} <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}

function LeadForm({ property, onClose }: { property?: Property; onClose?: () => void }) {
  const { t } = useLocale();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get('fullName') || '').trim();
    const email = String(form.get('email') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const company = String(form.get('company') || '').trim();
    const message = String(form.get('message') || '').trim();
    if (!fullName || !email) return;

    setState('sending');
    try {
      await submitLead({
        fullName,
        email,
        phone,
        propertyId: property?.id,
        actionCode: property ? 'inmopub_property_lead' : 'inmopub_demo_request',
        message: [
          property ? `Consulta por propiedad: ${property.title}` : 'Solicitud de demo InmoPub',
          company ? `Empresa: ${company}` : null,
          message,
        ].filter(Boolean).join('\n'),
      });
      if (property) {
        await submitPropertyLead(property.id, {
          fullName,
          email,
          phone,
          message: message || `Quiero recibir informacion de ${property.title}`,
        }).catch(() => undefined);
      }
      track('LEAD', {
        actionCode: property ? 'property_lead_submit' : 'demo_lead_submit',
        actionLabel: property ? property.title : 'Demo InmoPub',
        category: 'LEAD',
        propertyId: property?.id,
        metadata: { company },
      });
      setState('sent');
      event.currentTarget.reset();
    } catch {
      setState('error');
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          {t.form.name}
          <input name="fullName" required placeholder={t.form.namePh} />
        </label>
        <label>
          {t.form.email}
          <input name="email" required type="email" placeholder={t.form.emailPh} />
        </label>
        <label>
          {t.form.whatsapp}
          <input name="phone" placeholder={t.form.phonePh} />
        </label>
        <label>
          {t.form.company}
          <input name="company" placeholder={t.form.companyPh} />
        </label>
      </div>
      <label>
        {t.form.message}
        <textarea name="message" placeholder={property ? t.form.propertyMsg : t.form.demoMsg} />
      </label>
      <div className="form-actions">
        {onClose && <button type="button" className="secondary-button" onClick={onClose}>{t.form.close}</button>}
        <button className="primary-button" disabled={state === 'sending'}>
          {state === 'sending' ? t.form.sending : t.form.submit} <ArrowRight size={17} />
        </button>
      </div>
      {state === 'sent' && <p className="form-ok">{t.form.ok}</p>}
      {state === 'error' && <p className="form-error">{t.form.error}</p>}
    </form>
  );
}

function PropertyModal({ property, onClose }: { property: Property | null; onClose: () => void }) {
  const { locale, t } = useLocale();
  const operationLabels: Record<OperationType, string> = {
    SALE: t.catalog.sale,
    RENT: t.catalog.rent,
    TEMPORARY_RENT: t.catalog.temporary,
  };
  if (!property) return null;
  const view = localizedProperty(property, locale);
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="property-modal">
        <button className="modal-close" onClick={onClose} aria-label={t.modal.close}><X size={20} /></button>
        <div className="modal-media">
          <img src={view.imageUrl} alt={view.title} />
          <div className="modal-score">
            <strong>{view.leadScore}</strong>
            <span>{t.modal.score}</span>
          </div>
        </div>
        <div className="modal-content">
          <p className="eyebrow">{operationLabels[view.operationType]} · {view.propertyType}</p>
          <h2>{view.title}</h2>
          <p className="modal-description">{view.description}</p>
          <div className="modal-metrics">
            <span><strong>{formatPrice(view)}</strong> {t.modal.price}</span>
            <span><strong>{view.daysPublished}</strong> {t.modal.days}</span>
            <span><strong>{view.amenities.length}</strong> {t.modal.attributes}</span>
          </div>
          <div className="case-preview">
            <h3>{t.modal.flowTitle}</h3>
            <ol>
              {t.modal.flow.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </div>
          <LeadForm property={view} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

function RoiCalculator() {
  const { t } = useLocale();
  const [inputs, setInputs] = useState<RoiInputs>(defaultRoiInputs);
  const result = useMemo(() => calculateRoi(inputs), [inputs]);

  useEffect(() => {
    track('ROI_CALC', {
      actionCode: 'roi_calculator_update',
      actionLabel: 'ROI calculator updated',
      category: 'ROI',
      metadata: { inputs, result },
    });
  }, [inputs, result]);

  const update = (field: keyof RoiInputs, value: string) => {
    setInputs((current) => ({ ...current, [field]: Number(value) }));
  };

  return (
    <section className="section roi-section" id="roi">
      <div className="section-title">
        <span className="eyebrow">{t.roi.eyebrow}</span>
        <h2>{t.roi.title}</h2>
        <p>{t.roi.body}</p>
      </div>
      <div className="roi-grid">
        <div className="roi-inputs">
          {[
            ['properties', t.roi.inputs.properties, 10, 300],
            ['monthlyLeads', t.roi.inputs.monthlyLeads, 20, 1200],
            ['conversionRate', t.roi.inputs.conversionRate, 0.2, 4],
            ['averageCommission', t.roi.inputs.averageCommission, 300, 12000],
            ['adminHoursPerWeek', t.roi.inputs.adminHoursPerWeek, 2, 80],
            ['hourlyCost', t.roi.inputs.hourlyCost, 4, 50],
          ].map(([field, label, min, max]) => (
            <label key={field as string}>
              <span>{label}</span>
              <input
                type="range"
                min={min as number}
                max={max as number}
                step={field === 'conversionRate' ? 0.1 : 1}
                value={inputs[field as keyof RoiInputs]}
                onChange={(event) => update(field as keyof RoiInputs, event.target.value)}
              />
              <strong>{inputs[field as keyof RoiInputs]}</strong>
            </label>
          ))}
          <p className="roi-note">{t.roi.note}</p>
        </div>
        <div className="roi-output">
          <Calculator size={30} />
          <h3>{money(result.totalMonthlyImpact)}</h3>
          <p>{t.roi.impact}</p>
          <div className="roi-cards">
            <span><strong>{result.recoveredLeads}</strong> {t.roi.cards.recovered}</span>
            <span><strong>{result.extraDeals}</strong> {t.roi.cards.deals}</span>
            <span><strong>{money(result.extraRevenue)}</strong> {t.roi.cards.revenue}</span>
            <span><strong>{money(result.adminSavings)}</strong> {t.roi.cards.savings}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Copilot() {
  const { locale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<CopilotMessage[]>([{
    id: 'welcome',
    sender: 'bot',
    title: t.copilot.welcomeTitle,
    text: t.copilot.welcome,
    prompts: t.copilot.prompts,
  }]);

  function answer(value: string) {
    const text = value.trim();
    if (!text) return;
    setInput('');
    track('BOT_QUESTION', {
      actionCode: 'copilot_question',
      actionLabel: text.slice(0, 80),
      category: 'COPILOT',
      metadata: { question: text },
    });
    const normalized = normalize(text);
    if (normalized.includes('whatsapp') || normalized.includes('hablar') || normalized.includes('contactar')) {
      track('CLICK', {
        actionCode: 'copilot_whatsapp',
        actionLabel: 'WhatsApp desde copiloto',
        category: 'LEAD',
        metadata: { question: text },
      });
      window.open(`${appConfig.whatsappUrl}?text=${encodeURIComponent(t.copilot.whatsappText)}`, '_blank', 'noopener,noreferrer');
    }
    const localizedKnowledge = locale === 'es' ? copilotKnowledge : [
      {
        intent: ['demo', 'show', 'presentation', 'vender', 'mostrar'],
        title: locale === 'pt' ? 'Demo recomendada' : 'Recommended demo',
        answer: locale === 'pt'
          ? 'A demo vencedora mostra o fluxo completo: publicar imóvel, simular consulta, qualificar o interessado, preparar reserva e gerar documento comercial.'
          : 'The winning demo shows the full flow: publish a property, simulate an inquiry, qualify the prospect, prepare a reservation and generate a commercial document.',
      },
      {
        intent: ['document', 'contract', 'reserva', 'contrato', 'documento'],
        title: locale === 'pt' ? 'Imóveis + documentos' : 'Properties + documents',
        answer: locale === 'pt'
          ? 'Cada operação pode preparar reserva, autorização, proposta ou contrato. O copiloto pré-visualiza dados, pede faltantes e deixa a emissão para confirmação humana.'
          : 'Each deal can prepare a reservation, authorization, offer or contract. The copilot previews data, asks for missing fields and leaves issuance for human confirmation.',
      },
      {
        intent: ['lead', 'consulta', 'interested', 'cliente', 'contacto', 'contato'],
        title: locale === 'pt' ? 'Atendimento profissional de consultas' : 'Professional inquiry handling',
        answer: locale === 'pt'
          ? 'A melhor resposta confirma necessidade, orçamento, zona, urgência e disponibilidade para visita. InmoPub associa cada consulta ao imóvel, fonte e responsável.'
          : 'The best response confirms need, budget, area, urgency and visit availability. InmoPub links every inquiry to the property, source and owner.',
      },
      {
        intent: ['roi', 'return', 'retorno', 'conversion', 'conversao', 'conversion'],
        title: locale === 'pt' ? 'Retorno comercial' : 'Commercial return',
        answer: locale === 'pt'
          ? 'O retorno aparece ao responder rápido, recuperar consultas e reduzir dupla carga. Acompanhe consultas, visitas, documentos emitidos e operações fechadas.'
          : 'Return comes from faster responses, recovered inquiries and less duplicate work. Track inquiries, visits, issued documents and closed deals.',
      },
    ];
    const match = localizedKnowledge.find((item) => item.intent.some((keyword) => normalized.includes(keyword)));
    const fallback = {
      title: t.copilot.nextTitle,
      answer: t.copilot.nextAnswer,
    };
    const wantsContact = ['demo', 'contacto', 'precio', 'plan', 'whatsapp', 'hablar', 'contactar', 'comprar'].some((keyword) => normalized.includes(keyword));
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), sender: 'user', text },
      {
        id: crypto.randomUUID(),
        sender: 'bot',
        title: match?.title || fallback.title,
        text: match?.answer || fallback.answer,
        prompts: t.copilot.followPrompts,
        showLeadForm: wantsContact,
      },
    ]);
  }

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, open]);

  return (
    <div className="copilot">
      {open && (
        <div className="copilot-panel">
          <div className="copilot-head">
            <span><Bot size={18} /> {t.copilot.title}</span>
            <button onClick={() => setOpen(false)} aria-label={t.modal.close}><X size={18} /></button>
          </div>
          <div className="copilot-body">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.title && <strong>{message.title}</strong>}
                <p>{message.text}</p>
                {message.prompts && (
                  <div className="prompt-row">
                    {message.prompts.map((prompt) => (
                      <button key={prompt} onClick={() => answer(prompt)}>{prompt}</button>
                    ))}
                  </div>
                )}
                {message.showLeadForm && <LeadForm />}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="copilot-input" onSubmit={(event) => { event.preventDefault(); answer(input); }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={t.copilot.input} />
            <button><Send size={17} /></button>
          </form>
        </div>
      )}
      <button
        className="copilot-fab"
        onClick={() => {
          setOpen(true);
          track('BOT_OPEN', { actionCode: 'copilot_open', actionLabel: 'Open copilot', category: 'COPILOT' });
        }}
        data-track="copilot_fab"
        data-track-category="COPILOT"
      >
        <Sparkles size={22} />
        <span>{t.copilot.fab}</span>
      </button>
    </div>
  );
}

type LegalPageKey = 'legal' | 'privacidad' | 'cookies' | 'terminos' | 'aviso-legal';

function legalKeyFromPath(pathname: string): LegalPageKey | null {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  const cleanPath = (parts[0] === 'es' || parts[0] === 'en' || parts[0] === 'pt') ? (parts[1] || '') : (parts[0] || '');
  if (cleanPath === 'legal' || cleanPath === 'privacidad' || cleanPath === 'cookies' || cleanPath === 'terminos' || cleanPath === 'aviso-legal') return cleanPath;
  return null;
}

function normalizedPublicPath(pathname: string) {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  const localePrefix = parts[0] === 'es' || parts[0] === 'en' || parts[0] === 'pt' ? parts[0] : '';
  const contentPath = localePrefix ? (parts[1] || '') : (parts[0] || '');
  const isHome = parts.length === 0 || (localePrefix && parts.length === 1);
  const isLegal = contentPath === 'legal' || contentPath === 'privacidad' || contentPath === 'cookies' || contentPath === 'terminos' || contentPath === 'aviso-legal';
  if (isHome || isLegal) return pathname;
  return localePrefix ? `/${localePrefix}` : '/';
}

function LegalPage({ pageKey }: { pageKey: LegalPageKey }) {
  const { locale, t } = useLocale();
  const page = t.legalPages[pageKey];
  useEffect(() => {
    document.title = `${page.title} | InmoPub`;
  }, [page.title]);
  return (
    <div className="app legal-app">
      <header className="topbar">
        <Logo />
        <nav>
          <a href={localizedPath(locale, '/')}>{t.nav.home}</a>
          <a href={localizedPath(locale, '/privacidad')}>{t.nav.privacy}</a>
          <a href={localizedPath(locale, '/cookies')}>{t.nav.cookies}</a>
          <a href={localizedPath(locale, '/terminos')}>{t.nav.terms}</a>
        </nav>
        <LanguageSelector />
        <a className="nav-cta" href={`${localizedPath(locale, '/')}#contacto`}>{t.nav.seeDemo}</a>
      </header>
      <main className="legal-main">
        <section className="legal-hero">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p>{page.updatedLabel}: 25 Jun 2026</p>
        </section>
        <section className="legal-content">
          {page.sections.map(([title, body]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </section>
      </main>
      <FooterContent />
      <CookieBanner />
    </div>
  );
}

function CookieBanner() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(() => getCookieConsent() === null);
  if (!visible) return null;
  const choose = (value: 'accepted' | 'rejected') => {
    setCookieConsent(value);
    setVisible(false);
    if (value === 'accepted') {
      track('CLICK', { actionCode: 'cookie_accept', actionLabel: 'Acepta cookies', category: 'CONSENT' });
    }
  };
  return (
    <div className="cookie-banner" role="region" aria-label={t.cookies.aria}>
      <div>
        <strong>{t.cookies.title}</strong>
        <p>{t.cookies.body}</p>
      </div>
      <div className="cookie-actions">
        <button type="button" className="secondary-button" onClick={() => choose('rejected')}>{t.cookies.reject}</button>
        <button type="button" className="primary-button" onClick={() => choose('accepted')}>{t.cookies.accept}</button>
      </div>
    </div>
  );
}

function FooterContent() {
  const { locale, t } = useLocale();
  return (
    <footer className="footer">
      <Logo />
      <p>{t.footer.body}</p>
      <div className="footer-links">
        <a href={localizedPath(locale, '/legal')}>{t.footer.legal}</a>
        <a href={localizedPath(locale, '/privacidad')}>{t.footer.privacy}</a>
        <a href={localizedPath(locale, '/cookies')}>{t.footer.cookies}</a>
        <a href={localizedPath(locale, '/terminos')}>{t.footer.terms}</a>
        <a href={localizedPath(locale, '/aviso-legal')}>{t.footer.legalNotice}</a>
        <a href="https://diceprojects.com" target="_blank" rel="noreferrer" data-track="footer_diceprojects">by DiceProjects</a>
      </div>
    </footer>
  );
}

export default function App() {
  const { t } = useLocale();
  const [properties, setProperties] = useState<Property[]>(demoProperties);
  const [catalogPage, setCatalogPage] = useState(0);
  const [catalogTotal, setCatalogTotal] = useState(demoProperties.length);
  const [hasMoreProperties, setHasMoreProperties] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Property | null>(null);
  const [search, setSearch] = useState('');
  const [operation, setOperation] = useState('');
  const [selectedDocumentCode, setSelectedDocumentCode] = useState('RESERVA_COMPRA');
  const safePathname = normalizedPublicPath(window.location.pathname);
  const legalPageKey = legalKeyFromPath(safePathname);
  const selectedDocument = useMemo(
    () => t.document.templates.find((template) => template.code === selectedDocumentCode) ?? t.document.templates[0],
    [selectedDocumentCode, t.document.templates],
  );
  const quickFilterLabels = {
    featured: t.catalog.featured,
    saleCaba: localeLabel(t.catalog.sale, 'CABA'),
    rent: t.catalog.rent,
    premiumHomes: t.product.features[0]?.title === 'Properties' ? 'Premium homes' : t.product.features[0]?.title === 'Imóveis' ? 'Casas premium' : 'Casas premium',
    temporary: t.catalog.temporary,
  };

  useEffect(() => {
    if (safePathname !== window.location.pathname) {
      window.history.replaceState({}, '', safePathname);
    }
    if (legalPageKey) return;
    document.title = t.meta.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = t.meta.description;
    track('VIEW', {
      actionCode: 'page_home',
      actionLabel: 'InmoPub landing',
      category: 'NAVIGATION',
      metadata: { product: 'inmopub', domain: 'inmopub.com' },
    });
    const unbindClick = bindGlobalClickTracking();
    const unbindScroll = bindScrollDepthTracking();
    void loadProperties({});
    return () => {
      unbindClick();
      unbindScroll();
    };
  }, [legalPageKey, safePathname, t.meta.description, t.meta.title]);

  if (legalPageKey) return <LegalPage pageKey={legalPageKey} />;

  async function loadProperties(filters: Record<string, string | number | boolean | undefined>, page = 0, append = false) {
    setLoading(true);
    try {
      const next = await fetchProperties(filters, page);
      setProperties((current) => append ? [...current, ...next.items] : next.items);
      setCatalogPage(next.page);
      setCatalogTotal(next.totalElements);
      setHasMoreProperties(next.hasMore);
      track('SEARCH', {
        actionCode: 'properties_search',
        actionLabel: 'Buscar propiedades',
        category: 'CATALOG',
        metadata: { filters, page: next.page, pageSize: next.pageSize, results: next.items.length, total: next.totalElements },
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadProperties({ search, operationType: operation }, 0, false);
  }

  function handleLoadMore() {
    void loadProperties({ search, operationType: operation }, catalogPage + 1, true);
  }

  function handleSelect(property: Property) {
    setSelected(property);
    track('PROPERTY_VIEW', {
      actionCode: 'property_detail_open',
      actionLabel: property.title,
      category: 'CATALOG',
      propertyId: property.id,
      metadata: { operation: property.operationType, price: property.price, score: property.leadScore },
    });
  }

  const bi = useMemo(() => {
    const total = properties.length || 1;
    const avgScore = Math.round(properties.reduce((sum, item) => sum + item.leadScore, 0) / total);
    const sales = properties.filter((item) => item.operationType === 'SALE').length;
    const rent = properties.filter((item) => item.operationType !== 'SALE').length;
    return { total, avgScore, sales, rent, leads: total * 18, visits: total * 6 };
  }, [properties]);

  return (
    <div className="app" id="inicio">
      <header className="topbar">
        <Logo />
        <nav>
          <a href="#producto" data-track="nav_producto">{t.nav.product}</a>
          <a href="#catalogo" data-track="nav_catalogo">{t.nav.catalog}</a>
          <a href="#roi" data-track="nav_roi">{t.nav.simulator}</a>
          <a href="#demo" data-track="nav_demo">{t.nav.demo}</a>
        </nav>
        <LanguageSelector />
        <a className="nav-cta" href="#contacto" data-track="header_demo_cta" data-track-category="LEAD">{t.nav.seeDemo}</a>
      </header>

      <main>
        <section className="hero">
          <img src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=84" alt="" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="eyebrow">{t.hero.eyebrow}</span>
            <h1>{t.hero.title}</h1>
            <p>{t.hero.body}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#demo" data-track="hero_primary_demo" data-track-category="LEAD">{t.hero.primary} <ArrowRight size={18} /></a>
              <a className="secondary-button dark" href="#catalogo" data-track="hero_catalog" data-track-category="DISCOVERY">{t.hero.secondary}</a>
            </div>
            <div className="proof-row">
              <span><CheckCircle2 size={17} /> {t.hero.proofLogo}</span>
              <span><CheckCircle2 size={17} /> {t.hero.proofLeads}</span>
              <span><CheckCircle2 size={17} /> {t.hero.proofCases}</span>
            </div>
          </div>
        </section>

        <section className="section insight-strip">
          {t.insights.map((item) => (
            <article key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <small>{item.source}</small>
            </article>
          ))}
        </section>

        <section className="section product-grid" id="producto">
          <div className="section-title left">
            <span className="eyebrow">{t.product.eyebrow}</span>
            <h2>{t.product.title}</h2>
            <p>{t.product.body}</p>
          </div>
          <div className="feature-grid">
            {[
              Home,
              UserRoundCheck,
              ClipboardCheck,
              FileText,
              BarChart3,
              Bot,
            ].map((Icon, index) => (
              <article className="feature-card" key={t.product.features[index].title}>
                <Icon size={26} />
                <h3>{t.product.features[index].title}</h3>
                <p>{t.product.features[index].text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section copilot-product-section" id="copiloto">
          <div className="section-title left">
            <span className="eyebrow">{t.copilotSection.eyebrow}</span>
            <h2>{t.copilotSection.title}</h2>
            <p>{t.copilotSection.body}</p>
          </div>
          <div className="copilot-product-grid">
            <article data-track="copilot_without_ai" data-track-category="COPILOT">
              <ShieldCheck size={24} />
              <span>{t.copilotSection.cards[0].tag}</span>
              <h3>{t.copilotSection.cards[0].title}</h3>
              <p>{t.copilotSection.cards[0].text}</p>
            </article>
            <article data-track="copilot_with_ai" data-track-category="COPILOT">
              <Sparkles size={24} />
              <span>{t.copilotSection.cards[1].tag}</span>
              <h3>{t.copilotSection.cards[1].title}</h3>
              <p>{t.copilotSection.cards[1].text}</p>
            </article>
            <article data-track="copilot_sales_demo" data-track-category="COPILOT">
              <Bot size={24} />
              <span>{t.copilotSection.cards[2].tag}</span>
              <h3>{t.copilotSection.cards[2].title}</h3>
              <p>{t.copilotSection.cards[2].text}</p>
            </article>
          </div>
        </section>

        <section className="section catalog-section" id="catalogo">
          <div className="catalog-head">
            <div>
              <span className="eyebrow">{t.catalog.eyebrow}</span>
              <h2>{t.catalog.title}</h2>
              <p>{t.catalog.body}</p>
            </div>
            <form className="search-box" onSubmit={handleSubmit}>
              <Search size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.catalog.search} />
              <select value={operation} onChange={(event) => setOperation(event.target.value)}>
                <option value="">{t.catalog.operation}</option>
                <option value="SALE">{t.catalog.sale}</option>
                <option value="RENT">{t.catalog.rent}</option>
                <option value="TEMPORARY_RENT">{t.catalog.temporary}</option>
              </select>
              <button><Filter size={17} /> {t.catalog.searchButton}</button>
            </form>
          </div>
          <div className="quick-filter-row">
            {quickFilters.map((filter) => (
              <button
                key={filter.labelKey}
                onClick={() => {
                  setOperation(filter.operationType || '');
                  void loadProperties(filter, 0, false);
                  track('FILTER', { actionCode: `quick_filter_${filter.labelKey}`, actionLabel: quickFilterLabels[filter.labelKey as keyof typeof quickFilterLabels], category: 'CATALOG', metadata: filter });
                }}
              >
                {quickFilterLabels[filter.labelKey as keyof typeof quickFilterLabels]}
              </button>
            ))}
          </div>
          {loading ? <div className="loading">{t.catalog.loading}</div> : (
            <div className="property-grid">
              {properties.map((property) => <PropertyCard key={property.id} property={property} onSelect={handleSelect} />)}
            </div>
          )}
          <div className="catalog-more">
            <span>{properties.length} / {catalogTotal}</span>
            {hasMoreProperties && (
              <button type="button" onClick={handleLoadMore} disabled={loading}>
                {loading ? t.catalog.loading : 'Ver mas propiedades'}
              </button>
            )}
          </div>
        </section>

        <section className="section bi-section">
          <div className="bi-card main">
            <span className="eyebrow">{t.bi.eyebrow}</span>
            <h2>{t.bi.title}</h2>
            <p>{t.bi.body}</p>
          </div>
          {([
            [Building2, bi.total, t.bi.properties],
            [TrendingUp, bi.avgScore, t.bi.score],
            [MousePointerClick, bi.leads, t.bi.leads],
            [Timer, bi.visits, t.bi.visits],
            [LineChart, `${bi.sales}/${bi.rent}`, t.bi.saleRent],
          ] satisfies Array<[LucideIcon, string | number, string]>).map(([Icon, value, label]) => (
            <div className="bi-card" key={label as string}>
              <Icon size={24} />
              <strong>{value as string | number}</strong>
              <span>{label as string}</span>
            </div>
          ))}
        </section>

        <section className="section flow-section" id="demo">
          <div className="section-title">
            <span className="eyebrow">{t.flow.eyebrow}</span>
            <h2>{t.flow.title}</h2>
          </div>
          <div className="flow-grid">
            {t.flow.steps.map((step, index) => (
              <article key={step.title}>
                <strong>{String(index + 1).padStart(2, '0')}</strong>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <RoiCalculator />

        <section className="section document-section">
          <div className="document-copy">
            <span className="eyebrow">{t.document.eyebrow}</span>
            <h2>{t.document.title}</h2>
            <p>{t.document.body}</p>
            <div className="document-controls">
              <label htmlFor="document-template-selector">{t.document.selectorLabel}</label>
              <select
                id="document-template-selector"
                value={selectedDocument.code}
                onChange={(event) => {
                  setSelectedDocumentCode(event.target.value);
                  track('CLICK', {
                    actionCode: 'document_preview_type_change',
                    actionLabel: event.target.value,
                    category: 'DOCUMENTS',
                  });
                }}
              >
                {t.document.templates.map((template) => (
                  <option key={template.code} value={template.code}>{template.label}</option>
                ))}
              </select>
              <span className="document-api-pill"><FileText size={15} /> {t.document.apiPill}</span>
            </div>
            <ul className="check-list">
              {t.document.checks.map((item) => <li key={item}><ShieldCheck size={18} /> {item}</li>)}
            </ul>
          </div>
          <div className="document-stage">
            <div className="document-stage-head">
              <span className="eyebrow">{t.document.previewLabel}</span>
              <strong>{selectedDocument.label}</strong>
              <small>{selectedDocument.tag}</small>
            </div>
            <DocumentPreview company={t.document.company} meta={t.document.meta} template={selectedDocument} />
          </div>
        </section>

        <section className="section cta-section" id="contacto">
          <div>
            <span className="eyebrow">{t.cta.eyebrow}</span>
            <h2>{t.cta.title}</h2>
            <p>{t.cta.body}</p>
          </div>
          <LeadForm />
        </section>
      </main>

      <FooterContent />

      <PropertyModal property={selected} onClose={() => setSelected(null)} />
      <Copilot />
      <CookieBanner />
    </div>
  );
}
