async function newPostHandler(event){
    event.preventDefault();
    const title = document.querySelector("input[name='post-title']").value.trim();
    const post_url = document.querySelector("input[name='post-url']").value.trim();

    if (title && post_url){
        const response = await fetch('/api/posts', {
            method: 'POST',
            body: JSON.stringify({
                title:title,
                post_url: post_url
            }),
            headers: {'Content-Type': 'application/json'}
        })
        console.log(response);
        if (response.ok){
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText)
        }
        
    } else {
        alert('Please make sure all fields are completed')
    }

}



document.querySelector(".new-post-form").addEventListener('submit', newPostHandler);