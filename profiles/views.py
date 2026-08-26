from django.contrib.auth import get_user_model
from django.views.generic import DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.views import View
from django.views.generic import ListView
from notifications.models import Notification
from followers.models import Follower
from feed.models import Post
from django.contrib.auth import update_session_auth_hash
from .forms import (
    AccountUpdateForm,
    ProfileUpdateForm,
    StyledPasswordChangeForm,
)
from django.contrib.auth import get_user_model
from django.views.generic import ListView

User = get_user_model()
from django.shortcuts import render, redirect
from django.contrib import messages

from .forms import AccountUpdateForm, ProfileUpdateForm
User = get_user_model()


class ProfileDetailView(DetailView):
    model = User

    template_name = "profiles/detail.html"

    context_object_name = "profile_user"

    slug_field = "username"

    slug_url_kwarg = "username"

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .select_related("profile")
            .prefetch_related("posts")
        )
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        liked_posts = set()

        if self.request.user.is_authenticated:

            context["you_follow"] = Follower.objects.filter(
                followed_by=self.request.user,
                following=self.object,
            ).exists()
            liked_posts = set(
                            self.request.user.likes.values_list(
                                "post_id",
                                flat=True
                            )
                        )

        else:
            context["you_follow"] = False

        context["liked_posts"] = liked_posts
        return context

   



class FollowView(LoginRequiredMixin, View):

    def post(self, request, *args, **kwargs):

        action = request.POST.get("action")
        username = request.POST.get("username")

        if not action or not username:
            return JsonResponse(
                {
                    "success": False,
                    "error": "Missing action or username.",
                },
                status=400,
            )

        try:
            other_user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse(
                {
                    "success": False,
                    "error": "User does not exist.",
                },
                status=400,
            )

        if other_user == request.user:
            return JsonResponse(
                {
                    "success": False,
                    "error": "You cannot follow yourself.",
                },
                status=400,
            )

        if action == "follow":

         follower, created = Follower.objects.get_or_create(
        followed_by=request.user,
        following=other_user,
    )

         if created:
          Notification.objects.create(
            recipient=other_user,
            sender=request.user,
            notification_type=Notification.FOLLOW,
        )

          return JsonResponse(
        {
            "success": True,
            "wording": "Unfollow",
        }
    )

        elif action == "unfollow":

            Follower.objects.filter(
                followed_by=request.user,
                following=other_user,
            ).delete()

            return JsonResponse(
                {
                    "success": True,
                    "wording": "Follow",
                }
            )

        return JsonResponse(
            {
                "success": False,
                "error": "Invalid action.",
            },
            status=400,
        )


class AccountSettingsView(LoginRequiredMixin, View):

    template_name = "profiles/account.html"

    def get(self, request, *args, **kwargs):

        account_form = AccountUpdateForm(
            instance=request.user
        )

        profile_form = ProfileUpdateForm(
            instance=request.user.profile
        )

        password_form = StyledPasswordChangeForm(
            user=request.user
        )

        context = {
            "account_form": account_form,
            "profile_form": profile_form,
            "password_form": password_form,
        }

        return render(
            request,
            self.template_name,
            context
        )

    def post(self, request, *args, **kwargs):

        account_form = AccountUpdateForm(
            request.POST,
            instance=request.user
        )

        profile_form = ProfileUpdateForm(
            request.POST,
            request.FILES,
            instance=request.user.profile
        )

        password_form = StyledPasswordChangeForm(
            user=request.user,
            data=request.POST
        )

        if "account_submit" in request.POST:

            if account_form.is_valid() and profile_form.is_valid():

                account_form.save()
                profile_form.save()

                messages.success(
                    request,
                    "Account information updated successfully."
                )

                return redirect("profiles:account")

        elif "password_submit" in request.POST:

            if password_form.is_valid():

                user = password_form.save()

                update_session_auth_hash(
                    request,
                    user
                )

                messages.success(
                    request,
                    "Password changed successfully."
                )

                return redirect("profiles:account")

        context = {
            "account_form": account_form,
            "profile_form": profile_form,
            "password_form": password_form,
        }

        return render(
            request,
            self.template_name,
            context
        )      

class FollowersListView(ListView):

    template_name = "profiles/followers.html"
    context_object_name = "followers"

    def get_queryset(self):
        user = User.objects.get(
            username=self.kwargs["username"]
        )

        return user.followers.select_related("followed_by")





class FollowersListView(LoginRequiredMixin, ListView):

    template_name = "profiles/followers.html"
    context_object_name = "followers"

    def get_queryset(self):
        user = User.objects.get(
            username=self.kwargs["username"]
        )

        return user.followers.select_related("followed_by")


class FollowingListView(LoginRequiredMixin, ListView):

    template_name = "profiles/following.html"
    context_object_name = "following"

    def get_queryset(self):
        user = User.objects.get(
            username=self.kwargs["username"]
        )

        return user.following.select_related("following")

          