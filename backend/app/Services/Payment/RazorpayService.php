<?php

namespace App\Services\Payment;

use Illuminate\Support\Facades\Http;
use Exception;

class RazorpayService
{
    protected string $keyId;
    protected string $keySecret;
    protected string $baseUrl = 'https://api.razorpay.com/v1';

    public function __construct()
    {
        $this->keyId = config('services.razorpay.key') ?? 'rzp_test_placeholder';
        $this->keySecret = config('services.razorpay.secret') ?? 'rzp_secret_placeholder';
    }

    /**
     * Create an order in Razorpay.
     */
    public function createOrder(string $receiptId, float $amountInINR): array
    {
        $response = Http::withBasicAuth($this->keyId, $this->keySecret)
            ->post("{$this->baseUrl}/orders", [
                'amount' => (int) ($amountInINR * 100), // Convert to paise
                'currency' => 'INR',
                'receipt' => $receiptId,
                'payment_capture' => 1,
            ]);

        if ($response->failed()) {
            throw new Exception('Razorpay order creation failed: ' . $response->body());
        }

        return $response->json();
    }

    /**
     * Verify payment signature.
     */
    public function verifySignature(string $razorpayOrderId, string $razorpayPaymentId, string $razorpaySignature): bool
    {
        $generatedSignature = hash_hmac('sha256', $razorpayOrderId . '|' . $razorpayPaymentId, $this->keySecret);

        return hash_equals($generatedSignature, $razorpaySignature);
    }
}
