from django.conf import settings
from django.db import models

from feed.models import Post, Comment


class Notification(models.Model):

    LIKE = "like"
    COMMENT = "comment"
    FOLLOW = "follow"

    NOTIFICATION_TYPES = [
        (LIKE, "Like"),
        (COMMENT, "Comment"),
        (FOLLOW, "Follow"),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_notifications",
    )

    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES,
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications",
    )

    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications",
    )

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.sender.username} "
            f"→ {self.recipient.username} "
            f"({self.notification_type})"
        )
