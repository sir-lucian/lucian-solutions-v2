ARG NODE_VERSION

# APP Builder
ARG BUILDPLATFORM
FROM --platform=${BUILDPLATFORM:-linux/amd64} node:${NODE_VERSION:-20}-alpine AS builder

WORKDIR /app

COPY package.json ./

RUN npm install

# RUN npm audit fix --force

COPY . .

RUN npm run build

ARG NODE_VERSION

# App Runner
ARG BUILDPLATFORM
FROM --platform=${BUILDPLATFORM:-linux/amd64} node:${NODE_VERSION:-20}-alpine AS base

WORKDIR /usr/src/app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/.env .

COPY ./package.json .

EXPOSE 3000
CMD ["node", "-r", "dotenv/config", "build"]
