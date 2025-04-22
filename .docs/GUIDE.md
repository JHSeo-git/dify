# Guide

## frontend

> https://github.com/langgenius/dify/blob/main/web/README.md

### prerequisites

- node: https://nodejs.org/en/download/
- pnpm: `npm install -g pnpm`

### .env

```bash
cp .env.example .env.local
```

### install

```bash
pnpm install
```

### dev

```bash
pnpm dev
```

### 참고: 화면에서 Element 선택으로 코드로 이동

> https://github.com/zh-lx/code-inspector

<kbd>shift</kbd> + <kbd>option(⌥)</kbd> + mouse click

## backend

> https://github.com/langgenius/dify/blob/main/api/README.md

### prerequisites

- rancher desktop(docker, docker-compose): https://docs.rancherdesktop.com/getting-started/installation/
- uv: https://docs.astral.sh/uv/getting-started/installation/

### docker compose

```bash
cd ../docker
cp middleware.env.example middleware.env
# change the profile to other vector database if you are not using weaviate
docker compose -f docker-compose.middleware.yaml --profile weaviate -p dify up -d
# docker compose -f docker-compose.middleware.yaml --profile weaviate -p dify down
cd ../api
```

#### trouble shooting

**ssrf_proxy: already use 3128 port**

rancher desktop socket(또는 다른 이유)으로 인해 이미 3128 port를 사용하고 있어 `EXPOSE_SSRF_PROXY_PORT` 값을 13128로 변경해서 사용.

```bash
# middleware.env
EXPOSE_SSRF_PROXY_PORT=13128
```

```yaml
# docker-compose.middleware.yaml
environment:
  # pls clearly modify the squid env vars to fit your network environment.
  HTTP_PORT: ${SSRF_HTTP_PORT:-3128}
  COREDUMP_DIR: ${SSRF_COREDUMP_DIR:-/var/spool/squid}
  REVERSE_PROXY_PORT: ${SSRF_REVERSE_PROXY_PORT:-8194}
  SANDBOX_HOST: ${SSRF_SANDBOX_HOST:-sandbox}
  SANDBOX_PORT: ${SANDBOX_PORT:-8194}
ports:
  - "${EXPOSE_SSRF_PROXY_PORT:-13128}:${SSRF_HTTP_PORT:-3128}"
  - "${EXPOSE_SANDBOX_PORT:-8194}:${SANDBOX_PORT:-8194}"
```

### .env

```bash
cp .env.example .env
```

**create secret key**

```bash
secret_key=$(openssl rand -base64 42)
sed -i '' "/^SECRET_KEY=/c\\
SECRET_KEY=${secret_key}" .env
```

### install

```bash
uv sync --dev
```

### db migration

```bash
uv run flask db upgrade
```

### dev

```bash
uv run flask run --host 0.0.0.0 --port=5001 --debug
```

#### 참고: 비동기 작업(예: 데이터 세트 가져오기 및 문서 인덱싱)을 처리하고 디버깅해야 하는 경우

```bash
uv run celery -A app.celery worker -P gevent -c 1 --loglevel INFO -Q dataset,generation,mail,ops_trace,app_deletion
```
