# Kadal2Kadaai — Deployment Guide

## Architecture

- **Frontend**: Next.js deployed on Vercel.
- **Backend**: Laravel deployed on Hetzner VPS.
- **Database**: PostgreSQL (managed or on Hetzner).
- **Cache/Queue**: Redis (on Hetzner).
- **Storage**: Cloudflare R2.
- **CDN / DNS**: Cloudflare WAF.

## 1. Backend Deployment (Hetzner VPS)

### Prerequisites on VPS
- Ubuntu 24.04 LTS
- PHP 8.4
- Nginx
- PostgreSQL 16
- Redis 7
- Composer
- Node.js & NPM (for compiling assets if needed)
- Supervisor (for Laravel Horizon / Queues)

### Deployment Steps
1. SSH into the server.
2. Clone the repository into `/var/www/kadal2kadaai`.
3. Set permissions: `chown -R www-data:www-data /var/www/kadal2kadaai/storage /var/www/kadal2kadaai/bootstrap/cache`.
4. Run `composer install --optimize-autoloader --no-dev`.
5. Run `php artisan config:cache`, `php artisan route:cache`, `php artisan view:cache`.
6. Run migrations: `php artisan migrate --force`.
7. Restart Supervisor workers: `php artisan queue:restart`.
8. Reload Nginx: `systemctl reload nginx`.

### Automated Deployment (Envoyer / GitHub Actions)
A CI/CD pipeline should be set up to run tests and automate the above steps.

## 2. Frontend Deployment (Vercel)

### Setup
1. Import the Next.js project into Vercel.
2. Set the Framework Preset to Next.js.
3. Set the Root Directory to `frontend`.
4. Configure Environment Variables in the Vercel Dashboard (see `environment.md`).

### Deployment
Vercel handles deployments automatically on pushes to `main`.
Preview environments are generated for PRs.

## 3. Storage (Cloudflare R2)

1. Create an R2 bucket named `kadal2kadaai-prod`.
2. Generate API tokens with Read/Write access to the bucket.
3. Add the S3 API endpoint, Access Key, and Secret Key to the backend `.env`.
4. Ensure public access is configured if serving images directly.

## 4. DNS & SSL (Cloudflare)

1. Point domain `kadal2kadaai.com` nameservers to Cloudflare.
2. Create A records pointing `api.kadal2kadaai.com` to the Hetzner VPS IP.
3. Ensure SSL/TLS is set to "Full (Strict)".
4. Enable Web Application Firewall (WAF) managed rules.
