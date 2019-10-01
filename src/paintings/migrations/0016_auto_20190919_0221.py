# Generated by Django 2.0.7 on 2019-09-19 02:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paintings', '0015_auto_20190917_2223'),
    ]

    operations = [
        migrations.RenameField(
            model_name='painting',
            old_name='size',
            new_name='size_class',
        ),
        migrations.AddField(
            model_name='painting',
            name='size_measurements',
            field=models.CharField(blank=True, default='', max_length=255, null=True),
        ),
    ]
