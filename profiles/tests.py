from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from feed.models import Post


User = get_user_model()


class ProfileTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="alice",
            email="alice@example.com",
            password="test-password",
        )

    def test_profile_page_renders_without_avatar(self):
        Post.objects.create(author=self.user, text="Profile post")

        response = self.client.get(
            reverse("profiles:detail", kwargs={"username": self.user.username})
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Profile post")
        self.assertContains(response, "A")
