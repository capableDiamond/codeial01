let updateUserName = document.getElementById('update-user-name');
let updateUserEmail = document.getElementById('update-user-email');
let updateUserAvatar = document.getElementById('update-user-avatar');
let updateUserSubmitButton = document.getElementById('update-user-submit-button');
let imagePreview = document.getElementById('image-preview');

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
            checkFileExtension(updateUserAvatar);
            updateUserSubmitButton.disabled = false;
            showImagePreview(imagePreview,updateUserAvatar);
        }
    }else{
        updateUserSubmitButton.disabled = false;
    }
}

// a minor check on the frontend though can be bypassed by some by uploading a file with no extension but it is a rare case
function checkFileExtension(file){
    let fileName = file.value.toLowerCase();
    if(fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png')){
        updateUserSubmitButton.disabled = false;
    }else{
        alert('Please upload a file of type jpeg, jpg or png');
    }
}

function showImagePreview(imageDiv,fileRef){
    let url = URL.createObjectURL(fileRef.files[0]);
    console.log(url);
    // let path = fileRef.value;
    // let arr = path.split('\\');
    // console.log(arr[2]);
    imageDiv.innerHTML = '<img src ="' + url + '">'
}