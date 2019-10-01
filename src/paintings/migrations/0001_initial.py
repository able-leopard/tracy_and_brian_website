# Generated by Django 2.0.7 on 2019-09-17 00:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Painting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='', max_length=255)),
                ('slug', models.SlugField(blank=True, null=True)),
                ('style', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('description', models.TextField(blank=True, default='', null=True)),
                ('size', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('artist', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('price', models.DecimalField(blank=True, decimal_places=2, max_digits=20, null=True)),
                ('available', models.BooleanField(default=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-timestamp', '-updated'],
            },
        ),
    ]
