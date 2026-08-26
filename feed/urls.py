from django.urls import path
from . import views

app_name = "feed"

urlpatterns = [
    path(
        "",
        views.HomePage.as_view(),
        name="index",
    ),
   path(
        "post/<int:post_id>/like/",
        views.LikePostView.as_view(),
        name="like_post",
    ), 
        path(
        "My-following/",
        views.MyFollowingView.as_view(),
        name="my_following",
    ),

 path(
    "post/<int:post_id>/comment/",
    views.CommentCreateView.as_view(),
    name="add-comment"
),
    path(
        "new-posts/",
        views.CreateNewPost.as_view(),
        name="new_posts",
    ),
 
 
 
]