
let createCommentForm = $('.comment-form');//returns an array of all the comment forms

//listener could have been added at time of post creation also
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
        success:function(data){//<--this data has been populated with User's Name
            let newComment = newCommentDom(data.data.comment);

            //prepending the comment to the DOM
            $(`#post-comments-${data.data.comment.post._id}`).prepend(newComment);

            //attaching the delete function to the comment
            handleCommentDeletion($(`#delete-button-${data.data.comment._id}`));
            new Noty({
                theme: 'relax',
                text: "Comment Published",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
                
            }).show();

        },
        error:function(error){
            console.log(error.responseText);
        }
    });
}

//create the comment's html
let newCommentDom = function(comment){
    return $(
        `<li id='comment-${comment._id}'>
            <p>
                <a href="/comments/destroy/${comment._id}" class="delete-comment-button" id="delete-button-${comment._id}">X</a>
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
                console.log('success');
                $(`#comment-${data.data.commentId}`).remove();
                new Noty({
                    theme: 'relax',
                    text: "Comment Deleted",
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