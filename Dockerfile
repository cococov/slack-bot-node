FROM node:14.17-alpine

WORKDIR /app

COPY . .

RUN npm ci --only=production

CMD [ "node", "/app/src/index.js" ]