# Kadal2Kadaai — Environment Variables

## Backend (`backend/.env`)

```env
APP_NAME="Kadal2Kadaai"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# Database
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=kadal2kadaai
DB_USERNAME=k2k_user
DB_PASSWORD=k2k_secret_dev

# Cache & Session
BROADCAST_DRIVER=log
CACHE_DRIVER=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=k2k_redis_dev
REDIS_PORT=6379

# Mail (MailHog for local dev)
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@kadal2kadaai.com"
MAIL_FROM_NAME="${APP_NAME}"

# Cloudflare R2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=auto
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false
AWS_URL=
AWS_ENDPOINT=

# Razorpay
RAZORPAY_KEY=
RAZORPAY_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI="${APP_URL}/api/v1/auth/google/callback"

# OTP Provider (MSG91 / Twilio)
OTP_PROVIDER_KEY=
```

## Frontend (`frontend/.env.local`)

```env
# API URL (Point to Laravel backend)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Maps API (Future)
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
```
