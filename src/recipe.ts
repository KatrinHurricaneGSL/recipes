import { getRecipeById } from "./api";
import "./icons";
import type { RecipeType } from "./types/recipe.types";

const recipeBody = document.querySelector<HTMLDivElement>(".recipe-body")!;
const empty = document.querySelector<HTMLDivElement>(".empty")!;

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const url = new URL(window.location.href);
    const idRecipe = url.searchParams.get("id");
    console.log(idRecipe);
    const id = Number(idRecipe);

    if (isNaN(id)) {
      return;
    }

    const result = await getRecipeById(id);
    renderRecipe(result);
  } catch (e) {
    recipeBody.style.display = "none";
    empty.classList.remove("empty--hidden");
  }
});

const renderRecipe = (recipe: RecipeType) => {
  const title = document.querySelector<HTMLHeadingElement>(".recipe__title")!;
  const image = document.querySelector<HTMLImageElement>(".recipe__photo")!;

  const cuisine = document.querySelector<HTMLTableCellElement>("#cuisine")!;
  const prepTimeMinutes =
    document.querySelector<HTMLTableCellElement>("#prepTimeMinutes")!;
  const cookTimeMinutes =
    document.querySelector<HTMLTableCellElement>("#cookTimeMinutes")!;
  const totalTime = document.querySelector<HTMLTableCellElement>("#totalTime")!;
  const servings = document.querySelector<HTMLTableCellElement>("#servings")!;

  const ingredientsList =
    document.querySelector<HTMLUListElement>(".ingredients-list")!;
  const instructionsList =
    document.querySelector<HTMLOListElement>(".instructions-list")!;

  title.textContent = recipe.name;
  image.src = recipe.image;
  image.alt = `Рецепт ${recipe.name}`;

  cuisine.textContent = recipe.cuisine;
  prepTimeMinutes.textContent = `${recipe.prepTimeMinutes} мин`;
  cookTimeMinutes.textContent = `${recipe.cookTimeMinutes} мин`;
  totalTime.textContent = `${recipe.prepTimeMinutes + recipe.cookTimeMinutes} мин`;
  servings.textContent = `${recipe.servings}`;

  ingredientsList.innerHTML = "";
  instructionsList.innerHTML = "";

  for (const item of recipe.ingredients) {
    const li = document.createElement("li");
    li.textContent = item;
    ingredientsList?.append(li);
  }

  for (const item of recipe.instructions) {
    const li = document.createElement("li");
    li.textContent = item;
    instructionsList?.append(li);
  }
};
