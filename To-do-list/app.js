document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");

  const taskInput = document.getElementById("taskInput");

  const categoryInput = document.getElementById("category");

  const priorityInput = document.getElementById("priority");

  const dueDateInput = document.getElementById("dueDate");

  const taskList = document.getElementById("taskList");

  const emptyState = document.getElementById("emptyState");

  const searchInput = document.getElementById("searchInput");

  const errorMessage = document.getElementById("errorMessage");

  const totalCount = document.getElementById("totalCount");

  const pendingCount = document.getElementById("pendingCount");

  const completedCount = document.getElementById("completedCount");

  const themeBtn = document.getElementById("themeBtn");

  const filterButtons = document.querySelectorAll(".filter-btn");

  // =========================
  // DATA
  // =========================

  let tasks = JSON.parse(localStorage.getItem("taskFlowTasks")) || [];

  let currentFilter = "all";

  // =========================
  // SAVE TASKS
  // =========================

  function saveTasks() {
    localStorage.setItem("taskFlowTasks", JSON.stringify(tasks));
  }

  // =========================
  // ADD TASK
  // =========================

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
      errorMessage.textContent = "Please enter a task.";

      taskInput.focus();

      return;
    }

    if (title.length < 5) {
      errorMessage.textContent = "Task must contain at least 5 characters.";

      taskInput.focus();

      return;
    }

    errorMessage.textContent = "";

    // Create task

    const newTask = {
      id: Date.now(),

      title: title,

      category: categoryInput.value,

      priority: priorityInput.value,

      dueDate: dueDateInput.value,

      completed: false,
    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

    // Reset form

    taskForm.reset();

    priorityInput.value = "Medium";

    taskInput.focus();
  });

  // =========================
  // RENDER TASKS
  // =========================

  function renderTasks() {
    taskList.innerHTML = "";

    const searchTerm = searchInput.value.trim().toLowerCase();

    let filteredTasks = tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm);

      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "pending" && !task.completed) ||
        (currentFilter === "completed" && task.completed);

      return matchesSearch && matchesFilter;
    });

    // Empty state

    if (filteredTasks.length === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
    }

    filteredTasks.forEach((task) => {
      const taskElement = createTaskElement(task);

      taskList.appendChild(taskElement);
    });

    updateStatistics();
  }

  // =========================
  // CREATE TASK ELEMENT
  // =========================

  function createTaskElement(task) {
    const taskDiv = document.createElement("div");

    taskDiv.className = "task";

    if (task.completed) {
      taskDiv.classList.add("completed");
    }

    // Left side

    const leftDiv = document.createElement("div");

    leftDiv.className = "task-left";

    // Complete button

    const completeButton = document.createElement("button");

    completeButton.className = "complete-btn";

    completeButton.title = "Mark as complete/pending";

    completeButton.addEventListener("click", () => toggleTask(task.id));

    // Content

    const contentDiv = document.createElement("div");

    contentDiv.className = "task-content";

    const title = document.createElement("div");

    title.className = "task-title";

    title.textContent = task.title;

    // Information

    const infoDiv = document.createElement("div");

    infoDiv.className = "task-info";

    // Category

    const category = document.createElement("span");

    category.className = "badge";

    category.textContent = task.category;

    // Priority

    const priority = document.createElement("span");

    priority.className = `priority ${task.priority.toLowerCase()}`;

    priority.textContent = `${task.priority} Priority`;

    infoDiv.appendChild(category);

    infoDiv.appendChild(priority);

    // Due date

    if (task.dueDate) {
      const dueDate = document.createElement("span");

      dueDate.className = "due-date";

      dueDate.textContent = `Due: ${formatDate(task.dueDate)}`;

      infoDiv.appendChild(dueDate);
    }

    contentDiv.appendChild(title);

    contentDiv.appendChild(infoDiv);

    leftDiv.appendChild(completeButton);

    leftDiv.appendChild(contentDiv);

    // Actions

    const actionsDiv = document.createElement("div");

    actionsDiv.className = "task-actions";

    // Edit button

    const editButton = document.createElement("button");

    editButton.className = "action-btn edit-btn";

    editButton.textContent = "✏️";

    editButton.title = "Edit task";

    editButton.addEventListener("click", () => editTask(task.id));

    // Delete button

    const deleteButton = document.createElement("button");

    deleteButton.className = "action-btn delete-btn";

    deleteButton.textContent = "🗑️";

    deleteButton.title = "Delete task";

    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actionsDiv.appendChild(editButton);

    actionsDiv.appendChild(deleteButton);

    taskDiv.appendChild(leftDiv);

    taskDiv.appendChild(actionsDiv);

    return taskDiv;
  }

  // =========================
  // TOGGLE TASK
  // =========================

  function toggleTask(id) {
    tasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed,
        };
      }

      return task;
    });

    saveTasks();

    renderTasks();
  }

  // =========================
  // EDIT TASK
  // =========================

  function editTask(id) {
    const task = tasks.find((task) => task.id === id);

    if (!task) return;

    const newTitle = prompt("Edit your task:", task.title);

    if (newTitle === null) return;

    const title = newTitle.trim();

    if (title === "") {
      alert("Task cannot be empty.");

      return;
    }

    if (title.length < 2) {
      alert("Task must contain at least 2 characters.");

      return;
    }

    task.title = title;

    saveTasks();

    renderTasks();
  }

  // =========================
  // DELETE TASK
  // =========================

  function deleteTask(id) {
    const task = tasks.find((task) => task.id === id);

    if (!task) return;

    const confirmed = confirm(`Delete "${task.title}"?`);

    if (!confirmed) return;

    tasks = tasks.filter((task) => task.id !== id);

    saveTasks();

    renderTasks();
  }

  // =========================
  // SEARCH
  // =========================

  searchInput.addEventListener("input", renderTasks);

  // =========================
  // FILTER
  // =========================

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      currentFilter = button.dataset.filter;

      renderTasks();
    });
  });

  // =========================
  // STATISTICS
  // =========================

  function updateStatistics() {
    const total = tasks.length;

    const completed = tasks.filter((task) => task.completed).length;

    const pending = total - completed;

    totalCount.textContent = total;

    completedCount.textContent = completed;

    pendingCount.textContent = pending;
  }

  // =========================
  // FORMAT DATE
  // =========================

  function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // =========================
  // DARK MODE
  // =========================

  const savedTheme = localStorage.getItem("taskFlowTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";
  }

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    if (isDark) {
      themeBtn.textContent = "☀️";

      localStorage.setItem("taskFlowTheme", "dark");
    } else {
      themeBtn.textContent = "🌙";

      localStorage.setItem("taskFlowTheme", "light");
    }
  });

  // =========================
  // INITIAL RENDER
  // =========================

  renderTasks();
});
