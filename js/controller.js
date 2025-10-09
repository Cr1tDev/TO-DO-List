import * as model from "./model.js";
import view from "./views.js";

export const init = function () {
  model.loadTodos();
  view.render(model.state.todos);

  // Open modal when add button is clicked
  view._AddTaskBtn.addEventListener("click", () => {
    view._initPrioritySelector();
    view._addModalPerentEl.style.display = "flex";
  });

  // Handle saving form data when the user clicks "Save"
  view.addHandlerAddTask(function (taskData) {
    model.addTodo(taskData);
    view.render(model.state.todos);
  });

  // Handle edit Task
  view.addHandlerEdit(function (id, updatedTaskData) {
    model.updateTodo(id, updatedTaskData);
    view.render(model.state.todos);
  });

  // Handle toggle task
  view.addHandlerToggle(function (id) {
    model.toggleTodo(id);
    view.render(model.state.todos);
  });

  // Handle delete task
  view.addHandlerDelete(function (id) {
    model.deleteTodo(id);
    view.render(model.state.todos);
  });
};
