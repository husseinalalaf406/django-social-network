// Follow / Unfollow
document.addEventListener("click", async function (event) {
    const followButton = event.target.closest(".js-follow");
    if (!followButton) return;

    event.preventDefault();

    const action = followButton.dataset.action;
    const username = followButton.dataset.username;
    const url = followButton.dataset.url || "/profiles/follow/";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify({
                action: action,
                username: username
            })
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = "/accounts/login/";
            return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error(data.error);
            return;
        }

        const wording = followButton.querySelector(".js-follow-wording");
        if (wording) wording.textContent = data.wording;

        followButton.dataset.action = action === "follow" ? "unfollow" : "follow";
    } catch (error) {
        console.error("Follow error:", error);
    }
});
