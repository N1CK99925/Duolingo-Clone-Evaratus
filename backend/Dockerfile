# Build context: repo root (Render blueprint sets dockerfilePath: backend/Dockerfile).
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Runtime deps only (the image never runs tests/migrations).
RUN pip install --no-cache-dir \
    "fastapi>=0.141.0" \
    "uvicorn[standard]>=0.30" \
    "pydantic-settings>=2.0" \
    "sqlalchemy>=2.0" \
    "pydantic>=2.7"

COPY backend/ ./

# Run unprivileged; db.py creates /app/data at runtime.
RUN useradd --create-home --uid 10001 appuser \
    && mkdir -p /app/data \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:' + __import__('os').environ.get('PORT', '8000') + '/api/health', timeout=3)"

# Render injects PORT; default 8000 locally. reload is dev-only, never here.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]