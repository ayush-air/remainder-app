var taskInput = document.getElementById("task-input");
var taskDate = document.getElementById("task-date");
var addBtn = document.getElementById("add-item");
var taskList = document.getElementById("task-list");
var countSpan = document.getElementById("count");
var filterButtons = document.querySelectorAll(".filter button");
var clearBtn = document.getElementById("clearcompleted");

var tasks = [];

function updateCount() {
    var remainingTasks = tasks.filter(function(task) {
        return task.completed === false;
    });
    countSpan.textContent = "Tasks: " + remainingTasks.length;
}

function getToday() {
    var todayDate = new Date();
    var year = todayDate.getFullYear();
    var month = String(todayDate.getMonth() + 1);
    var day = String(todayDate.getDate())
    return year + "-" + month + "-" + day;
}

function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    var today = getToday();

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];

        if (filter === "today" && task.date !== today) continue;
        if (filter === "schedule" && (!task.date || task.date <= today)) continue;
        if (filter === "complete" && task.completed === false) continue;
        if (filter === "flag" && task.flag === false) continue;

        let li = document.createElement("li");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function() {
            task.completed = this.checked;
            renderTasks(filter);
        });
        li.appendChild(checkbox);

        let taskText = document.createTextNode(" " + task.name + " (" + (task.date || "No Date" ) + ") ");
        li.appendChild(taskText);

        let flagBtn = document.createElement("button");
        flagBtn.textContent = task.flag ? "🚩" : "🏳️";
        flagBtn.title = "MARK AS IMPORTANT";
        flagBtn.addEventListener("click", function() {
            task.flag = !task.flag;
            renderTasks(filter);
        });
        li.appendChild(flagBtn);

        taskList.appendChild(li);
    }

    updateCount();
}
addBtn.addEventListener("click", function() {
    var name = taskInput.value.trim();
    var date = taskDate.value;

    if (name === "") return;

    tasks.push({
        name: name,
        date: date,
        completed: false,
        flag: false
    });

    taskInput.value = "";
    taskDate.value = "";

    renderTasks();
});

for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener("click", function() {
        var filter = this.getAttribute("data-filter");
        renderTasks(filter);
    });
}
clearBtn.addEventListener("click", function() {
    tasks = tasks.filter(function(task) {
        return task.completed === false;
    });
    renderTasks();
});

var filterButtons = document.querySelectorAll(".filter button");

for (var i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener("click", function() {
        for (var j = 0; j < filterButtons.length; j++) {
            filterButtons[j].classList.remove("active");
        }
        this.classList.add("active");
    });
}
