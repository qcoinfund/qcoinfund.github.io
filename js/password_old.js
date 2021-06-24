const passwordButton = document.getElementById("password_button");
const passwordInput = document.getElementById("enter_password");

passwordButton.addEventListener("click", passwordCheck);
passwordInput.addEventListener('keyup', function(event) {
    if (event.code === 'Enter')
    {
        event.preventDefault();
        passwordCheck(event);
    }
});

function passwordCheck(event)
{
	var password = passwordInput.value;
	if (password)
	{
		if (password == "wwg1wga")
			window.location.href=password+".html";
		else
			alert("Sorry you are not authorized to buy in our pre-sale");
	}
}