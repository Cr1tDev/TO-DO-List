import * as model from "./model.js";
import view from "./views.js";

function applyFilter() {
  let filtered = [];

  switch (model.state.currentFilter) {
    case "active":
      filtered = model.state.todos.filter((t) => !t.completed);
      break;
    case "completed":
      filtered = model.state.todos.filter((t) => t.completed);
      break;
    case "high":
      filtered = model.state.todos.filter((t) => t.priority === "high");
      break;
    default:
      filtered = model.state.todos;
  }

  view.render(filtered);
}

const controlFilter = function (filterType) {
  model.state.currentFilter = filterType;
  applyFilter();
};

const controlAdd = function (taskData) {
  model.addTodo(taskData);
  applyFilter();
};

const controlToggle = function (id) {
  model.toggleTodo(id);
  applyFilter();
};

const controlDelete = function (id) {
  model.deleteTodo(id);
  applyFilter();
};

const controlEdit = function (id, updatedTaskData) {
  model.updateTodo(id, updatedTaskData);
  applyFilter();
};

export const init = function () {
  model.loadTodos();

  // Open Add Modal (only toggles modal visibility and setups add priority)
  view._AddTaskBtn.addEventListener("click", () => {
    view._initPrioritySelector(); // sets up add-modal priority delegation (idempotent)
    view._addModalPerentEl.style.display = "flex";
  });

  // Pass a getter for full data to the edit handler so it can always find the correct task
  view.addHandlerEdit(controlEdit, () => model.state.todos);

  // Other handlers
  view.addHandlerFilter(controlFilter);
  view.addHandlerAddTask(controlAdd);
  view.addHandlerToggle(controlToggle);
  view.addHandlerDelete(controlDelete);

  // initial render with current filter
  applyFilter();
};
