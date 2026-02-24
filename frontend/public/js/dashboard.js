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
        const completedList = document.getElementById("completed-list");

        todoList.innerHTML = "";
        completedList.innerHTML = "";

        if (user.ToDo && user.ToDo.length > 0) {
            user.ToDo.forEach(todo => {
                const li = `
                    <li>
                        <input type="checkbox" ${todo.Completed ? 'checked' : ''} 
                                onclick="toggleTask('${todo.Id}', ${todo.Completed})">
                        <span>${todo.Task}</span>
                        <button class="delete-btn" onclick="deleteTask('${todo.Id}')">×</button>
                    </li>
                `;

                if (todo.Completed) {
                    completedList.innerHTML += li;
                } else {
                    todoList.innerHTML += li;
                }
            });
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

async function toggleTask(todoId, currentStatus) {
    try {
        await fetch(`http://localhost:3001/api/users/${userId}/todos/${todoId}`, {
            method: "PUT", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Completed: !currentStatus })
        });
        
        loadUserData(); 
    } catch (err) {
        console.error("Error updating task:", err);
    }
}

async function deleteTask(todoId) {
    if (!confirm("Delete this task?")) return;

    try {
        await fetch(`http://localhost:3001/api/users/${userId}/todos/${todoId}`, {
            method: "DELETE"
        });
        loadUserData(); 
    } catch (err) {
        console.error("Delete failed:", err);
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
