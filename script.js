
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6LMVqO9dltRwNzKZKDixwjPeSgVi_828",
  authDomain: "grocery-list-d3fbd.firebaseapp.com",
  databaseURL: "https://grocery-list-d3fbd-default-rtdb.firebaseio.com",
  projectId: "grocery-list-d3fbd",
  storageBucket: "grocery-list-d3fbd.appspot.com",
  messagingSenderId: "573221066119",
  appId: "1:573221066119:web:39f2ab864507267fac6f22"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let grocerySections = {};
let sectionOrder = [];

function renderSections() {
  const sectionsDiv = document.getElementById('sections');
  sectionsDiv.innerHTML = '';

  sectionOrder.forEach((section) => {
    if (!(section in grocerySections)) return;

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section';

    const title = document.createElement('h2');
    title.textContent = section;

    const upBtn = document.createElement('button');
    upBtn.textContent = '⬆️';
    upBtn.onclick = () => moveSection(section, -1);

    const downBtn = document.createElement('button');
    downBtn.textContent = '⬇️';
    downBtn.onclick = () => moveSection(section, 1);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️ Delete';
    deleteBtn.onclick = () => {
      if (confirm(`Are you sure you want to delete "${section}"?`)) {
        delete grocerySections[section];
        sectionOrder = sectionOrder.filter(name => name !== section);
        saveData();
      }
    };

    sectionDiv.appendChild(title);
    sectionDiv.appendChild(upBtn);
    sectionDiv.appendChild(downBtn);
    sectionDiv.appendChild(deleteBtn);

    const itemInput = document.createElement('input');
    itemInput.placeholder = `Add item to ${section}`;
    const addItemBtn = document.createElement('button');
    addItemBtn.textContent = 'Add';
    addItemBtn.onclick = () => {
      const name = itemInput.value.trim();
      if (name === '') return;
      grocerySections[section].push({ name, checked: false });
      itemInput.value = '';
      saveData();
    };
    sectionDiv.appendChild(itemInput);
    sectionDiv.appendChild(addItemBtn);

    const list = document.createElement('ul');
    grocerySections[section].forEach((item, index) => {
      const li = document.createElement('li');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = item.checked;
      checkbox.addEventListener('change', () => {
        grocerySections[section][index].checked = checkbox.checked;
        saveData();
      });

      const itemText = document.createElement('span');
      itemText.textContent = item.name;
      if (item.checked) itemText.classList.add('checked');

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        grocerySections[section].splice(index, 1);
        saveData();
      };

      li.appendChild(checkbox);
      li.appendChild(itemText);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });

    sectionDiv.appendChild(list);
    sectionsDiv.appendChild(sectionDiv);
  });
}

function addSection() {
  const input = document.getElementById('sectionInput');
  const sectionName = input.value.trim();
  if (sectionName === '' || grocerySections[sectionName]) return;
  grocerySections[sectionName] = [];
  sectionOrder.push(sectionName);
  input.value = '';
  saveData();
}

function moveSection(sectionName, direction) {
  const index = sectionOrder.indexOf(sectionName);
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= sectionOrder.length) return;
  const temp = sectionOrder[newIndex];
  sectionOrder[newIndex] = sectionOrder[index];
  sectionOrder[index] = temp;
  saveData();
}

function saveData() {
  db.ref("groceryApp/sections").set({
    grocerySections,
    sectionOrder
  }, (error) => {
    if (error) {
      console.error("❌ Firebase write failed:", error);
    }
  });
}

function loadData() {
  db.ref("groceryApp/sections").on("value", (snapshot) => {
    const data = snapshot.val();
    console.log("🔥 Firebase loaded:", data); // ✅ Add this line

    if (data) {
  grocerySections = data.grocerySections || {};
  sectionOrder = data.sectionOrder || Object.keys(grocerySections);

  // Ensure every section from sectionOrder exists in grocerySections
  sectionOrder.forEach(section => {
    if (!grocerySections[section]) {
      grocerySections[section] = [];
    }
  });

  renderSections();
} else {
      // First-time setup
      const defaultSections = [
        "Proteins & Meats",
        "Dairy & Refrigerated",
        "Fruits",
        "Vegetables",
        "Canned & Packaged Goods",
        "Grains & Bread",
        "Snacks & Sweets"
      ];
      defaultSections.forEach(section => grocerySections[section] = []);
      sectionOrder = [...defaultSections];
      saveData();
    }
  });
}


// ✅ Load data when the page loads
window.onload = function () {
  loadData();
};

