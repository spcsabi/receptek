import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { initialState, initialStateNotToStore } from "./initialData";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  or,
  serverTimestamp,
} from "firebase/firestore";

const useStore = create()(
  devtools(
    immer((set, get) => ({
      ...initialState,
      ...initialStateNotToStore,

      actions: {
        subscribeToData: (userId) => {
          if (!userId) return () => {};

          set((state) => {
            state.isLoading = true;
          });

          // 1. Subscribe to Recipes
          const recipesRef = collection(db, "recipes");
          const recipesQuery = query(
            recipesRef,
            or(
              where("ownerId", "==", userId),
              where("sharedWith", "array-contains", userId),
            ),
          );

          const unsubRecipes = onSnapshot(recipesQuery, (snapshot) => {
            const recipes = snapshot.docs.map((docItem) => ({
              id: docItem.id,
              ...docItem.data(),
            }));
            set((state) => {
              state.recipes = recipes;
            });
          });

          // 2. Subscribe to Global Tags
          const globalTagsRef = collection(db, "tags");
          const unsubGlobalTags = onSnapshot(globalTagsRef, (snapshot) => {
            const globalTags = snapshot.docs.map((docItem) => ({
              id: docItem.id,
              ...docItem.data(),
              isCustom: false,
            }));
            set((state) => {
              const customOnly = state.tags.filter((t) => t.isCustom);
              state.tags = [...customOnly, ...globalTags];
            });
          });

          // 3. Subscribe to User Custom Tags
          const customTagsRef = collection(db, "users", userId, "customTags");
          const unsubCustomTags = onSnapshot(customTagsRef, (snapshot) => {
            const customTags = snapshot.docs.map((docItem) => ({
              id: docItem.id,
              ...docItem.data(),
              isCustom: true,
            }));
            set((state) => {
              state.customTags = customTags;
              const globalOnly = state.tags.filter((t) => !t.isCustom);
              state.tags = [...customTags, ...globalOnly];
              state.isLoaded = true;
              state.isLoading = false;
            });
          });

          return () => {
            unsubRecipes();
            unsubGlobalTags();
            unsubCustomTags();
          };
        },

        setSearchTerm: (term) =>
          set((state) => {
            state.searchTerm = term;
          }),

        toggleTagFilter: (tagName) =>
          set((state) => {
            const index = state.selectedTags.indexOf(tagName);
            if (index > -1) {
              state.selectedTags.splice(index, 1);
            } else {
              state.selectedTags.push(tagName);
            }
          }),

        // --- RECIPE ACTIONS ---

        addRecipe: async (recipeData, userId) => {
          try {
            const newRecipe = {
              title: recipeData.title || "Untitled Recipe",
              ownerId: userId,
              sharedWith: recipeData.sharedWith || [],
              ingredients: recipeData.ingredients || [], // [{ ingredientId, name, amountGrams, calories }]
              totalCalories: recipeData.totalCalories || 0,
              instructions: recipeData.instructions || "",
              createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "recipes"), newRecipe);
          } catch (error) {
            console.error("Error adding recipe:", error);
            throw error;
          }
        },

        updateRecipe: async (recipeId, updatedData) => {
          try {
            const recipeRef = doc(db, "recipes", recipeId);
            await updateDoc(recipeRef, {
              ...updatedData,
              updatedAt: serverTimestamp(),
            });
          } catch (error) {
            console.error("Error updating recipe:", error);
            throw error;
          }
        },

        deleteRecipe: async (recipeId) => {
          try {
            await deleteDoc(doc(db, "recipes", recipeId));
          } catch (error) {
            console.error("Error deleting recipe:", error);
            throw error;
          }
        },

        shareRecipe: async (recipeId, recipientUserId) => {
          try {
            const recipeRef = doc(db, "recipes", recipeId);
            const recipe = get().recipes.find((r) => r.id === recipeId);
            if (!recipe) return;

            const updatedSharedWith = Array.from(
              new Set([...(recipe.sharedWith || []), recipientUserId]),
            );

            await updateDoc(recipeRef, { sharedWith: updatedSharedWith });
          } catch (error) {
            console.error("Error sharing recipe:", error);
            throw error;
          }
        },

        // --- CUSTOM INGREDIENT ACTIONS ---

        addCustomIngredient: async (ingredientData, userId) => {
          try {
            const newIngredient = {
              name: ingredientData.name,
              caloriesPer100g: Number(ingredientData.caloriesPer100g) || 0,
              protein: Number(ingredientData.protein) || 0,
              carbs: Number(ingredientData.carbs) || 0,
              fat: Number(ingredientData.fat) || 0,
              createdAt: serverTimestamp(),
            };

            await addDoc(
              collection(db, "users", userId, "customIngredients"),
              newIngredient,
            );
          } catch (error) {
            console.error("Error adding custom ingredient:", error);
            throw error;
          }
        },

        updateCustomIngredient: async (userId, ingredientId, updatedData) => {
          try {
            const ingRef = doc(
              db,
              "users",
              userId,
              "customIngredients",
              ingredientId,
            );
            await updateDoc(ingRef, {
              ...updatedData,
              updatedAt: serverTimestamp(),
            });
          } catch (error) {
            console.error("Error updating custom ingredient:", error);
            throw error;
          }
        },

        deleteCustomIngredient: async (userId, ingredientId) => {
          try {
            const ingRef = doc(
              db,
              "users",
              userId,
              "customIngredients",
              ingredientId,
            );
            await deleteDoc(ingRef);
          } catch (error) {
            console.error("Error deleting custom ingredient:", error);
            throw error;
          }
        },

        // --- CUSTOM TAG ACTIONS ---

        addCustomTag: async (tagName, userId) => {
          try {
            const newTag = {
              name: tagName.trim(),
              createdAt: serverTimestamp(),
            };
            await addDoc(collection(db, "users", userId, "customTags"), newTag);
          } catch (error) {
            console.error("Error adding custom tag:", error);
            throw error;
          }
        },

        updateCustomTag: async (userId, tagId, newName) => {
          try {
            const tagRef = doc(db, "users", userId, "customTags", tagId);
            await updateDoc(tagRef, {
              name: newName.trim(),
              updatedAt: serverTimestamp(),
            });
          } catch (error) {
            console.error("Error updating custom tag:", error);
            throw error;
          }
        },

        deleteCustomTag: async (userId, tagId) => {
          try {
            const tagRef = doc(db, "users", userId, "customTags", tagId);
            await deleteDoc(tagRef);
          } catch (error) {
            console.error("Error deleting custom tag:", error);
            throw error;
          }
        },
      },
    })),
  ),
);

export default useStore;
