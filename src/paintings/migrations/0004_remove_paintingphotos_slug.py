# Generated by Django 2.0.7 on 2019-09-17 15:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('paintings', '0003_paintingphotos_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='paintingphotos',
            name='slug',
        ),
    ]
