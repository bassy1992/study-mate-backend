# Custom migration to remove episode tables
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0007_episode_episodeprogress'),
    ]

    operations = [
        # Use raw SQL to drop the tables directly
        migrations.RunSQL(
            "DROP TABLE IF EXISTS courses_episodeprogress;",
            reverse_sql="-- Cannot reverse this operation"
        ),
        migrations.RunSQL(
            "DROP TABLE IF EXISTS courses_episode;",
            reverse_sql="-- Cannot reverse this operation"
        ),
    ]