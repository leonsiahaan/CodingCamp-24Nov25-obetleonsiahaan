const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const errorMsg = document.getElementById("errorMsg");
const deleteAllBtn = document.getElementById("deleteAll");
const filterSelect = document.getElementById("filterSelect");
const searchInput = document.getElementById("searchInput");

let tasks = [];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function renderTasks(filter = "all", searchText = "") {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (filter === "done") filteredTasks = tasks.filter(t => t.done);
  if (filter === "pending") filteredTasks = tasks.filter(t => !t.done);

  if (searchText.trim() !== "") {
    filteredTasks = filteredTasks.filter(t => 
      t.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<tr><td colspan="4" class="empty">No tasks yet</td></tr>`;
    return;
  }

  filteredTasks.forEach((task, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.name}</td>
      <td>${task.date}</td>
      <td>${task.done ? "Selesai" : "Pending"}</td>
      <td>
        ${task.done 
          ? `<span style="color:green;font-weight:bold;">✔ Completed</span>` 
          : `
            <button class="action-btn done-btn" onclick="toggleDone(${index})">✔</button>
            <button class="action-btn delete-btn" onclick="deleteTask(${index})">✖</button>
          `
        }
      </td>
    `;
    taskList.appendChild(row);
  });
}

function addTask() {
  const taskName = taskInput.value.trim();
  const taskDate = dateInput.value;

  if (!taskName || !taskDate) {
    errorMsg.textContent = "Please fill task and date!";
    return;
  }

  const today = new Date().setHours(0,0,0,0);
  const selectedDate = new Date(taskDate).setHours(0,0,0,0);

  if (selectedDate < today) {
    errorMsg.textContent = "Enter a valid date (today or later)!";
    return;
  }

  tasks.push({ name: taskName, date: formatDate(taskDate), done: false });
  taskInput.value = "";
  dateInput.value = "";
  errorMsg.textContent = "";
  renderTasks(filterSelect.value, searchInput.value);
}

function toggleDone(index) {
  tasks[index].done = true; // lock task
  renderTasks(filterSelect.value, searchInput.value);
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks(filterSelect.value, searchInput.value);
}

addBtn.addEventListener("click", addTask);

deleteAllBtn.addEventListener("click", () => {
  if (tasks.length === 0) return;
  const confirmDelete = confirm("Are you sure to delete all tasks?");
  if (confirmDelete) {
    tasks = [];
    renderTasks();
  }
});

filterSelect.addEventListener("change", () => {
  renderTasks(filterSelect.value, searchInput.value);
});

searchInput.addEventListener("input", () => {
  renderTasks(filterSelect.value, searchInput.value);
});

renderTasks();
