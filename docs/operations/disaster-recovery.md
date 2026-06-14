# Disaster Recovery & Business Continuity

## 1. Backup Policies
- **Database Backups**: Continuous Archiving (WAL) enabling Point-In-Time-Recovery (PITR). Full snapshot backups performed daily at 02:00 AM UTC. Backups retained for 30 days.
- **Storage Backups**: S3 buckets configured with Cross-Region Replication (CRR). Versioning enabled to protect against accidental overwrites.
- **Configuration Backups**: Infrastructure-as-Code (Terraform/Ansible) stored securely in version control. Secrets backed up in managed vaults (AWS Secrets Manager).

## 2. Recovery Procedures
- **RTO (Recovery Time Objective)**: 4 Hours for total regional failure. 15 minutes for isolated database failure.
- **RPO (Recovery Point Objective)**: 5 Minutes. Maximum acceptable data loss is 5 minutes of transactional volume.
- **Rollback Procedures**: Failed deployments automatically trigger a blue/green rollback. Database migrations must always have a verified `down()` script.

## 3. Service Restoration
- Documented runbooks exist for "Cold Start" bringing up the entire infrastructure in a secondary region.
- DNS failover is automated via Cloudflare Health Checks routing to the DR cluster if the primary cluster drops offline.
