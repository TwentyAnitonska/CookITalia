import { getAuth } from 'firebase/auth';

// ============================================================
//  SPOONACULAR API - Recipe data
// ============================================================
const API_KEY = 'a1f025e7400f4490b5d11aaf710d0807';
const BASE_URL = 'https://api.spoonacular.com/recipes';

// ============================================================
//  RECIPE TYPE INFERENCE
// ============================================================
function normalizeTitleForComparison(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function includesAny(text, words) {
  const normalizedText = normalizeTitleForComparison(text || '');
  return words.some(word => new RegExp(`\\b${word}\\b`, 'i').test(normalizedText));
}

function inferRecipeType(recipe, forcedCategory = '') {
  const forcedLabels = { primi: 'First Course', secondi: 'Main Course', contorni: 'Side Dish', dolci: 'Dessert' };
  if (forcedLabels[forcedCategory]) return forcedLabels[forcedCategory];

  const dishTypes = (recipe.dishTypes || []).map(type => normalizeTitleForComparison(type));
  const title = recipe.title || '';
  const sourceText = `${title} ${dishTypes.join(' ')}`;

  if (dishTypes.includes('dessert') || includesAny(sourceText, ['dessert', 'cake', 'pie', 'cookie', 'pudding', 'gelato', 'sorbet', 'tiramisu', 'sweet', 'biscotti', 'pannacotta'])) {
    return 'Dessert';
  }
  if (dishTypes.includes('side dish') || includesAny(sourceText, ['salad', 'potatoes', 'vegetables', 'beans', 'spinach', 'broccoli', 'caprese', 'panzanella'])) {
    return 'Side Dish';
  }
  if (includesAny(sourceText, ['pasta', 'spaghetti', 'penne', 'rigatoni', 'lasagna', 'lasagne', 'risotto', 'gnocchi', 'ravioli', 'tortellini', 'tagliatelle', 'fettuccine', 'linguine', 'soup', 'minestrone', 'broth', 'macaroni'])) {
    return 'First Course';
  }
  if (dishTypes.includes('main course') || dishTypes.includes('main dish') || includesAny(sourceText, ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'steak', 'meat', 'turkey', 'eggplant', 'parmigiana', 'cacciatore', 'meatloaf', 'braciole', 'veal', 'seafood', 'lobster', 'scallops', 'sausage'])) {
    return 'Main Course';
  }
  if (dishTypes.some(type => ['appetizer', 'antipasti', 'starter', 'snack', 'bread', 'bruschetta', 'crostini', 'fingerfood'].includes(type)) || includesAny(sourceText, ['bruschetta', 'antipasto', 'crostini', 'mozzarella', 'prosciutto'])) {
    return 'Appetizer';
  }

  if (dishTypes.includes('salad')) return 'Side Dish';
  if (dishTypes.includes('soup')) return 'First Course';
  if (dishTypes.includes('breakfast') || dishTypes.includes('bread')) return 'Appetizer';

  return 'Main Course';
}

function sanitizeText(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>?/gm, '').trim();
}

async function prepareRecipe(recipe) {
  const prepared = { ...recipe };
  prepared.recipeTypeLabel = inferRecipeType(recipe, recipe.forcedCategory);
  if (prepared.title) prepared.title = sanitizeText(prepared.title);
  if (prepared.summary) prepared.summary = sanitizeText(prepared.summary);
  if (prepared.image) {
    prepared.image = prepared.image.replace(/-\d+x\d+\.(jpg|jpeg|png)$/i, '-636x393.$1');
  }
  return prepared;
}

async function prepareRecipeDetail(recipe) {
  const prepared = await prepareRecipe(recipe);
  if (prepared.extendedIngredients?.length > 0) {
    for (const ing of prepared.extendedIngredients) {
      if (ing.original) ing.original = sanitizeText(ing.original);
    }
  }
  return prepared;
}

const DISH_CATEGORY_MAP = {
  primi: { query: 'pasta', type: 'main course' },
  secondi: { query: 'meat', type: 'main course' },
  contorni: { query: 'vegetables', type: 'side dish' },
  dolci: { query: 'dessert', type: 'dessert' }
};

async function handleFetchResponse(response, errorMessage) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`${errorMessage}: ${response.status}${errorData.message ? ` - ${errorData.message}` : ''}`);
    return null;
  }
  return await response.json();
}

const getLocalDietPreferences = () => {
  try {
    const uid = getAuth().currentUser?.uid;
    if (uid) {
      const profile = localStorage.getItem(`profile_${uid}`);
      if (profile) {
        const parsed = JSON.parse(profile);
        return parsed.dietPreferences || {};
      }
    }
  } catch (e) {
    console.error("Error reading diet preferences from localStorage", e);
  }
  return {};
};

const getDietParamsString = () => {
  const prefs = getLocalDietPreferences();
  let params = '';
  const activeDiets = [];
  if (prefs.vegetarian) activeDiets.push('vegetarian');
  if (prefs.vegan) activeDiets.push('vegan');
  if (prefs.glutenFree) activeDiets.push('gluten free');

  if (activeDiets.length > 0) {
    params += `&diet=${encodeURIComponent(activeDiets.join(','))}`;
  }
  if (prefs.dairyFree) {
    params += `&intolerances=dairy`;
  }
  return params;
};

export default {
  async searchRecipes(query, limit = 24) {
    let results = [];
    if (API_KEY) {
      try {
        const dietParams = getDietParamsString();
        const url = `${BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(query)}&cuisine=Italian&number=${limit}&addRecipeInformation=true${dietParams}`;
        const response = await fetch(url);
        const data = await handleFetchResponse(response, 'Error fetching recipes');
        if (data && data.results) {
          for (const recipe of data.results) {
            results.push(await prepareRecipe(recipe));
          }
        }
      } catch (error) {
        console.error('Error fetching recipes from API:', error);
      }
    }
    return results;
  },

  async getRecommended(favoriteRecipes = []) {
    let results = [];
    const prefs = getLocalDietPreferences();

    if (API_KEY) {
      try {
        if (favoriteRecipes && favoriteRecipes.length > 0) {
          const randomFav = favoriteRecipes[Math.floor(Math.random() * favoriteRecipes.length)];
          const title = (randomFav.title || '').toLowerCase();

          let keyword = '';
          const keywords = ['pasta', 'spaghetti', 'penne', 'lasagna', 'risotto', 'gnocchi', 'ravioli', 'chicken', 'beef', 'pork', 'fish', 'shrimp', 'salad', 'soup', 'tiramisu', 'cake', 'biscotti', 'panna cotta', 'dessert', 'pizza'];
          for (const kw of keywords) {
            if (title.includes(kw)) {
              keyword = kw;
              break;
            }
          }

          if (keyword) {
            const dietParams = getDietParamsString();
            const url = `${BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(keyword)}&cuisine=Italian&number=6&addRecipeInformation=true${dietParams}`;
            const response = await fetch(url);
            const data = await handleFetchResponse(response, 'Error fetching recommended based on favorite');
            if (data && data.results?.length > 0) {
              for (const recipe of data.results) {
                results.push(await prepareRecipe(recipe));
              }
            }
          }
        }

        if (results.length === 0) {
          let tags = 'italian';
          if (prefs.vegetarian) tags += ',vegetarian';
          if (prefs.vegan) tags += ',vegan';
          if (prefs.glutenFree) tags += ',gluten free';
          if (prefs.dairyFree) tags += ',dairy free';

          const url = `${BASE_URL}/random?apiKey=${API_KEY}&number=6&tags=${encodeURIComponent(tags)}`;
          const response = await fetch(url);
          const data = await handleFetchResponse(response, 'Error fetching recommended');
          if (data && data.recipes) {
            for (const recipe of data.recipes) {
              results.push(await prepareRecipe(recipe));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching recommended from API:', error);
      }
    }
    return results;
  },

  async getRecipesByDishCategory(category, limit = 24) {
    const normalizedCategory = String(category || '').toLowerCase();
    const categoryConfig = DISH_CATEGORY_MAP[normalizedCategory];
    let results = [];

    if (categoryConfig && API_KEY) {
      try {
        const dietParams = getDietParamsString();
        const url = `${BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(categoryConfig.query)}&type=${encodeURIComponent(categoryConfig.type)}&cuisine=Italian&number=${limit}&addRecipeInformation=true${dietParams}`;
        const response = await fetch(url);
        const data = await handleFetchResponse(response, `Error fetching ${normalizedCategory} recipes`);
        if (data && data.results) {
          for (const recipe of data.results) {
            results.push(await prepareRecipe({ ...recipe, forcedCategory: normalizedCategory }));
          }
        }
      } catch (error) {
        console.error(`Error fetching ${normalizedCategory} recipes from API:`, error);
      }
    }
    return results;
  },

  async getRecipeOfTheDay() {
    let result = null;
    if (API_KEY) {
      try {
        const url = `${BASE_URL}/random?apiKey=${API_KEY}&number=1&tags=italian,main course`;
        const response = await fetch(url);
        const data = await handleFetchResponse(response, 'Error fetching recipe of the day');
        if (data && data.recipes && data.recipes.length > 0) {
          const recipe = data.recipes[0];
          result = await prepareRecipe({
            ...recipe,
            category: recipe.dishTypes?.length > 0 ? recipe.dishTypes[0] : 'Main Course',
            origin: 'Italy'
          });
        }
      } catch (error) {
        console.error('Error fetching recipe of the day from API:', error);
      }
    }
    return result;
  },

  async getRecipeById(id) {
    if (API_KEY) {
      try {
        const url = `${BASE_URL}/${id}/information?apiKey=${API_KEY}&includeNutrition=true`;
        const response = await fetch(url);
        const data = await handleFetchResponse(response, `Error fetching recipe ${id}`);
        if (data) {
          return await prepareRecipeDetail(data);
        }
      } catch (error) {
        console.error(`Error fetching recipe ${id} from API:`, error);
      }
    }
    return null;
  }
};

// ============================================================
//  FIREBASE USER DATA & SEARCH HISTORY (Modificato)
// ============================================================
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';


const userDoc = (uid) => doc(getFirestore(), 'users', uid);
const favoritesCol = (uid) => collection(getFirestore(), 'users', uid, 'favorites');
const favoriteDoc = (uid, recipeId) => doc(getFirestore(), 'users', uid, 'favorites', String(recipeId));

export const clearUserLocalData = (uid) => {
  if (!uid) return;
  try {
    localStorage.removeItem(`profile_${uid}`);
    localStorage.removeItem(`settings_${uid}`);
    localStorage.removeItem(`favorites_${uid}`);
    localStorage.removeItem(`favorites_recipes_${uid}`);
  } catch (e) {
    console.warn("localStorage user cleanup failed", e);
  }
};

export const deleteUserData = async (uid) => {
  if (!uid) return;
  const favoritesSnapshot = await getDocs(favoritesCol(uid));
  await Promise.all(favoritesSnapshot.docs.map((favorite) => deleteDoc(favorite.ref)));
  await deleteDoc(userDoc(uid));
  clearUserLocalData(uid);
};

export const ensureUserProfile = async (user, extraProfile = {}) => {
  if (!user) return;
  const snapshot = await getDoc(userDoc(user.uid));
  const existing = snapshot.exists() ? snapshot.data() : {};
  const mergedProfile = {
    ...existing,
    email: user.email || extraProfile.email || existing.email || '',
    nickname: extraProfile.nickname ?? existing.nickname ?? '',
    updatedAt: serverTimestamp()
  };
  await setDoc(userDoc(user.uid), mergedProfile, { merge: true });
  try {
    localStorage.setItem(`profile_${user.uid}`, JSON.stringify({
      ...mergedProfile,
      updatedAt: existing.updatedAt || null
    }));
  } catch (e) {
    console.warn("localStorage profile cache failed", e);
  }
};

export const getUserProfile = async (uid) => {
  const snapshot = await getDoc(userDoc(uid));
  return snapshot.exists() ? snapshot.data() : {};
};

export const saveUserProfile = async (user, profile) => {
  const existingProfile = await getUserProfile(user.uid);
  const data = {
    ...existingProfile,
    email: user.email || '',
    nickname: profile.nickname || '',
    updatedAt: serverTimestamp()
  };
  if (profile.photoBase64 !== undefined) {
    data.photoBase64 = profile.photoBase64;
  }
  await setDoc(userDoc(user.uid), data, { merge: true });
};

/* ==========================================
   NUOVE FUNZIONI CRONOLOGIA DI RICERCA INTERNA
   ========================================== */

/**
 * Salva un termine cercato nella cronologia di Firestore dell'utente.
 * Evita i duplicati e limita l'array alle ultime 5 ricerche recenti.
 */
export const saveSearchToHistory = async (uid, query) => {
  if (!uid || !query.trim()) return;
  try {
    const snap = await getDoc(userDoc(uid));
    let history = [];
    if (snap.exists()) {
      history = snap.data().searchHistory || [];
    }
    // Rimuove duplicati ignorando maiuscole/minuscole
    history = history.filter(item => item.toLowerCase() !== query.trim().toLowerCase());
    history.unshift(query.trim());
    if (history.length > 5) history = history.slice(0, 5);

    await setDoc(userDoc(uid), { searchHistory: history }, { merge: true });
  } catch (error) {
    console.error("Errore durante il salvataggio della cronologia ricerche:", error);
  }
};

/**
 * Recupera l'array della cronologia ricerche salvato sotto il profilo dell'utente.
 */
export const getSearchHistory = async (uid) => {
  if (!uid) return [];
  try {
    const snap = await getDoc(userDoc(uid));
    if (snap.exists()) {
      return snap.data().searchHistory || [];
    }
    return [];
  } catch (error) {
    console.error("Errore nel recupero della cronologia ricerche:", error);
    return [];
  }
};

/**
 * Pulisce l'intera cronologia dell'utente impostando l'array searchHistory a vuoto.
 */
export const clearSearchHistory = async (uid) => {
  if (!uid) return;
  try {
    await setDoc(userDoc(uid), { searchHistory: [] }, { merge: true });
  } catch (error) {
    console.error("Errore durante la rimozione della cronologia:", error);
    throw error;
  }
};

/**
 * Recupera ricette reali da Spoonacular per i suggerimenti testuali della barra di ricerca.
 */
export const getAllRecipes = async (query = 'Italian', limit = 12) => {
  let results = [];
  if (API_KEY) {
    try {
      const url = `${BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(query || 'Italian')}&cuisine=Italian&number=${limit}&addRecipeInformation=true`;
      const response = await fetch(url);
      const data = await handleFetchResponse(response, 'Error fetching search suggestions');
      if (data && data.results) {
        for (const recipe of data.results) {
          results.push(await prepareRecipe(recipe));
        }
      }
    } catch (error) {
      console.error("Errore nel recupero dei suggerimenti dall'API:", error);
    }
  }

  return results;
};

/* ==========================================
   FINE NUOVE FUNZIONI CRONOLOGIA
   ========================================== */

export const getFavoriteRecipes = async (uid) => {
  try {
    const snapshot = await getDocs(favoritesCol(uid));
    const items = snapshot.docs.map(s => s.data());
    try {
      localStorage.setItem(`favorites_recipes_${uid}`, JSON.stringify(items));
      localStorage.setItem(`favorites_${uid}`, JSON.stringify(items.map(r => Number(r.id)).filter(Boolean)));
    } catch (e) {
      console.warn("localStorage write failed", e);
    }
    return items;
  } catch (err) {
    console.warn("Firestore getFavoriteRecipes failed, reading from localStorage:", err);
    try {
      const local = localStorage.getItem(`favorites_recipes_${uid}`);
      return local ? JSON.parse(local) : [];
    } catch (e) {
      return [];
    }
  }
};

export const getFavoriteIds = async (uid) => {
  try {
    const favorites = await getFavoriteRecipes(uid);
    return favorites.map(r => Number(r.id)).filter(Boolean);
  } catch (err) {
    console.warn("getFavoriteIds failed, reading from localStorage:", err);
    try {
      const local = localStorage.getItem(`favorites_${uid}`);
      return local ? JSON.parse(local) : [];
    } catch (e) {
      return [];
    }
  }
};

export const toggleFavoriteRecipe = async (uid, recipe, favoriteIds) => {
  const id = Number(recipe.id);
  const isFavorite = favoriteIds.includes(id);
  let newFavoriteIds;

  if (isFavorite) {
    newFavoriteIds = favoriteIds.filter(fId => fId !== id);
    try {
      await deleteDoc(favoriteDoc(uid, id));
    } catch (err) {
      console.warn("Firestore delete failed in toggleFavoriteRecipe", err);
    }
  } else {
    newFavoriteIds = [...favoriteIds, id];
    try {
      await setDoc(favoriteDoc(uid, id), {
        id,
        title: recipe.title || `Recipe #${id}`,
        image: recipe.image || '',
        readyInMinutes: recipe.readyInMinutes || null,
        recipeTypeLabel: recipe.recipeTypeLabel || '',
        savedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn("Firestore set failed in toggleFavoriteRecipe", err);
    }
  }

  try {
    let localRecipes = [];
    const localRecipesStr = localStorage.getItem(`favorites_recipes_${uid}`);
    if (localRecipesStr) {
      localRecipes = JSON.parse(localRecipesStr);
    }
    if (isFavorite) {
      localRecipes = localRecipes.filter(r => Number(r.id) !== id);
    } else {
      localRecipes.push({
        id,
        title: recipe.title || `Recipe #${id}`,
        image: recipe.image || '',
        readyInMinutes: recipe.readyInMinutes || null,
        recipeTypeLabel: recipe.recipeTypeLabel || '',
      });
    }
    localStorage.setItem(`favorites_recipes_${uid}`, JSON.stringify(localRecipes));
    localStorage.setItem(`favorites_${uid}`, JSON.stringify(newFavoriteIds));
  } catch (e) {
    console.warn("localStorage sync failed in toggleFavoriteRecipe", e);
  }

  return newFavoriteIds;
};

export const removeRecipeFromFavorites = async (uid, recipeId) => {
  const id = Number(recipeId);
  try {
    await deleteDoc(favoriteDoc(uid, id));
  } catch (err) {
    console.warn("Firestore deleteDoc failed in removeRecipeFromFavorites", err);
  }

  try {
    const localRecipesStr = localStorage.getItem(`favorites_recipes_${uid}`);
    if (localRecipesStr) {
      const items = JSON.parse(localRecipesStr).filter(r => Number(r.id) !== id);
      localStorage.setItem(`favorites_recipes_${uid}`, JSON.stringify(items));
      localStorage.setItem(`favorites_${uid}`, JSON.stringify(items.map(r => Number(r.id)).filter(Boolean)));
    }
  } catch (e) {
    console.warn("localStorage sync failed in removeRecipeFromFavorites", e);
  }
};
