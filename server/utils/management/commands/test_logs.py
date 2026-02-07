from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from foods.models import Food
from logs.services import FoodLogService

class Command(BaseCommand):
    help = "Test food log service logic"

    def handle(self, *args, **kwargs):
        user = User.objects.get(id=1)

        # Create a new food log
        logs = FoodLogService.get_daily_logs(user=user)
        data = {
            "calories": 0
        }
        for log in logs:
            data["calories"] += log["food_details"]["calories"] * log["quantity"]
            

        
        self.stdout.write(str(data))