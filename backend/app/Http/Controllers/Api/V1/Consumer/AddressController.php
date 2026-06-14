<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Consumer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()->addresses()->latest()->get();
        return $this->successResponse($addresses, 'Addresses retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'label'     => 'nullable|string|max:50',
            'street'    => 'required|string',
            'city'      => 'required|string|max:100',
            'state'     => 'required|string|max:100',
            'pincode'   => 'required|string|max:10',
            'landmark'  => 'nullable|string',
            'is_default'=> 'boolean',
        ]);

        $user = $request->user();

        if (!empty($validated['is_default'])) {
            $user->addresses()->update(['is_default' => false]);
        }

        // First address is always default
        if ($user->addresses()->count() === 0) {
            $validated['is_default'] = true;
        }

        $address = $user->addresses()->create($validated);

        return $this->successResponse($address, 'Address saved', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $address = $request->user()->addresses()->findOrFail($id);

        $validated = $request->validate([
            'label'     => 'nullable|string|max:50',
            'street'    => 'sometimes|string',
            'city'      => 'sometimes|string|max:100',
            'state'     => 'sometimes|string|max:100',
            'pincode'   => 'sometimes|string|max:10',
            'landmark'  => 'nullable|string',
            'is_default'=> 'boolean',
        ]);

        if (!empty($validated['is_default'])) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address->update($validated);

        return $this->successResponse($address, 'Address updated');
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $address = $request->user()->addresses()->findOrFail($id);
        $address->delete();

        // Assign a new default if needed
        if ($address->is_default) {
            $request->user()->addresses()->latest()->first()?->update(['is_default' => true]);
        }

        return $this->successResponse(null, 'Address deleted');
    }
}
