from django.conf import settings
from django.db import models


class Post(models.Model):

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts",
        null=True,
        blank=True,
    )
    image = models.ImageField(upload_to="post/", null=True, blank=True)
    text = models.TextField(
    blank=True


    )

    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        author_name = self.author.username if self.author else "Anonymous"
        return f"Post by {author_name}: {self.text[:30]}"


class Like(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="likes",
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="likes",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "post"],
                name="unique_user_post_like",
            )
        ]

    def __str__(self):
        return f"{self.user.username} likes post {self.post.id}"


class Comment(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    text = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.text[:30]}"   