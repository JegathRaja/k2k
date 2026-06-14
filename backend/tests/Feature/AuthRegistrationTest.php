<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Models\ConsumerProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_consumer_can_register_with_valid_data(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'password' => 'Test@1234!',
            'password_confirmation' => 'Test@1234!',
            'contact_number' => '9876543210',
            'district' => 'Chennai',
            'pincode' => '600001',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);

        $this->assertDatabaseHas('users', ['email' => 'john.doe@example.com', 'first_name' => 'John']);
        $this->assertDatabaseHas('consumer_profiles', [
            'user_id' => User::where('email', 'john.doe@example.com')->first()->id,
        ]);
    }

    public function test_registration_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'john.doe@example.com']);

        $response = $this->postJson('/api/v1/auth/register', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'password' => 'Test@1234!',
            'password_confirmation' => 'Test@1234!',
            'contact_number' => '9876543210',
            'district' => 'Chennai',
            'pincode' => '600001',
        ]);

        $response->assertStatus(422);
    }

    public function test_registration_fails_with_weak_password(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'contact_number' => '9876543210',
            'district' => 'Chennai',
            'pincode' => '600001',
        ]);

        $response->assertStatus(422);
    }

    public function test_registration_fails_with_missing_required_fields(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'email' => 'john.doe@example.com',
        ]);

        $response->assertStatus(422);
    }
}
