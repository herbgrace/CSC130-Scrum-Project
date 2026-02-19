document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({Username: username, Password: password})
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("userId", data.Id);
            
            window.location.href = "/dashboard";
        } else {
            alert("Error: " + (data.error || "Failed to create account"));
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Error creating account");
    }
});
