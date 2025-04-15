<?php
// Include required files
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/User.php';

class Auth {
    // Generate JWT Token
    public static function generateToken($userId, $email, $userType) {
        $secret_key = "YOUR_SECRET_KEY";  // Change this to a secure key in production
        $issuer = "job_portal_api";  // Issuer name
        $audience = "job_portal_users";  // Audience
        $issuedAt = time();  // Issued at: current time
        $notBefore = $issuedAt;  // Valid not before
        $expire = $issuedAt + (60 * 60 * 24);  // Expires in 24 hours
        
        // Token payload
        $payload = [
            "iss" => $issuer,
            "aud" => $audience,
            "iat" => $issuedAt,
            "nbf" => $notBefore,
            "exp" => $expire,
            "data" => [
                "id" => $userId,
                "email" => $email,
                "userType" => $userType
            ]
        ];
        
        // Encode JWT Token
        $jwt = self::encodeJWT($payload, $secret_key);
        
        return $jwt;
    }
    
    // Verify JWT Token
    public static function validateToken() {
        // Get all headers
        $headers = getallheaders();
        
        // Get authorization header
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        // Check if authorization header exists
        if (!$authHeader) {
            return false;
        }
        
        // Extract the token
        $arr = explode(" ", $authHeader);
        $jwt = isset($arr[1]) ? $arr[1] : '';
        
        if (!$jwt) {
            return false;
        }
        
        try {
            $secret_key = "YOUR_SECRET_KEY";  // Change this to a secure key in production
            $payload = self::decodeJWT($jwt, $secret_key);
            
            if ($payload && isset($payload['data']['id'])) {
                return $payload['data'];
            }
            
            return false;
        } catch (Exception $e) {
            return false;
        }
    }
    
    // Encode JWT
    private static function encodeJWT($payload, $secret) {
        // Create header
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ]);
        
        // Encode Header
        $base64UrlHeader = self::base64UrlEncode($header);
        
        // Encode Payload
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));
        
        // Create Signature Hash
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        
        // Encode Signature to Base64Url
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        // Create JWT
        $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
        
        return $jwt;
    }
    
    // Decode JWT
    private static function decodeJWT($jwt, $secret) {
        // Split token
        $tokenParts = explode('.', $jwt);
        
        if (count($tokenParts) != 3) {
            throw new Exception("Invalid token format");
        }
        
        $header = base64_decode($tokenParts[0]);
        $payload = json_decode(base64_decode($tokenParts[1]), true);
        $signatureProvided = $tokenParts[2];
        
        // Verify expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception("Token expired");
        }
        
        // Verify signature
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = $tokenParts[1];
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        if ($base64UrlSignature !== $signatureProvided) {
            throw new Exception("Invalid token signature");
        }
        
        return $payload;
    }
    
    // Base64Url encode
    private static function base64UrlEncode($data) {
        $base64 = base64_encode($data);
        $base64Url = strtr($base64, '+/', '-_');
        return rtrim($base64Url, '=');
    }
}
?>