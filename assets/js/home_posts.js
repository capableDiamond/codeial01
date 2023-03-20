//this is the js file that fetches the data from the form and submits it to the server in JSON Format
//method to submit the form data using AJAX
{  
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            //the data to be submitted is within this submit function only had I placed the AJAX request out of it it would have given a blank string to serialize
            $.ajax({
                type:'post',
                url:'/posts/create',
                //this converts the form data into JSON
                data: newPostForm.serialize(), 
                success:function(data){
                    //creating the html for the new post
                    let newPost = newPostDom(data.data.post);

                    //appending the html to the posts list
                    $('#post-lists-container > ul').prepend(newPost);

                    //attaching the delete post function to every post that is created
                    //implies this class has to be inside the newPost where newPost is just a variable containing the HTML for new post
                    deletePost($(' .delete-post-button', newPost)); 

                    //also attach the comment-form AJAX Code 
                    $(`#comment-form-${data.data.post._id}`).submit(function(e){
                        e.preventDefault();
                        handleCommentCreation(e,newPost);
                    });

                    //Noty notifications
                    new Noty({
                        theme: 'relax',
                        text: "Post Created",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

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
            
            <form action="/comments/create" method="post" class='comment-form' id='comment-form-${post._id}'>
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
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error:function(err){
                    console.log(err.responseText);
                }
            });
        });
    }

    createPost();

    //Function for comments on the post
    function handleCommentCreation(e,newPost){
        $.ajax({
            type:'post',
            url:'/comments/create',
            data: $(e.target).serialize(),//e.target refers to the comment form attached to the post on which comment is being made
            success:function(data){//this data has been populated with User's Name

                let newComment = newCommentDom(data.data.comment);
                $(' .post-comments-list',newPost).prepend(newComment);

                //attaching the delete function to the comment
                handleCommentDeletion($(`#delete-button-${data.data.comment._id}`));

            },
            error:function(error){
                console.log(error.responseText);
            }
        });
    }
    //create the comment html
    let newCommentDom = function(comment){
        return $
        (
            `<li id='comment-${comment._id}'>
                <p>
                    <a href="/comments/destroy/${comment._id}" class='delete-comment-button' id="delete-button-${comment._id}">X</a>
                    ${comment.content}
                    <br>
                    <small>
                        ${comment.user.name}
                    </small>
                </p>
            </li>`
        )
    }
    
    //function to handle comment deletion dynamically
function handleCommentDeletion(deleteLink){
    
    $(deleteLink).click(function(e){
        e.preventDefault();
        $.ajax({
            type:'get',
            url:$(deleteLink).prop('href'),
            success:function(data){
                $(`#comment-${data.data.commentId}`).remove();
            },
            error:function(err){
                console.log(err.responseText);
            }
        });

    });    
    
}

}

