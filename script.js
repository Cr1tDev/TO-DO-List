// import { init } from "./js/controller.js";
// init();

const modalContainer = document.querySelector(".modal-overlay-add");

modalContainer.classList.add("show");
const addTaskBtn = document.querySelector(".save__add");

addTaskBtn.addEventListener("click", function () {
  const taskName = document.querySelector(".add-input__name").value;
  const dueDate = document.querySelector(".add-input__date").value;

  const radioLables = document.querySelectorAll(".radio-label__edit");
  let selectedPriority = null;
  radioLables.forEach((label) => {
    label.addEventListener("click", () => {
      radioLables.forEach((l) => l.classList.remove());
    });
  });

  console.log(priority);

  console.log(taskName);
  console.log(dueDate);
});
