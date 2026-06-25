# InmoPub UI

Landing comercial de InmoPub by DiceProjects.

InmoPub es un producto vertical para inmobiliarias: mini portal de propiedades, captura de consultas, simulador comercial, documentación de operaciones y copiloto web para orientar interesados y vender la demo.

## Stack

- React + Vite
- TypeScript
- CSS propio
- Netlify-ready

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

URL local por defecto:

```text
http://localhost:3001
```

## Deploy en Netlify

El repo incluye `netlify.toml`.

```text
Build command: npm run build
Publish directory: dist
Node version: 22
```

## Variables de entorno

Configurar en Netlify:

```env
VITE_API_BASE_URL=https://api.diceprojects.com/api
VITE_PROPERTIES_TENANT_ID=efe8818b-6e5b-4687-b231-40f24fa76d79
VITE_MARKETING_CAMPAIGN_KEY=inmopub-web
VITE_PUBLIC_BOT_KEY=inmopub-web
VITE_PUBLIC_WHATSAPP_URL=https://wa.me/541172466605
```

Notas:

- `VITE_MARKETING_CAMPAIGN_KEY` debe existir como campaña activa en Marketing para capturar eventos y formularios.
- `VITE_PROPERTIES_TENANT_ID` define el tenant usado para el catálogo público de propiedades.
- Si la API pública de propiedades no responde o no tiene datos publicados, la landing usa propiedades demo locales.

## Integraciones

La landing usa:

- Marketing: eventos, scroll depth, clicks, búsquedas, filtros, preguntas del copiloto y formularios.
- Propiedades: catálogo público y consultas por propiedad.
- WhatsApp: contacto directo desde CTAs y copiloto.

## Licencia

Este proyecto usa la licencia privada interna de DiceProjects. Ver [LICENSE.md](./LICENSE.md).
