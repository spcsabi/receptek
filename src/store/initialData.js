export const initialState = {
  recipes: [],
  ingredients: [],
  customIngredients: [],
  tags: [],
  customTags: [],
};

export const initialStateNotToStore = {
  isLoaded: false,
  isLoading: true,
  error: null,
  searchTerm: "",
  selectedTags: [],
};
