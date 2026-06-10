FROM node:24-slim
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json frontend/
RUN pnpm install --frozen-lockfile
COPY . .
WORKDIR /app/frontend
EXPOSE 5314
CMD ["pnpm", "dev", "--host", "0.0.0.0"]