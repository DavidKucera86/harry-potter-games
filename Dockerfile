# --- Build stage: compile TS -> JS and generate HTML from templates ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Serve stage: static hosting via nginx ---
FROM nginx:alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Copy only the static payload that gets published (mirrors netlify publish dir).
COPY --from=build /app/index.html /app/manifest.webmanifest ./
COPY --from=build /app/shared ./shared
COPY --from=build /app/guess-character-name ./guess-character-name
COPY --from=build /app/guess-house ./guess-house
COPY --from=build /app/guess-spell ./guess-spell
COPY --from=build /app/who-is-on-photo ./who-is-on-photo
COPY --from=build /app/rock-paper-scissors ./rock-paper-scissors
COPY --from=build /app/chat-with-character ./chat-with-character

EXPOSE 4173
