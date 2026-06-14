<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadService
{
    /**
     * Stub for R2 / S3 upload. Currently saves to local public storage to ensure it works without credentials.
     * Ready to be swapped to 'r2' disk when credentials are provided.
     */
    public function uploadProductImage(UploadedFile $file): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        // Fallback to local storage for Phase 4 validation.
        $path = $file->storeAs('products', $filename, 'public');
        
        return Storage::disk('public')->url($path);
    }

    public function deleteImage(string $url): void
    {
        $path = str_replace(Storage::disk('public')->url(''), '', $url);
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
