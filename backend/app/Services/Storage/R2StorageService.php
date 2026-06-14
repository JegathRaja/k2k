<?php

declare(strict_types=1);

namespace App\Services\Storage;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class R2StorageService
{
    protected string $disk = 's3'; // configured for R2

    public function uploadImage(UploadedFile $file, string $path = 'images'): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $fullPath = $path . '/' . $filename;

        Storage::disk($this->disk)->put($fullPath, file_get_contents($file->getRealPath()));

        return Storage::disk($this->disk)->url($fullPath);
    }

    public function deleteImage(string $url): bool
    {
        $path = $this->getPathFromUrl($url);
        
        if ($path) {
            return Storage::disk($this->disk)->delete($path);
        }

        return false;
    }

    protected function getPathFromUrl(string $url): ?string
    {
        $baseUrl = config('filesystems.disks.s3.url');
        if (str_starts_with($url, $baseUrl)) {
            return str_replace($baseUrl . '/', '', $url);
        }
        return null;
    }
}
