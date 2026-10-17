<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class PayPalService
{
    protected string $clientId;
    protected string $clientSecret;
    protected string $mode;
    protected string $currency;
    protected string $baseUrl;

    public function __construct()
    {
        $this->clientId = (string) config('services.paypal.client_id', '');
        $this->clientSecret = (string) config('services.paypal.client_secret', '');
        $this->mode = (string) config('services.paypal.mode', 'sandbox');
        $this->currency = (string) config('services.paypal.currency', 'USD');
        $this->baseUrl = $this->mode === 'live' 
            ? 'https://api-m.paypal.com' 
            : 'https://api-m.sandbox.paypal.com';
    }

    public function getClientId(): string
    {
        return $this->clientId;
    }

    public function getCurrency(): string
    {
        return $this->currency;
    }

    public function isConfigured(): bool
    {
        return !empty($this->clientId) && !empty($this->clientSecret);
    }

    /**
     * Get OAuth2 Access Token from PayPal
     */
    public function getAccessToken(): string
    {
        if (!$this->isConfigured()) {
            throw new Exception('PayPal credentials are not configured in environment.');
        }

        $response = Http::asForm()
            ->withBasicAuth($this->clientId, $this->clientSecret)
            ->post("{$this->baseUrl}/v1/oauth2/token", [
                'grant_type' => 'client_credentials',
            ]);

        if (!$response->successful()) {
            Log::error('PayPal Auth Failure: ' . $response->body());
            throw new Exception('Failed to authenticate with PayPal API: ' . $response->json('error_description', 'Unknown error'));
        }

        return $response->json('access_token');
    }

    /**
     * Create PayPal Checkout Order
     */
    public function createOrder(float $amount, string $referenceId, string $description = 'AT Loops Enterprise Order'): array
    {
        $token = $this->getAccessToken();

        $payload = [
            'intent' => 'CAPTURE',
            'purchase_units' => [
                [
                    'reference_id' => $referenceId,
                    'description' => substr($description, 0, 127),
                    'amount' => [
                        'currency_code' => $this->currency,
                        'value' => number_format($amount, 2, '.', ''),
                    ],
                ]
            ],
            'application_context' => [
                'brand_name' => 'AT Loops Enterprise',
                'landing_page' => 'NO_PREFERENCE',
                'user_action' => 'PAY_NOW',
                'shipping_preference' => 'NO_SHIPPING',
            ]
        ];

        $response = Http::withToken($token)
            ->withHeaders(['Prefer' => 'return=representation'])
            ->post("{$this->baseUrl}/v2/checkout/orders", $payload);

        if (!$response->successful()) {
            Log::error('PayPal Create Order Error: ' . $response->body());
            throw new Exception('PayPal failed to create order: ' . $response->json('message', 'Please check payment parameters'));
        }

        return $response->json();
    }

    /**
     * Capture Payment for an authorized PayPal Order
     */
    public function captureOrder(string $paypalOrderId): array
    {
        $token = $this->getAccessToken();

        $response = Http::withToken($token)
            ->withHeaders([
                'Content-Type' => 'application/json',
                'Prefer' => 'return=representation',
            ])
            ->post("{$this->baseUrl}/v2/checkout/orders/{$paypalOrderId}/capture", new \stdClass());

        if (!$response->successful()) {
            Log::error('PayPal Capture Error: ' . $response->body());
            throw new Exception('PayPal capture failed: ' . $response->json('message', 'Unable to capture transaction'));
        }

        return $response->json();
    }
}
