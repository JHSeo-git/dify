## Docker 배포를 위한 README

Docker Compose를 사용하여 Dify를 배포하기 위한 새로운 `docker` 디렉토리에 오신 것을 환영합니다. 이 README는 업데이트 내용, 배포 지침 및 기존 사용자를 위한 마이그레이션 세부 정보를 설명합니다.

### 업데이트된 내용

- **Certbot 컨테이너**: `docker-compose.yaml`에 SSL 인증서 관리를 위한 `certbot`이 포함되었습니다. 이 컨테이너는 인증서를 자동으로 갱신하고 안전한 HTTPS 연결을 보장합니다.  
  자세한 내용은 `docker/certbot/README.md`를 참조하세요.

- **영구 환경 변수**: 환경 변수는 이제 `.env` 파일을 통해 관리되어 배포 간에 설정이 유지됩니다.

  > `.env`란 무엇인가요? </br> </br> > `.env` 파일은 Docker 및 Docker Compose 환경에서 중요한 구성 요소로, 컨테이너가 런타임에 접근할 수 있는 환경 변수를 정의할 수 있는 중앙 구성 파일입니다. 이 파일은 개발, 테스트 및 프로덕션의 다양한 단계에서 환경 설정을 간소화하고 일관성과 쉬운 구성을 제공합니다.

- **통합 벡터 데이터베이스 서비스**: 모든 벡터 데이터베이스 서비스는 이제 단일 Docker Compose 파일 `docker-compose.yaml`에서 관리됩니다. `.env` 파일에서 `VECTOR_STORE` 환경 변수를 설정하여 다른 벡터 데이터베이스로 전환할 수 있습니다.
- **필수 .env 파일**: `docker compose up`을 실행하려면 `.env` 파일이 필요합니다. 이 파일은 배포 구성과 업그레이드를 통해 사용자 정의 설정을 유지하는 데 중요합니다.
- **레거시 지원**: 이전 배포 파일은 이제 `docker-legacy` 디렉토리에 있으며 더 이상 유지 관리되지 않습니다.

### `docker-compose.yaml`로 Dify 배포하기

1. **사전 요구사항**: 시스템에 Docker와 Docker Compose가 설치되어 있는지 확인하세요.
2. **환경 설정**:
   - `docker` 디렉토리로 이동합니다.
   - `cp .env.example .env`를 실행하여 `.env.example` 파일을 `.env`라는 새 파일로 복사합니다.
   - 필요에 따라 `.env` 파일을 사용자 정의합니다. 자세한 구성 옵션은 `.env.example` 파일을 참조하세요.
3. **서비스 실행**:
   - `docker` 디렉토리에서 `docker compose up`을 실행하여 서비스를 시작합니다.
   - 벡터 데이터베이스를 지정하려면 `.env` 파일에서 `VECTOR_STORE` 변수를 `milvus`, `weaviate` 또는 `opensearch`와 같은 원하는 벡터 데이터베이스 서비스로 설정하세요.
4. **SSL 인증서 설정**:
   - Certbot을 사용하여 SSL 인증서를 설정하려면 `docker/certbot/README.md`를 참조하세요.
5. **OpenTelemetry Collector 설정**:
   - `.env`에서 `ENABLE_OTEL`을 `true`로 변경합니다.
   - `OTLP_BASE_ENDPOINT`를 적절히 구성합니다.

### Dify 개발을 위한 미들웨어 배포하기

1. **미들웨어 설정**:
   - 데이터베이스 및 캐시와 같은 필수 미들웨어 서비스를 설정하려면 `docker-compose.middleware.yaml`을 사용합니다.
   - `docker` 디렉토리로 이동합니다.
   - `cp middleware.env.example middleware.env`를 실행하여 `middleware.env` 파일을 생성합니다 (`middleware.env.example` 파일 참조).
2. **미들웨어 서비스 실행**:
   - `docker` 디렉토리로 이동합니다.
   - `docker compose -f docker-compose.middleware.yaml --profile weaviate -p dify up -d`를 실행하여 미들웨어 서비스를 시작합니다. (weaviate를 사용하지 않는 경우 다른 벡터 데이터베이스로 프로필을 변경하세요)

### 기존 사용자를 위한 마이그레이션

`docker-legacy` 설정에서 마이그레이션하는 사용자의 경우:

1. **변경 사항 검토**: 새로운 `.env` 구성과 Docker Compose 설정을 숙지하세요.
2. **사용자 정의 전송**:
   - `docker-compose.yaml`, `ssrf_proxy/squid.conf` 또는 `nginx/conf.d/default.conf`와 같은 구성을 사용자 정의한 경우, 생성한 `.env` 파일에 이러한 변경 사항을 반영해야 합니다.
3. **데이터 마이그레이션**:
   - 필요한 경우 데이터베이스 및 캐시와 같은 서비스의 데이터를 새 구조로 적절히 백업하고 마이그레이션하세요.

### `.env` 개요

#### 주요 모듈 및 사용자 정의

- **벡터 데이터베이스 서비스**: 사용하는 벡터 데이터베이스 유형(`VECTOR_STORE`)에 따라 사용자는 특정 엔드포인트, 포트 및 인증 세부 정보를 설정할 수 있습니다.
- **스토리지 서비스**: 스토리지 유형(`STORAGE_TYPE`)에 따라 사용자는 S3, Azure Blob, Google Storage 등에 대한 특정 설정을 구성할 수 있습니다.
- **API 및 웹 서비스**: 사용자는 API 및 웹 프론트엔드의 작동 방식에 영향을 미치는 URL 및 기타 설정을 정의할 수 있습니다.

#### 기타 주목할 만한 변수

Docker 설정에서 제공하는 `.env.example` 파일은 광범위하며 다양한 구성 옵션을 다룹니다. 이는 애플리케이션과 서비스의 다양한 측면에 관한 여러 섹션으로 구성되어 있습니다. 주요 섹션과 변수는 다음과 같습니다:

1. **공통 변수**:

   - `CONSOLE_API_URL`, `SERVICE_API_URL`: 다양한 API 서비스의 URL.
   - `APP_WEB_URL`: 프론트엔드 애플리케이션 URL.
   - `FILES_URL`: 파일 다운로드 및 미리보기를 위한 기본 URL.

2. **서버 구성**:

   - `LOG_LEVEL`, `DEBUG`, `FLASK_DEBUG`: 로깅 및 디버그 설정.
   - `SECRET_KEY`: 세션 쿠키 및 기타 민감한 데이터를 암호화하기 위한 키.

3. **데이터베이스 구성**:

   - `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`: PostgreSQL 데이터베이스 자격 증명 및 연결 세부 정보.

4. **Redis 구성**:

   - `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: Redis 서버 연결 설정.

5. **Celery 구성**:

   - `CELERY_BROKER_URL`: Celery 메시지 브로커 구성.

6. **스토리지 구성**:

   - `STORAGE_TYPE`, `S3_BUCKET_NAME`, `AZURE_BLOB_ACCOUNT_NAME`: 로컬, S3, Azure Blob 등과 같은 파일 스토리지 옵션에 대한 설정.

7. **벡터 데이터베이스 구성**:

   - `VECTOR_STORE`: 벡터 데이터베이스 유형(예: `weaviate`, `milvus`).
   - `WEAVIATE_ENDPOINT`, `MILVUS_URI`와 같은 각 벡터 스토어에 대한 특정 설정.

8. **CORS 구성**:

   - `WEB_API_CORS_ALLOW_ORIGINS`, `CONSOLE_CORS_ALLOW_ORIGINS`: 교차 출처 리소스 공유 설정.

9. **OpenTelemetry 구성**:

   - `ENABLE_OTEL`: API에서 OpenTelemetry collector 활성화.
   - `OTLP_BASE_ENDPOINT`: OTLP 익스포터의 엔드포인트.

10. **기타 서비스별 환경 변수**:
    - `nginx`, `redis`, `db` 및 벡터 데이터베이스와 같은 각 서비스는 `docker-compose.yaml`에서 직접 참조되는 특정 환경 변수를 가집니다.

### 추가 정보

- **지속적인 개선 단계**: 커뮤니티의 피드백을 적극적으로 수집하여 배포 프로세스를 개선하고 향상시키고 있습니다. 더 많은 사용자가 이 새로운 방법을 채택함에 따라 귀하의 경험과 제안을 바탕으로 계속해서 개선할 것입니다.
- **지원**: 자세한 구성 옵션 및 환경 변수 설정은 `docker` 디렉토리의 `.env.example` 파일과 Docker Compose 구성 파일을 참조하세요.

이 README는 새로운 Docker Compose 설정을 사용한 배포 프로세스를 안내하는 것을 목적으로 합니다. 문제가 있거나 추가 지원이 필요한 경우 공식 문서를 참조하거나 지원팀에 문의하세요.
