
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6LMVqO9dltRwNzKZKDixwjPeSgVi_828",
  authDomain: "grocery-list-d3fbd.firebaseapp.com",
  projectId: "grocery-list-d3fbd",
  storageBucket: "grocery-list-d3fbd.appspot.com",
  messagingSenderId: "573221066119",
  appId: "1:573221066119:web:39f2ab864507267fac6f22",
  databaseURL: "https://grocery-list-d3fbd-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById("addSectionBtn").addEventListener("click", () => {
  const input = document.getElementById("sectionInput");
  const sectionName = input.value.trim();
  if (sectionName === "") return;

  const sectionRef = ref(db, \`sections/\${sectionName}\`);
  set(sectionRef, {
    createdAt: new Date().toISOString()
  });

  input.value = "";
});

function loadSections() {
  const sectionContainer = document.getElementById("sectionContainer");
  const sectionListRef = ref(db, "sections");

  onValue(sectionListRef, (snapshot) => {
    sectionContainer.innerHTML = "";
    const sections = snapshot.val();
    if (sections) {
      Object.keys(sections).forEach((key) => {
        const div = document.createElement("div");
        div.className = "section";
        div.textContent = key;
        sectionContainer.appendChild(div);
      });
    }
  });
}

loadSections();
