<?php

namespace App\Http\Controllers\Api\V1\Webhook;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class RazorpayWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->all();
        $signature = $request->header('X-Razorpay-Signature');

        if (!$this->verifySignature($request->getContent(), $signature)) {
            Log::warning('Razorpay webhook invalid signature', ['payload' => $payload]);
            return response()->json(['status' => 'invalid signature'], 400);
        }

        $event = $payload['event'] ?? '';

        if ($event === 'payment.captured') {
            $paymentEntity = $payload['payload']['payment']['entity'];
            $orderId = $paymentEntity['notes']['order_id'] ?? null;
            
            if ($orderId) {
                // Update internal Payment status
                Payment::where('transaction_id', $paymentEntity['order_id'])
                       ->update([
                           'status' => 'COMPLETED', 
                           'payment_method' => $paymentEntity['method']
                       ]);
                
                Log::info("Payment captured for order {$orderId}");
            }
        } elseif ($event === 'payment.failed') {
            $paymentEntity = $payload['payload']['payment']['entity'];
            $orderId = $paymentEntity['notes']['order_id'] ?? null;
            
            if ($orderId) {
                Payment::where('transaction_id', $paymentEntity['order_id'])
                       ->update(['status' => 'FAILED']);
                Log::error("Payment failed for order {$orderId}");
            }
        }

        return response()->json(['status' => 'success']);
    }

    private function verifySignature(string $payload, ?string $signature): bool
    {
        if (!$signature) return false;
        
        $secret = config('services.razorpay.webhook_secret') ?? 'rzp_test_placeholder';
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        return hash_equals($expectedSignature, $signature);
    }
}
