import "./icons";
import { getRecipes } from "./api";
import type { LoadProps, RecipeType } from "./types/recipe.types";
import { Clock3, createIcons } from "lucide";
import debounce from "lodash.debounce";
import { renderPagination } from "./pagination";

const template = document.querySelector<HTMLTemplateElement>("#recipeCard")!;
const countRecipes = document.querySelector(".results-count__value")!;
const empty = document.querySelector(".empty") as HTMLDivElement;
const resetButton =
  document.querySelector<HTMLButtonElement>(".search__reset")!;
const searchInput = document.querySelector<HTMLInputElement>(".search__input")!;

const pagination = document.querySelector(".pagination");
let currentPage = 1;

const updateSearchButton = () => {
  if (searchInput.value.trim()) {
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
    const title = card.querySelector<HTMLHeadingElement>(".recipe-card__name")!;
    const timeValue = card.querySelector<HTMLSpanElement>(".time-meta__value")!;
    const link = card.querySelector<HTMLAnchorElement>(".button")!;

    image.src = recipe.image;
    image.alt = `Фото ${recipe.name}`;
    badge.textContent = recipe.cuisine;
    title.textContent = recipe.name;
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

    if (pagination) {
      pagination.innerHTML = "";
    }

    const result = await getRecipes(props);
    renderCards(result.recipes);
    countRecipes.textContent = result.total.toString();

    renderPagination(result.total, props?.currentPage || 1);
    setActivePageButton(props?.currentPage || 1);

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

const setLoading = (isLoading: boolean) => {
  const skeletonCount = 6;

  const recipeGrid = document.querySelector(".recipe-grid");
  if (!recipeGrid) {
    return;
  }

  if (isLoading) {
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

const getPage = (): number => {
  const url = new URL(window.location.href);
  const result = url.searchParams.get("page");
  if (result) {
    return Number(result);
  }

  return 1;
};

const setPage = (page: number): void => {
  const url = new URL(window.location.href);
  url.searchParams.set("page", page.toString());
  window.history.replaceState(null, "", url);
};

const setActivePageButton = (currentPage: number) => {
  const paginationButtons =
    document.querySelectorAll<HTMLButtonElement>(".pagination button");
  for (const button of paginationButtons) {
    const buttonPage = button.dataset.page;
    if (buttonPage) {
      if (Number(buttonPage) === currentPage) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    }
  }
};

searchInput.addEventListener("input", () => {
  fetchCards({ search: searchInput.value, currentPage: 1 });
  setSearchUrl(searchInput.value);
  updateSearchButton();
});

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  updateSearchButton();
  fetchCards();
  setSearchUrl();
});

window.addEventListener("DOMContentLoaded", async () => {
  const search = getSearchUrl();
  if (search) {
    searchInput.value = search;
  }

  const page = getPage();
  currentPage = page;

  updateSearchButton();
  fetchCards({ search: search, currentPage: currentPage });
});

pagination?.addEventListener("click", (e) => {
  const button = e.target;
  if (button instanceof HTMLButtonElement) {
    if (button.dataset.page) {
      currentPage = Number(button.dataset.page);
      const search = getSearchUrl();
      setPage(currentPage);
      fetchCards({ search: search, currentPage: currentPage });
    }
  }
});
