// =====================================================
// POST MODAL
// =====================================================

document.addEventListener("click", function (event) {
    const button = event.target.closest(".js-toggle-modal");
    if (!button) return;

    event.preventDefault();
    const modal = document.getElementById("post-modal");
    if (modal) {
        modal.classList.toggle("hidden");
    }
});

// ================= COMMENTS MODAL =================

document.addEventListener("click", function (event) {
    // OPEN MODAL
    const openButton = event.target.closest(".js-comment-modal");
    if (openButton) {
        const postId = openButton.dataset.postId;
        const modal = document.getElementById(`comments-modal-${postId}`);
        if (modal) {
            modal.classList.remove("hidden");
        }
        return;
    }

    // CLOSE BUTTON
    const closeButton = event.target.closest(".js-close-comment-modal");
    if (closeButton) {
        const modal = closeButton.closest(".comments-modal");
        if (modal) {
            modal.classList.add("hidden");
        }
        return;
    }

    // CLOSE BACKDROP
    const modal = event.target.closest(".comments-modal");
    if (modal && event.target === modal) {
        modal.classList.add("hidden");
    }
});

// ================= ADD COMMENT =================

document.addEventListener("submit", async function (event) {
    const form = event.target.closest(".comment-form");
    if (!form) return;

    event.preventDefault();

    try {
        const formData = new FormData(form);
        const text = formData.get("text") || form.querySelector('input[name="text"]')?.value;

        const response = await fetch(form.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify({ text })
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = "/accounts/login/";
            return;
        }

        if (!response.ok) {
            throw new Error("Comment request failed.");
        }

        const data = await response.json();

        if (!data.success) {
            console.error(data.errors);
            return;
        }

        const modal = document.getElementById(`comments-modal-${data.post_id}`);
        if (!modal) return;

        const commentsList = modal.querySelector(".comments-list");
        if (!commentsList) return;

        const noComments = commentsList.querySelector(".py-10.text-center");
        if (noComments) {
            noComments.remove();
        }

        let commentContainer = commentsList.querySelector(".space-y-4");
        if (!commentContainer) {
            commentContainer = document.createElement("div");
            commentContainer.className = "space-y-4";
            commentsList.appendChild(commentContainer);
        }

        commentContainer.insertAdjacentHTML("beforeend", data.html);

        const countElements = document.querySelectorAll(
            `#comment-count-${data.post_id}, #comments-modal-${data.post_id} .comment-modal-count`
        );

        countElements.forEach(function (element) {
            element.textContent = data.comment_count;
        });

        form.reset();

        const newComment = commentContainer.lastElementChild;
        if (newComment) {
            newComment.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    } catch (error) {
        console.error("Comment error:", error);
    }
});

// ================= LIKE BUTTON =================

document.addEventListener("click", async function (event) {
    const likeButton = event.target.closest(".like-button");
    if (!likeButton) return;

    const url = likeButton.dataset.likeUrl;
    if (!url) return;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = "/accounts/login/";
            return;
        }

        if (!response.ok) {
            throw new Error("Like request failed.");
        }

        const data = await response.json();

        const countSpan = likeButton.querySelector(".like-count");
        if (countSpan) countSpan.textContent = data.likes_count;

        const textSpan = likeButton.querySelector(".like-text");
        if (textSpan) textSpan.textContent = data.liked ? "Unlike" : "Like";

        const icon = likeButton.querySelector(".like-icon");
        if (icon) icon.setAttribute("fill", data.liked ? "currentColor" : "none");

        if (data.liked) {
            likeButton.classList.add("text-rose-600", "bg-rose-50");
            likeButton.classList.remove("text-gray-600");
        } else {
            likeButton.classList.remove("text-rose-600", "bg-rose-50");
            likeButton.classList.add("text-gray-600");
        }
    } catch (error) {
        console.error("Like error:", error);
    }
});

// ================= MOBILE MENU =================
document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const openIcon = document.getElementById("mobile-menu-open-icon");
    const closeIcon = document.getElementById("mobile-menu-close-icon");

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
            if (openIcon) openIcon.classList.toggle("hidden");
            if (closeIcon) closeIcon.classList.toggle("hidden");
        });
    }
});
