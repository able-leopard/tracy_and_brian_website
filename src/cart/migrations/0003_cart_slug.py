# Generated by Django 2.0.7 on 2019-10-26 12:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0002_cart_shipping'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='slug',
            field=models.SlugField(blank=True, null=True),
        ),
    ]
