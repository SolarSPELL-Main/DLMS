# Generated by Django 2.1.3 on 2019-12-20 22:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content_management', '0034_remove_content_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='active',
            field=models.SmallIntegerField(default=1),
        ),
    ]