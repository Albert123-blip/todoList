// ---------- Grab elements (using your own ids and classes) ----------
const taskForm = document.getElementById("task-form");
const inputTask = document.getElementById("input-task");
const taskList = document.getElementById("task-list");
const tabButtons = document.querySelectorAll(".tabs button");
const clearAll = document.getElementById("clear-all");
const themeToggle = document.getElementById("theme-toggle");

// ---------- Data ----------
// Each task looks like: { id: 123, text: "Buy milk", done: false }
let tasks = [];
try { tasks = JSON.parse(localStorage.getItem("tasks")) || []; } catch (e) {}
let currentFilter = "all"; // "all", "active" or "completed"

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---------- Show tasks on the page ----------
function showTasks() {
    taskList.innerHTML = "";

    // Pick which tasks to show based on the selected tab
    let visibleTasks = tasks;
    if (currentFilter === "active") {
        visibleTasks = tasks.filter(function (task) { return !task.done; });
    } else if (currentFilter === "completed") {
        visibleTasks = tasks.filter(function (task) { return task.done; });
    }

    // Message when there is nothing to show
    if (visibleTasks.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty-msg";
        empty.textContent = "No tasks here yet.";
        taskList.appendChild(empty);
        return;
    }

    visibleTasks.forEach(function (task) {
        const li = document.createElement("li");
        li.className = task.done ? "task done" : "task";

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", function () {
            task.done = checkbox.checked;
            saveTasks();
            showTasks();
        });

        // Task text
        const span = document.createElement("span");
        span.textContent = task.text;

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "×";
        deleteBtn.setAttribute("aria-label", "Delete task");
        deleteBtn.addEventListener("click", function () {
            tasks = tasks.filter(function (t) { return t.id !== task.id; });
            saveTasks();
            showTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// ---------- Add a task ----------
taskForm.addEventListener("submit", function (e) {
    e.preventDefault(); // stops the page from reloading

    const text = inputTask.value.trim();
    if (text === "") return;

    tasks.unshift({ id: Date.now(), text: text, done: false });
    inputTask.value = "";
    saveTasks();
    showTasks();
});

// ---------- Tabs: All / Active / Completed ----------
tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        // Every tab goes back to "tab", the clicked one becomes "tab-active"
        tabButtons.forEach(function (b) { b.className = "tab"; });
        button.className = "tab-active";

        currentFilter = button.dataset.filter;
        showTasks();
    });
});

// ---------- Clear All ----------
clearAll.addEventListener("click", function () {
    if (tasks.length === 0) return;
    if (confirm("Delete all tasks?")) {
        tasks = [];
        saveTasks();
        showTasks();
    }
});

// ---------- Theme toggle ----------
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "☀";
}

themeToggle.addEventListener("click", function () {
    const isLight = document.body.classList.toggle("light");
    themeToggle.textContent = isLight ? "☀" : "☾";
    localStorage.setItem("theme", isLight ? "light" : "dark");
});

// ---------- Start ----------
showTasks();