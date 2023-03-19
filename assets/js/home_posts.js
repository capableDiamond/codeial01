//this is the js file that fetches the data from the form and submits it to the server in JSON Format
//method to submit the form data using AJAX
{
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();
            console.log(newPostForm.serialize());
            //the data to be submitted is within this submit function only had I placed the AJAX request out of it it would have given a blank string to serialize
            $.ajax({
                type:'post',
                url:'/posts/create',
                data: newPostForm.serialize(), //this converts the form data into JSON
                success:function(data){
                    // console.log('Successfuly posted data');
                    let newPost = newPostDom(data.data.post);
                    $('#post-lists-container > ul').prepend(newPost);
                    //attaching the delete post function to every post that is created
                    deletePost($(' .delete-post-button', newPost)); //implies this class has to be inside the newPost where newPost is just a variable containing the HTML for new post
                },
                error: function(error){
                    console.log(error.responseText);
                }
                
            });

        });


    }

    //Method to create a post in DOM
    let newPostDom = function(post){
        //the html we are returning we have removed a lot of checks given the fact this code is sent when the user has called the post create implying he is signed in
        return $(
        `<li id="post-${post._id}">
        <p>
            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
            </small>
    
            ${post.content} 
            <br>
            <small>
                by ${post.user.name}<!-- //this does not work as it has not been populated yet -->
            </small>
        </p>
        <div class="post-comments">
            
            <form action="/comments/create" method="post">
                <input type="text" name="content" placeholder="Type Here to add Comment ..." required>
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" value="Add Comment">
            </form>
    
            <div class="post-comments-list">
                <ul id="post-comments-${post._id}">
                </ul>
            </div>
    
        </div>
    </li>`
    );
    }

    //Method to delete a post in DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){//the data we get back when the request is successfully completed by server
                    $(`#post-${data.data.post_id}`).remove();
                },
                error:function(err){
                    console.log(err.responseText);
                }
            });
        });
    }



    createPost();

    
}

