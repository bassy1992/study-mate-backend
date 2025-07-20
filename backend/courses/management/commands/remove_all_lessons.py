from django.core.management.base import BaseCommand
from courses.models import Lesson, LessonContent, LessonProgress
from django.db import transaction


class Command(BaseCommand):
    help = 'Remove all lessons from the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm that you want to delete all lessons',
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(
                self.style.WARNING(
                    'This will delete ALL lessons from the database. '
                    'Use --confirm to proceed.'
                )
            )
            return

        try:
            with transaction.atomic():
                # Count existing records
                lesson_count = Lesson.objects.count()
                content_count = LessonContent.objects.count()
                progress_count = LessonProgress.objects.count()

                self.stdout.write(f'Found {lesson_count} lessons')
                self.stdout.write(f'Found {content_count} lesson contents')
                self.stdout.write(f'Found {progress_count} lesson progress records')

                # Delete all lesson-related data
                LessonProgress.objects.all().delete()
                self.stdout.write(
                    self.style.SUCCESS(f'Deleted {progress_count} lesson progress records')
                )

                LessonContent.objects.all().delete()
                self.stdout.write(
                    self.style.SUCCESS(f'Deleted {content_count} lesson contents')
                )

                Lesson.objects.all().delete()
                self.stdout.write(
                    self.style.SUCCESS(f'Deleted {lesson_count} lessons')
                )

                self.stdout.write(
                    self.style.SUCCESS('Successfully removed all lessons from the database!')
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error removing lessons: {str(e)}')
            )