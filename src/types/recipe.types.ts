export type RecipeType = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  cuisine: string;
  image: string;
};

export type RecipesResponse = {
  recipes: RecipeType[];
  total: number;
  skip: number;
  limit: number;
};

export type LoadProps = {
  search?: string;
  currentPage: number;
};
