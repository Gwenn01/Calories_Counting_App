from django.contrib.auth.models import User
from macros.services import MacrosService

def run():
    user = User.objects.first()
    macros = MacrosService.upsert_today_macros(user.id)
    print(macros)
