from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.views.generic import ListView, View
from django.views.generic.edit import CreateView
from .models import Post,Like,Comment
from .forms import CommentForm
from django.views.generic import TemplateView
from followers.models import Follower
from django.shortcuts import redirect, get_object_or_404
import notifications.models
from django.template.loader import render_to_string


# 1. Homepage View (Lists recent posts)
class HomePage(ListView):
    http_method_names = ["get"]
    template_name = "feed/homepage.html"
    model = Post
    context_object_name = "posts"

    def get_queryset(self):
        return (
            Post.objects
            .all()
            .select_related("author", "author__profile")
            .prefetch_related("likes")
            .order_by("-id")[:30]
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        liked_posts = set()

        if self.request.user.is_authenticated:
            liked_posts = set(
                self.request.user.likes.values_list(
                    "post_id",
                    flat=True
                )
            )

        context["liked_posts"] = liked_posts

        return context

class MyFollowingView(LoginRequiredMixin, TemplateView):
    template_name = "feed/My-following.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        liked_posts = set()

        following = list(
                Follower.objects
                .filter(followed_by=self.request.user)
                .values_list("following", flat=True)
            )

        if following:
                posts = (
                    Post.objects
                    .filter(author__in=following)
                    .select_related("author", "author__profile")
                    .order_by("-id")[:60]
                )

        else:
                posts = []
        if self.request.user.is_authenticated:
                   liked_posts = set(
                       self.request.user.likes.values_list(
                           "post_id",
                           flat=True
                       )
                   )
       
    
        context["posts"] = posts
        context["liked_posts"] = liked_posts
        return context

  





# 2. Post Creation View (Handles form submission)
class CreateNewPost(LoginRequiredMixin, CreateView):



    model = Post
    fields = ["text", "image"] 
    success_url = reverse_lazy("feed:index")  # Redirects to home page after creation

    def form_valid(self, form):

        # Automatically assign the logged-in user as author
        form.instance.author = self.request.user
        return super().form_valid(form)

class LikePostView(LoginRequiredMixin, View):
     def post(self, request, post_id):

        post = Post.objects.get(id=post_id)

        like, created = Like.objects.get_or_create(
            user=request.user,
            post=post
        )

        if not created:
            like.delete()
            liked = False
        else:
            liked = True
            if post.author != request.user:
             notifications.models.Notification.objects.create(
            recipient=post.author,
            sender=request.user,
            notification_type=notifications.models.Notification.LIKE,
            post=post,
        )
        return JsonResponse({
            "liked": liked,
            "likes_count": post.likes.count()
        })   
        context = super().get_context_data(**kwargs)
        posts = context['posts']  # whatever your post list is called

        if self.request.user.is_authenticated:
         liked_posts = Like.objects.filter(
            user=self.request.user,
            post__in=posts
        ).values_list('post_id', flat=True)
        else:
          liked_posts = []

        context['liked_posts'] = liked_posts
        return context 


class CommentCreateView(CreateView):

    model = Comment
    form_class = CommentForm

    def get_post(self):
        return get_object_or_404(Post, pk=self.kwargs["post_id"])

    def form_valid(self, form):

        form.instance.user = self.request.user
        form.instance.post = self.get_post()

        self.object = form.save()
        if self.object.post.author != self.request.user:
              notifications.models.Notification.objects.create(
                recipient=self.object.post.author,
                sender=self.request.user,
                notification_type=notifications.models.Notification.COMMENT,
                post=self.object.post,
                comment=self.object,
            ) 
        if self.request.headers.get("x-requested-with") == "XMLHttpRequest":

            html = render_to_string(
                "feed/partials/comment.html",
                {
                    "comment": self.object,
                },
                request=self.request,
            )

            return JsonResponse({
                "success": True,
                "html": html,
                "post_id": self.object.post.id,
                "comment_count": self.object.post.comments.count(),
            })

        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy("feed:index").__str__() + f"#comments-modal-{self.object.post.id}"

