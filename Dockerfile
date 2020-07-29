FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --only=production
COPY . .
EXPOSE 3000

HEALTHCHECK --interval=5s --timeout=10s --retries=3 CMD curl -sS localhost:3000/health || exit 1

CMD [ "node", "app.js" ]