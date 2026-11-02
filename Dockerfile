# Build the static site
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm test && npm run build
# Compress once at build time (max level) so nginx never compresses per request
RUN find dist -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' -o -name '*.svg' -o -name '*.ico' -o -name '*.webmanifest' \) -exec gzip -9 -k {} \;

# Serve it with nginx on port 8000 (same port the Django app used)
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8000
