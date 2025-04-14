import Board from "./Board.js";

export default class App {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.state = {}; // Сюда загрузим состояние из localStorage
    this.board = null; // Экземпляр Board
  }

  init() {
    this.state = this.loadState();
    this.board = new Board(this.state);
    this.board.render(this.container, this.onChange.bind(this));
  }

  loadState() {
    try {
      const raw = localStorage.getItem("trello-state");
      if (!raw) {
        // Если данных нет — создаём структуру по умолчанию
        return {
          todo: ["Welcome to Trello!"],
          inprogress: [
            "Invite your team to this board using the Add Members button",
          ],
          done: ["To learn more tricks, check out the guide."],
        };
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to load state:", e);
      return {
        todo: [],
        inprogress: [],
        done: [],
      };
    }
  }

  saveState() {
    const newState = this.board.getState();
    localStorage.setItem("trello-state", JSON.stringify(newState));
  }

  onChange() {
    this.saveState();
  }
}
