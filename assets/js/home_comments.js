{
    let createCommentForm = $('.comment-form');//returns an array of all the comment forms
    let postId = createCommentForm.find('input[name="post"]').val();

    for(i of createCommentForm){
        i.addEventListener('submit',(e)=>{
            handleCommentCreation(e);
        });
    }

    function handleCommentCreation(e){
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'/comments/create',
            data: $(e.target).serialize(),//e.target refers to the comment form attached to the post on which comment is being made
            success:function(data){//this data has been populated with User's Name

                let newComment = newCommentDom(data.data.comment);
                $(`#post-comments-${postId}`).prepend(newComment);

            },
            error:function(error){
                console.log(error.responseText);
            }
        });
    }
    //create the comment html
    let newCommentDom = function(comment){
        return $(
            `<li>
                <p>
                    <a href="/comments/destroy/${comment.id}">X</a>
                    ${comment.content}
                    <br>
                    <small>
                        ${comment.user.name}
                    </small>
                </p>
            </li>`
            )
        
    }

}