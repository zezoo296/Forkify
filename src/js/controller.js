import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_MSEC } from './config.js';


// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

if (module.hot)
  module.hot.accept();

const controlRecipe = async function (recipeId) {
  try {
    if (!recipeId)
      return;
    recipeView.renderSpinner();

    await model.loadRecipe(recipeId);

    recipeView.render(model.state.recipe);

    resultsView.update(model.getSearchResultsPage(model.state.search.page));
    bookmarksView.update(model.state.bookmarks);
  }
  catch (err) {
    recipeView.renderError();
  }
}

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query)
      return;
    resultsView.renderSpinner();

    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage(1));

    paginationView.render(model.state.search);
  }
  catch (err) {
    resultsView.renderError();
  }
}

const controlPagination = function (page) {
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
}

const controlServings = function (num) {
  model.updateServings(model.state.recipe.servings + num);
  recipeView.render(model.state.recipe);
}

const controlBookmark = function () {
  if (model.state.recipe.bookmarked)
    model.removeBookmark();
  else
    model.addBookmark();
  recipeView.update(model.state.recipe);
  controlBookmarkLoad();
}

const controlBookmarkLoad = function () {
  if (model.state.bookmarks.length > 0)
    bookmarksView.render(model.state.bookmarks);
  else
    bookmarksView.renderEmpty();
}

const controlAddRecipe = async function (data) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(data);

    addRecipeView.renderSuccess();
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_MSEC);

    window.location.hash = model.state.recipe.id;

    setTimeout(() => addRecipeView.render(), MODAL_CLOSE_MSEC + 1000);

    controlBookmarkLoad();
  }
  catch (e) {
    addRecipeView.renderError(e.message);
    setTimeout(() => addRecipeView.render(), MODAL_CLOSE_MSEC);
  }
}

const init = function () {
  bookmarksView.addHandler(controlBookmarkLoad);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.handleEvent(controlSearchResults);
  paginationView.handleEvent(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
