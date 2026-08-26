from django.conf import settings
from django.db import models


class Follower(models.Model):

    followed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="following",
    )

    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="followers",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["followed_by", "following"],
                name="unique_follow_relationship",
            )
        ]

    def __str__(self):
        return f"{self.followed_by.username} is following {self.following.username}"
