from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Comment, Like, Post


User = get_user_model()


class FeedTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="alice",
            email="alice@example.com",
            password="test-password",
        )
        self.client.force_login(self.user)

    def test_homepage_renders_posts_without_avatar(self):
        Post.objects.create(author=self.user, text="Hello world")

        response = self.client.get(reverse("feed:index"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Hello world")
        self.assertContains(response, "A")

    def test_authenticated_user_can_create_post(self):
        response = self.client.post(
            reverse("feed:new_posts"),
            {"text": "A new post"},
        )

        self.assertRedirects(response, reverse("feed:index"))
        self.assertTrue(Post.objects.filter(author=self.user, text="A new post").exists())

    def test_like_endpoint_toggles_like(self):
        post = Post.objects.create(author=self.user, text="Like me")
        url = reverse("feed:like_post", kwargs={"post_id": post.id})

        first_response = self.client.post(url)
        second_response = self.client.post(url)

        self.assertJSONEqual(first_response.content, {"liked": True, "likes_count": 1})
        self.assertJSONEqual(second_response.content, {"liked": False, "likes_count": 0})
        self.assertFalse(Like.objects.filter(user=self.user, post=post).exists())

    def test_comment_uses_created_at_and_renders_without_avatar(self):
        post = Post.objects.create(author=self.user, text="Comment here")
        comment = Comment.objects.create(user=self.user, post=post, text="Nice post")

        response = self.client.get(reverse("feed:index"))

        self.assertContains(response, comment.created_at.strftime("%b"))
        self.assertContains(response, "Nice post")
