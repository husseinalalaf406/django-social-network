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
});