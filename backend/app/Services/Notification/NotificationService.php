<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\User;
use App\Models\Notification as NotificationModel;
use App\Enums\NotificationChannel;

class NotificationService
{
    public function send(User $user, string $title, string $body, NotificationChannel $channel = NotificationChannel::InApp, array $data = []): void
    {
        if ($channel === NotificationChannel::InApp) {
            $this->createInAppNotification($user, $title, $body, $data);
        } elseif ($channel === NotificationChannel::Email) {
            // Logic to send email
        } elseif ($channel === NotificationChannel::Sms) {
            // Logic to send SMS
        } elseif ($channel === NotificationChannel::WhatsApp) {
            // Logic to send WhatsApp
        }
    }

    protected function createInAppNotification(User $user, string $title, string $body, array $data = []): NotificationModel
    {
        return NotificationModel::create([
            'user_id' => $user->id,
            'type' => 'general',
            'channel' => NotificationChannel::InApp->value,
            'title' => $title,
            'body' => $body,
            'data' => $data,
        ]);
    }
}
