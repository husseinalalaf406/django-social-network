from django import forms
from .models import Comment, Post


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ["text"]
        widgets = {
            "text": forms.Textarea(attrs={
                "rows": 1,
                "placeholder": "Write a comment...",
                "class": (
                    "w-full rounded-full border border-gray-300 "
                    "px-4 py-2 text-sm focus:outline-none "
                    "focus:ring-2 focus:ring-indigo-500"
                ),
            }),
        }


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["text"]  # add "image" etc. if your Post has more fields
        widgets = {
            "content": forms.Textarea(attrs={
                "rows": 3,
                "placeholder": "What's on your mind?",
                "class": (
                    "w-full rounded-lg border border-gray-300 "
                    "px-4 py-2 text-sm focus:outline-none "
                    "focus:ring-2 focus:ring-indigo-500"
                ),
            }),
        }