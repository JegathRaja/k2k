<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\VisitorAnalytics;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class VisitorTrackingMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only track successful GET requests to prevent bloating DB with errors/POSTs
        if ($request->isMethod('GET') && $response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            
            // In a stateless Sanctum API, session ID might not exist automatically,
            // so we generate/read from a custom header or fallback.
            $sessionId = $request->header('X-Visitor-Session', Session::getId());
            $ipHash = hash('sha256', $request->ip());
            $userAgent = $request->userAgent();
            $deviceType = $this->determineDeviceType($userAgent);
            $userId = auth('sanctum')->id();
            
            // Only insert once per session per day to avoid spam
            $exists = VisitorAnalytics::where('session_id', $sessionId)
                ->whereDate('visit_date', today())
                ->exists();

            if (!$exists) {
                VisitorAnalytics::create([
                    'session_id' => $sessionId,
                    'ip_hash' => $ipHash,
                    'user_agent' => $userAgent,
                    'device_type' => $deviceType,
                    'visit_date' => today(),
                    'user_id' => $userId,
                    'is_registered' => $userId !== null,
                ]);
            }
            
            // If the user is authenticated and is a consumer, update their profile
            if ($userId) {
                $user = auth('sanctum')->user();
                if ($user->consumerProfile) {
                    $user->consumerProfile->update(['last_visit_at' => now()]);
                }
            }
        }

        return $response;
    }

    private function determineDeviceType(?string $userAgent): string
    {
        if (!$userAgent) return 'unknown';
        
        $userAgent = strtolower($userAgent);
        
        if (str_contains($userAgent, 'mobile') || str_contains($userAgent, 'android') || str_contains($userAgent, 'iphone')) {
            return 'mobile';
        }
        
        if (str_contains($userAgent, 'tablet') || str_contains($userAgent, 'ipad')) {
            return 'tablet';
        }
        
        return 'desktop';
    }
}
