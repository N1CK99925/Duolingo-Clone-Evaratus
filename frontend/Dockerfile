# Static export of the Next.js frontend, then served by a tiny static server.
# Build-time env: the URL the browser will use to reach the backend.
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/duolingo-clone/package.json ./
RUN npm install --no-audit --no-fund
COPY frontend/duolingo-clone/ ./
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
RUN npm run build

FROM python:3.12-alpine
WORKDIR /site
COPY --from=build /app/out/ ./
EXPOSE 3000
CMD ["python3", "-m", "http.server", "3000", "--bind", "0.0.0.0"]