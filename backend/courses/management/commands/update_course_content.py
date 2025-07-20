from django.core.management.base import BaseCommand
from courses.models import Course


class Command(BaseCommand):
    help = 'Update course learning objectives and prerequisites'

    def add_arguments(self, parser):
        parser.add_argument(
            '--course-slug',
            type=str,
            help='Update specific course by slug',
        )
        parser.add_argument(
            '--objectives',
            type=str,
            nargs='+',
            help='Learning objectives (space-separated)',
        )
        parser.add_argument(
            '--prerequisites',
            type=str,
            help='Prerequisites text',
        )

    def handle(self, *args, **options):
        course_slug = options.get('course_slug')
        objectives = options.get('objectives')
        prerequisites = options.get('prerequisites')

        if not course_slug:
            self.stdout.write(
                self.style.ERROR('Please provide a course slug with --course-slug')
            )
            return

        try:
            course = Course.objects.get(slug=course_slug)
            
            if objectives:
                course.learning_objectives = objectives
                self.stdout.write(
                    self.style.SUCCESS(f'Updated learning objectives for: {course.title}')
                )
            
            if prerequisites:
                course.prerequisites = prerequisites
                self.stdout.write(
                    self.style.SUCCESS(f'Updated prerequisites for: {course.title}')
                )
            
            if objectives or prerequisites:
                course.save()
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully updated course: {course.title}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING('No updates provided. Use --objectives or --prerequisites')
                )
                
        except Course.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'Course with slug "{course_slug}" not found')
            )