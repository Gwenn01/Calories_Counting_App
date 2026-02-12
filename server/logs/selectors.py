from .models import DailyLog
from .serializers import LogSerializer

class LogSelectors:
    ...
    
    @staticmethod
    def format_daily_logs(user, date):
        logs = (
            DailyLog.objects
            .filter(user=user, created_at=date)
            .select_related("food")   
            .order_by("created_at")
        )

        data = {
            "date": date,
            "breakfast": [],
            "lunch": [],
            "dinner": [],
            "snacks": [],
        }

        for log in logs:
            data[log.meal_type].append(LogSerializer(log).data)
        
        return data
        