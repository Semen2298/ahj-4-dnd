import createCardElement from "./card.js";
import moreIcon from "../../img/more_icon.svg";
import deleteIcon from "../../img/delete_icon.svg";

export default class Column {
  constructor(type, cardsData) {
    this.type = type; // 'todo', 'inprogress', 'done'
    this.cardsData = cardsData; // массив строк — тексты карточек
    this.element = null; // DOM-элемент .column
    this.cardsContainer = null; // DOM-элемент .column__cards
  }

  render() {
    const column = document.createElement("div");
    column.classList.add("column", `column--${this.type}`);
    column.dataset.column = this.type;

    column.innerHTML = `
      <div class="column__header">
        <h2 class="column__title">${this.type.toUpperCase().replace(/INPROGRESS/, "IN PROGRESS")}</h2>
        <button class="column__more">
          <img src="${moreIcon}" alt="">
        </button>
      </div>
      <div class="column__cards"></div>
      <div class="column__footer">
        <button class="column__add">+ Add another card</button>
        <form class="column__add-form hidden">
          <textarea class="column__add-textarea" placeholder="Enter a title for this card..."></textarea>
          <div class="column__add-btns">
            <button class="column__add-btn">Add card</button>
            <button class="column__add-close">
              <img src="${deleteIcon}" alt="">
            </button>
          </div>
        </form>
      </div>
    `;

    this.element = column;
    this.cardsContainer = column.querySelector(".column__cards");

    this.cardsData.forEach((text) => {
      const card = createCardElement(text);
      if (card) this.cardsContainer.appendChild(card);
    });

    return column;
  }

  bindEvents(onChange) {
    const addBtn = this.element.querySelector(".column__add");
    const form = this.element.querySelector(".column__add-form");
    const textarea = this.element.querySelector(".column__add-textarea");
    const addCardBtn = this.element.querySelector(".column__add-btn");
    const closeFormBtn = this.element.querySelector(".column__add-close");

    // Показать форму
    addBtn.addEventListener("click", () => {
      form.classList.remove("hidden");
      addBtn.classList.add("hidden");
      textarea.focus();
    });

    // Скрыть форму
    closeFormBtn.addEventListener("click", (e) => {
      e.preventDefault();
      form.classList.add("hidden");
      addBtn.classList.remove("hidden");
      textarea.value = "";
    });

    // Добавить карточку
    addCardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const text = textarea.value.trim();
      if (!text) return;

      const card = createCardElement(text);
      if (card) {
        this.cardsContainer.appendChild(card);
        textarea.value = "";
        form.classList.add("hidden");
        addBtn.classList.remove("hidden");
        onChange();
      }
    });

    // Удалить карточку (делегирование)
    this.cardsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".card__btn-delete");
      if (!btn) return;
      const card = btn.closest(".card");
      if (!card) return;

      card.remove();
      onChange();
    });
  }

  getCards() {
    const cards = this.cardsContainer.querySelectorAll(".card");
    return Array.from(cards).map(
      (card) => card.childNodes[0]?.textContent.trim() || "",
    );
  }

  bindDnDEvents(onChange) {
    let dragged = null;
    let placeholder = null;
    let offsetX = 0;
    let offsetY = 0;

    this.cardsContainer.addEventListener("mousedown", (e) => {
      const deleteBtn = e.target.closest(".card__btn-delete");
      if (deleteBtn) return;

      const card = e.target.closest(".card");
      if (!card) return;

      e.preventDefault();

      dragged = card.cloneNode(true);
      dragged.classList.add("dragging");
      dragged.style.position = "absolute";
      dragged.style.zIndex = 1000;
      dragged.style.pointerEvents = "none";

      const rect = card.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      dragged.style.width = `${rect.width}px`;
      dragged.style.height = `${rect.height}px`;
      dragged.style.left = `${e.pageX - offsetX}px`;
      dragged.style.top = `${e.pageY - offsetY}px`;

      document.body.appendChild(dragged);

      placeholder = document.createElement("div");
      placeholder.classList.add("card");
      placeholder.style.height = `${rect.height}px`;
      placeholder.style.border = "2px dashed #999";
      card.after(placeholder);
      card.remove();

      const onMouseMove = (e) => {
        dragged.style.left = `${e.pageX - offsetX}px`;
        dragged.style.top = `${e.pageY - offsetY}px`;

        document.querySelectorAll(".column__cards").forEach((container) => {
          const rect = container.getBoundingClientRect();
          const inside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

          if (!inside) return;

          const children = Array.from(container.children);
          let inserted = false;

          for (let el of children) {
            const elRect = el.getBoundingClientRect();
            const midY = elRect.top + elRect.height / 2;

            if (e.clientY < midY) {
              container.insertBefore(placeholder, el);
              inserted = true;
              break;
            }
          }

          if (!inserted) {
            container.appendChild(placeholder);
          }
        });
      };

      const onMouseUp = () => {
        if (placeholder) {
          const finalCard = createCardElement(dragged.textContent.trim());
          placeholder.replaceWith(finalCard);
          onChange();
        }

        dragged.remove();
        dragged = null;
        placeholder = null;

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }
}
