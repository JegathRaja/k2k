<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Traits\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    use ApiResponse;

    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->renderable(function (Throwable $e, $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return $this->handleApiException($e);
            }
        });
    }

    protected function handleApiException(Throwable $e)
    {
        if ($e instanceof ValidationException) {
            return $this->validationError($e->errors(), $e->getMessage());
        }

        if ($e instanceof AuthenticationException) {
            return $this->unauthorized($e->getMessage());
        }

        if ($e instanceof AccessDeniedHttpException) {
            return $this->forbidden($e->getMessage());
        }

        if ($e instanceof NotFoundHttpException) {
            return $this->notFound('Resource not found.');
        }

        if ($e instanceof TooManyRequestsHttpException) {
            return $this->error('Rate limit exceeded', 429, null, 'RATE_001');
        }

        // Default 500 for other exceptions in production, show details in local
        $message = config('app.debug') ? $e->getMessage() : 'Server Error';
        $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;

        return $this->error($message, $statusCode);
    }
}
