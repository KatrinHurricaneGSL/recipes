import { getRecipeById } from "./api";
import "./icons";
import type { RecipeType } from "./types/recipe.types";
import { checkElement } from "./utils";

const recipeBody = checkElement(
  document.querySelector<HTMLDivElement>(".recipe__body"),
  ".recipe__body",
);
const empty = checkElement(
  document.querySelector<HTMLDivElement>(".empty"),
  ".empty",
);

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const url = new URL(window.location.href);
    const idRecipe = url.searchParams.get("id");
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
  const title = checkElement(
    document.querySelector<HTMLHeadingElement>(".recipe__title"),
    ".recipe__title",
  );

  const image = checkElement(
    document.querySelector<HTMLImageElement>(".recipe__photo"),
    ".recipe__photo",
  );

  const cuisine = checkElement(
    document.querySelector<HTMLTableCellElement>("#cuisine"),
    "#cuisine",
  );

  const prepTimeMinutes = checkElement(
    document.querySelector<HTMLTableCellElement>("#prepTimeMinutes"),
    "#prepTimeMinutes",
  );

  const cookTimeMinutes = checkElement(
    document.querySelector<HTMLTableCellElement>("#cookTimeMinutes"),
    "#cookTimeMinutes",
  );

  const totalTime = checkElement(
    document.querySelector<HTMLTableCellElement>("#totalTime"),
    "#totalTime",
  );

  const servings = checkElement(
    document.querySelector<HTMLTableCellElement>("#servings"),
    "#servings",
  );

  const ingredientsList = checkElement(
    document.querySelector<HTMLUListElement>(".ingredients-list"),
    ".ingredients-list",
  );

  const instructionsList = checkElement(
    document.querySelector<HTMLOListElement>(".instructions-list"),
    ".instructions-list"
  );

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

  for (const ingredient of recipe.ingredients) {
    const li = document.createElement("li");
    li.classList.add("ingredients-list__item");
    li.textContent = ingredient;
    ingredientsList.append(li);
  }

  for (const instruction of recipe.instructions) {
    const li = document.createElement("li");
    li.classList.add("instructions-list__item");
    li.textContent = instruction;
    instructionsList.append(li);
  }
};
