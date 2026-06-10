FROM node:24-slim
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/
RUN pnpm install --frozen-lockfile
COPY . .
WORKDIR /app/backend
RUN pnpm prisma generate
EXPOSE 3001
CMD ["pnpm", "start:docker"]