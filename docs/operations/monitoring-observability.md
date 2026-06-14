# System Health & Observability Architecture

## 1. Centralized Health Monitoring
All services expose a `/health` endpoint evaluated every 10 seconds by the monitoring cluster.
- **Frontend**: Node.js memory pressure, React SSR render times.
- **Backend**: API availability, CPU usage.
- **Database**: Active connections, lock contention, slow query logs (>100ms).
- **Storage**: S3 API latency, available disk space.
- **Realtime & Queue Services**: Redis connection health, failed job counts, WebSocket active client capacity.

## 2. Observability Standards
- **Logging**: All logs are structured JSON shipped to a centralized aggregator (e.g., ELK Stack / Datadog).
- **Tracing**: Distributed tracing via OpenTelemetry injected into HTTP headers (`x-b3-traceid`).
- **Metrics**: 
  - *Errors/Exceptions*: Caught globally and reported via Sentry/Bugsnag.
  - *Failed Requests*: Any 4xx/5xx tracked with route context.
  - *Slow Queries*: Tracked dynamically via APM.

## 3. Automated Alerting
- **P0 (Critical System Failures)**: Database down, Payment Gateway unreachable. Alerts via **Phone Call / PagerDuty / WhatsApp**.
- **P1 (High Impact)**: Elevated 5xx error rates (>5%), Realtime connection failures. Alerts via **SMS / Slack channel ping**.
- **P2 (Warnings)**: Queue processing delays, minor memory spikes. Alerts via **Email / In-App Notification**.
