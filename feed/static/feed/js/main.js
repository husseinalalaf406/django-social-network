// =====================================================
// POST MODAL
// =====================================================

document.addEventListener("click", function (event) {

    console.log("CLICK DETECTED");

    const button = event.target.closest(".js-toggle-modal");

    if (!button) {
        return;
    }

    console.log("TOGGLE BUTTON FOUND");

    event.preventDefault();

    const modal = document.getElementById("post-modal");

    if (modal) {
        modal.classList.toggle("hidden");
    }

});

// ================= COMMENTS MODAL =================

document.addEventListener("click", function (event) {

    // ================= OPEN MODAL =================

    const openButton = event.target.closest(".js-comment-modal");

    if (openButton) {

        const postId = openButton.dataset.postId;

        const modal = document.getElementById(
            `comments-modal-${postId}`
        );

        if (modal) {
            modal.classList.remove("hidden");
        }

        return;
    }


    // ================= CLOSE BUTTON =================

    const closeButton = event.target.closest(
        ".js-close-comment-modal"
    );

    if (closeButton) {

        const modal = closeButton.closest(".comments-modal");

        if (modal) {
            modal.classList.add("hidden");
        }

        return;
    }


    // ================= CLOSE BACKDROP =================

    const modal = event.target.closest(".comments-modal");

    if (modal && event.target === modal) {

        modal.classList.add("hidden");

    }

});


// ================= ADD COMMENT =================

document.addEventListener("submit", async function (event) {

    const form = event.target.closest(".comment-form");

    if (!form) {
        return;
    }

    event.preventDefault();


    try {

        const response = await fetch(form.action, {

            method: "POST",

            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },

            body: new FormData(form)

        });


        if (response.status === 403) {

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


        // ================= GET MODAL =================

        const modal = document.getElementById(
            `comments-modal-${data.post_id}`
        );


        if (!modal) {
            return;
        }


        // ================= GET COMMENTS LIST =================

        const commentsList = modal.querySelector(
            ".comments-list"
        );


        // ================= REMOVE "NO COMMENTS" =================

        const noComments = commentsList.querySelector(
            ".py-10.text-center"
        );

        if (noComments) {
            noComments.remove();
        }


        // ================= GET COMMENT CONTAINER =================

        let commentContainer = commentsList.querySelector(
            ".space-y-4"
        );


        if (!commentContainer) {

            commentContainer = document.createElement("div");

            commentContainer.className = "space-y-4";

            commentsList.appendChild(commentContainer);

        }


        // ================= INSERT NEW COMMENT =================

        commentContainer.insertAdjacentHTML(
            "beforeend",
            data.html
        );


        // ================= UPDATE COUNT =================

        const countElements = document.querySelectorAll(
            `#comment-count-${data.post_id}, 
             #comments-modal-${data.post_id} .comment-modal-count`
        );


        countElements.forEach(function (element) {

            element.textContent = data.comment_count;

        });


        // ================= CLEAR INPUT =================

        form.reset();


        // ================= SCROLL TO NEW COMMENT =================

        const newComment =
            commentContainer.lastElementChild;


        if (newComment) {

            newComment.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        }

    }

    catch (error) {

        console.error("Comment error:", error);

    }

});

// ================= LIKE BUTTON =================

document.addEventListener("click", async function (event) {

    const likeButton = event.target.closest(".like-button");

    if (!likeButton) {
        return;
    }

    const url = likeButton.dataset.likeUrl;

    try {

        const response = await fetch(url, {

            method: "POST",

            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRFToken": getCookie("csrftoken"),
            },

        });

        if (response.status === 403) {
            window.location.href = "/accounts/login/";
            return;
        }

        if (!response.ok) {
            throw new Error("Like request failed.");
        }

        const data = await response.json();

        // ================= UPDATE COUNT =================

        const countSpan = likeButton.querySelector(".like-count");
        countSpan.textContent = data.likes_count;

        // ================= UPDATE TEXT =================

        const textSpan = likeButton.querySelector(".like-text");
        textSpan.textContent = data.liked ? "Unlike" : "Like";

        // ================= UPDATE ICON FILL =================

        const icon = likeButton.querySelector(".like-icon");
        icon.setAttribute("fill", data.liked ? "currentColor" : "none");

        // ================= UPDATE COLORS =================

        if (data.liked) {
            likeButton.classList.add("text-danger", "bg-red-50");
            likeButton.classList.remove("text-secondary");
        } else {
            likeButton.classList.remove("text-danger", "bg-red-50");
            likeButton.classList.add("text-secondary");
        }

    } catch (error) {
        console.error("Like error:", error);
    }

});


// ================= CSRF HELPER =================

function getCookie(name) {

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }

}










 const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const openIcon = document.getElementById("mobile-menu-open-icon");
    const closeIcon = document.getElementById("mobile-menu-close-icon");

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener("click", () => {

            mobileMenu.classList.toggle("hidden");
            openIcon.classList.toggle("hidden");
            closeIcon.classList.toggle("hidden");

        });
    }