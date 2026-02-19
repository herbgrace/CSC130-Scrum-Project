function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const userId = getCookie("userId");

if (!userId) {
    window.location.href = "/users/signup";
}
async function loadUserData() {
    try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}`);
        const user = await response.json();

        document.getElementById("username-display").textContent = `Welcome, ${user.Username}!`;

        const todoList = document.getElementById("todo-list");
        if (user.ToDo && user.ToDo.length > 0) {
            todoList.innerHTML = user.ToDo.map(todo => `
                <li>
                    <input type="checkbox" ${todo.Completed ? 'checked' : ''}>
                    ${todo.Task}
                </li>
            `).join("");
        } else {
            todoList.innerHTML = "<li class='empty-message'>No tasks yet. Add one to get started!</li>";
        }
    } catch (err) {
        console.error("Error loading user data:", err);
        document.getElementById("todo-list").innerHTML = "<li class='error-message'>Error loading tasks</li>";
    }
}

document.getElementById("todo-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const task = document.getElementById("task").value;
    
    try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({Task: task})
        });

        const newTodo = await response.json();
        
        document.getElementById("task").value = "";
        loadUserData();
    } catch (err) {
        console.error("Error adding task:", err);
        alert("Error adding task");
    }
});

loadUserData();
