// ======================= Storage Controller =======================
const StorageCtrl = (function() {
  return {
    // Public methods
    storeItem: function(item) {
      let items;
      // Check if any items in localStorage
      if (localStorage.getItem("items") === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Get items
        items = JSON.parse(localStorage.getItem("items"));
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    deleteItem: function(currentItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function(item, index) {
        if (currentItem.id === item.id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    clearAllItems: function() {
      localStorage.removeItem("items");
    },
    updateItem: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function(item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    }
  };
})();

//========================== Item Controller ===========================
const ItemCtrl = (function() {
  // Private
  // Item Contructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    // items: [
    //   // new Item(0, "Steak Dinner", 1200),
    //   // new Item(1, "Eggs", 200),
    //   // new Item(2, "Pizza", 700)
    // ],
    currentItem: null,
    totalCalories: 0
  };

  // Public
  return {
    getItems: function() {
      return data.items;
    },
    logData: function() {
      return data;
    },
    addItem: function(name, calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items.length;
      } else {
        ID = 0;
      }

      // Caloires to num
      calories = parseInt(calories);

      // Create new item object
      newItem = new Item(ID, name, calories);

      // Push newItem
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      // Loop thru items
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      // Calories to num
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function(id) {
      // Get ids
      const ids = data.items.map(function(item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(currentItem) {
      data.currentItem = currentItem;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;
      data.items.forEach(function(item) {
        total += item.calories;
      });
      data.totalCalories = total;
      // Set totalCalories in data structure
      return data.totalCalories;
    }
  };
})();

//=========================== UI Controller ===========================
const UICtrl = (function() {
  // Private
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    nameInput: "#item-name",
    caloriesInput: "#item-calories",
    totalCalories: ".total-calories",
    listItems: "#item-list li",
    clearBtn: ".clear-btn"
  };

  // Public
  return {
    populateItemList: function(items) {
      let html = "";

      items.forEach(function(item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-edit"></i></a>
        </li>
        `;
      });

      // Insert lists
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    addListItem: function(item) {
      // Show itemList
      document.querySelector(UISelectors.itemList).style.display = "block";

      document.querySelector(UISelectors.itemList).innerHTML += `
      <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-edit"></i></a>
      </li>
      `;
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearListItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      // Remove list
      listItems.forEach(function(listItem) {
        listItem.remove();
      });
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      // Update list
      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          listItem.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-edit"></i></a>
          `;
        }
      });
    },
    clearForm: function() {
      document.querySelector(UISelectors.nameInput).value = "";
      document.querySelector(UISelectors.caloriesInput).value = "";
    },
    addItemToForm: function() {
      // Get current item
      const currentItem = ItemCtrl.logData().currentItem;

      // Show in form
      document.querySelector(UISelectors.nameInput).value = currentItem.name;
      document.querySelector(UISelectors.caloriesInput).value =
        currentItem.calories;

      // Change edit state
      UICtrl.showEditState();
    },
    getSelectors: function() {
      return UISelectors;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.nameInput).value,
        calories: document.querySelector(UISelectors.caloriesInput).value
      };
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearForm();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    }
  };
})();

//============================= App Controller ============================
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable submit on enter
    document.addEventListener("keypress", function(e) {
      // When hit enter
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Back btn event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", function(e) {
        UICtrl.clearEditState();
        e.preventDefault();
      });

    // Back btn event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // ClearAll btn event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  // Event handlers
  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UICtrl
    const input = UICtrl.getItemInput();

    // Validate input
    if (input.name && input.calories) {
      // Add item to data structure
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Show total caloreis on UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in local storage
      StorageCtrl.storeItem(newItem);

      // Clear form
      UICtrl.clearForm();
    }

    e.preventDefault();
  };

  // Set edit state
  const itemEditClick = function(e) {
    // Delegate to edit-item class
    if (e.target.className.includes("edit-item")) {
      // Get list-item id
      const listId = e.target.parentElement.parentElement.id;

      // Break into an array
      const idArr = listId.split("-");
      id = parseInt(idArr[1]);

      // Get the actual item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  // Update item submit
  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Update total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    // Update LocalStorage
    StorageCtrl.updateItem(updatedItem);

    // Clear Edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete item submit
  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Remove from UI
    UICtrl.deleteListItem(currentItem.id);

    // Update total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    // Delete from LocalStorage
    StorageCtrl.deleteItem(currentItem);

    // Clear Edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear all items click
  const clearAllItemsClick = function(e) {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Clear UI
    UICtrl.clearListItems();

    // Clear Local Storage
    StorageCtrl.clearAllItems();

    // Update total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    // Hide ul
    UICtrl.hideList();
  };

  // Public
  return {
    init: function() {
      console.log("Initializing...");

      // Set initial state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Show total caloreis on UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize
App.init();
