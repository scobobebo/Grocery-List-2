
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, set, push, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6LMVqO9dltRwNzKZKDixwjPeSgVi_828",
  authDomain: "grocery-list-d3fbd.firebaseapp.com",
  projectId: "grocery-list-d3fbd",
  storageBucket: "grocery-list-d3fbd.appspot.com",
  messagingSenderId: "573221066119",
  appId: "1:573221066119:web:39f2ab864507267fac6f22",
  databaseURL: "https://grocery-list-d3fbd-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Add new section logic
document.getElementById("addSectionBtn").addEventListener("click", () => {
  const input = document.getElementById("sectionInput");
  const sectionName = input.value.trim();
  if (sectionName === "") return;

  const sectionRef = ref(db, \`groceryApp/sections/grocerySections/\${sectionName}\`);
  set(sectionRef, {
    createdAt: new Date().toISOString()
  });

  const orderRef = ref(db, "groceryApp/sections/sectionOrder");
  onValue(orderRef, (snapshot) => {
    let order = snapshot.val() || [];
    if (!order.includes(sectionName)) {
      order.push(sectionName);
      set(orderRef, order);
    }
  }, {
    onlyOnce: true
  });

  input.value = "";
});

// Load and display sections
function loadSections() {
  const sectionContainer = document.getElementById("sectionContainer");
  sectionContainer.innerHTML = "";

  const orderRef = ref(db, "groceryApp/sections/sectionOrder");
  const dataRef = ref(db, "groceryApp/sections/grocerySections");

  onValue(orderRef, (orderSnapshot) => {
    const sectionOrder = orderSnapshot.val();

    if (!sectionOrder) return;

    onValue(dataRef, (dataSnapshot) => {
      const sectionsData = dataSnapshot.val() || {};

      sectionContainer.innerHTML = "";

      sectionOrder.forEach((sectionName) => {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "section";
        sectionDiv.textContent = sectionName;

        // Optional: show items inside section
        const items = sectionsData[sectionName];
        if (items) {
          const ul = document.createElement("ul");
          Object.keys(items).forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);
          });
          sectionDiv.appendChild(ul);
        }

        sectionContainer.appendChild(sectionDiv);
      });
    });
  });
}

loadSections();
