import View from "./view";

class SearchView extends View{
    _parentEl = document.querySelector('.search');

    getQuery() {
        return this._parentEl.querySelector('.search__field').value;
    }

    handleEvent(handler) {
        this._parentEl.addEventListener('submit', (e) => {
            e.preventDefault();
            handler();
            this._clearSearch();
        });
    }

    _clearSearch(){
        this._parentEl.querySelector('.search__field').value = '';
    }
}

export default new SearchView();