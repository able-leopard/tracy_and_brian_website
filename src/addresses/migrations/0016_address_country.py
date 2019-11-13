# Generated by Django 2.0.7 on 2019-11-13 17:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('addresses', '0015_remove_address_country'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='country',
            field=models.CharField(blank=True, choices=[('Canada', 'Canada'), ('United States', 'United States')], max_length=120, null=True),
        ),
    ]
