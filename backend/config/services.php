<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'orange_money' => [
        'api_key' => env('ORANGE_MONEY_API_KEY'),
        'merchant_key' => env('ORANGE_MONEY_MERCHANT_KEY'),
        'merchant_id' => env('ORANGE_MONEY_MERCHANT_ID'),
        'api_url' => env('ORANGE_MONEY_API_URL', 'https://api.orange.com/orange-money-webpay/gu/v1'),
    ],

    'mtn_money' => [
        'api_key' => env('MTN_MONEY_API_KEY'),
        'subscription_key' => env('MTN_MONEY_SUBSCRIPTION_KEY'),
        'api_url' => env('MTN_MONEY_API_URL', 'https://sandbox.momodeveloper.mtn.com'),
        'environment' => env('MTN_MONEY_ENVIRONMENT', 'sandbox'), // sandbox ou production
    ],

    'sms' => [
        'provider' => env('SMS_PROVIDER', 'orange'), // orange, mtn, twilio
        'orange_api_key' => env('ORANGE_SMS_API_KEY'),
        'mtn_api_key' => env('MTN_SMS_API_KEY'),
        'twilio_sid' => env('TWILIO_SID'),
        'twilio_token' => env('TWILIO_AUTH_TOKEN'),
        'twilio_from' => env('TWILIO_FROM'),
    ],

    'n8n' => [
        'secret' => env('N8N_WEBHOOK_SECRET'),
        'url' => env('N8N_URL', 'http://localhost:5678'),
    ],

];
