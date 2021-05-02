FROM node:15-alpine3.13 AS builder-base
RUN apk add --no-cache python3 make g++

FROM builder-base AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM builder-base AS runner
RUN apk add python3
RUN npm install ts-node -g
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production && yarn cache clean
COPY --from=builder /app/dist ./
COPY ./src/scripts ./scripts
CMD ["node", "index.js"]
