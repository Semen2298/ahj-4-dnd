import Column from "./Column.js";

export default class Board {
  constructor(state) {
    this.state = state; // объект: { todo: [], inprogress: [], done: [] }
    this.columns = []; // массив экземпляров Column
  }

  render(container, onChange) {
    const columnsWrapper = container.querySelector(".board__columns");
    columnsWrapper.innerHTML = ""; // очищаем перед отрисовкой

    const types = ["todo", "inprogress", "done"];

    types.forEach((type) => {
      const cardsData = this.state[type] || [];

      // Создаем экземпляр колонки
      const column = new Column(type, cardsData);
      const columnEl = column.render();

      // Добавляем в DOM
      columnsWrapper.appendChild(columnEl);

      // Привязываем обработчики событий
      column.bindEvents(onChange);

      column.bindDnDEvents(onChange);

      // Сохраняем колонку в массив для дальнейшей работы
      this.columns.push(column);
    });
  }

  getState() {
    const result = {
      todo: [],
      inprogress: [],
      done: [],
    };

    this.columns.forEach((column) => {
      result[column.type] = column.getCards();
    });

    return result;
  }
}
