import PreviewView from "./previewView";
import icons from 'url:../../img/icons.svg';

class bookmarksView extends PreviewView {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMsg = "No bookmarks yet, Find a nice recipe and bookmark it.";
    _successMsg;

    addHandler(handler){
        window.addEventListener('load', handler);
    }

    renderEmpty(){
        const html = ` 
                        <div class="message">
                            <div>
                            <svg>
                                <use href="${icons}#icon-smile"></use>
                            </svg>
                            </div>
                            <p>
                            No bookmarks yet. Find a nice recipe and bookmark it :)
                            </p>
                        </div>
                    `;
        this._parentElement.innerHTML = '';
        this._parentElement.insertAdjacentHTML("afterbegin", html);
    }
}

export default new bookmarksView();