from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Follower


User = get_user_model()


class FollowTests(TestCase):
    def setUp(self):
        self.alice = User.objects.create_user(
            username="alice",
            email="alice@example.com",
            password="test-password",
        )
        self.bob = User.objects.create_user(
            username="bob",
            email="bob@example.com",
            password="test-password",
        )
        self.client.force_login(self.alice)

    def test_follow_is_idempotent(self):
        url = reverse("profiles:follow")

        first_response = self.client.post(
            url,
            {"action": "follow", "username": self.bob.username},
        )
        second_response = self.client.post(
            url,
            {"action": "follow", "username": self.bob.username},
        )

        self.assertEqual(first_response.status_code, 200)
        self.assertEqual(second_response.status_code, 200)
        self.assertEqual(
            Follower.objects.filter(followed_by=self.alice, following=self.bob).count(),
            1,
        )
