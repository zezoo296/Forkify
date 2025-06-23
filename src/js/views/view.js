import icons from 'url:../../img/icons.svg';

export default class View{
    _data;
    _parentElement;
    _errorMsg;
    _successMsg;

    render(data){
        this._data = data;
        const html = this._generateMarkup();
        this._parentElement.innerHTML = '';
        this._parentElement.insertAdjacentHTML('afterbegin', html);
    }

    update(data){
      this._data = data;
      const html = this._generateMarkup();

      const newDom = document.createRange().createContextualFragment(html);
      const currElements = this._parentElement.querySelectorAll('*');
      const newElements = newDom.querySelectorAll('*');

      newElements.forEach((newEl, i) => {
        if(!newEl.isEqualNode(currElements[i]))
        {
          if(newEl.firstChild?.nodeType === 3 && newEl.textContent !== currElements[i].textContent)
            currElements[i].textContent = newEl.textContent;
          currElements[i].classList = newEl.classList
          Array.from(newEl.attributes).forEach(attr => {
            currElements[i].setAttribute(attr.name, attr.value);
          });
        }
      })
    }

    renderError(message = this._errorMsg){
        const html = `
        <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
          </div> 
        `;
        this._parentElement.innerHTML = '';
        this._parentElement.insertAdjacentHTML('afterbegin', html);
      }

      renderSuccess(message = this._successMsg){
        const html = `
        <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
          </div> 
        `;
        this._parentElement.innerHTML = '';
        this._parentElement.insertAdjacentHTML('afterbegin', html);
      }
  
      renderSpinner(){
          this._parentElement.innerHTML = '';
          const html = `
            <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
          `;
          this._parentElement.insertAdjacentHTML('afterbegin', html);
      }
}