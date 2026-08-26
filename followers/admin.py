from django.contrib import admin

from .models import Follower


@admin.register(Follower)
class FollowerAdmin(admin.ModelAdmin):
    list_display = ("followed_by", "following")
    list_select_related = ("followed_by", "following")
