import { API_URL, RESULTS_PER_PAGE, KEY } from "./config";
import { AJAX } from "./helper";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1
    },
    bookmarks: []
};

const createRecipeObject = function(data){
    const { recipe } = data.data;
    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && {key: recipe.key})
    };
}

export const loadRecipe = async function(recipeId){
    try{
        const data = await AJAX(`${API_URL}/${recipeId}?key=${KEY}`);
        state.recipe = createRecipeObject(data);

        if(state.bookmarks.some(rec => rec.id === recipeId))
            state.recipe.bookmarked = true;
        else
            state.recipe.bookmarked = false;
    }
    catch(err){
        throw err;
    }
}

export const loadSearchResults = async function(query){
    try{
        query = query.toLowerCase().trim();
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                key: recipe.key
            }
        })
    }
    catch(err){
        throw err;
    }
}

export const getSearchResultsPage = function(page = state.search.page){
    state.search.page = page;
    const start = (page - 1) * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    return state.search.results.slice(start, end);
}

export const updateServings = function(newServ){
    if(newServ < 1)
        return;
    state.recipe.ingredients.forEach(ing => 
        ing.quantity = ing.quantity * newServ / state.recipe.servings
    );
    state.recipe.cookingTime = state.recipe.cookingTime * newServ / state.recipe.servings;
    state.recipe.servings = newServ;
}

const persistBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(){
    state.bookmarks.push(state.recipe);
    state.recipe.bookmarked = true;
    persistBookmarks();
}

export const removeBookmark = function(){
    const index = state.bookmarks.findIndex(recipe => recipe.id === state.recipe.id);
    state.bookmarks.splice(index, 1);
    state.recipe.bookmarked = false;
    persistBookmarks();
}

const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage)
        state.bookmarks = JSON.parse(storage);
}

init();

export const uploadRecipe = async function(newRecipe){
    try{
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
            const arrData = ing[1].split(',').map(el => el.trim());
            if(arrData.length != 3)
                throw new Error("Wrong Ingredients format!");
            const [quantity, unit, description] = arrData;
            return {quantity: quantity ? +quantity : null, unit, description};
        })

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients
        }

        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    }
    catch(err){
        throw err;
    }

}