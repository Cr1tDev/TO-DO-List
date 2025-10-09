import * as model from "./model.js";
import view from "./views.js";

export const init = function () {
  model.loadTodos();
  view.render(model.state.todos);

  // Handle Add Task
  const controlAddTask = function () {
    // Open modal when add button is clicked
    view._AddTaskBtn.addEventListener("click", () => {
      view._initPrioritySelector();
      view._addModalPerentEl.style.display = "flex";
    });

    // Handle saving form data when the user clicks "Save"
    const controlTaskData = function (taskData) {
      console.log("🟢 New Task Data:", taskData);
      model.addTodo(taskData);
      view.render(model.state.todos);
    };

    view.addHandlerAddTask(controlTaskData);
  };

  controlAddTask();
};
