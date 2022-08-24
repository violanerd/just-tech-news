async function editPostHandler (event){
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
    const title = document.querySelector("input[name='post-title']").value.trim();
    
    if(title){
        const response = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: title
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


document.querySelector('.edit-post-form').addEventListener('submit', editPostHandler);