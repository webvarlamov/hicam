function onSigninButtonClick() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const responseStatusSuccess = document.getElementById("response-status-success");
    const responseStatusError = document.getElementById("response-status-error");
    responseStatusSuccess.style.display = 'node';
    responseStatusError.style.display = 'node';

    const formData = new FormData();
    formData.set("username", username);
    formData.set("password", password);

    fetch("/signin_api", {
        method: "POST",
        body: formData
    }).then(response => {
        response.text().then(status => {
            if (status === "OK") {
                responseStatusSuccess.style.display = 'block';
                setTimeout(() => {
                    document.location.href = '/admin'
                }, 1000)
            } else if (status === "USER_EXIST") {
                responseStatusError.style.display = 'block';
            }
        })
    })
}
