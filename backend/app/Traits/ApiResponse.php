<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

trait ApiResponse
{
    /**
     * Send a successful JSON response.
     */
    protected function success(
        mixed $data = null,
        string $message = 'Success',
        int $statusCode = 200,
        ?array $pagination = null,
    ): JsonResponse {
        return response()->json([
            'success'    => true,
            'message'    => $message,
            'data'       => $data,
            'pagination' => $pagination,
            'meta'       => $this->buildMeta(),
        ], $statusCode);
    }

    /**
     * Alias for success() — used by Auth, Marketplace, and Admin controllers.
     */
    protected function successResponse(
        mixed $data = null,
        string $message = 'Success',
        int $statusCode = 200,
    ): JsonResponse {
        return $this->success($data, $message, $statusCode);
    }

    /**
     * Send a created resource response (201).
     */
    protected function created(mixed $data = null, string $message = 'Resource created successfully'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    /**
     * Send a no-content response (204).
     */
    protected function noContent(): JsonResponse
    {
        return response()->json(null, 204);
    }

    /**
     * Send an error JSON response.
     */
    protected function error(
        string $message = 'An error occurred',
        int $statusCode = 400,
        ?array $errors = null,
        ?string $errorCode = null,
    ): JsonResponse {
        $body = [
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
            'meta'    => $this->buildMeta($errorCode),
        ];

        return response()->json($body, $statusCode);
    }

    /**
     * Alias for error() — used by Auth, Search controllers.
     */
    protected function errorResponse(
        string $message = 'An error occurred',
        int $statusCode = 400,
        ?array $errors = null,
    ): JsonResponse {
        return $this->error($message, $statusCode, $errors);
    }

    /**
     * Send a validation error response (422).
     */
    protected function validationError(array $errors, string $message = 'Validation failed'): JsonResponse
    {
        return $this->error($message, 422, $errors, 'VAL_001');
    }

    /**
     * Send a not found response (404).
     */
    protected function notFound(string $message = 'Resource not found'): JsonResponse
    {
        return $this->error($message, 404);
    }

    /**
     * Send an unauthorized response (401).
     */
    protected function unauthorized(string $message = 'Unauthenticated', string $errorCode = 'AUTH_002'): JsonResponse
    {
        return $this->error($message, 401, null, $errorCode);
    }

    /**
     * Send a forbidden response (403).
     */
    protected function forbidden(string $message = 'Access denied'): JsonResponse
    {
        return $this->error($message, 403);
    }

    /**
     * Build pagination array from a paginator.
     */
    protected function buildPagination(mixed $paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'per_page'     => $paginator->perPage(),
            'total'        => $paginator->total(),
            'last_page'    => $paginator->lastPage(),
            'from'         => $paginator->firstItem(),
            'to'           => $paginator->lastItem(),
            'next_page_url'=> $paginator->nextPageUrl(),
            'prev_page_url'=> $paginator->previousPageUrl(),
        ];
    }

    /**
     * Send a paginated response.
     */
    protected function paginated(
        mixed $paginator,
        mixed $data,
        string $message = 'Data fetched successfully',
    ): JsonResponse {
        return $this->success($data, $message, 200, $this->buildPagination($paginator));
    }

    /**
     * Build the meta block for every response.
     */
    private function buildMeta(?string $errorCode = null): array
    {
        $meta = [
            'version'    => '1.0',
            'timestamp'  => now()->toIso8601ZuluString(),
            'request_id' => request()->header('X-Request-ID', (string) Str::uuid()),
        ];

        if ($errorCode !== null) {
            $meta['error_code'] = $errorCode;
        }

        return $meta;
    }
}
