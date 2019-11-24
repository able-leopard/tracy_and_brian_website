"""painting_website URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import path, include, re_path

urlpatterns = [
    path('', TemplateView.as_view(template_name='react.html')),
    re_path(r'^paintings', TemplateView.as_view(template_name='react.html')),
    re_path(r'^checkout', TemplateView.as_view(template_name='react.html')),
    re_path(r'^bio', TemplateView.as_view(template_name='react.html')),
    path('admin/', admin.site.urls),
    path('api/paintings/', include('paintings.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/billing/', include('billing.urls')),
    path('api/account/', include('accounts.urls')),
    path('api/address/', include('addresses.urls')),
    path('api/bio/', include('bio.urls')),
    # re_path(r'^static/(?P.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]

#remember to include this if you want to show images
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
