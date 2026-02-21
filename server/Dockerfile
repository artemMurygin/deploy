FROM node:18-alpine

WORKDIR /src

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["node", "server.js"]