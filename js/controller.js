import * as model from "./model.js";
import view from "./views.js";

export const init = function () {
  model.loadTodos();
  console.log(model.state.todos);

  const eventHandler = function () {
    view.render();
  };

  const controllAddTask = function () {
    // Open modal when add button is clicked
    view._AddTaskBtn.addEventListener("click", () => {
      view._initPrioritySelector();
      view._addModalPerentEl.style.display = "flex";
    });

    // Handle saving form data when the user clicks "Save"
    view.addHandlerAddTask(function (taskData) {
      console.log("🟢 New Task Data:", taskData);

      // You can now store it in the model
      // model.addTodo(taskData);
      // view.render(model.state.todos);
    });
  };

  controllAddTask();
  eventHandler();
};
