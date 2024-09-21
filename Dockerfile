FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22 AS runner

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "start"]