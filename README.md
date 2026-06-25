# InmoPub UI

Landing comercial de InmoPub by DiceProjects.

## Local

```bash
npm install
npm run dev
```

URL local por defecto:

```text
http://localhost:3001
```

## Netlify

Build command:

```bash
npm run build
```

Publish directory:

```text
dist
```

## Environment

Configurar en Netlify:

```env
VITE_API_BASE_URL=https://api.diceprojects.com/api
VITE_PROPERTIES_TENANT_ID=efe8818b-6e5b-4687-b231-40f24fa76d79
VITE_MARKETING_CAMPAIGN_KEY=inmopub-web
VITE_PUBLIC_BOT_KEY=inmopub-web
VITE_PUBLIC_WHATSAPP_URL=https://wa.me/541172466605
```

`VITE_MARKETING_CAMPAIGN_KEY` debe existir como campaña activa en Marketing para capturar eventos y formularios.
