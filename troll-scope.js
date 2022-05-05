function time_span_to_time_string (time_ms) {
    time = time_ms;
    time_scale = "ms";
    if (time > 1000){
        time = time/1000;
        time_scale = "s";
    }
    if (time > 60){
        time = time/60;
        time_scale = "min";
    }
    if (time > 60){
        time = time/60;
        time_scale = "h";
    }
    if (time > 24){
        time = time/24;
        time_scale = "d";
    }
    if (time > 365) {
        time = time/365;
        time_scale = "y";
    } else if (time > 30) {
        time = time/30;
        time_scale = "m";
    }
    time = Math.floor(time);
    return `${time}${time_scale}`;
}

function removePopupContainers() {
    popupContainers = document.querySelectorAll('#myPopupContainer');

    popupContainers.forEach(popupContainer => {
        popupContainer.remove();
    })
}

function mouseEnterHandler(event) {
    byLine = event.target;

    popupText = byLine.querySelector('.popuptext');

    if ("" == popupText.innerHTML) {
        author_name = byLine.querySelector('.author-name').innerHTML;
        user_url = `https://api.imgur.com/account/v1/accounts/${author_name}?client_id=546c25a59c58ad7`;
        fetch(user_url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            username = data.username;
            created_at = Date.parse(data.created_at);
            reputation_count = Math.floor(data.reputation_count);

            time_string = time_span_to_time_string(Date.now() - created_at);
            popupText.innerHTML = `${time_string} | ${reputation_count}`
        })
        .catch(function (err) {
            console.error(err);
        });
    }
    popupText.classList.toggle("show");
}

function mouseLeaveHandler(event) {
    byLine = event.target;
    popupText = byLine.querySelector('.popuptext');
    popupText.classList.toggle("show");
}

function decorateComment(comment) {
    byLine = comment.querySelector('.GalleryComment-byLine');

    pfp = byLine.querySelector('.GalleryComment-avatar-bar');

    pfp.insertAdjacentHTML("beforeBegin",`
    <div class="popup">
    <span class="popuptext"></span>
    </div>
    `);

    byLine.addEventListener('mouseenter', mouseEnterHandler);
    byLine.addEventListener('mouseleave', mouseLeaveHandler);
}

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    mutationsList.forEach(mutation => {
        mutation.addedNodes.forEach(node => {

            if (node.classList.contains('GalleryComment')) {
                decorateComment(node);
            }
            else if (
                node.classList.contains('GalleryComment-replies') ||
                (null != node.querySelector('.toggle-bad-comments'))
            ) {
                comments = node.querySelectorAll('.GalleryComment');
                comments.forEach(comment => {decorateComment(comment);});
            }
        });
    });
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(document, { childList: true, subtree: true });
