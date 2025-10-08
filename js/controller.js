import * as model from "./model.js";
import view from "./views.js";

export const init = function () {
  model.loadTodos();
  console.log(model.state.todos);

  const eventHandler = function () {
    view.addHandlerAddTask();
  };

  eventHandler();
};
