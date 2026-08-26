from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordChangeForm

from .models import Profile


User = get_user_model()


# ============================================================
# Shared Input Style
# ============================================================

INPUT_CLASS = (
    "w-full "
    "px-4 py-2.5 "
    "rounded-lg "
    "border border-gray-300 "
    "bg-white "
    "text-gray-900 "
    "text-sm "
    "placeholder:text-gray-400 "
    "transition "
    "focus:outline-none "
    "focus:ring-2 "
    "focus:ring-gray-900 "
    "focus:border-transparent"
)


# ============================================================
# Account Update Form
# ============================================================

class AccountUpdateForm(forms.ModelForm):

    class Meta:
        model = User

        fields = [
            "username",
            "first_name",
            "last_name",
        ]

        widgets = {

            "username": forms.TextInput(
                attrs={
                    "class": INPUT_CLASS,
                    "placeholder": "Username",
                    "autocomplete": "username",
                }
            ),

            "first_name": forms.TextInput(
                attrs={
                    "class": INPUT_CLASS,
                    "placeholder": "First name",
                    "autocomplete": "given-name",
                }
            ),

            "last_name": forms.TextInput(
                attrs={
                    "class": INPUT_CLASS,
                    "placeholder": "Last name",
                    "autocomplete": "family-name",
                }
            ),
        }


# ============================================================
# Profile Update Form
# ============================================================

class ProfileUpdateForm(forms.ModelForm):

    class Meta:
        model = Profile

        fields = [
            "avatar",
            "bio",
        ]

        widgets = {

            "avatar": forms.ClearableFileInput(
                attrs={
                    "class": (
                        "block w-full "
                        "text-sm text-gray-600 "
                        "cursor-pointer "
                        "border border-gray-200 "
                        "rounded-lg "
                        "bg-gray-50 "
                        "p-2 "
                        "file:mr-4 "
                        "file:py-2 "
                        "file:px-4 "
                        "file:rounded-lg "
                        "file:border-0 "
                        "file:text-sm "
                        "file:font-semibold "
                        "file:bg-gray-100 "
                        "file:text-gray-700 "
                        "hover:file:bg-gray-200 "
                        "focus:outline-none"
                    ),
                    "accept": "image/*",
                }
            ),

            "bio": forms.Textarea(
                attrs={
                    "class": (
                        INPUT_CLASS +
                        " resize-none"
                    ),
                    "rows": 4,
                    "placeholder": "Tell people about yourself...",
                }
            ),
        }


# ============================================================
# Password Change Form
# ============================================================

class StyledPasswordChangeForm(PasswordChangeForm):

    old_password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": INPUT_CLASS,
                "placeholder": "Current password",
                "autocomplete": "current-password",
            }
        )
    )

    new_password1 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": INPUT_CLASS,
                "placeholder": "New password",
                "autocomplete": "new-password",
            }
        )
    )

    new_password2 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": INPUT_CLASS,
                "placeholder": "Confirm new password",
                "autocomplete": "new-password",
            }
        )
    )