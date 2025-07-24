# Generated manually to add lesson video fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0008_remove_episode_tables'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='video_url',
            field=models.URLField(blank=True, help_text='YouTube, Vimeo, or other video platform URL'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='video_file',
            field=models.FileField(blank=True, help_text='Upload video file directly', null=True, upload_to='lesson_videos/'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='video_duration',
            field=models.IntegerField(default=0, help_text='Duration in seconds'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='video_thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='lesson_video_thumbnails/'),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='lesson_type',
            field=models.CharField(choices=[('video', 'Video'), ('text', 'Text'), ('interactive', 'Interactive'), ('quiz', 'Quiz')], default='video', max_length=20),
        ),
    ]