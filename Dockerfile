# ============================================================
# HealthFlow — Dockerfile
# Build multi-stage: Node.js build → Nginx serve
# ============================================================

# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências primeiro (cache de camadas)
COPY package*.json ./
RUN npm install --prefer-offline

# Copia código-fonte
COPY . .

# Variáveis de build passadas via --build-arg ou Portainer secrets
ARG VITE_SUPABASE_URL=https://supabase.autotech.dev.br
ARG VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.9Ec1G8PyXuvqMW4v3-rL1bRm0Mu5qJ9rvQU2PTi5n-Y
ARG VITE_APP_DOMAIN=healthflow.autotech.dev.br

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_APP_DOMAIN=$VITE_APP_DOMAIN

RUN npm run build

# --- Stage 2: Serve com Nginx ---
FROM nginx:alpine AS runner

# Configuração Nginx otimizada para SPA React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Arquivos estáticos gerados pelo build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
