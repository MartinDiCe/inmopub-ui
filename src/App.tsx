import { FormEvent, useEffect, useMemo, useState } from 'react';
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
import { copilotKnowledge, defaultRoiInputs, demoProperties, funnelSteps, marketInsights } from './data';
import { fetchProperties, submitPropertyLead } from './propertiesApi';
import { calculateRoi, money } from './roi';
import { appConfig, bindGlobalClickTracking, bindScrollDepthTracking, getCookieConsent, setCookieConsent, submitLead, track } from './marketing';
import type { CopilotMessage, OperationType, Property, RoiInputs } from './types';
import type { LucideIcon } from 'lucide-react';

const operationLabels: Record<OperationType, string> = {
  SALE: 'Venta',
  RENT: 'Alquiler',
  TEMPORARY_RENT: 'Temporario',
};

const quickFilters = [
  { label: 'Venta CABA', operationType: 'SALE', city: 'Ciudad Autonoma de Buenos Aires' },
  { label: 'Alquiler', operationType: 'RENT' },
  { label: 'Casas premium', propertyType: 'Casa' },
  { label: 'Temporarios', operationType: 'TEMPORARY_RENT' },
];

function normalize(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function formatPrice(property: Property) {
  if (!property.price) return 'Consultar';
  return money(property.price, property.currency);
}

function Logo() {
  return (
    <a href="#inicio" className="brand" data-track="nav_logo" data-track-category="NAV">
      <span className="brand-mark">
        <span />
        <span />
      </span>
      <span>
        <strong>Inmo</strong>Pub
        <small>by DiceProjects</small>
      </span>
    </a>
  );
}

function PropertyCard({ property, onSelect }: { property: Property; onSelect: (property: Property) => void }) {
  return (
    <article className="property-card">
      <button
        type="button"
        className="property-image"
        onClick={() => onSelect(property)}
        data-track="property_image_open"
        data-track-category="CATALOG"
        data-track-label={property.title}
      >
        <img src={property.imageUrl} alt={property.title} loading="lazy" />
        <span className="property-badge">{operationLabels[property.operationType]}</span>
        {property.featured && <span className="property-featured">Destacada</span>}
      </button>
      <div className="property-body">
        <div>
          <p className="property-type">{property.propertyType} · {property.zone}</p>
          <h3>{property.title}</h3>
          <p className="property-location"><MapPin size={15} /> {property.neighborhood}, {property.city}</p>
        </div>
        <div className="property-price-row">
          <strong>{formatPrice(property)}</strong>
          <span>{property.coveredArea || property.totalArea} m2</span>
        </div>
        <div className="property-specs">
          <span>{property.rooms || '-'} amb.</span>
          <span>{property.bedrooms || '-'} dorm.</span>
          <span>{property.bathrooms || '-'} baños</span>
          <span>{property.garages || 0} coch.</span>
        </div>
        <div className="property-tags">
          {property.amenities.slice(0, 4).map((amenity) => <span key={amenity}>{amenity}</span>)}
        </div>
        <div className="property-flow">
          <span><ClipboardCheck size={14} /> {property.caseStage}</span>
          <span><FileText size={14} /> {property.documentStage}</span>
        </div>
        <button
          type="button"
          className="link-button"
          onClick={() => onSelect(property)}
          data-track="property_open"
          data-track-category="CATALOG"
          data-track-label={property.title}
        >
          Ver ficha vendible <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}

function LeadForm({ property, onClose }: { property?: Property; onClose?: () => void }) {
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
          Nombre
          <input name="fullName" required placeholder="Ej. Mariana Gomez" />
        </label>
        <label>
          Email
          <input name="email" required type="email" placeholder="mariana@inmobiliaria.com" />
        </label>
        <label>
          WhatsApp
          <input name="phone" placeholder="+54 9 11..." />
        </label>
        <label>
          Inmobiliaria
          <input name="company" placeholder="Nombre de la empresa" />
        </label>
      </div>
      <label>
        Mensaje
        <textarea name="message" placeholder={property ? 'Quiero coordinar visita y recibir ficha.' : 'Quiero una demo con propiedades, consultas y documentos.'} />
      </label>
      <div className="form-actions">
        {onClose && <button type="button" className="secondary-button" onClick={onClose}>Cerrar</button>}
        <button className="primary-button" disabled={state === 'sending'}>
          {state === 'sending' ? 'Enviando...' : 'Pedir demo'} <ArrowRight size={17} />
        </button>
      </div>
      {state === 'sent' && <p className="form-ok">Listo. Quedó registrado como consulta medible en marketing.</p>}
      {state === 'error' && <p className="form-error">No se pudo registrar. Probá WhatsApp o reintentá.</p>}
    </form>
  );
}

function PropertyModal({ property, onClose }: { property: Property | null; onClose: () => void }) {
  if (!property) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="property-modal">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        <div className="modal-media">
          <img src={property.imageUrl} alt={property.title} />
          <div className="modal-score">
            <strong>{property.leadScore}</strong>
            <span>interés comercial</span>
          </div>
        </div>
        <div className="modal-content">
          <p className="eyebrow">{operationLabels[property.operationType]} · {property.propertyType}</p>
          <h2>{property.title}</h2>
          <p className="modal-description">{property.description}</p>
          <div className="modal-metrics">
            <span><strong>{formatPrice(property)}</strong> precio</span>
            <span><strong>{property.daysPublished}</strong> dias publicada</span>
            <span><strong>{property.amenities.length}</strong> atributos</span>
          </div>
          <div className="case-preview">
            <h3>Flujo conectado</h3>
            <ol>
              <li>Consulta capturada desde ficha publica.</li>
              <li>La consulta entra al seguimiento con fuente y propiedad.</li>
              <li>Se arma una carpeta comercial para la reserva, alquiler o venta.</li>
              <li>Se genera documento: reserva, autorizacion, boleto o contrato.</li>
            </ol>
          </div>
          <LeadForm property={property} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

function RoiCalculator() {
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
        <span className="eyebrow">Simulador comercial</span>
        <h2>Mostrá cuánto puede ganar una inmobiliaria ordenando su operación.</h2>
        <p>Ajustá los supuestos de una inmobiliaria real y estimá el impacto de responder mejor, no perder consultas y generar documentos sin doble carga.</p>
      </div>
      <div className="roi-grid">
        <div className="roi-inputs">
          {[
            ['properties', 'Cartera publicada', 10, 300],
            ['monthlyLeads', 'Consultas por mes', 20, 1200],
            ['conversionRate', 'Consultas que cierran (%)', 0.2, 4],
            ['averageCommission', 'Ingreso promedio por cierre', 300, 12000],
            ['adminHoursPerWeek', 'Horas semanales de carga manual', 2, 80],
            ['hourlyCost', 'Costo estimado por hora', 4, 50],
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
          <p className="roi-note">Los controles son editables para simular una inmobiliaria chica, mediana o premium antes de pedir la demo.</p>
        </div>
        <div className="roi-output">
          <Calculator size={30} />
          <h3>{money(result.totalMonthlyImpact)}</h3>
          <p>impacto mensual estimado entre consultas mejor atendidas, cierres adicionales y tiempo operativo recuperado.</p>
          <div className="roi-cards">
            <span><strong>{result.recoveredLeads}</strong> consultas recuperadas</span>
            <span><strong>{result.extraDeals}</strong> cierres estimados</span>
            <span><strong>{money(result.extraRevenue)}</strong> ingreso potencial</span>
            <span><strong>{money(result.adminSavings)}</strong> tiempo recuperado</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Copilot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([{
    id: 'welcome',
    sender: 'bot',
    title: 'Copiloto InmoPub',
    text: 'Soy asesor inmobiliario y consultor comercial de InmoPub. Puedo orientar sobre publicación de propiedades, consultas, visitas, reservas, documentos y también ayudarte a vender la demo.',
    prompts: ['Quiero una demo', 'Como atiendo una consulta', 'Que documentos genera', 'Hablar por WhatsApp'],
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
      window.open(`${appConfig.whatsappUrl}?text=${encodeURIComponent('Hola, quiero una demo de InmoPub para mi inmobiliaria.')}`, '_blank', 'noopener,noreferrer');
    }
    const match = copilotKnowledge.find((item) => item.intent.some((keyword) => normalized.includes(keyword)));
    const fallback = {
      title: 'Siguiente mejor accion',
      answer: 'Como asesor inmobiliario, llevaria la conversacion al siguiente paso concreto: entender la propiedad, calificar al interesado, coordinar visita y preparar la documentacion. Para vender InmoPub, mostrá ese mismo flujo completo en la demo.',
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
        prompts: ['Agendar demo', 'Ver propiedades demo', 'Como cerrar una visita', 'Hablar por WhatsApp'],
        showLeadForm: wantsContact,
      },
    ]);
  }

  return (
    <div className="copilot">
      {open && (
        <div className="copilot-panel">
          <div className="copilot-head">
            <span><Bot size={18} /> InmoPub Copilot</span>
            <button onClick={() => setOpen(false)} aria-label="Cerrar copiloto"><X size={18} /></button>
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
          </div>
          <form className="copilot-input" onSubmit={(event) => { event.preventDefault(); answer(input); }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Preguntame por venta, alquiler, visitas, documentos o demo..." />
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
        <span>Copiloto</span>
      </button>
    </div>
  );
}

type LegalPageKey = 'legal' | 'privacidad' | 'cookies' | 'terminos' | 'aviso-legal';

const legalPages: Record<LegalPageKey, { title: string; updated: string; sections: Array<[string, string]> }> = {
  legal: {
    title: 'Legal y transparencia',
    updated: '25 Jun 2026',
    sections: [
      ['Marco legal', 'InmoPub es un sitio comercial de DiceProjects orientado a mostrar una solución vertical para inmobiliarias. En esta sección reunimos las políticas aplicables al uso del sitio, formularios, medición de campañas, cookies y contacto comercial.'],
      ['Documentos disponibles', 'Podés consultar los términos y condiciones, política de privacidad, política de cookies y aviso legal desde los enlaces al pie del sitio.'],
      ['Contacto legal', 'Para consultas legales o de privacidad escribinos a legal@diceprojects.com.'],
    ],
  },
  privacidad: {
    title: 'Política de privacidad',
    updated: '25 Jun 2026',
    sections: [
      ['Alcance', 'Esta política aplica al sitio web InmoPub, a sus formularios comerciales, eventos de marketing, consultas por propiedades demo o publicadas y comunicaciones derivadas.'],
      ['Datos que podemos tratar', 'Podemos procesar nombre, email, teléfono, inmobiliaria, mensaje, propiedad consultada, URL de origen, campaña, fuente UTM, identificador de visitante, interacción con formularios, clicks, búsquedas, filtros, uso del simulador y preguntas realizadas al copiloto.'],
      ['Finalidad', 'Usamos la información para responder consultas, coordinar demos, medir campañas, mejorar la experiencia, entender intención comercial, derivar oportunidades a canales de contacto y proteger la operación del sitio.'],
      ['Servicios conectados', 'El sitio puede integrarse con APIs de DiceProjects para marketing, propiedades, formularios y WhatsApp. Los datos enviados voluntariamente por formularios se usan para contacto comercial y seguimiento.'],
      ['Conservación', 'Conservamos los datos mientras sean necesarios para operar campañas, responder consultas, auditar actividad, prestar servicios o cumplir obligaciones aplicables. Luego pueden eliminarse, anonimizarse o mantenerse sólo cuando corresponda técnica o legalmente.'],
      ['Derechos', 'Podés solicitar acceso, rectificación o eliminación de tus datos escribiendo a legal@diceprojects.com o mdice@diceprojects.com.'],
    ],
  },
  cookies: {
    title: 'Política de cookies',
    updated: '25 Jun 2026',
    sections: [
      ['Qué son', 'Las cookies y tecnologías similares son pequeños datos que permiten recordar preferencias, medir uso del sitio y mejorar la experiencia. InmoPub usa principalmente localStorage y eventos web propios.'],
      ['Cookies esenciales', 'Son necesarias para que el sitio funcione, por ejemplo recordar la preferencia del banner de cookies o mantener funcionalidades básicas del navegador.'],
      ['Medición y marketing', 'Con tu consentimiento, podemos medir vistas, clicks, scroll, búsquedas, filtros, propiedades abiertas, preguntas al copiloto, simulaciones comerciales y formularios. Esto ayuda a optimizar campañas y entender intención real.'],
      ['Control', 'Podés aceptar o rechazar cookies no esenciales desde el banner. También podés borrar datos del sitio desde la configuración del navegador. Si rechazás, el sitio seguirá funcionando, pero no enviaremos eventos de marketing automáticos.'],
    ],
  },
  terminos: {
    title: 'Términos y condiciones',
    updated: '25 Jun 2026',
    sections: [
      ['Aceptación', 'Al navegar InmoPub aceptás estos términos. Si no estás de acuerdo, podés dejar de usar el sitio.'],
      ['Uso del sitio', 'InmoPub muestra información comercial, demos, propiedades de ejemplo o publicadas, simuladores y formularios de contacto. La información puede cambiar sin aviso previo.'],
      ['No asesoramiento legal o inmobiliario vinculante', 'El contenido del sitio y del copiloto tiene finalidad informativa y comercial. Las operaciones inmobiliarias reales deben ser revisadas por profesionales habilitados, escribanos, abogados o asesores correspondientes.'],
      ['Disponibilidad', 'Hacemos esfuerzos razonables para mantener el sitio disponible, pero no garantizamos operación ininterrumpida ni ausencia total de errores.'],
      ['Propiedad intelectual', 'El sitio, marca, textos, diseños, código y materiales pertenecen a DiceProjects o a sus respectivos titulares. No se permite copiar, distribuir o explotar comercialmente el contenido sin autorización.'],
    ],
  },
  'aviso-legal': {
    title: 'Aviso legal',
    updated: '25 Jun 2026',
    sections: [
      ['Titularidad', 'InmoPub es un producto vertical presentado por DiceProjects. Contacto: mdice@diceprojects.com.'],
      ['Responsabilidad', 'La información publicada se ofrece de buena fe con finalidad comercial e informativa. DiceProjects no garantiza que todo contenido esté libre de errores ni asume responsabilidad por decisiones tomadas únicamente sobre la base del sitio.'],
      ['Enlaces externos', 'El sitio puede enlazar a WhatsApp, DiceProjects u otros recursos. No controlamos el contenido ni disponibilidad de sitios externos.'],
      ['Jurisdicción', 'Estas condiciones se interpretan bajo normativa aplicable en Argentina, salvo que una relación contractual específica establezca otra cosa.'],
    ],
  },
};

function legalKeyFromPath(pathname: string): LegalPageKey | null {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '') || '';
  if (cleanPath === 'legal' || cleanPath === 'privacidad' || cleanPath === 'cookies' || cleanPath === 'terminos' || cleanPath === 'aviso-legal') return cleanPath;
  return null;
}

function LegalPage({ pageKey }: { pageKey: LegalPageKey }) {
  const page = legalPages[pageKey];
  useEffect(() => {
    document.title = `${page.title} | InmoPub`;
  }, [page.title]);
  return (
    <div className="app legal-app">
      <header className="topbar">
        <Logo />
        <nav>
          <a href="/">Inicio</a>
          <a href="/privacidad">Privacidad</a>
          <a href="/cookies">Cookies</a>
          <a href="/terminos">Términos</a>
        </nav>
        <a className="nav-cta" href="/#contacto">Ver demo</a>
      </header>
      <main className="legal-main">
        <section className="legal-hero">
          <span className="eyebrow">InmoPub legal</span>
          <h1>{page.title}</h1>
          <p>Última actualización: {page.updated}</p>
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
    <div className="cookie-banner" role="region" aria-label="Aviso de cookies">
      <div>
        <strong>Cookies y medición</strong>
        <p>Usamos cookies no esenciales sólo si aceptás para medir campañas, consultas, clicks y uso del copiloto. Podés seguir navegando aunque rechaces.</p>
      </div>
      <div className="cookie-actions">
        <button type="button" className="secondary-button" onClick={() => choose('rejected')}>Rechazar</button>
        <button type="button" className="primary-button" onClick={() => choose('accepted')}>Aceptar</button>
      </div>
    </div>
  );
}

function FooterContent() {
  return (
    <footer className="footer">
      <Logo />
      <p>Producto vertical para inmobiliarias. Mini portal, seguimiento comercial y documentos.</p>
      <div className="footer-links">
        <a href="/legal">Legal</a>
        <a href="/privacidad">Privacidad</a>
        <a href="/cookies">Cookies</a>
        <a href="/terminos">Términos</a>
        <a href="/aviso-legal">Aviso legal</a>
        <a href="https://diceprojects.com" target="_blank" rel="noreferrer" data-track="footer_diceprojects">by DiceProjects</a>
      </div>
    </footer>
  );
}

export default function App() {
  const [properties, setProperties] = useState<Property[]>(demoProperties);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Property | null>(null);
  const [search, setSearch] = useState('');
  const [operation, setOperation] = useState('');
  const legalPageKey = legalKeyFromPath(window.location.pathname);

  useEffect(() => {
    if (legalPageKey) return;
    document.title = 'InmoPub | Mini portal inmobiliario, consultas y documentos';
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
  }, [legalPageKey]);

  if (legalPageKey) return <LegalPage pageKey={legalPageKey} />;

  async function loadProperties(filters: Record<string, string | number | undefined>) {
    setLoading(true);
    try {
      const next = await fetchProperties(filters);
      setProperties(next);
      track('SEARCH', {
        actionCode: 'properties_search',
        actionLabel: 'Buscar propiedades',
        category: 'CATALOG',
        metadata: { filters, results: next.length },
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadProperties({ search, operationType: operation });
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
          <a href="#producto" data-track="nav_producto">Producto</a>
          <a href="#catalogo" data-track="nav_catalogo">Catálogo</a>
          <a href="#roi" data-track="nav_roi">Simulador</a>
          <a href="#demo" data-track="nav_demo">Demo</a>
        </nav>
        <a className="nav-cta" href="#contacto" data-track="header_demo_cta" data-track-category="LEAD">Ver demo</a>
      </header>

      <main>
        <section className="hero">
          <img src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=84" alt="" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="eyebrow">Mini portal inmobiliario + consultas + documentos</span>
            <h1>Publicá propiedades y convertí consultas en operaciones.</h1>
            <p>InmoPub centraliza propiedades, interesados, visitas y documentos comerciales. Menos planillas, menos WhatsApps perdidos, más seguimiento medible.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#demo" data-track="hero_primary_demo" data-track-category="LEAD">Ver demo del flujo <ArrowRight size={18} /></a>
              <a className="secondary-button dark" href="#catalogo" data-track="hero_catalog" data-track-category="DISCOVERY">Explorar propiedades</a>
            </div>
            <div className="proof-row">
              <span><CheckCircle2 size={17} /> Ficha publica con logo</span>
              <span><CheckCircle2 size={17} /> Leads y seguimiento</span>
              <span><CheckCircle2 size={17} /> Casos y documentos</span>
            </div>
          </div>
        </section>

        <section className="section insight-strip">
          {marketInsights.map((item) => (
            <article key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <small>{item.source}</small>
            </article>
          ))}
        </section>

        <section className="section product-grid" id="producto">
          <div className="section-title left">
            <span className="eyebrow">Producto vertical</span>
            <h2>No compite contra portales masivos. Convierte tu operacion en un mini portal vendible.</h2>
            <p>La propuesta es simple: una inmobiliaria carga, publica, mide, atiende y documenta desde un flujo profesional propio.</p>
          </div>
          <div className="feature-grid">
            {[
              [Home, 'Propiedades', 'Venta, alquiler, temporario, fotos, amenities, estados y ficha publica compartible.'],
              [UserRoundCheck, 'Consultas', 'Interesados con fuente, prioridad, seguimiento, visitas y responsable comercial.'],
              [ClipboardCheck, 'Operaciones', 'Reserva, autorizacion, boleto, contrato, entrega y documentacion asociada.'],
              [FileText, 'Documentos', 'Plantillas comerciales con tu logo y datos de la operación.'],
              [BarChart3, 'Panel comercial', 'Tiempos de respuesta, conversión, visitas, publicaciones y documentos emitidos.'],
              [Bot, 'Copiloto vendedor', 'Responde dudas, califica interesados, prepara demo y sugiere siguiente accion.'],
            ].map(([Icon, title, text]) => (
              <article className="feature-card" key={title as string}>
                <Icon size={26} />
                <h3>{title as string}</h3>
                <p>{text as string}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section catalog-section" id="catalogo">
          <div className="catalog-head">
            <div>
              <span className="eyebrow">Catálogo inmobiliario</span>
              <h2>Asi se ve una inmobiliaria usando InmoPub.</h2>
              <p>Mostrá propiedades reales con filtros, ficha vendible, captura de interesados y seguimiento comercial desde el primer contacto.</p>
            </div>
            <form className="search-box" onSubmit={handleSubmit}>
              <Search size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar barrio, ciudad, titulo..." />
              <select value={operation} onChange={(event) => setOperation(event.target.value)}>
                <option value="">Operacion</option>
                <option value="SALE">Venta</option>
                <option value="RENT">Alquiler</option>
                <option value="TEMPORARY_RENT">Temporario</option>
              </select>
              <button><Filter size={17} /> Buscar</button>
            </form>
          </div>
          <div className="quick-filter-row">
            {quickFilters.map((filter) => (
              <button
                key={filter.label}
                onClick={() => {
                  setOperation(filter.operationType || '');
                  void loadProperties(filter);
                  track('FILTER', { actionCode: `quick_filter_${filter.label}`, actionLabel: filter.label, category: 'CATALOG', metadata: filter });
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
          {loading ? <div className="loading">Cargando propiedades...</div> : (
            <div className="property-grid">
              {properties.map((property) => <PropertyCard key={property.id} property={property} onSelect={handleSelect} />)}
            </div>
          )}
        </section>

        <section className="section bi-section">
          <div className="bi-card main">
            <span className="eyebrow">Panel de demo</span>
            <h2>Un panel que habla idioma inmobiliario.</h2>
            <p>La demo vende cuando muestra control: publicaciones, consultas, visitas, documentos y conversión.</p>
          </div>
          {([
            [Building2, bi.total, 'propiedades publicadas'],
            [TrendingUp, bi.avgScore, 'interés comercial promedio'],
            [MousePointerClick, bi.leads, 'consultas proyectadas'],
            [Timer, bi.visits, 'visitas potenciales'],
            [LineChart, `${bi.sales}/${bi.rent}`, 'venta / alquiler'],
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
            <span className="eyebrow">Demo de 90 segundos</span>
            <h2>Del inmueble publicado a la operación lista para cerrar.</h2>
          </div>
          <div className="flow-grid">
            {funnelSteps.map((step, index) => (
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
          <div className="document-preview">
            <div className="document-head">
              <span>INMOBILIARIA DEMO</span>
              <small>CUIT · Matricula · Domicilio · Email</small>
            </div>
            <h3>RESERVA DE COMPRA</h3>
            <p>En la ciudad de Buenos Aires, el interesado <mark>{'{{cliente}}'}</mark> formula reserva por la propiedad ubicada en <mark>{'{{domicilio}}'}</mark>, por el precio de <mark>{'{{precio}}'}</mark>.</p>
            <p>La operacion queda vinculada a una carpeta comercial, con documentacion adjunta, estado de avance y registro de aprobaciones.</p>
            <div className="signature-row"><span>Comprador</span><span>Vendedor</span><span>Inmobiliaria</span></div>
          </div>
          <div>
            <span className="eyebrow">Documentos comerciales</span>
            <h2>Documentos listos para vender, reservar o alquilar.</h2>
            <p>La inmobiliaria carga una propiedad, recibe un interesado y el sistema prepara la documentación editable con los datos de la operación.</p>
            <ul className="check-list">
              <li><ShieldCheck size={18} /> Autorizacion de venta o alquiler</li>
              <li><ShieldCheck size={18} /> Reserva, recibo, boleto o contrato base</li>
              <li><ShieldCheck size={18} /> Logo y datos institucionales de la inmobiliaria</li>
              <li><ShieldCheck size={18} /> Historial de cambios y versiones del documento</li>
            </ul>
          </div>
        </section>

        <section className="section cta-section" id="contacto">
          <div>
            <span className="eyebrow">Lanzamiento InmoPub</span>
            <h2>Quiero una demo con mis propiedades y mi marca.</h2>
            <p>Para venderlo fuerte, la primera demo deberia mostrar propiedades reales de la inmobiliaria, una consulta simulada, una reserva y un documento listo para enviar.</p>
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
