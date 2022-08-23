async function upvoteButtonHandler(event){
    event.preventDefault();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length-1
    ];
    // user id comes form backend session
    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: post_id
        }),
        headers: {'Content-Type': 'application/json'}     
    })
    if (response.ok){
       document.location.reload();
    } else {
        alert(response.statusText);
    }
    console.log(response);
}


document.querySelector(".upvote-btn").addEventListener("click", upvoteButtonHandler);