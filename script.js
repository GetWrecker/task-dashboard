const list = document.getElementById("list");
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const search = document.getElementById("search");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// save helper
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// add task
addBtn.onclick = () => {
  const text = input.value.trim();
  const priority = document.getElementById("priority").value;

  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    priority,
    done: false
  });

  input.value = "";
  save();
  render();
};

// toggle
function toggle(id) {
  const t = tasks.find(t => t.id === id);
  if (t) t.done = !t.done;
  save();
  render();
}

// delete
function remove(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

// filter buttons
document.querySelectorAll(".filters button").forEach(btn => {
  btn.onclick = () => {
    filter = btn.dataset.filter;
    render();
  };
});

// render
function render() {
  list.innerHTML = "";

  let data = [...tasks];

  const q = search.value.toLowerCase();
  if (q) {
    data = data.filter(t => t.text.toLowerCase().includes(q));
  }

  if (filter === "done") data = data.filter(t => t.done);
  if (filter === "pending") data = data.filter(t => !t.done);

  data.forEach(t => {
    const li = document.createElement("li");
    li.className = t.done ? "done" : "";

    li.innerHTML = `
      <span onclick="toggle(${t.id})">
        ${t.text} (${t.priority})
      </span>
      <button onclick="remove(${t.id})">x</button>
    `;

    list.appendChild(li);
  });

  updateStats();
}

// stats
function updateStats() {
  document.getElementById("total").textContent = tasks.length;
  document.getElementById("done").textContent =
    tasks.filter(t => t.done).length;
  document.getElementById("pending").textContent =
    tasks.filter(t => !t.done).length;
}

search.oninput = render;

// initial load
render();
