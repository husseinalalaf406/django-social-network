from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from profiles import views

app_name = "profiles"
urlpatterns = [    
    path(
        "follow/",
        views.FollowView.as_view(),
        name="follow",
    ),
path(
    "account/",
    views.AccountSettingsView.as_view(),
    name="account",
),
   path(
        "<str:username>/",
        views.ProfileDetailView.as_view(),
        name="detail"
    ),
path(
    "<str:username>/followers/",
    views.FollowersListView.as_view(),
    name="followers",
),

path(
    "<str:username>/following/",
    views.FollowingListView.as_view(),
    name="following",
),
]

