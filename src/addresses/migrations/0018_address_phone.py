# Generated by Django 2.0.7 on 2019-11-18 23:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('addresses', '0017_auto_20191118_2247'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='phone',
            field=models.CharField(blank=True, max_length=12, null=True),
        ),
    ]