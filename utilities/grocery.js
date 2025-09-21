// Retrieve items from localStorage or start empty
let groceryItems = JSON.parse(localStorage.getItem('groceryItems')) || [];

const form = document.getElementById('grocery-form');
const itemName = document.getElementById('item-name');
const itemQuantity = document.getElementById('item-quantity');
const groceryList = document.getElementById('grocery-list');

// Add item
form.addEventListener('submit', function(e){
    e.preventDefault();
    const item = {
        id: Date.now(),
        name: itemName.value.trim(),
        quantity: parseInt(itemQuantity.value),
        bought: false
    };
    groceryItems.push(item);
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems));
    updateUI();
    form.reset();
});

// Update UI
function updateUI(){
    groceryList.innerHTML = '';
    groceryItems.forEach(item => {
        const li = document.createElement('li');
        li.classList.toggle('bought', item.bought);
        li.innerHTML = `
            <span>${item.name} - ${item.quantity}</span>
            <div class="item-actions">
                <button onclick="toggleBought(${item.id})">${item.bought ? 'Unmark' : 'Bought'}</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
            </div>
        `;
        groceryList.appendChild(li);
    });
}

// Toggle bought/unbought
function toggleBought(id){
    groceryItems = groceryItems.map(item => {
        if(item.id === id){
            item.bought = !item.bought;
        }
        return item;
    });
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems));
    updateUI();
}

// Delete item
function deleteItem(id){
    groceryItems = groceryItems.filter(item => item.id !== id);
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems));
    updateUI();
}

// Initialize
updateUI();
