const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const tabs = document.querySelectorAll(".tab");

let tasks = [];

function renderTasks(filter = "today") {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "completed") filteredTasks = tasks.filter(t => t.completed);
  else if (filter === "flagged") filteredTasks = tasks.filter(t => t.flagged);
  else if (filter === "scheduled") filteredTasks = tasks.filter(t => t.scheduled);
  else if (filter === "today") filteredTasks = tasks.filter(t => !t.completed);

  if (filteredTasks.length === 0) {
    taskList.innerHTML = "<p style='text-align:center;color:#777'>No Reminders</p>";
    return;
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleComplete(${index})">✓</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, completed: false, flagged: false, scheduled: false });
  taskInput.value = "";
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => e.key === "Enter" && addTask());

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderTasks(tab.dataset.tab);
  });
});

renderTasks();