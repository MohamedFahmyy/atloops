<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\PayPalService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Exception;

class PaymentController extends Controller
{
    protected PayPalService $paypal;

    public function __construct(PayPalService $paypal)
    {
        $this->paypal = $paypal;
    }

    /**
     * Get Public PayPal Configuration
     */
    public function getPayPalConfig(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'client_id' => $this->paypal->getClientId(),
                'currency' => $this->paypal->getCurrency(),
                'is_configured' => $this->paypal->isConfigured(),
            ]
        ]);
    }

    /**
     * Initialize Checkout & Create PayPal Order
     */
    public function createPayPalOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'nullable|exists:products,id',
            'customer_name' => 'required|string|max:150',
            'customer_email' => 'required|email|max:150',
            'customer_phone' => 'nullable|string|max:30',
            'amount' => 'nullable|numeric|min:1',
            'notes' => 'nullable|string|max:500',
        ]);

        $product = null;
        $amount = (float) ($validated['amount'] ?? 0);

        if (!empty($validated['product_id'])) {
            $product = Product::findOrFail($validated['product_id']);
            if ($amount <= 0 && $product->price > 0) {
                $amount = (float) $product->price;
            }
        }

        if ($amount <= 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid order amount. Amount must be greater than zero.',
            ], 422);
        }

        $orderNumber = 'ATL-' . date('Ymd') . '-' . strtoupper(Str::random(5));
        $description = $product 
            ? "AT Loops - {$product->name_en} ({$orderNumber})" 
            : "AT Loops Enterprise Software ({$orderNumber})";

        try {
            // 1. Create order record in Database
            $order = Order::create([
                'order_number' => $orderNumber,
                'product_id' => $product?->id,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'] ?? null,
                'amount' => $amount,
                'currency' => $this->paypal->getCurrency(),
                'payment_gateway' => 'paypal',
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            // 2. Call PayPal API to generate PayPal Order ID
            $paypalOrder = $this->paypal->createOrder($amount, $orderNumber, $description);
            $paypalOrderId = $paypalOrder['id'] ?? null;

            if (!$paypalOrderId) {
                throw new Exception('PayPal did not return a valid order ID');
            }

            // 3. Update order with PayPal Order ID
            $order->update([
                'gateway_order_id' => $paypalOrderId,
            ]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'paypal_order_id' => $paypalOrderId,
                    'amount' => $order->amount,
                    'currency' => $order->currency,
                ]
            ]);

        } catch (Exception $e) {
            Log::error('PayPal Order Creation Failed: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Capture PayPal Payment once authorized by user in frontend
     */
    public function capturePayPalOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'paypal_order_id' => 'required|string',
        ]);

        $order = Order::findOrFail($validated['order_id']);

        if ($order->status === 'completed') {
            return response()->json([
                'status' => 'success',
                'message' => 'Order is already marked as completed.',
                'data' => $order,
            ]);
        }

        try {
            $captureResult = $this->paypal->captureOrder($validated['paypal_order_id']);
            $captureStatus = $captureResult['status'] ?? 'UNKNOWN';

            if ($captureStatus === 'COMPLETED') {
                $captures = $captureResult['purchase_units'][0]['payments']['captures'] ?? [];
                $captureId = !empty($captures) ? $captures[0]['id'] : null;

                $order->update([
                    'status' => 'completed',
                    'gateway_capture_id' => $captureId,
                    'payment_payload' => $captureResult,
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Payment authorized and captured successfully.',
                    'data' => [
                        'order_number' => $order->order_number,
                        'customer_name' => $order->customer_name,
                        'customer_email' => $order->customer_email,
                        'amount' => $order->amount,
                        'currency' => $order->currency,
                        'status' => $order->status,
                        'capture_id' => $captureId,
                    ]
                ]);
            }

            $order->update([
                'status' => 'failed',
                'payment_payload' => $captureResult,
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Payment capture was not completed by PayPal. Status: ' . $captureStatus,
                'data' => $captureResult,
            ], 400);

        } catch (Exception $e) {
            Log::error('PayPal Capture Exception: ' . $e->getMessage());

            $order->update([
                'status' => 'failed',
                'notes' => 'Capture error: ' . $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Payment processing failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
