
import "./icons";
import { getRecipes } from "./api";
import type { LoadProps, RecipeType } from "./types/recipe.types";
import { Clock3, createIcons } from "lucide";

const template = document.querySelector<HTMLTemplateElement>("#recipeCard")!;
const countRecipes = document.querySelector(".results-count__value")!

const renderCards = (recipes: RecipeType[]) => {
  const recipeGrid = document.querySelector(".recipe-grid");
  if (!recipeGrid) {
    return;
  }

  for (const recipe of recipes) {
    const card = template.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    const image = card.querySelector<HTMLImageElement>(".recipe-card__image")!;
    const badge = card.querySelector<HTMLSpanElement>(".badge")!;
    const name = card.querySelector<HTMLHeadingElement>(".recipe-card__name")!;
    const timeValue = card.querySelector<HTMLSpanElement>(".time-meta__value")!;
    const link = card.querySelector<HTMLLinkElement>(".button")!;

    image.src = recipe.image;
    badge.textContent = recipe.cuisine
    name.textContent = recipe.name
    timeValue.textContent = `${recipe.prepTimeMinutes + recipe.cookTimeMinutes} мин`;
    link.href = `/recipe.html?id=${recipe.id}`

    recipeGrid.append(card);

    createIcons({
        icons: {
            Clock3
        }
    })
  }
};

const loadCards = async (props?:LoadProps) => {
  try {
    setLoading(true);
    const result = await getRecipes(props);
    renderCards(result.recipes);
    countRecipes.textContent = result.recipes.length.toString()
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false);
  }
};

const setLoading = (state: boolean) => {
  const skeletonCount = 6;

  const recipeGrid = document.querySelector(".recipe-grid");
  if (!recipeGrid) {
    return;
  }

  if (state) {
    recipeGrid.innerHTML = "";
    countRecipes.textContent = "Загрузка..."

    for (let i = 0; i < skeletonCount; i++) {
      const card = template.content.firstElementChild!.cloneNode(
        true,
      ) as HTMLElement;
      card.classList.add("recipe-card--loading");
      recipeGrid.append(card);
    }
  } else {
    const skeletons = document.querySelectorAll(".recipe-card--loading");
    for (const skeleton of skeletons) {
      skeleton.remove();
    }
  }
};

const searchRecipe = document.querySelector<HTMLInputElement>(".search__input")!
searchRecipe.addEventListener("change", (event) => {
  loadCards({search: event.currentTarget.value});
})

window.addEventListener("DOMContentLoaded", async () => {
  loadCards();
});
