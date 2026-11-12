import "./icons";
import { getRecipes } from "./api";
import type { LoadProps, RecipeType } from "./types/recipe.types";
import { Clock3, createIcons } from "lucide";
import debounce from "lodash.debounce";

const template = document.querySelector<HTMLTemplateElement>("#recipeCard")!;
const countRecipes = document.querySelector(".results-count__value")!;
const empty = document.querySelector(".empty") as HTMLDivElement;
const resetButton = document.querySelector<HTMLButtonElement>(".reset")!;
const searchRecipe =
  document.querySelector<HTMLInputElement>(".search__input")!;

const updateSearchButton = () => {
  if (searchRecipe.value.trim()) {
    resetButton.removeAttribute("disabled");
  } else {
    resetButton.setAttribute("disabled", "true");
  }
};

const renderCards = (recipes: RecipeType[]) => {
  const recipeGrid = document.querySelector(".recipe-grid");
  if (!recipeGrid) {
    return;
  }

  recipeGrid.innerHTML = "";

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
    image.alt = `Фото ${recipe.name}`;
    badge.textContent = recipe.cuisine;
    name.textContent = recipe.name;
    timeValue.textContent = `${recipe.prepTimeMinutes + recipe.cookTimeMinutes} мин`;
    link.href = `/recipe.html?id=${recipe.id}`;

    recipeGrid.append(card);

    createIcons({
      icons: {
        Clock3,
      },
    });
  }
};

const loadCards = async (props?: LoadProps) => {
  try {
    setLoading(true);
    const result = await getRecipes(props);
    renderCards(result.recipes);
    countRecipes.textContent = result.recipes.length.toString();

    if (result.recipes.length === 0) {
      empty.classList.remove("empty--hidden");
    } else {
      empty.classList.add("empty--hidden");
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const fetchCards = debounce(loadCards, 300);

const setLoading = (state: boolean) => {
  const skeletonCount = 6;

  const recipeGrid = document.querySelector(".recipe-grid");
  if (!recipeGrid) {
    return;
  }

  if (state) {
    recipeGrid.innerHTML = "";
    countRecipes.textContent = "Загрузка...";

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

const setSearchUrl = (query?: string) => {
  const url = new URL(window.location.href);

  if (query) {
    url.searchParams.set("search", query);
  } else {
    url.searchParams.delete("search");
  }

  window.history.replaceState(null, "", url);
};

const getSearchUrl = (): string | undefined => {
  const url = new URL(window.location.href);
  const result = url.searchParams.get("search");

  return result || undefined;
};

searchRecipe.addEventListener("input", () => {
  fetchCards({ search: searchRecipe.value });
  setSearchUrl(searchRecipe.value);
  updateSearchButton();
});

resetButton.addEventListener("click", () => {
  searchRecipe.value = "";
  updateSearchButton();
  fetchCards();
  setSearchUrl();
});

window.addEventListener("DOMContentLoaded", async () => {
  const search = getSearchUrl();
  if (search) {
    searchRecipe.value = search;
  }

  updateSearchButton();
  fetchCards({ search: search });
});
