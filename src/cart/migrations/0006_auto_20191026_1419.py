# Generated by Django 2.0.7 on 2019-10-26 14:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0005_cart_session'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cart',
            name='session',
        ),
        migrations.AddField(
            model_name='cart',
            name='session_key',
            field=models.CharField(max_length=40, null=True),
        ),
    ]
