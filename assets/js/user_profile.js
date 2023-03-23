let updateUserName = document.getElementById('update-user-name');
let updateUserEmail = document.getElementById('update-user-email');
let updateUserAvatar = document.getElementById('update-user-avatar');
let updateUserSubmitButton = document.getElementById('update-user-submit-button');
let imagePreview = document.getElementById('image-preview');
let userUpdateForm = $('#user-update-form');
let profilePicture = $('#user-avatar');

//check change in file input if any on change in other fields of form and validate the image and enable the submit button then
updateUserName.addEventListener('change',checkFileSize);
updateUserEmail.addEventListener('change',checkFileSize);
updateUserAvatar.addEventListener('change',checkFileSize);

//check file size function
function checkFileSize(){
    if(updateUserAvatar.files.length > 0){
        const fileSize = updateUserAvatar.files.item(0).size;
        const fileMb = fileSize/1024 ** 2;
        if(fileMb>2){
            alert('Please select a file less than 2MB.');
        }else{
            if(checkFileExtension(updateUserAvatar)){
                updateUserSubmitButton.disabled = false;
                showImagePreview(imagePreview,updateUserAvatar);
            }
        }
    }else{ //when no image update is demanded
        updateUserSubmitButton.disabled = false;
    }
}

// a minor check on the frontend though can be bypassed by some by uploading a file with no extension but it is a rare case
function checkFileExtension(file){
    let fileName = file.value.toLowerCase();
    if(fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png')){
        return true;
    }else{
        alert('Please upload a file of type jpeg, jpg or png');
        return false;
    }
}

function showImagePreview(imageDiv,fileRef){
    let url = URL.createObjectURL(fileRef.files[0]);
    imageDiv.innerHTML = '<img src ="' + url + '">'
}

userUpdateForm.submit((e)=>{
    handleFormSubmission(e);
})

function handleFormSubmission(event){
    event.preventDefault();
    //get form
    let form = userUpdateForm[0];

    //create a form data object
    let formData =new FormData(form);

    $.ajax({
        type:'post',
        enctype: 'multipart/form-data',
        url:event.target.action,
        data:formData,
        processData: false, //important prevents Jquery to stringify data
        contentType: false,
        cache: false,
        success:function(data){
            //update the profile picture
            profilePicture.attr('src',data.data.user.avatar);
            //remove the image preview
            imagePreview.innerHTML = "";

            //change the values of input tags
            $('#user-update-form input[name="name"]').attr('value',data.data.user.name);
            $('#user-update-form input[name="email"]').attr('value',data.data.user.email);
            $('#greeting').text("Hi, " + data.data.user.name);
            // $('#greeting').css('color','red');

            //Noty Notifications
            new Noty({
                theme: 'relax',
                text: "User Updated",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
                
            }).show();
        },
        error:function(err){
            console.log("Error at user_profilejs in assets",err);
        }
    });
}