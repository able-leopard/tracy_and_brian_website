# Generated by Django 2.0.7 on 2019-09-17 16:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('paintings', '0008_auto_20190917_1608'),
    ]

    operations = [
        migrations.RenameField(
            model_name='paintingphotos',
            old_name='image',
            new_name='photo',
        ),
    ]
