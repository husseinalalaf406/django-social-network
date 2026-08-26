from django.conf import settings
from django.db import models


class Profile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    bio = models.TextField(
        max_length=500,
        blank=True
    )

    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"