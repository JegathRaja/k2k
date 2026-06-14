<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Models\ConsumerProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthLoginTest extends TestCase
{
    use RefreshDatabase;

    private function createConsumer(array $overrides = []): User
    {
        $user = User::factory()->create(array_merge([
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'password' => Hash::make('Test@1234!'),
            'status' => 'active',
        ], $overrides));

        ConsumerProfile::create(['user_id' => $user->id]);
        $user->assignRole('consumer');

        return $user;
    }

    public function test_consumer_can_login_with_valid_credentials(): void
    {
        $this->createConsumer();

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
            'password' => 'Test@1234!',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonStructure(['data' => ['user', 'token']]);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $this->createConsumer();

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
            'password' => 'WrongPassword!',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_fails_for_inactive_account(): void
    {
        $this->createConsumer(['status' => 'suspended']);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
            'password' => 'Test@1234!',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_updates_last_login_timestamp(): void
    {
        $user = $this->createConsumer();

        $this->assertNull($user->last_login_at);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
            'password' => 'Test@1234!',
        ]);

        $user->refresh();
        $this->assertNotNull($user->last_login_at);
    }

    public function test_authenticated_user_can_access_me_endpoint(): void
    {
        $user = $this->createConsumer();
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
                 ->assertJsonPath('data.email', 'test@example.com');
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = $this->createConsumer();
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->postJson('/api/v1/auth/logout');

        $response->assertStatus(200);
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
