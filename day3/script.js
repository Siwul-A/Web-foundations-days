let notes=[
    {id:1, text:"Buy milk and bread", category: "personal"},
    {id:2, text:"Finish the Day 3 assignment", category: "study"},
    {id:3, text:"Email the project report to Grace", category: "work"},
    {id:4, text:"Revise javascript Arrays", category: "study"},
    {id:5, text: "Call mum", category: "personal"}
]
function searchNotes(word){
    const searchItem = word.toLowerCase();
        return notes.filter((note) => note.text.toLowerCase().includes(searchItem));
};
function longestNote(){
    if(notes.length===0) {return null;}
    return  notes.reduce((longest, current) => {
        return current.text.length > longest.text.length ? current: longest;
    }, notes[0] );
}
function countByCategory(){
    const counts = {};
    for(const note of notes){
        const cat = note.category;
        counts[cat] = (counts[cat] || 0) +1;
    } return counts;
}
function getSummary(){
    const total = notes.length;
    const label = total === 1 ? "note" : "notes";
    const counts = countByCategory();
    const details = Object.entries(counts)
    .map(([cat, count]) => `${count} ${cat}`)
    .join(", ");
    return `${total} ${label}: ${details}.`;
}
function isDuplicate(text){
    const cleanInput = text.trim().toLowerCase();
    return notes.some((note) => note.text.trim().toLowerCase() === cleanInput);  
}
function addNote(text, category) {
  const trimmedText = text ? text.trim() : "";
  const validCategories = ["personal", "work", "study"];

  if (trimmedText.length < 1 || trimmedText.length > 200) {
    console.log("❌ Failed to add note: Text must be between 1 and 200 characters.");
    return false;
  }

  if (isDuplicate(trimmedText)) {
    console.log("❌ Failed to add note: Duplicate note text already exists.");
    return false;
  }

  if (!validCategories.includes(category)) {
    console.log("❌ Failed to add note: Category must be personal, work, or study.");
    return false;
  }

  const newNote = {
    id: Date.now(),
    text: trimmedText,
    category: category,
  };

  notes.push(newNote);
  console.log(`✅ Note added successfully: "${trimmedText}"`);
  return true;
}
console.log("--- Testing searchNotes ---");
console.log(searchNotes("javascript")); 
console.log(searchNotes("python")); 

console.log("\n--- Testing longestNote ---");
console.log(longestNote()); // 

console.log("\n--- Testing countByCategory ---");
console.log(countByCategory()); 

console.log("\n--- Testing getSummary ---");
console.log(getSummary()); 

console.log("\n--- Testing isDuplicate ---");
console.log(isDuplicate("  buy milk and bread  ")); 
console.log(isDuplicate("Clean the house")); 

console.log("\n--- Testing addNote ---");
console.log(addNote("Practice coding daily", "study")); 
console.log(addNote("Call mum", "personal")); 
console.log(addNote("Go to gym", "fitness")); 
console.log(addNote("   ", "personal")); 