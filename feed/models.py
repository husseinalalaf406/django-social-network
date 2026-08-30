from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models


# ============================================================
# Post Image Validation
# ============================================================

MAX_POST_IMAGE_SIZE_MB = 10
ALLOWED_POST_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"]


def validate_post_image_size(file):
    if file.size > MAX_POST_IMAGE_SIZE_MB * 1024 * 1024:
        raise ValidationError(
            f"Image file too large. Maximum size is {MAX_POST_IMAGE_SIZE_MB}MB."
        )


class Post(models.Model):

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts",
        null=True,
        blank=True,
    )
    image = models.ImageField(
        upload_to="post/",
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(allowed_extensions=ALLOWED_POST_IMAGE_EXTENSIONS),
            validate_post_image_size,
        ],
    )
    text = models.TextField(
        blank=True,
        max_length=5000,
    )

    date = models.DateTimeField(auto_now_add=True, db_index=True)

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

    text = models.TextField(max_length=1000)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return f"{self.user.username}: {self.text[:30]}"