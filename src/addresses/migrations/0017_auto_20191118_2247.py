# Generated by Django 2.0.7 on 2019-11-18 22:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('addresses', '0016_address_country'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='first_name',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
        migrations.AddField(
            model_name='address',
            name='last_name',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
    ]
