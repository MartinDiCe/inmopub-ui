export type Locale = 'es' | 'en' | 'pt';

type Messages = {
  meta: { title: string; description: string };
  nav: { product: string; catalog: string; backoffice: string; simulator: string; demo: string; seeDemo: string; home: string; privacy: string; cookies: string; terms: string };
  hero: { eyebrow: string; title: string; body: string; primary: string; secondary: string; proofLogo: string; proofLeads: string; proofCases: string };
  insights: Array<{ value: string; label: string; source: string }>;
  product: { eyebrow: string; title: string; body: string; features: Array<{ title: string; text: string }> };
  copilotSection: { eyebrow: string; title: string; body: string; cards: Array<{ tag: string; title: string; text: string }> };
  backoffice: { eyebrow: string; title: string; body: string; views: Array<{ label: string; title: string; summary: string; kpis: Array<{ label: string; value: string }> }> };
  catalog: { eyebrow: string; title: string; body: string; search: string; operation: string; sale: string; rent: string; temporary: string; searchButton: string; loading: string; openCard: string; featured: string };
  bi: { eyebrow: string; title: string; body: string; properties: string; score: string; leads: string; visits: string; saleRent: string };
  flow: { eyebrow: string; title: string; steps: Array<{ title: string; text: string }> };
  roi: { eyebrow: string; title: string; body: string; note: string; impact: string; inputs: Record<string, string>; cards: { recovered: string; deals: string; revenue: string; savings: string } };
  document: {
    eyebrow: string;
    title: string;
    body: string;
    company: string;
    meta: string;
    selectorLabel: string;
    previewLabel: string;
    apiPill: string;
    checks: string[];
    templates: Array<{
      code: string;
      label: string;
      tag: string;
      title: string;
      paragraphs: string[];
      signatures: string[];
    }>;
  };
  cta: { eyebrow: string; title: string; body: string };
  form: { name: string; email: string; whatsapp: string; company: string; message: string; close: string; submit: string; sending: string; ok: string; error: string; namePh: string; emailPh: string; phonePh: string; companyPh: string; propertyMsg: string; demoMsg: string };
  modal: { close: string; score: string; price: string; days: string; daysPublished: string; attributes: string; flowTitle: string; flow: string[] };
  copilot: { title: string; welcomeTitle: string; welcome: string; prompts: string[]; nextTitle: string; nextAnswer: string; input: string; fab: string; whatsappText: string; followPrompts: string[] };
  cookies: { title: string; body: string; reject: string; accept: string; aria: string };
  footer: { body: string; legal: string; privacy: string; cookies: string; terms: string; legalNotice: string };
  legalPages: Record<'legal' | 'privacidad' | 'cookies' | 'terminos' | 'aviso-legal', { title: string; updatedLabel: string; eyebrow: string; sections: Array<[string, string]> }>;
};

export const messages: Record<Locale, Messages> = {
  es: {
    meta: {
      title: 'InmoPub | Mini portal inmobiliario, consultas y documentos',
      description: 'Mini portal inmobiliario, seguimiento comercial y documentos para inmobiliarias.',
    },
    nav: { product: 'Producto', catalog: 'Catálogo', backoffice: 'Backoffice', simulator: 'Simulador', demo: 'Demo', seeDemo: 'Ver demo', home: 'Inicio', privacy: 'Privacidad', cookies: 'Cookies', terms: 'Términos' },
    hero: {
      eyebrow: 'Mini portal inmobiliario + consultas + documentos',
      title: 'Publicá propiedades y convertí consultas en operaciones.',
      body: 'InmoPub se contrata por suscripción y centraliza propiedades, interesados, visitas y documentos comerciales. Probalo 3 meses con tu operación real para medir si recupera consultas, ordena visitas y acelera cierres.',
      primary: 'Ver demo del flujo',
      secondary: 'Explorar propiedades',
      proofLogo: 'Ficha pública con logo',
      proofLeads: 'Leads y seguimiento',
      proofCases: 'Casos y documentos',
    },
    insights: [
      { value: '0.4% - 1.2%', label: 'conversión promedio de consultas inmobiliarias digitales', source: 'RealScout / JustCall, 2026' },
      { value: '5 min', label: 'ventana crítica para responder antes que otro agente gane la conversación', source: 'Harvard Business Review citado por RealScout' },
      { value: '2+ h/día', label: 'tiempo operativo que puede recuperar una inmobiliaria con automatización', source: 'Meduzzen, 2026' },
      { value: '30-50%', label: 'reducción potencial de carga administrativa por automatizar flujos repetibles', source: 'Epiphany Dynamics, 2026' },
    ],
    product: {
      eyebrow: 'Producto vertical',
      title: 'No compite contra portales masivos. Convierte tu operación en un mini portal vendible.',
      body: 'La propuesta es simple: una inmobiliaria carga, publica, mide, atiende y documenta desde un flujo profesional propio, con una prueba inicial de 3 meses antes de escalar la suscripción.',
      features: [
        { title: 'Propiedades', text: 'Venta, alquiler, temporario, fotos, amenities, estados y ficha pública compartible.' },
        { title: 'Consultas', text: 'Interesados con fuente, prioridad, seguimiento, visitas y responsable comercial.' },
        { title: 'Operaciones', text: 'Reserva, autorización, boleto, contrato, entrega y documentación asociada.' },
        { title: 'Documentos', text: 'Plantillas comerciales con tu logo y datos de la operación.' },
        { title: 'Panel comercial', text: 'Tiempos de respuesta, conversión, visitas, publicaciones y documentos emitidos.' },
        { title: 'Copiloto inmobiliario', text: 'Opera consultas y documentos con flujos seguros; suma IA para vender, calificar y responder mejor.' },
      ],
    },
    copilotSection: {
      eyebrow: 'Copiloto como servicio',
      title: 'Un asistente inmobiliario que vende, pero no improvisa operaciones.',
      body: 'InmoPub combina flujos determinísticos para ejecutar tareas del negocio con IA opcional para interpretar mensajes, redactar respuestas y preparar la mejor demo comercial.',
      cards: [
        { tag: 'Sin IA · Operativo', title: 'Hace el trabajo repetible con reglas claras.', text: 'Lista propiedades, filtra interesados, agenda visitas, arma reservas desde plantilla, pide datos faltantes y deja todo trazado por inmobiliaria, usuario y operación.' },
        { tag: 'Con IA · Comercial', title: 'Ayuda a vender mejor sin guardar nada sin confirmación.', text: 'Resume consultas largas, detecta intención, redacta respuestas, sugiere próximos pasos, prepara objeciones y guía al vendedor para cerrar visita, reserva o demo.' },
        { tag: 'Demo y captación', title: 'También actúa como asesor de venta de InmoPub.', text: 'Explica el ROI, compara contra planillas y portales, califica leads de inmobiliarias y propone el flujo ideal: propiedad publicada, consulta, seguimiento y documento.' },
      ],
    },
    backoffice: {
      eyebrow: 'Backoffice InmoPub',
      title: 'La inmobiliaria ve cartera, precio por zona, expedientes y documentos en un solo lugar.',
      body: 'Capturas reales del tenant InmoPub Demo: 60 propiedades paginadas, ficha interna con moneda y referencia m2, expedientes inmobiliarios, dashboard de casos y copiloto consultando datos por API.',
      views: [
        { label: 'Cartera', title: 'Cartera de propiedades operativa', summary: 'Listado interno con 60 propiedades, filtros, estados comerciales, propietarios, precios y paginado real.', kpis: [{ label: 'Propiedades', value: '60' }, { label: 'Páginas', value: '6' }, { label: 'Estados', value: '5' }, { label: 'Monedas', value: 'ARS/USD' }] },
        { label: 'Ficha', title: 'Ficha interna con moneda y referencia m2', summary: 'Alta y edición de propiedad con selector de moneda, nota territorial no invasiva y sugerencia de precio por zona.', kpis: [{ label: 'Referencia', value: 'm2' }, { label: 'Moneda', value: 'USD' }, { label: 'Zona', value: 'Dique 3' }, { label: 'Precio', value: '317K' }] },
        { label: 'Expedientes', title: 'Gestión de casos inmobiliarios', summary: 'Reservas, boletos, contratos, captaciones y visitas con estados trazables y vencimientos.', kpis: [{ label: 'Expedientes', value: '12' }, { label: 'Abiertos', value: '9' }, { label: 'Cerrados', value: '2' }, { label: 'Por vencer', value: '8' }] },
        { label: 'Dashboard', title: 'Dashboard de expedientes y vencimientos', summary: 'KPIs de operación inmobiliaria: tasa de cierre, costo estimado, distribución por tipo y próximos vencimientos.', kpis: [{ label: 'Cierre', value: '17%' }, { label: 'Costo est.', value: '$1.2M' }, { label: 'Tipos', value: '5' }, { label: 'Vencidos', value: '0' }] },
        { label: 'Copiloto', title: 'Copiloto consultando cartera y expedientes', summary: 'El asistente lee Propiedades y CaseFlow por API para resumir zonas, precios, m2, cartera USD y expedientes abiertos.', kpis: [{ label: 'Zonas', value: '8' }, { label: 'Cartera USD', value: '23M' }, { label: 'Expedientes', value: '12' }, { label: 'API', value: 'Live' }] },
      ],
    },
    catalog: { eyebrow: 'Catálogo inmobiliario', title: 'Así se ve una inmobiliaria usando InmoPub.', body: 'Mostrá propiedades reales con filtros, ficha vendible, captura de interesados y seguimiento comercial desde el primer contacto.', search: 'Buscar barrio, ciudad, título...', operation: 'Operación', sale: 'Venta', rent: 'Alquiler', temporary: 'Temporario', searchButton: 'Buscar', loading: 'Cargando propiedades...', openCard: 'Ver ficha vendible', featured: 'Destacada' },
    bi: { eyebrow: 'Panel de demo', title: 'Un panel que habla idioma inmobiliario.', body: 'La demo vende cuando muestra control: publicaciones, consultas, visitas, documentos y conversión.', properties: 'propiedades publicadas', score: 'interés comercial promedio', leads: 'consultas proyectadas', visits: 'visitas potenciales', saleRent: 'venta / alquiler' },
    flow: { eyebrow: 'Demo de 90 segundos', title: 'Del inmueble publicado a la operación lista para cerrar.', steps: [
      { title: 'Publicar', text: 'Carga propiedad, fotos, amenities, precio, estado y ficha compartible con logo de la inmobiliaria.' },
      { title: 'Captar', text: 'El interesado consulta desde ficha pública, WhatsApp o formulario y entra al seguimiento comercial con trazabilidad.' },
      { title: 'Operar', text: 'Se agenda visita, cambia el estado de la consulta y se genera documentación comercial.' },
      { title: 'Cerrar', text: 'Reserva, autorización, boleto o contrato se generan con datos de la operación y quedan adjuntos.' },
    ] },
    roi: { eyebrow: 'Simulador comercial', title: 'Mostrá cuánto puede ganar una inmobiliaria ordenando su operación.', body: 'Ajustá los supuestos de una inmobiliaria real y estimá el impacto de responder mejor, no perder consultas y generar documentos sin doble carga.', note: 'Los controles ayudan a definir una prueba de 3 meses con métricas concretas antes de activar o ampliar la suscripción.', impact: 'impacto mensual estimado entre consultas mejor atendidas, cierres adicionales y tiempo operativo recuperado.', inputs: { properties: 'Cartera publicada', monthlyLeads: 'Consultas por mes', conversionRate: 'Consultas que cierran (%)', averageCommission: 'Ingreso promedio por cierre', adminHoursPerWeek: 'Horas semanales de carga manual', hourlyCost: 'Costo estimado por hora' }, cards: { recovered: 'consultas recuperadas', deals: 'cierres estimados', revenue: 'ingreso potencial', savings: 'tiempo recuperado' } },
    document: {
      eyebrow: 'Documentos comerciales',
      title: 'Mostrá documentos reales, con logo, datos de la inmobiliaria y vista A4.',
      body: 'Elegí el documento inmobiliario y la demo previsualiza cómo saldría para una operación. La misma lógica puede consumirse por API con marca, tipo documental y datos de ejemplo.',
      company: 'INMOBILIARIA DEMO',
      meta: 'CUIT · Matrícula · Domicilio · Email',
      selectorLabel: 'Documento inmobiliario',
      previewLabel: 'Vista previa profesional',
      apiPill: 'API de preview por marca y tipo documental',
      checks: ['Autorización de venta o alquiler', 'Reserva, recibo, boleto o contrato base', 'Logo y datos institucionales de la inmobiliaria', 'Historial de cambios y versiones del documento'],
      templates: [
        { code: 'RESERVA_COMPRA', label: 'Reserva de compra', tag: 'Venta', title: 'RESERVA DE COMPRA', paragraphs: ['En la ciudad de Buenos Aires, el interesado {{cliente}} formula reserva por la propiedad ubicada en {{domicilio}}, por el precio de {{precio}}.', 'La operación queda vinculada a una carpeta comercial con documentación adjunta, estado de avance y registro de aprobaciones.'], signatures: ['Comprador', 'Vendedor', 'Inmobiliaria'] },
        { code: 'AUTORIZACION_VENTA', label: 'Autorización de venta', tag: 'Captación', title: 'AUTORIZACIÓN DE VENTA', paragraphs: ['El propietario {{propietario}} autoriza a {{inmobiliaria}} a ofrecer comercialmente la propiedad ubicada en {{domicilio}}, bajo las condiciones pactadas en la ficha de publicación.', 'La autorización incluye difusión, coordinación de visitas, recepción de consultas y preparación de documentación comercial previa a la operación.'], signatures: ['Propietario', 'Martillero', 'Inmobiliaria'] },
        { code: 'CONTRATO_ALQUILER', label: 'Contrato base de alquiler', tag: 'Alquiler', title: 'CONTRATO DE ALQUILER', paragraphs: ['Entre {{locador}} y {{locatario}} se acuerda la locación del inmueble ubicado en {{domicilio}}, por el plazo de {{plazo}} y canon mensual de {{precio}}.', 'El contrato queda sujeto a revisión profesional, documentación respaldatoria, garantías informadas y aprobación final de las partes.'], signatures: ['Locador', 'Locatario', 'Inmobiliaria'] },
        { code: 'RECIBO_SENA', label: 'Recibo de seña', tag: 'Reserva', title: 'RECIBO DE SEÑA', paragraphs: ['La inmobiliaria deja constancia de haber recibido de {{cliente}} la suma de {{precio}} en concepto de seña para la operación sobre el inmueble {{domicilio}}.', 'El presente recibo queda asociado al expediente comercial, con vencimiento de confirmación el día {{fecha_limite}}.'], signatures: ['Cliente', 'Responsable', 'Inmobiliaria'] },
        { code: 'ENTREGA_LLAVES', label: 'Acta de entrega de llaves', tag: 'Cierre', title: 'ACTA DE ENTREGA DE LLAVES', paragraphs: ['En la fecha {{fecha}}, se deja constancia de la entrega de llaves del inmueble ubicado en {{domicilio}} a favor de {{cliente}}.', 'Las partes manifiestan recibir el inmueble según el estado informado en la documentación adjunta y dejan constancia para seguimiento posterior.'], signatures: ['Entrega', 'Recibe', 'Inmobiliaria'] },
      ],
    },
    cta: { eyebrow: 'Lanzamiento InmoPub', title: 'Probá InmoPub 3 meses con tus propiedades y tu marca.', body: 'La primera demo debe mostrar propiedades reales de la inmobiliaria, una consulta simulada, una reserva y un documento listo para enviar. Después medimos durante 3 meses si la suscripción resuelve el problema.' },
    form: { name: 'Nombre', email: 'Email', whatsapp: 'WhatsApp', company: 'Inmobiliaria', message: 'Mensaje', close: 'Cerrar', submit: 'Pedir prueba de 3 meses', sending: 'Enviando...', ok: 'Listo. Quedó registrado como consulta medible en marketing.', error: 'No se pudo registrar. Probá WhatsApp o reintentá.', namePh: 'Ej. Mariana Gómez', emailPh: 'mariana@inmobiliaria.com', phonePh: '+54 9 11...', companyPh: 'Nombre de la empresa', propertyMsg: 'Quiero coordinar visita y recibir ficha.', demoMsg: 'Quiero una prueba de 3 meses con propiedades, consultas y documentos.' },
    modal: { close: 'Cerrar', score: 'interés comercial', price: 'precio', days: 'días publicada', daysPublished: 'días publicada', attributes: 'atributos', flowTitle: 'Flujo conectado', flow: ['Consulta capturada desde ficha pública.', 'La consulta entra al seguimiento con fuente y propiedad.', 'Se arma una carpeta comercial para la reserva, alquiler o venta.', 'Se genera documento: reserva, autorización, boleto o contrato.'] },
    copilot: { title: 'InmoPub Copilot', welcomeTitle: 'Copiloto InmoPub', welcome: 'Soy asesor inmobiliario y consultor comercial de InmoPub. Puedo orientar sobre publicación de propiedades, consultas, visitas, reservas, documentos, suscripción y prueba de 3 meses.', prompts: ['Quiero una prueba de 3 meses', 'Cómo atiendo una consulta', 'Qué documentos genera', 'Hablar por WhatsApp'], nextTitle: 'Siguiente mejor acción', nextAnswer: 'Como asesor inmobiliario, llevaría la conversación al siguiente paso concreto: entender la propiedad, calificar al interesado, coordinar visita y preparar la documentación. Para vender InmoPub, mostrá ese flujo completo y ofrecé una prueba de 3 meses con métricas claras.', input: 'Preguntame por venta, alquiler, visitas, documentos o demo...', fab: 'Copiloto', whatsappText: 'Hola, quiero una prueba de 3 meses de InmoPub para mi inmobiliaria.', followPrompts: ['Agendar prueba', 'Ver propiedades demo', 'Cómo cerrar una visita', 'Hablar por WhatsApp'] },
    cookies: { title: 'Cookies y medición', body: 'Usamos cookies no esenciales sólo si aceptás para medir campañas, consultas, clicks y uso del copiloto. Podés seguir navegando aunque rechaces.', reject: 'Rechazar', accept: 'Aceptar', aria: 'Aviso de cookies' },
    footer: { body: 'Producto vertical para inmobiliarias. Mini portal, seguimiento comercial y documentos.', legal: 'Legal', privacy: 'Privacidad', cookies: 'Cookies', terms: 'Términos', legalNotice: 'Aviso legal' },
    legalPages: {
      legal: { title: 'Legal y transparencia', updatedLabel: 'Última actualización', eyebrow: 'InmoPub legal', sections: [['Marco legal', 'InmoPub es un sitio comercial de DiceProjects orientado a mostrar una solución vertical para inmobiliarias.'], ['Documentos disponibles', 'Podés consultar los términos y condiciones, política de privacidad, política de cookies y aviso legal desde los enlaces al pie del sitio.'], ['Contacto legal', 'Para consultas legales o de privacidad escribinos a legal@diceprojects.com.']] },
      privacidad: { title: 'Política de privacidad', updatedLabel: 'Última actualización', eyebrow: 'InmoPub legal', sections: [['Alcance', 'Esta política aplica al sitio web InmoPub, a sus formularios comerciales, eventos de marketing y consultas por propiedades.'], ['Datos que podemos tratar', 'Podemos procesar nombre, email, teléfono, inmobiliaria, mensaje, URL de origen, campaña, eventos de navegación y preguntas al copiloto.'], ['Finalidad', 'Usamos la información para responder consultas, coordinar demos, medir campañas y mejorar la experiencia.'], ['Derechos', 'Podés solicitar acceso, rectificación o eliminación de tus datos escribiendo a legal@diceprojects.com.']] },
      cookies: { title: 'Política de cookies', updatedLabel: 'Última actualización', eyebrow: 'InmoPub legal', sections: [['Qué son', 'Las cookies y tecnologías similares permiten recordar preferencias, medir uso del sitio y mejorar la experiencia.'], ['Medición y marketing', 'Con tu consentimiento medimos vistas, clicks, scroll, búsquedas, filtros, propiedades abiertas, simulaciones y formularios.'], ['Control', 'Podés aceptar o rechazar cookies no esenciales desde el banner.']] },
      terminos: { title: 'Términos y condiciones', updatedLabel: 'Última actualización', eyebrow: 'InmoPub legal', sections: [['Aceptación', 'Al navegar InmoPub aceptás estos términos.'], ['Uso del sitio', 'InmoPub muestra información comercial, demos, propiedades de ejemplo o publicadas, simuladores y formularios de contacto.'], ['No asesoramiento vinculante', 'El contenido tiene finalidad informativa y comercial. Las operaciones inmobiliarias reales deben ser revisadas por profesionales habilitados.'], ['Propiedad intelectual', 'El sitio, marca, textos, diseños, código y materiales pertenecen a DiceProjects o a sus respectivos titulares.']] },
      'aviso-legal': { title: 'Aviso legal', updatedLabel: 'Última actualización', eyebrow: 'InmoPub legal', sections: [['Titularidad', 'InmoPub es un producto vertical presentado por DiceProjects. Contacto: mdice@diceprojects.com.'], ['Responsabilidad', 'La información se ofrece de buena fe con finalidad comercial e informativa.'], ['Enlaces externos', 'El sitio puede enlazar a WhatsApp, DiceProjects u otros recursos.']] },
    },
  },
  en: {} as Messages,
  pt: {} as Messages,
};

messages.en = {
  ...messages.es,
  meta: { title: 'InmoPub | Real estate mini portal, leads and documents', description: 'Real estate mini portal, commercial follow-up and documents for agencies.' },
  nav: { product: 'Product', catalog: 'Catalog', backoffice: 'Backoffice', simulator: 'Simulator', demo: 'Demo', seeDemo: 'See demo', home: 'Home', privacy: 'Privacy', cookies: 'Cookies', terms: 'Terms' },
  hero: { eyebrow: 'Real estate mini portal + leads + documents', title: 'Publish properties and turn inquiries into deals.', body: 'InmoPub is subscription-based and centralizes properties, prospects, visits and commercial documents. Try it for 3 months with your real operation to measure recovered inquiries, visits and faster closings.', primary: 'See flow demo', secondary: 'Explore properties', proofLogo: 'Public listing with logo', proofLeads: 'Leads and follow-up', proofCases: 'Cases and documents' },
  insights: [
    { value: '0.4% - 1.2%', label: 'average conversion for digital real estate inquiries', source: 'RealScout / JustCall, 2026' },
    { value: '5 min', label: 'critical response window before another agent wins the conversation', source: 'Harvard Business Review cited by RealScout' },
    { value: '2+ h/day', label: 'operational time an agency can recover with automation', source: 'Meduzzen, 2026' },
    { value: '30-50%', label: 'potential administrative workload reduction through repeatable flow automation', source: 'Epiphany Dynamics, 2026' },
  ],
  product: {
    eyebrow: 'Vertical product',
    title: 'Do not compete with massive portals. Turn your operation into a sellable mini portal.',
    body: 'The value is simple: an agency uploads, publishes, measures, follows up and documents from its own professional flow, starting with a 3-month proof before scaling the subscription.',
    features: [
      { title: 'Properties', text: 'Sale, rent, short-term rental, photos, amenities, status and shareable public listing.' },
      { title: 'Inquiries', text: 'Prospects with source, priority, follow-up, visits and commercial owner.' },
      { title: 'Deals', text: 'Reservation, authorization, purchase agreement, contract, handover and related documents.' },
      { title: 'Documents', text: 'Commercial templates with your logo and operation data.' },
      { title: 'Commercial dashboard', text: 'Response times, conversion, visits, listings and issued documents.' },
      { title: 'Real estate copilot', text: 'Runs inquiries and documents with safe flows; adds AI to sell, qualify and respond better.' },
    ],
  },
  copilotSection: {
    eyebrow: 'Copilot as a service',
    title: 'A real estate assistant that sells, without improvising operations.',
    body: 'InmoPub combines deterministic flows for business tasks with optional AI to interpret messages, draft replies and prepare a better sales demo.',
    cards: [
      { tag: 'No AI · Operational', title: 'Runs repeatable work with clear rules.', text: 'Lists properties, filters leads, schedules visits, creates reservations from templates, asks for missing data and keeps agency, user and operation traceability.' },
      { tag: 'With AI · Commercial', title: 'Helps sell better without saving anything without confirmation.', text: 'Summarizes long inquiries, detects intent, drafts answers, suggests next steps, prepares objections and guides the seller toward visit, reservation or demo.' },
      { tag: 'Demo and capture', title: 'Also acts as an InmoPub sales advisor.', text: 'Explains ROI, compares against spreadsheets and portals, qualifies agency leads and proposes the ideal flow: published property, inquiry, follow-up and document.' },
    ],
  },
  catalog: { eyebrow: 'Connected catalog', title: 'This is how an agency looks with InmoPub.', body: 'Show real properties with filters, sellable listing pages, lead capture and commercial follow-up from first contact.', search: 'Search neighborhood, city, title...', operation: 'Operation', sale: 'Sale', rent: 'Rent', temporary: 'Short-term', searchButton: 'Search', loading: 'Loading properties...', openCard: 'View sellable listing', featured: 'Featured' },
  cta: { eyebrow: 'InmoPub launch', title: 'Try InmoPub for 3 months with your properties and brand.', body: 'The strongest demo shows real agency properties, a simulated inquiry, a reservation and a document ready to send. Then we measure for 3 months whether the subscription solves the problem.' },
  bi: { eyebrow: 'Demo dashboard', title: 'A dashboard that speaks real estate.', body: 'The demo sells when it shows control: listings, inquiries, visits, documents and conversion.', properties: 'published properties', score: 'average commercial interest', leads: 'projected inquiries', visits: 'potential visits', saleRent: 'sale / rent' },
  flow: { eyebrow: '90-second demo', title: 'From published property to deal ready to close.', steps: [
    { title: 'Publish', text: 'Upload property, photos, amenities, price, status and shareable listing with agency logo.' },
    { title: 'Capture', text: 'The prospect contacts from public listing, WhatsApp or form and enters commercial follow-up with traceability.' },
    { title: 'Operate', text: 'Schedule a visit, update inquiry status and generate commercial documentation.' },
    { title: 'Close', text: 'Reservation, authorization, purchase agreement or contract are generated with operation data and attached.' },
  ] },
  roi: { eyebrow: 'Commercial simulator', title: 'Show how much an agency can gain by organizing its operation.', body: 'Adjust assumptions from a real agency and estimate the impact of responding better, not losing inquiries and generating documents without duplicate work.', note: 'Controls help define a 3-month proof with concrete metrics before activating or expanding the subscription.', impact: 'estimated monthly impact from better handled inquiries, extra closings and recovered operational time.', inputs: { properties: 'Published portfolio', monthlyLeads: 'Monthly inquiries', conversionRate: 'Inquiries that close (%)', averageCommission: 'Average revenue per closing', adminHoursPerWeek: 'Weekly manual work hours', hourlyCost: 'Estimated hourly cost' }, cards: { recovered: 'recovered inquiries', deals: 'estimated closings', revenue: 'potential revenue', savings: 'recovered time' } },
  document: {
    eyebrow: 'Commercial documents',
    title: 'Show real documents with logo, agency data and A4 preview.',
    body: 'Choose a real estate document and the demo previews how it would look for an operation. The same logic can be consumed by API with brand, document type and sample data.',
    company: 'DEMO AGENCY',
    meta: 'Tax ID · License · Address · Email',
    selectorLabel: 'Real estate document',
    previewLabel: 'Professional preview',
    apiPill: 'Preview API by brand and document type',
    checks: ['Sale or rental authorization', 'Reservation, receipt, purchase agreement or base contract', 'Agency logo and institutional data', 'Document change history and versions'],
    templates: [
      { code: 'RESERVA_COMPRA', label: 'Purchase reservation', tag: 'Sale', title: 'PURCHASE RESERVATION', paragraphs: ['In Buenos Aires, the prospect {{cliente}} places a reservation for the property located at {{domicilio}}, for the price of {{precio}}.', 'The operation is linked to a commercial folder with attached documentation, progress status and approval record.'], signatures: ['Buyer', 'Seller', 'Agency'] },
      { code: 'AUTORIZACION_VENTA', label: 'Sale authorization', tag: 'Listing', title: 'SALE AUTHORIZATION', paragraphs: ['The owner {{propietario}} authorizes {{inmobiliaria}} to commercially offer the property located at {{domicilio}}, under the conditions agreed in the listing file.', 'The authorization includes publication, visit coordination, inquiry intake and commercial documentation before the operation.'], signatures: ['Owner', 'Broker', 'Agency'] },
      { code: 'CONTRATO_ALQUILER', label: 'Base rental contract', tag: 'Rental', title: 'RENTAL CONTRACT', paragraphs: ['Between {{locador}} and {{locatario}}, the lease of the property located at {{domicilio}} is agreed for {{plazo}} and a monthly rent of {{precio}}.', 'The contract remains subject to professional review, supporting documentation, reported guarantees and final approval by the parties.'], signatures: ['Landlord', 'Tenant', 'Agency'] },
      { code: 'RECIBO_SENA', label: 'Deposit receipt', tag: 'Reservation', title: 'DEPOSIT RECEIPT', paragraphs: ['The agency records receipt from {{cliente}} of {{precio}} as deposit for the operation over the property {{domicilio}}.', 'This receipt is linked to the commercial case, with confirmation deadline on {{fecha_limite}}.'], signatures: ['Client', 'Responsible', 'Agency'] },
      { code: 'ENTREGA_LLAVES', label: 'Key handover record', tag: 'Closing', title: 'KEY HANDOVER RECORD', paragraphs: ['On {{fecha}}, this record confirms the delivery of keys for the property located at {{domicilio}} to {{cliente}}.', 'The parties acknowledge receiving the property according to the condition reported in the attached documentation and leave record for later follow-up.'], signatures: ['Delivering party', 'Receiving party', 'Agency'] },
    ],
  },
  form: { ...messages.es.form, name: 'Name', whatsapp: 'WhatsApp', company: 'Agency', message: 'Message', close: 'Close', submit: 'Request 3-month trial', sending: 'Sending...', ok: 'Done. It was registered as a measurable marketing inquiry.', error: 'Could not register it. Try WhatsApp or retry.', namePh: 'Ex. Mariana Gomez', companyPh: 'Company name', propertyMsg: 'I want to schedule a visit and receive the listing.', demoMsg: 'I want a 3-month trial with properties, leads and documents.' },
  modal: { close: 'Close', score: 'commercial interest', price: 'price', days: 'days published', daysPublished: 'days published', attributes: 'attributes', flowTitle: 'Connected flow', flow: ['Inquiry captured from public listing.', 'The inquiry enters follow-up with source and property.', 'A commercial folder is created for reservation, rent or sale.', 'A document is generated: reservation, authorization, purchase agreement or contract.'] },
  copilot: { title: 'InmoPub Copilot', welcomeTitle: 'InmoPub Copilot', welcome: 'I am a real estate advisor and InmoPub commercial consultant. I can help with listings, inquiries, visits, reservations, documents, subscription and a 3-month trial.', prompts: ['I want a 3-month trial', 'How to handle an inquiry', 'What documents it generates', 'Talk on WhatsApp'], nextTitle: 'Next best action', nextAnswer: 'As a real estate advisor, I would move the conversation to the next concrete step: understand the property, qualify the prospect, schedule a visit and prepare documentation. To sell InmoPub, show that flow and offer a 3-month proof with clear metrics.', input: 'Ask me about sales, rentals, visits, documents or demo...', fab: 'Copilot', whatsappText: 'Hi, I want a 3-month InmoPub trial for my real estate agency.', followPrompts: ['Schedule trial', 'View demo properties', 'How to close a visit', 'Talk on WhatsApp'] },
  cookies: { title: 'Cookies and analytics', body: 'We use non-essential cookies only if you accept them to measure campaigns, inquiries, clicks and copilot usage. You can continue browsing if you reject them.', reject: 'Reject', accept: 'Accept', aria: 'Cookie notice' },
  footer: { body: 'Vertical product for real estate agencies. Mini portal, commercial follow-up and documents.', legal: 'Legal', privacy: 'Privacy', cookies: 'Cookies', terms: 'Terms', legalNotice: 'Legal notice' },
  legalPages: {
    legal: { title: 'Legal and transparency', updatedLabel: 'Last updated', eyebrow: 'InmoPub legal', sections: [['Legal framework', 'InmoPub is a DiceProjects commercial site focused on a vertical solution for real estate agencies.'], ['Available documents', 'You can read the terms, privacy policy, cookie policy and legal notice from the footer links.'], ['Legal contact', 'For legal or privacy questions write to legal@diceprojects.com.']] },
    privacidad: { title: 'Privacy policy', updatedLabel: 'Last updated', eyebrow: 'InmoPub legal', sections: [['Scope', 'This policy applies to the InmoPub website, commercial forms, marketing events and property inquiries.'], ['Data we may process', 'We may process name, email, phone, agency, message, origin URL, campaign, navigation events and copilot questions.'], ['Purpose', 'We use information to answer inquiries, coordinate demos, measure campaigns and improve experience.'], ['Rights', 'You can request access, correction or deletion by writing to legal@diceprojects.com.']] },
    cookies: { title: 'Cookie policy', updatedLabel: 'Last updated', eyebrow: 'InmoPub legal', sections: [['What they are', 'Cookies and similar technologies remember preferences, measure usage and improve experience.'], ['Analytics and marketing', 'With consent, we measure views, clicks, scroll, searches, filters, opened properties, simulations and forms.'], ['Control', 'You can accept or reject non-essential cookies from the banner.']] },
    terminos: { title: 'Terms and conditions', updatedLabel: 'Last updated', eyebrow: 'InmoPub legal', sections: [['Acceptance', 'By browsing InmoPub you accept these terms.'], ['Use of the site', 'InmoPub shows commercial information, demos, sample or published properties, simulators and contact forms.'], ['No binding advice', 'Content is informational and commercial. Real estate operations must be reviewed by qualified professionals.'], ['Intellectual property', 'The site, brand, texts, designs, code and materials belong to DiceProjects or their respective owners.']] },
    'aviso-legal': { title: 'Legal notice', updatedLabel: 'Last updated', eyebrow: 'InmoPub legal', sections: [['Ownership', 'InmoPub is a vertical product presented by DiceProjects. Contact: mdice@diceprojects.com.'], ['Responsibility', 'Information is offered in good faith for commercial and informational purposes.'], ['External links', 'The site may link to WhatsApp, DiceProjects or other resources.']] },
  },
};

messages.pt = {
  ...messages.es,
  meta: { title: 'InmoPub | Mini portal imobiliário, consultas e documentos', description: 'Mini portal imobiliário, acompanhamento comercial e documentos para imobiliárias.' },
  nav: { product: 'Produto', catalog: 'Catálogo', backoffice: 'Backoffice', simulator: 'Simulador', demo: 'Demo', seeDemo: 'Ver demo', home: 'Início', privacy: 'Privacidade', cookies: 'Cookies', terms: 'Termos' },
  hero: { eyebrow: 'Mini portal imobiliário + consultas + documentos', title: 'Publique imóveis e transforme consultas em operações.', body: 'InmoPub funciona por assinatura e centraliza imóveis, interessados, visitas e documentos comerciais. Teste por 3 meses com sua operação real para medir consultas recuperadas, visitas e fechamentos mais rápidos.', primary: 'Ver demo do fluxo', secondary: 'Explorar imóveis', proofLogo: 'Ficha pública com logo', proofLeads: 'Leads e acompanhamento', proofCases: 'Casos e documentos' },
  insights: [
    { value: '0.4% - 1.2%', label: 'conversão média de consultas imobiliárias digitais', source: 'RealScout / JustCall, 2026' },
    { value: '5 min', label: 'janela crítica para responder antes que outro corretor ganhe a conversa', source: 'Harvard Business Review citado por RealScout' },
    { value: '2+ h/dia', label: 'tempo operacional que uma imobiliária pode recuperar com automação', source: 'Meduzzen, 2026' },
    { value: '30-50%', label: 'redução potencial de carga administrativa ao automatizar fluxos repetíveis', source: 'Epiphany Dynamics, 2026' },
  ],
  product: {
    eyebrow: 'Produto vertical',
    title: 'Não concorra com portais massivos. Transforme sua operação em um mini portal vendável.',
    body: 'A proposta é simples: a imobiliária cadastra, publica, mede, atende e documenta a partir de um fluxo profissional próprio, começando com uma prova de 3 meses antes de escalar a assinatura.',
    features: [
      { title: 'Imóveis', text: 'Venda, aluguel, temporada, fotos, amenities, estados e ficha pública compartilhável.' },
      { title: 'Consultas', text: 'Interessados com fonte, prioridade, acompanhamento, visitas e responsável comercial.' },
      { title: 'Operações', text: 'Reserva, autorização, contrato, entrega e documentação associada.' },
      { title: 'Documentos', text: 'Modelos comerciais com seu logo e dados da operação.' },
      { title: 'Painel comercial', text: 'Tempos de resposta, conversão, visitas, publicações e documentos emitidos.' },
      { title: 'Copiloto imobiliário', text: 'Opera consultas e documentos com fluxos seguros; soma IA para vender, qualificar e responder melhor.' },
    ],
  },
  copilotSection: {
    eyebrow: 'Copiloto como serviço',
    title: 'Um assistente imobiliário que vende, mas não improvisa operações.',
    body: 'InmoPub combina fluxos determinísticos para executar tarefas do negócio com IA opcional para interpretar mensagens, redigir respostas e preparar uma demo comercial melhor.',
    cards: [
      { tag: 'Sem IA · Operacional', title: 'Executa o trabalho repetível com regras claras.', text: 'Lista imóveis, filtra interessados, agenda visitas, monta reservas a partir de modelo, pede dados faltantes e mantém rastreabilidade por imobiliária, usuário e operação.' },
      { tag: 'Com IA · Comercial', title: 'Ajuda a vender melhor sem salvar nada sem confirmação.', text: 'Resume consultas longas, detecta intenção, redige respostas, sugere próximos passos, prepara objeções e guia o vendedor para visita, reserva ou demo.' },
      { tag: 'Demo e captação', title: 'Também atua como assessor de venda do InmoPub.', text: 'Explica ROI, compara com planilhas e portais, qualifica leads de imobiliárias e propõe o fluxo ideal: imóvel publicado, consulta, acompanhamento e documento.' },
    ],
  },
  catalog: { eyebrow: 'Catálogo imobiliário', title: 'Assim fica uma imobiliária usando InmoPub.', body: 'Mostre imóveis reais com filtros, ficha vendável, captura de interessados e acompanhamento comercial desde o primeiro contato.', search: 'Buscar bairro, cidade, título...', operation: 'Operação', sale: 'Venda', rent: 'Aluguel', temporary: 'Temporada', searchButton: 'Buscar', loading: 'Carregando imóveis...', openCard: 'Ver ficha comercial', featured: 'Destaque' },
  cta: { eyebrow: 'Lançamento InmoPub', title: 'Teste InmoPub por 3 meses com seus imóveis e sua marca.', body: 'A primeira demo deve mostrar imóveis reais da imobiliária, uma consulta simulada, uma reserva e um documento pronto para enviar. Depois medimos por 3 meses se a assinatura resolve o problema.' },
  bi: { eyebrow: 'Painel da demo', title: 'Um painel que fala o idioma imobiliário.', body: 'A demo vende quando mostra controle: publicações, consultas, visitas, documentos e conversão.', properties: 'imóveis publicados', score: 'interesse comercial médio', leads: 'consultas projetadas', visits: 'visitas potenciais', saleRent: 'venda / aluguel' },
  flow: { eyebrow: 'Demo de 90 segundos', title: 'Do imóvel publicado à operação pronta para fechar.', steps: [
    { title: 'Publicar', text: 'Cadastre imóvel, fotos, amenities, preço, estado e ficha compartilhável com logo da imobiliária.' },
    { title: 'Captar', text: 'O interessado consulta pela ficha pública, WhatsApp ou formulário e entra no acompanhamento comercial com rastreabilidade.' },
    { title: 'Operar', text: 'Agenda-se visita, muda-se o estado da consulta e gera-se documentação comercial.' },
    { title: 'Fechar', text: 'Reserva, autorização, proposta ou contrato são gerados com dados da operação e anexados.' },
  ] },
  roi: { eyebrow: 'Simulador comercial', title: 'Mostre quanto uma imobiliária pode ganhar organizando sua operação.', body: 'Ajuste premissas de uma imobiliária real e estime o impacto de responder melhor, não perder consultas e gerar documentos sem dupla carga.', note: 'Os controles ajudam a definir uma prova de 3 meses com métricas concretas antes de ativar ou ampliar a assinatura.', impact: 'impacto mensal estimado entre consultas melhor atendidas, fechamentos adicionais e tempo operacional recuperado.', inputs: { properties: 'Carteira publicada', monthlyLeads: 'Consultas por mês', conversionRate: 'Consultas que fecham (%)', averageCommission: 'Receita média por fechamento', adminHoursPerWeek: 'Horas semanais de trabalho manual', hourlyCost: 'Custo estimado por hora' }, cards: { recovered: 'consultas recuperadas', deals: 'fechamentos estimados', revenue: 'receita potencial', savings: 'tempo recuperado' } },
  document: {
    eyebrow: 'Documentos comerciais',
    title: 'Mostre documentos reais, com logo, dados da imobiliária e prévia A4.',
    body: 'Escolha o documento imobiliário e a demo mostra como sairia para uma operação. A mesma lógica pode ser consumida por API com marca, tipo documental e dados de exemplo.',
    company: 'IMOBILIÁRIA DEMO',
    meta: 'CNPJ · Registro · Endereço · Email',
    selectorLabel: 'Documento imobiliário',
    previewLabel: 'Prévia profissional',
    apiPill: 'API de prévia por marca e tipo documental',
    checks: ['Autorização de venda ou aluguel', 'Reserva, recibo, proposta ou contrato base', 'Logo e dados institucionais da imobiliária', 'Histórico de alterações e versões do documento'],
    templates: [
      { code: 'RESERVA_COMPRA', label: 'Reserva de compra', tag: 'Venda', title: 'RESERVA DE COMPRA', paragraphs: ['Na cidade de Buenos Aires, o interessado {{cliente}} formaliza reserva pelo imóvel localizado em {{domicilio}}, pelo preço de {{precio}}.', 'A operação fica vinculada a uma pasta comercial, com documentação anexada, estado de avanço e registro de aprovações.'], signatures: ['Comprador', 'Vendedor', 'Imobiliária'] },
      { code: 'AUTORIZACION_VENTA', label: 'Autorização de venda', tag: 'Captação', title: 'AUTORIZAÇÃO DE VENDA', paragraphs: ['O proprietário {{propietario}} autoriza {{inmobiliaria}} a oferecer comercialmente o imóvel localizado em {{domicilio}}, sob as condições acordadas na ficha de publicação.', 'A autorização inclui divulgação, coordenação de visitas, recepção de consultas e preparação documental antes da operação.'], signatures: ['Proprietário', 'Corretor', 'Imobiliária'] },
      { code: 'CONTRATO_ALQUILER', label: 'Contrato base de aluguel', tag: 'Aluguel', title: 'CONTRATO DE ALUGUEL', paragraphs: ['Entre {{locador}} e {{locatario}} fica acordada a locação do imóvel localizado em {{domicilio}}, pelo prazo de {{plazo}} e aluguel mensal de {{precio}}.', 'O contrato fica sujeito à revisão profissional, documentação de apoio, garantias informadas e aprovação final das partes.'], signatures: ['Locador', 'Locatário', 'Imobiliária'] },
      { code: 'RECIBO_SENA', label: 'Recibo de sinal', tag: 'Reserva', title: 'RECIBO DE SINAL', paragraphs: ['A imobiliária registra o recebimento de {{cliente}} da quantia de {{precio}} como sinal para a operação sobre o imóvel {{domicilio}}.', 'Este recibo fica associado à pasta comercial, com prazo de confirmação em {{fecha_limite}}.'], signatures: ['Cliente', 'Responsável', 'Imobiliária'] },
      { code: 'ENTREGA_LLAVES', label: 'Ata de entrega de chaves', tag: 'Fechamento', title: 'ATA DE ENTREGA DE CHAVES', paragraphs: ['Na data {{fecha}}, registra-se a entrega das chaves do imóvel localizado em {{domicilio}} a {{cliente}}.', 'As partes declaram receber o imóvel conforme o estado informado na documentação anexa e deixam registro para acompanhamento posterior.'], signatures: ['Entrega', 'Recebe', 'Imobiliária'] },
    ],
  },
  form: { ...messages.es.form, name: 'Nome', whatsapp: 'WhatsApp', company: 'Imobiliária', message: 'Mensagem', close: 'Fechar', submit: 'Pedir prova de 3 meses', sending: 'Enviando...', ok: 'Pronto. Ficou registrado como consulta mensurável em marketing.', error: 'Não foi possível registrar. Tente WhatsApp ou novamente.', namePh: 'Ex. Mariana Gomez', companyPh: 'Nome da empresa', propertyMsg: 'Quero agendar visita e receber a ficha.', demoMsg: 'Quero uma prova de 3 meses com imóveis, consultas e documentos.' },
  modal: { close: 'Fechar', score: 'interesse comercial', price: 'preço', days: 'dias publicada', daysPublished: 'dias publicada', attributes: 'atributos', flowTitle: 'Fluxo conectado', flow: ['Consulta capturada pela ficha pública.', 'A consulta entra no acompanhamento com fonte e imóvel.', 'Cria-se uma pasta comercial para reserva, aluguel ou venda.', 'Gera-se documento: reserva, autorização, proposta ou contrato.'] },
  copilot: { title: 'InmoPub Copilot', welcomeTitle: 'Copiloto InmoPub', welcome: 'Sou assessor imobiliário e consultor comercial da InmoPub. Posso orientar sobre imóveis, consultas, visitas, reservas, documentos, assinatura e prova de 3 meses.', prompts: ['Quero uma prova de 3 meses', 'Como atender uma consulta', 'Que documentos gera', 'Falar no WhatsApp'], nextTitle: 'Próxima melhor ação', nextAnswer: 'Como assessor imobiliário, levaria a conversa ao próximo passo concreto: entender o imóvel, qualificar o interessado, agendar visita e preparar documentação. Para vender InmoPub, mostre esse fluxo e ofereça uma prova de 3 meses com métricas claras.', input: 'Pergunte sobre venda, aluguel, visitas, documentos ou demo...', fab: 'Copiloto', whatsappText: 'Olá, quero uma prova de 3 meses do InmoPub para minha imobiliária.', followPrompts: ['Agendar prova', 'Ver imóveis demo', 'Como fechar uma visita', 'Falar no WhatsApp'] },
  cookies: { title: 'Cookies e medição', body: 'Usamos cookies não essenciais apenas se você aceitar para medir campanhas, consultas, cliques e uso do copiloto. Você pode continuar navegando se rejeitar.', reject: 'Rejeitar', accept: 'Aceitar', aria: 'Aviso de cookies' },
  footer: { body: 'Produto vertical para imobiliárias. Mini portal, acompanhamento comercial e documentos.', legal: 'Legal', privacy: 'Privacidade', cookies: 'Cookies', terms: 'Termos', legalNotice: 'Aviso legal' },
  legalPages: {
    legal: { title: 'Legal e transparência', updatedLabel: 'Última atualização', eyebrow: 'InmoPub legal', sections: [['Marco legal', 'InmoPub é um site comercial da DiceProjects voltado a uma solução vertical para imobiliárias.'], ['Documentos disponíveis', 'Você pode consultar termos, privacidade, cookies e aviso legal pelos links do rodapé.'], ['Contato legal', 'Para dúvidas legais ou de privacidade escreva para legal@diceprojects.com.']] },
    privacidad: { title: 'Política de privacidade', updatedLabel: 'Última atualização', eyebrow: 'InmoPub legal', sections: [['Escopo', 'Esta política se aplica ao site InmoPub, formulários comerciais, eventos de marketing e consultas por imóveis.'], ['Dados que podemos tratar', 'Podemos tratar nome, email, telefone, imobiliária, mensagem, URL de origem, campanha, eventos de navegação e perguntas ao copiloto.'], ['Finalidade', 'Usamos as informações para responder consultas, coordenar demos, medir campanhas e melhorar a experiência.'], ['Direitos', 'Você pode solicitar acesso, correção ou exclusão escrevendo para legal@diceprojects.com.']] },
    cookies: { title: 'Política de cookies', updatedLabel: 'Última atualização', eyebrow: 'InmoPub legal', sections: [['O que são', 'Cookies e tecnologias similares lembram preferências, medem uso do site e melhoram a experiência.'], ['Medição e marketing', 'Com consentimento, medimos visualizações, cliques, scroll, buscas, filtros, imóveis abertos, simulações e formulários.'], ['Controle', 'Você pode aceitar ou rejeitar cookies não essenciais no banner.']] },
    terminos: { title: 'Termos e condições', updatedLabel: 'Última atualização', eyebrow: 'InmoPub legal', sections: [['Aceitação', 'Ao navegar no InmoPub você aceita estes termos.'], ['Uso do site', 'InmoPub mostra informação comercial, demos, imóveis de exemplo ou publicados, simuladores e formulários de contato.'], ['Sem assessoria vinculante', 'O conteúdo é informativo e comercial. Operações imobiliárias reais devem ser revisadas por profissionais habilitados.'], ['Propriedade intelectual', 'Site, marca, textos, designs, código e materiais pertencem à DiceProjects ou seus respectivos titulares.']] },
    'aviso-legal': { title: 'Aviso legal', updatedLabel: 'Última atualização', eyebrow: 'InmoPub legal', sections: [['Titularidade', 'InmoPub é um produto vertical apresentado pela DiceProjects. Contato: mdice@diceprojects.com.'], ['Responsabilidade', 'As informações são oferecidas de boa-fé com finalidade comercial e informativa.'], ['Links externos', 'O site pode vincular para WhatsApp, DiceProjects ou outros recursos.']] },
  },
};

export function msg(locale: Locale): Messages {
  return messages[locale] || messages.es;
}
