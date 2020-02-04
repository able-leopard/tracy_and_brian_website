"""
Django settings for t_and_b_website project.

Generated by 'django-admin startproject' using Django 2.0.7.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.0/ref/settings/
"""

"""
Things to change in production vs development:
1. Turn off debug via debug=False in production (will take care of this via my .env file)
2. Comment out the STATICFILES_DIRS while in development mode or it won't work
3. Set SECURE_SSL_REDIRECT = True in production. (will also handle this via env file)
   When switch back to development, turn it to False, comment out SECURE_PROXY_SSL_HEADER, and clear cached files in browser to make it work. 

* Remember all the environment variables are set via the .env file in development and set via heroku config when in production
"""

import os
import environ
import django_heroku 

# reading env files documentation:
# https://django-environ.readthedocs.io/en/latest/

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)

# reading .env file
environ.Env.read_env()


#BASE_DIR is where manage.py lives
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SETTINGS_PATH = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
# debug will be set to false if the env variable is anything other than 'True' (have to do it this way because value needs to be boolean instead of string)
DEBUG = (env('DEBUG_VALUE') == "True")

ALLOWED_HOSTS = ['127.0.0.1', 'testserver', 'mytracyandbrianapp.herokuapp.com', 't-and-b-website.herokuapp.com', 'http://tracyandbrianart.com/', 'https://tracyandbrianart.com/']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    #my own apps
    'corsheaders',
    'rest_framework',
    'paintings',
    'cart',
    'accounts',
    'billing',
    'addresses',
    'orders',
    'bio',
    'storages',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ORIGIN_ALLOW_ALL = True

ROOT_URLCONF = 't_and_b_website.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(SETTINGS_PATH, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 't_and_b_website.wsgi.application'

# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASE_PASSWORD = env('DATABASE_PASSWORD')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 't_and_b_website',
        'USER': 'postgres',
        'PASSWORD': DATABASE_PASSWORD,
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'staticfiles')

STATIC_URL = '/static/'

# full solution of dealing with the procfile here
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, 'staticfiles'), 
# ]

# comment this out on local
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

#MEDIA_ROOT is for directory for any media that our users upload
MEDIA_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'media_cdn')
MEDIA_URL = '/media_cdn/'


CORS_URLS_REGEX = r'^/api.*'
CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = (
    '*',
    'your-domain.com',
    'your-bucket-here.s3-us-west-2.amazonaws.com',
)

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
}

JWT_AUTH = {
    # Authorization:Token xxx
    'JWT_AUTH_HEADER_PREFIX': 'Token',
}

# django storages documentation:
# https://django-storages.readthedocs.io/en/latest/


STRIPE_SECRET_KEY = env('STRIPE_SECRET_KEY')


AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME')


AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = None


DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'


# this has to be commented out during development mode to see the static files
# django_heroku.settings(locals())

# forcing https instead of http

# SECURE_SSL_REDIRECT will be set to false if the env variable is anything other than 'True' (have to do it this way because value needs to be boolean instead of string)
# SECURE_SSL_REDIRECT = (env('SECURE_SSL_REDIRECT_VALUE') == "True")

#remember to commend this part out in development model
# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')