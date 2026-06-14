<?php
$ch = curl_init('http://localhost:8000/api/v1/auth/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['email' => 'k2k-admin@gmail.com', 'password' => 'admin123']));
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
echo "Login HTTP: $httpcode\n";
$data = json_decode($response, true);
$token = $data['data']['token'] ?? null;

if ($token) {
    $ch2 = curl_init('http://localhost:8000/api/v1/auth/me');
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch2, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json', "Authorization: Bearer $token"]);
    $me_response = curl_exec($ch2);
    $me_httpcode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
    echo "Me HTTP: $me_httpcode\n";
    echo "Me Response: $me_response\n";
} else {
    echo "No token received\n";
}
