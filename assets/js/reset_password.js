let password = document.getElementById('password');
let confirmPassword = document.getElementById('confirm-password');
let submitButton = document.getElementById('reset-password-button');

password.addEventListener('change',checkIfSame);
confirmPassword.addEventListener('change',checkIfSame);

//enable the submit button only when the passwords are same
//though this is just a client side check same check has also been aplied on the server side
function checkIfSame(){
    if(password.value == confirmPassword.value){
        submitButton.disabled = false;
        return;
    }else{
        submitButton.disabled = true;
    }
}