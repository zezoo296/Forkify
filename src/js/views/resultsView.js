import previewView from "./previewView";

class ResultsView extends previewView {
    _parentElement = document.querySelector('.results');
    _errorMsg = "No recipes found for your query Please try again!";
    _successMsg;
}

export default new ResultsView();