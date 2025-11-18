FROM php:8.2-fpm

# Arguments
ARG user=immo
ARG uid=1000

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libicu-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmagickwand-dev \
    libwebp-dev \
    libpq-dev \
    postgresql-client \
    jpegoptim optipng pngquant gifsicle \
    vim \
    nano \
    supervisor

# Nettoyage du cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Installation des extensions PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
    pdo_pgsql \
    pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
    opcache

# Installation de Redis
RUN pecl install redis && docker-php-ext-enable redis

# Installation d'Imagick
RUN pecl install imagick && docker-php-ext-enable imagick

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Création de l'utilisateur système
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Configuration PHP
COPY local.ini /usr/local/etc/php/conf.d/local.ini

# Définir le répertoire de travail
WORKDIR /var/www

# Changer l'utilisateur
USER $user

# Exposer le port
EXPOSE 9000

CMD ["php-fpm"]
