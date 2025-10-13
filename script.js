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

var tasks = [];
var currentFilter = "all";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function loadTasks() {
  var response = await fetch(apiUrl + "/tasks");
  var data = await response.json();
  tasks = data;
  displayTasks();
}

function displayTasks() {
  taskList.innerHTML = "";
  var remaining = 0;
  var todayDate = getTodayDate();

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];

    const taskDateStr = task.date ? task.date.split("T")[0] : "";

    if (currentFilter === "today" && taskDateStr !== todayDate) continue;
    if (currentFilter === "flagged" && task.flag !== 1) continue;
    if (currentFilter === "completed" && task.completed !== 1) continue;

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed === 1;
    checkbox.addEventListener("change", async function () {
      await fetch(apiUrl + "/update/" + task.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: this.checked ? 1 : 0, flag: task.flag }),
      });
      loadTasks();
    });

    const text = document.createTextNode(task.name + (taskDateStr ? " (" + taskDateStr + ")" : ""));

    const flagBtn = document.createElement("button");
    flagBtn.textContent = task.flag ? "🚩" : "🏳️";
    flagBtn.addEventListener("click", async function () {
      await fetch(apiUrl + "/update/" + task.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: task.completed, flag: task.flag === 1 ? 0 : 1 }),
      });
      loadTasks();
    }); 

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(flagBtn);
    taskList.append(li);

    if (task.completed !== 1) remaining++;
  }

  countEl.textContent = remaining;
  
}

addBtn.addEventListener("click", async function () {
  const name = taskInput.value.trim();
  const date = taskDate.value;

  if (!name) {
    alert("please enter your task");
    return;
  }

  await fetch(apiUrl + "/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, date }),
  });

  taskInput.value = "";
  taskDate.value = "";
  loadTasks();
});

clearBtn.addEventListener("click", async function () {
  await fetch(apiUrl + "/clear", { method: "DELETE" });
  loadTasks();
});

showAllBtn.addEventListener("click", function () {
  currentFilter = "all";
  displayTasks();
});

showTodayBtn.addEventListener("click", function () {
  currentFilter = "today";
  displayTasks();
});

showCompletedBtn.addEventListener("click", function () {
  currentFilter = "completed";
  displayTasks();
});

showFlaggedBtn.addEventListener("click", function () {
  currentFilter = "flagged";
  displayTasks();
});

loadTasks(); 
 
