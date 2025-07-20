from django.core.management.base import BaseCommand
from courses.models import Course
from ecommerce.models import Bundle


class Command(BaseCommand):
    help = 'Add preview videos to courses and bundles'

    def add_arguments(self, parser):
        parser.add_argument(
            '--course-id',
            type=int,
            help='Add preview video to specific course ID',
        )
        parser.add_argument(
            '--bundle-id',
            type=int,
            help='Add preview video to specific bundle ID',
        )
        parser.add_argument(
            '--video-url',
            type=str,
            help='Video URL to add',
        )
        parser.add_argument(
            '--duration',
            type=int,
            default=180,
            help='Video duration in seconds (default: 180)',
        )

    def handle(self, *args, **options):
        video_url = options.get('video_url')
        duration = options.get('duration')
        course_id = options.get('course_id')
        bundle_id = options.get('bundle_id')

        if not video_url:
            self.stdout.write(
                self.style.ERROR('Please provide a video URL with --video-url')
            )
            return

        if course_id:
            try:
                course = Course.objects.get(id=course_id)
                course.preview_video_url = video_url
                course.preview_video_duration = duration
                course.save()
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Successfully added preview video to course: {course.title}'
                    )
                )
            except Course.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Course with ID {course_id} not found')
                )

        elif bundle_id:
            try:
                bundle = Bundle.objects.get(id=bundle_id)
                bundle.preview_video_url = video_url
                bundle.preview_video_duration = duration
                bundle.save()
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Successfully added preview video to bundle: {bundle.title}'
                    )
                )
            except Bundle.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Bundle with ID {bundle_id} not found')
                )

        else:
            self.stdout.write(
                self.style.ERROR('Please specify either --course-id or --bundle-id')
            )