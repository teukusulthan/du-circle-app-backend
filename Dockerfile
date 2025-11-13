FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app
RUN corepack enable

COPY package.json package-lock.json ./
RUN npm install --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated/prisma ./dist/src/generated/prisma
COPY --from=builder /app/src/swagger.yaml ./dist/src/swagger.yaml

EXPOSE 80
CMD ["node", "dist/src/index.js"]
