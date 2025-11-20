# 🔐 VARIABLES D'ENVIRONNEMENT - Immo Guinée

## Variables à ajouter dans `.env`

### Base de données
```env
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=immoguinee
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

### Application
```env
APP_NAME="Immo Guinée"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost
```

### Mobile Money - Orange Money
```env
ORANGE_MONEY_API_KEY=
ORANGE_MONEY_MERCHANT_KEY=
ORANGE_MONEY_MERCHANT_ID=
ORANGE_MONEY_API_URL=https://api.orange.com/orange-money-webpay/gu/v1
```

### Mobile Money - MTN Mobile Money
```env
MTN_MONEY_API_KEY=
MTN_MONEY_SUBSCRIPTION_KEY=
MTN_MONEY_API_URL=https://sandbox.momodeveloper.mtn.com
MTN_MONEY_ENVIRONMENT=sandbox
```

### SMS Gateway
```env
SMS_PROVIDER=orange
ORANGE_SMS_API_KEY=
MTN_SMS_API_KEY=
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM=
```

### n8n (Agents IA)
```env
N8N_WEBHOOK_SECRET=your_secret_key_here
N8N_URL=http://localhost:5678
```

### Mail (Optionnel)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@immoguinee.gn
MAIL_FROM_NAME="${APP_NAME}"
```

### Queue (Pour jobs asynchrones)
```env
QUEUE_CONNECTION=database
```

### Cache
```env
CACHE_DRIVER=redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

---

## 📝 NOTES

- Les clés API Orange Money et MTN doivent être obtenues auprès des opérateurs
- Pour le développement, vous pouvez utiliser des valeurs de test
- En production, utilisez des secrets forts pour `N8N_WEBHOOK_SECRET`

