/**
* This script defines the registration functionality for the Registration page in the Recipe Management Application.
*/

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
* TODO: Get references to various DOM elements
* - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
*/
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const repeatPasswordInput = document.getElementById("repeat-password-input");
const registerButton = document.getElementById("register-button");
/* 
* TODO: Ensure the register button calls processRegistration when clicked
*/
const registerForm = document.getElementById("register-form");
/* 
* TODO: Ensure the register button calls processRegistration when clicked
*/
// registerButton.addEventListener("click", processRegistration);
registerForm.addEventListener("submit", function (event) {
    event.preventDefault(); // prevent default form submission
    console.log('event good');
    processRegistration();
});



/**
* TODO: Process Registration Function
* 
* Requirements:
* - Retrieve username, email, password, and repeat password from input fields
* - Validate all fields are filled
* - Check that password and repeat password match
* - Create a request body with username, email, and password
* - Define requestOptions using method POST and proper headers
* 
* Fetch Logic:
* - Send POST request to `${BASE_URL}/register`
* - If status is 201:
*      - Redirect user to login page
* - If status is 409:
*      - Alert that user/email already exists
* - Otherwise:
*      - Alert generic registration error
* 
* Error Handling:
* - Wrap in try/catch
* - Log error and alert user
*/
async function processRegistration() {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const repeatPassword = repeatPasswordInput.value.trim();
    if(username==="" || email==="" || password===""){
        alert("Fill out all fields!");
        return;
    }
    if(password!=repeatPassword){
        alert("Passwords do not match!");
        return;
    }
    // Implement registration logic here

    // Example placeholder:
const registerBody = { username, email, password };
const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(registerBody)
    };
    try{
        const URL = `${BASE_URL}/register`;
        const response = await fetch(URL,requestOptions);
        // const data = await response.json();
        if(!response.ok){
            if(response.status===409){
                alert("User already exists!");
                return;
            }
            const errorMessage = `${response.status} ${response.statusText} ${data.message || "Unknown Error!"}`;
            console.error(errorMessage);
            alert("Client or Server error! View console for more details!");
            return;
        }

        window.location.href ="../login/login-page.html"

    }
    catch(e){
        console.error(e);
        // alert("Network Failure!")
    }
}
 