# Generated by Django 2.0.7 on 2019-09-30 15:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paintings', '0021_auto_20190921_1932'),
    ]

    operations = [
        migrations.AlterField(
            model_name='painting',
            name='size_class',
            field=models.CharField(blank=True, choices=[('small', 'small'), ('medium', 'medium'), ('large', 'large')], default='', max_length=1, null=True),
        ),
    ]
