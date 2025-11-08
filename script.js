const apiUrl = "http://localhost:3000";

const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const addBtn = document.getElementById("add-item");
const taskList = document.getElementById("task-list");
const countEl = document.getElementById("count");
const clearBtn = document.getElementById("clearcompleted");

const showAllBtn = document.getElementById("show-all");
const showTodayBtn = document.getElementById("show-today");
const showCompletedBtn = document.getElementById("show-completed");
const showFlaggedBtn = document.getElementById("show-flagged");

let tasks = [];
let currentFilter = "all";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


async function loadTasks() {
  const response = await fetch(`${apiUrl}/tasks`);
  tasks = await response.json();
  displayTasks();
}

function displayTasks() {
  taskList.innerHTML = "";
  let remaining = 0;
  const todayDate = getTodayDate();

  tasks.forEach(task => {
    const taskDateStr = task.date ? task.date.split("T")[0] : "";

    if (currentFilter === "today" && taskDateStr !== todayDate) return;
    if (currentFilter === "flagged" && task.flag !== 1) return;
    if (currentFilter === "completed" && task.completed !== 1) return;

    const li = document.createElement("li");
    if (task.completed === 1) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed === 1;
    checkbox.addEventListener("change", async function () {
      await fetch(`${apiUrl}/update/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: this.checked ? 1 : 0, flag: task.flag }),
      });
      loadTasks();
    });

    const text = document.createTextNode(task.name + (taskDateStr ? " (" + taskDateStr + ")" : ""));

    const flagBtn = document.createElement("button");
    flagBtn.textContent = task.flag ? "🚩" : "🏳️";
    flagBtn.classList.add("flag-btn");
    flagBtn.addEventListener("click", async function () {
      await fetch(`${apiUrl}/update/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: task.completed, flag: task.flag === 1 ? 0 : 1 }),
      });
      loadTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(flagBtn);
    taskList.appendChild(li);

    if (task.completed !== 1) remaining++;
  });

  countEl.textContent = remaining;
}


addBtn.addEventListener("click", async function () {
  const name = taskInput.value.trim();
  const date = taskDate.value || null; 
  if (!name) return alert("Please enter your task");

  await fetch(`${apiUrl}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, date }),
  });

  taskInput.value = "";
  taskDate.value = "";
  loadTasks();
});

clearBtn.addEventListener("click", async function () {
  await fetch(`${apiUrl}/clear`, { method: "DELETE" });
  loadTasks();
});

showAllBtn.addEventListener("click", () => { currentFilter = "all"; displayTasks(); });
showTodayBtn.addEventListener("click", () => { currentFilter = "today"; displayTasks(); });
showCompletedBtn.addEventListener("click", () => { currentFilter = "completed"; displayTasks(); });
showFlaggedBtn.addEventListener("click", () => { currentFilter = "flagged"; displayTasks(); });

loadTasks();

 
