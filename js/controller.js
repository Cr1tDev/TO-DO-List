import * as model from "./modal.js";
import view from "./views.js";

export const init = function () {
  model.loadTodos();
  console.log(model.state.todos);
};
