from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView

from .models import Notification


class NotificationListView(LoginRequiredMixin, ListView):

    model = Notification
    template_name = "notifications/notifications.html"
    context_object_name = "notifications"

    def get_queryset(self):

        queryset = Notification.objects.filter(
            recipient=self.request.user
        ).select_related(
            "sender",
            "post",
            "comment",
        ).order_by(
            "-created_at"
        )

        # Mark all user's unread notifications as read
        Notification.objects.filter(
            recipient=self.request.user,
            is_read=False
        ).update(
            is_read=True
        )

        return queryset