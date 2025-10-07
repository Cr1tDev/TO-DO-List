import * as model from "./modal.js";

export const init = function () {
  model.addTodo("test Task");
  model.addTodo("test two");
  console.log(model.state.todos);
};
