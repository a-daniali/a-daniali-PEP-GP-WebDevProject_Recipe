/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const logoutButton = document.getElementById("logout-button");
    const adminLink = document.getElementById("admin-link");

    const addNameInput = document.getElementById("add-recipe-name-input");
    const addInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const updateNameInput = document.getElementById("update-recipe-name-input");
    const updateInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const deleteNameInput = document.getElementById("delete-recipe-name-input");

    const recipeList = document.getElementById("recipe-list");
    const searchInput = document.getElementById("search-input");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token")) {
        logoutButton.style.display = "inline-block";
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    displayAdminLink();

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    document.getElementById("add-recipe-submit-input").addEventListener("click", addRecipe);
    document.getElementById("update-recipe-submit-input").addEventListener("click", updateRecipe);
    document.getElementById("delete-recipe-submit-input").addEventListener("click", deleteRecipe);
    document.getElementById("search-button").addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    function displayAdminLink() {
        if (sessionStorage.getItem("is-admin") === "true") {
            adminLink.style.display = "inline-block";
        }
    }

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        const term = searchInput.value.trim().toLowerCase();
        const filtered = recipes.filter(r => r.name.toLowerCase().includes(term));
        refreshRecipeList(filtered);
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        const name = addNameInput.value.trim();
        const instructions = addInstructionsInput.value.trim();
        if (!name || !instructions) {
            alert("Please enter both name and instructions.");
            return;
        }

        try {
            await fetch(`${BASE_URL}/recipes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                },
                body: JSON.stringify({ name, instructions })
            });
            addNameInput.value = "";
            addInstructionsInput.value = "";
            getRecipes();
        } catch (error) {
            alert("Failed to add recipe.");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        const name = updateNameInput.value.trim();
        const instructions = updateInstructionsInput.value.trim();
        if (!name || !instructions) {
            alert("Please enter both name and updated instructions.");
            return;
        }

        const recipe = recipes.find(r => r.name === name);
        if (!recipe) {
            alert("Recipe not found.");
            return;
        }

        try {
            await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                },
                body: JSON.stringify({ instructions })
            });
            updateNameInput.value = "";
            updateInstructionsInput.value = "";
            getRecipes();
        } catch (error) {
            alert("Failed to update recipe.");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        const name = deleteNameInput.value.trim();
        if (!name) {
            alert("Please enter a recipe name.");
            return;
        }

        const recipe = recipes.find(r => r.name === name);
        if (!recipe) {
            alert("Recipe not found.");
            return;
        }

        try {
            await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            });
            deleteNameInput.value = "";
            getRecipes();
        } catch (error) {
            alert("Failed to delete recipe.");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            });
            recipes = await response.json();
            refreshRecipeList(recipes);
        } catch (error) {
            alert("Failed to fetch recipes.");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList(list) {
        recipeList.innerHTML = "";
        list.forEach(recipe => {
            const li = document.createElement("li");
            li.textContent = `${recipe.name}: ${recipe.instructions}`;
            recipeList.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        const token = sessionStorage.getItem("auth-token");
        if (!token) {
            alert("No token found.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                sessionStorage.removeItem("auth-token");
                sessionStorage.removeItem("is-admin");
                window.location.href = "login-page.html";
            } else {
                alert("Logout failed.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("An error occurred during logout.");
        }
    }

});
