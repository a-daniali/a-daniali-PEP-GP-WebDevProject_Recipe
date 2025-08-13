/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
document.getElementById("add-ingredient-submit-button").addEventListener("click", addIngredient);
document.getElementById("delete-ingredient-submit-button").addEventListener("click", deleteIngredient);

/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
window.addEventListener("DOMContentLoaded", () => {
    // Verify token and admin status
    const token = sessionStorage.getItem("auth-token");
    const isAdmin = sessionStorage.getItem("is-admin");

    if (!token || isAdmin !== "true") {
        alert("Access denied. Admins only.");
        window.location.href = "../recipe/recipe-page.html";
        return;
    }

    getIngredients();
});

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    const name = addIngredientNameInput.value.trim();
    if (!name) {
        alert("Please enter an ingredient name.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            body: JSON.stringify({ name })
        });

        if (response.ok) {
            addIngredientNameInput.value = "";
            await getIngredients();
        } else {
            alert("Failed to add ingredient.");
        }
    } catch (error) {
        console.error("Add ingredient error:", error);
        alert("An error occurred while adding the ingredient.");
    }
}

/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        });

        if (response.ok) {
            ingredients = await response.json();
            refreshIngredientList();
        } else {
            alert("Failed to fetch ingredients.");
        }
    } catch (error) {
        console.error("Get ingredients error:", error);
        alert("An error occurred while fetching ingredients.");
    }
}

/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    const name = deleteIngredientNameInput.value.trim();
    if (!name) {
        alert("Please enter an ingredient name to delete.");
        return;
    }

    const ingredient = ingredients.find(i => i.name === name);
    if (!ingredient) {
        alert("Ingredient not found.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/ingredients/${ingredient.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        });

        if (response.ok) {
            deleteIngredientNameInput.value = "";
            await getIngredients();
        } else {
            alert("Failed to delete ingredient.");
        }
    } catch (error) {
        console.error("Delete ingredient error:", error);
        alert("An error occurred while deleting the ingredient.");
    }
}

/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    ingredientListContainer.innerHTML = "";
    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = ingredient.name;
        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    });
}
