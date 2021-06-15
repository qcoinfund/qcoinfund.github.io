const passwordButton = document.getElementById("password_button");


passwordButton.addEventListener("click", passwordCheck);

function passwordCheck(event)
{
	const passwordInput = document.getElementById("enter_password").value;
	if (passwordInput)
	{
		var md5Hash = md5(passwordInput);
		if (md5Hash == "31f2df3f026bc2f6af00134eb51ab667")
			window.location.href=passwordInput+".html";
		else
			alert("Sorry you are not authorized to buy in our pre-sale");
	}
}

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});
