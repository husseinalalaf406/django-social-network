from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile

# 1. Listen for whenever a User object runs its post_save method
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Automated Listener:
    Fires automatically every time a User instance is saved.
    """
    # 2. Only run if this is a BRAND NEW user (created == True)
    if created:
        # 3. Create the linked profile automatically
        Profile.objects.create(user=instance)