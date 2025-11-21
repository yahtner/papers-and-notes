let papers = [];
let fuse;

async function initSearch() {
    const res = await fetch("/index.json");
    const data = await res.json();

    papers = data;
    fuse = new Fuse(papers, {
        keys: ["title", "summary", "content", "tags"],
        includeScore: false,
        threshold: 0.3
    });
}

function renderItems(items) {
    const domItems = document.querySelectorAll(".paperItem");
    domItems.forEach(el => el.style.display = "none");

    items.forEach(item => {
        const match = document.querySelector(
          `.paperItem a[href='${item.permalink.replace(location.origin, "")}']`
        );
        if (match) match.parentElement.style.display = "block";
    });
}

document.getElementById("searchInput").addEventListener("input", e => {
    const q = e.target.value;
    if (q === "") {
        document.querySelectorAll(".paperItem")
                .forEach(el => el.style.display = "block");
        return;
    }
    const results = fuse.search(q).map(r => r.item);
    renderItems(results);
});

window.addEventListener("load", initSearch);

// Tag filtering
document.querySelectorAll(".tagButton").forEach(btn => {
    btn.addEventListener("click", () => {
        const tag = btn.dataset.tag;
        document.querySelectorAll(".paperItem").forEach(el => {
            const tags = el.dataset.tags.split(",");
            el.style.display = tags.includes(tag) ? "block" : "none";
        });
    });
});
