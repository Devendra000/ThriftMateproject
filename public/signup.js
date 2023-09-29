const signupbtn = document.querySelector('#signupbtn');
const loginbtn = document.querySelector('#loginbtn');

const gotologin = document.querySelector('#gotologin');
const gotosignup = document.querySelector('#gotosignup');

const container = document.querySelector('.container');
const forget = document.querySelector('.goto');
const forgot = document.querySelector('.forgot');
const body = document.querySelector('#navigation');

const signup = document.querySelector('.signup');

const login = document.querySelector('.login');

function signupform(){
    container.classList.remove('hidden');
    signup.classList.remove('hidden');
    login.classList.add('hidden');
    forgot.classList.add('hidden')
    body.classList.add('blur');
}

function loginform(){
    container.classList.remove('hidden');
    signup.classList.add('hidden');
    login.classList.remove('hidden');
    forgot.classList.add('hidden')
    body.classList.add('blur');
}


signupbtn.addEventListener('click', signupform);

loginbtn.addEventListener('click', loginform);

forget.addEventListener('click',function(){
    login.classList.add('hidden');
    forgot.classList.remove('hidden');
});

gotologin.addEventListener('click',loginform);
gotosignup.addEventListener('click',signupform);

function gotobody(){
    signup.classList.add('hidden');
    login.classList.add('hidden');
    forgot.classList.add('hidden');
    body.classList.remove('blur');
}

body.addEventListener('click',gotobody);