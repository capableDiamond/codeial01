let likes = $('.like-link');

for(i of likes){
    i.addEventListener('click',(e)=>{
        handleLike(e);
    })
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