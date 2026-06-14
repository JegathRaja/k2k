# File Storage Governance Constitution

This document defines the strict policies for handling file uploads, storage, and distribution in Kadal2Kadaai.

## 1. Folder Hierarchy & Naming Standards
- Files must be stored logically in an S3-compatible bucket or organized local disk (dev only).
- **Structure**: `/{environment}/{domain}/{uuid}/{filename}`.
- Example: `/prod/products/01HXY.../main_image.jpg`.
- **Naming Standards**: User-uploaded filenames must be sanitized, converted to lowercase, spaces replaced with hyphens, and appended with a unique hash to prevent collisions.

## 2. Image Standards
- **Formats Allowed**: WebP (preferred), JPEG, PNG.
- **Upload Limits**: Max 5MB per image.
- **Compression Rules**: All images MUST be aggressively compressed on the server before storing. Original uncompressed files should be discarded unless explicitly needed.
- **Thumbnail Rules**: Uploads of product images must trigger async jobs to generate multiple sizes: `thumb` (200x200), `medium` (600x600), `large` (1200x1200).

## 3. Video Standards
- **Formats Allowed**: MP4.
- **Upload Limits**: Max 50MB per video.
- **Compression**: Must run through ffmpeg or a cloud transcoder for web optimization.

## 4. Document Standards
- **Formats Allowed**: PDF only (e.g., Seller KYC docs).
- **Upload Limits**: Max 10MB.

## 5. CDN & Cache Rules
- All public media must be served through a CDN (Cloudflare or AWS CloudFront).
- **Cache Rules**: Cache headers must be set to 1 year (`Cache-Control: public, max-age=31536000`). If an image changes, the filename/hash MUST change (Cache Busting).

## 6. Media Security Rules
- Sensitive documents (e.g., Seller KYC, Invoices) MUST NOT be public. They must be stored in a private bucket and served via signed URLs with strict expiry (e.g., 5 minutes) upon API request.
