const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggleBtn = document.querySelector("#theme-toggle");

const DRAFT_KEY = "note-draft";
const THEME_KEY = "theme-preference";

function loadSavedData(){
  const savedDraft = localStorage.getItem(DRAFT_KEY);
  if(savedDraft !== null){
    textarea.value = savedDraft;
  }
  const savedTheme = localStorage.getItem(THEME_KEY);
  if(savedTheme === "dark"){
    document.body.classList.add("dark");
    themeToggleBtn.textContent = "Light mode";    
  } else{
    themeToggleBtn.textContent = "Dark mode";
  }
  updateCounts();
}
function updateCounts(){
  const text = textarea.value;
  const length = text.length;
  const words = text.trim() === "" ? 0:text.trim().split(/\s+/).length;
  charCount.textContent = `${length}/200 characters`;
  wordCount.textContent = `${words} words`;
  charCount.classList.remove("warning", "over");
  if(length > 200){charCount.classList.add("over");    
  } else if(length > 180){
    charCount.classList.add("warning");
  }
  localStorage.setItem(DRAFT_KEY, text);
}
function clearNote(){
  textarea.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
  textarea.focus();
}
textarea.addEventListener("input", updateCounts);
textarea.addEventListener("keydown", (event) =>{
  if(event.key === "Escape") {
    clearNote();
  }
});
clearBtn.addEventListener("click", clearNote);
themeToggleBtn.addEventListener("click", () =>{
  document.body.classList.toggle("dark");
  if(document.body.classList.contains("dark")){
    themeToggleBtn.textContent = "Light mode";
    localStorage.setItem(THEME_KEY, "dark");
  } else{
    themeToggleBtn.textContent = "Dark mode";
    localStorage.setItem(THEME_KEY, "light");
  }
});
loadSavedData();