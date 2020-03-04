# Generated by Django 2.1.3 on 2020-02-12 19:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content_management', '0038_auto_20200124_1342'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='content',
            name='coverage',
        ),
        migrations.RemoveField(
            model_name='content',
            name='source',
        ),
        migrations.RemoveField(
            model_name='content',
            name='workareas',
        ),
        migrations.RemoveField(
            model_name='directory',
            name='coverages',
        ),
        migrations.RemoveField(
            model_name='directory',
            name='coverages_need_all',
        ),
        migrations.RemoveField(
            model_name='directory',
            name='workareas',
        ),
        migrations.RemoveField(
            model_name='directory',
            name='workareas_need_all',
        ),
        migrations.AddField(
            model_name='content',
            name='resource_type',
            field=models.CharField(max_length=2000, null=True),
        ),
        migrations.DeleteModel(
            name='Coverage',
        ),
        migrations.DeleteModel(
            name='Workarea',
        ),
    ]