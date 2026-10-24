FROM ghcr.io/puppeteer/puppeteer:24.0.0

WORKDIR /usr/src/app

COPY package*.json ./

USER root
RUN npm install --omit=dev
USER pptruser

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
