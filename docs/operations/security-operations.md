# Security Operations Center (SOC) Architecture

## 1. Security Monitoring
The platform actively monitors for Malicious or Anomalous behaviors:
- **Failed Logins**: Tracking consecutive failures to trigger temporary account lockouts or IP bans.
- **API Abuse**: Identifying abnormal usage patterns (e.g., massive spikes in product scraping or cart additions).
- **Rate Limit Violations**: Capturing 429 errors in aggregate to identify DDoS attempts.
- **Permission Violations**: Logging 403 Forbidden errors when an authenticated user attempts to breach their tenant boundary.
- **Admin Access Changes**: Alerts triggered whenever an Admin escalates privileges or provisions a new SuperAdmin.

## 2. Security Alerts
Security incidents flow into a dedicated Incident Management system:
- High severity alerts (e.g., suspected data exfiltration, mass permission changes) trigger immediate P0 notifications to the SecOps team.
- The SOC Dashboard (`/admin/security`) provides a real-time feed of these alerts.

## 3. Incident Management System
- **Incident Creation**: Automated generation based on SOC triggers.
- **Severity Levels**: S1 (Critical, system breach), S2 (High, targeted attack), S3 (Medium, repeated abuse), S4 (Low, individual account lockout).
- **Resolution Tracking**: Incidents remain open until manually resolved and a Postmortem is attached.
