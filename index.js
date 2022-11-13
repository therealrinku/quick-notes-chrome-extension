const notesList = document.querySelector(".notes-list");
const note = document.querySelector(".note");
const form = document.getElementsByTagName("form")[0];
const input = document.getElementsByTagName("input")[0];

const clearButton = document.querySelector(".clear-btn");
const toggleInputButton = document.querySelector(".toggle-input-btn");
const privacyModeButton = document.querySelector(".privacy-mode-btn");

const isFormHidden = localStorage.getItem("formHidden");
const privacyMode = localStorage.getItem("privacyMode");

clearButton.addEventListener("click", () => {
  localStorage.removeItem("notes");
  notesList.remove();
});

toggleInputButton.addEventListener("click", () => {
  localStorage.setItem("formHidden", isFormHidden === "false" ? "true" : "false");
  document.body.classList.toggle("hide-form");
  styleActiveButtons();
});

privacyModeButton.addEventListener("click", () => {
  const notes = JSON.parse(localStorage.getItem("notes") || "");
  if (!notes) return;
  if (notesList.childNodes[0].textContent.includes("*")) {
    notesList.innerHTML = "";
    localStorage.setItem("privacyMode", "false");
    return notes.forEach((note) => addNote(note));
  }
  localStorage.setItem("privacyMode", "true");
  styleActiveButtons();
  return notesList.childNodes.forEach((child) => (child.textContent = "*************"));
});

// function showHideNoNotesAlert() {
//     const container = document.createElement("div");
//     container.classList.add("no-notes-container");
//     if (notesList.contains(container)) {
//       return notesList.removeChild(container);
//     }
//     const emptyBoxImage = document.createElement("img");
//     emptyBoxImage.src = "https://img.icons8.com/ios-filled/2x/empty-box.png";
//     emptyBoxImage.alt = "empty-box-image";
//     const emptyBoxText = document.createElement("p");
//     emptyBoxText.innerText = "No any notes found";
//     container.appendChild(emptyBoxImage);
//     container.appendChild(emptyBoxText);
//     notesList.appendChild(container);
// }

const notes = JSON.parse(localStorage.getItem("notes") || "[]");

function addNote(note) {
  const privacyMode = localStorage.getItem("privacyMode");
  const newNote = document.createElement("section");
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-button";
  deleteBtn.innerText = "X";
  deleteBtn.addEventListener("click", () => {
    const answer = confirm("Are you sure want to delete this note?");
    if (answer) {
      //delete note
      const todos = JSON.parse(localStorage.getItem("notes") || "[]");
      const filteredTodos = todos.filter((d) => d !== deleteBtn.getAttribute("todo"));
      localStorage.setItem("notes", JSON.stringify(filteredTodos));
      alert("Deleted the note successfully!");
      notesList.innerHTML = "";
      return filteredTodos.forEach((note) => addNote(note));
    }
  });

  newNote.className = "note";

  newNote.innerText = note;
  if (privacyMode === "true") {
    newNote.innerText = "*************";
  }

  deleteBtn.setAttribute("todo", note);
  newNote.appendChild(deleteBtn);

  notesList.appendChild(newNote);
  // showHideNoNotesAlert();
}

function styleActiveButtons() {
  const privacyMode = localStorage.getItem("privacyMode");
  const isFormHidden = localStorage.getItem("formHidden");

  if (privacyMode === "true") {
    privacyModeButton.style.border = "solid 2px coral";
  }
  if (isFormHidden === "true") {
    toggleInputButton.style.border = "solid 2px coral";
  }
}

function populateNotes(data) {
  if (isFormHidden === "true") document.body.classList.toggle("hide-form");
  // if (!notes.length) return showHideNoNotesAlert();
  styleActiveButtons();
  return data.forEach((note) => addNote(note));
}

populateNotes(notes);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!input.value.trim().length) return;
  addNote(input.value);

  const lastNotes = notes || [];
  localStorage.setItem("notes", JSON.stringify([...lastNotes, input.value]));
  input.value = "";
});
