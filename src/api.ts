import { PAGE_SIZE } from "./pagination";
import type {
  LoadProps,
  RecipesResponse,
  RecipeType,
} from "./types/recipe.types";

const baseUrl = "https://dummyjson.com";

export async function getRecipes(
  { search = "", currentPage = 1 }: LoadProps = { currentPage: 1 },
): Promise<RecipesResponse> {
  const endpoint = search.trim() ? "/recipes/search" : "/recipes";

  const url = new URL(`${baseUrl}${endpoint}`);

  if (search.trim()) {
    url.searchParams.set("q", search.trim());
  }

  url.searchParams.set("limit", String(PAGE_SIZE));
  url.searchParams.set("skip", String((currentPage - 1) * PAGE_SIZE));

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Не удалось загрузить данные с сервера");
  }

  const data: RecipesResponse = await response.json();

  return data;
}

export async function getRecipeById(id: number): Promise<RecipeType> {
  const response = await fetch(`${baseUrl}/recipes/${id}`);

  if (!response.ok) {
    throw new Error("Не удалось загрузить рецепт с сервера");
  }

  const data = await response.json();

  return data;
}
