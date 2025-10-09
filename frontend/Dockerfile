FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

# ✅ Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ✅ Copiar arquivos buildados
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]