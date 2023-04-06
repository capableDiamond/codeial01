
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

            //attaching the like function to the comment
            $(`#like-comment-${comment._id}`).click(function(e){
                handleLike(e);
            });

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
            <div class="like" id="like-comment-${comment._id}">
                <p>${comment.likes.length}</p>
                <a href="/likes/toggle/?id=${comment._id}&type=Comment" class="like-link">
                    <!-- check for post id in liked by user to see if the post has been liked by user -->
                    <i class="fa-regular fa-heart" style="color: #000000;"></i>
                    Like
                </a>
            </div>
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

function handleLike(e){
    e.preventDefault();
    
    $.ajax({
        type:'get',
        url:e.target.href,
        success:function(data){
            //fetch type of likeable
            let type = e.target.href.split('=').pop().toLowerCase();

            //fetch post id fron url
            let id = e.target.href.split('=')[1];
            id = id.split('&')[0];

            if(data.data.deleted){
                //fetching the count of likes element and altering its inner html
                $(`#like-${type}-${id} p`).html(data.data.length);
                
                //change colour of the like symbol
                $(`#like-${type}-${id} a i`).toggleClass('fa-solid fa-regular');
                $(`#like-${type}-${id} a i`).css('color','#000000');
            }else{
                //fetching the count of likes element and altering its inner html
                $(`#like-${type}-${id} p`).html(data.data.length);

                //change colour of the like symbol
                $(`#like-${type}-${id} a i`).toggleClass('fa-regular fa-solid');
                $(`#like-${type}-${id} a i`).css('color','#ff0000');
            }
        }
    });
}