import View from "./view";
import icons from 'url:../../img/icons.svg';
import { RESULTS_PER_PAGE } from "../config";

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');

    _generateMarkup(){
        const currPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / RESULTS_PER_PAGE);
        if(currPage === 1){
            if(numPages > 1)
                return this.#generateNextPageMarkup(currPage);
            return "";
        }

        if(currPage === numPages){
            return this.#generatePrevPageMarkup(currPage);
        }

        if(currPage < numPages){
            return `
            ${this.#generatePrevPageMarkup(currPage)}
            ${this.#generateNextPageMarkup(currPage)}
            `;
        }
    }

    #generatePrevPageMarkup(currPage){
        return `
        <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
        </button>
        `
    }

    #generateNextPageMarkup(currPage){
        return `
        <button class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `
    }


    handleEvent(handler){
        this._parentElement.addEventListener('click', (e) => {
            if(e.target.closest('.pagination__btn--next'))
                handler(this._data.page + 1);
            else if(e.target.closest('.pagination__btn--prev'))
                handler(this._data.page - 1);
            else
                return;
        })
    }
}

export default new PaginationView();