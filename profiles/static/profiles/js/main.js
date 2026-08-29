function getCookie(name) {

    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {

        const [key, value] = cookie.trim().split("=");

        if (key === name) {
            return decodeURIComponent(value);
        }
    }

    return null;
}


// Follow / Unfollow
document.addEventListener("click", async function (event) {
console.log("FOLLOW SYSTEM JS VERSION 2026-08-17");
    const followButton = event.target.closest(".js-follow");

    if (!followButton) {
        return;
    }

    event.preventDefault();

    const action = followButton.dataset.action;
    const username = followButton.dataset.username;
    const url = followButton.dataset.url;

    const response = await fetch(url, {
        method: "POST",

        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Content-Type": "application/x-www-form-urlencoded",
        },

        body: new URLSearchParams({
            action: action,
            username: username,
        }),
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok || !data.success) {
        console.error(data.error);
        return;
    }

    const wording = followButton.querySelector(".js-follow-wording");

    wording.textContent = data.wording;

    followButton.dataset.action =
        action === "follow"
            ? "unfollow"
            : "follow";

    const isFollowing = followButton.dataset.action === "unfollow";
    followButton.classList.toggle("bg-primary", !isFollowing);
    followButton.classList.toggle("hover:bg-primary-hover", !isFollowing);
    followButton.classList.toggle("text-secondary", !isFollowing);
    followButton.classList.toggle("bg-secondary", isFollowing);
    followButton.classList.toggle("hover:bg-gray-700", isFollowing);
    followButton.classList.toggle("text-white", isFollowing);
});

    document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const isDark = document.documentElement.classList.toggle("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            document.querySelectorAll("[data-theme-icon]").forEach((icon) => {
                icon.textContent = isDark ? "Light mode" : "Dark mode";
            });
        });
    });
    const initialTheme = document.documentElement.classList.contains("dark");
    document.querySelectorAll("[data-theme-icon]").forEach((icon) => {
        icon.textContent = initialTheme ? "Light mode" : "Dark mode";
    });
