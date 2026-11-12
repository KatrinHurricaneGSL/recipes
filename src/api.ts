import type {
  LoadProps,
  RecipesResponse,
  RecipeType,
} from "./types/recipe.types";

const baseUrl = "https://dummyjson.com";

export async function getRecipes(props?: LoadProps): Promise<RecipesResponse> {
  let url = `${baseUrl}/recipes`;

  if (props?.search) {
    url += `/search?q=${props.search}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Не удалось загрузить данные с сервера");
  }

  const data = await response.json();

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
