import deleteIcon from "../../img/delete_icon.svg";

export default function createCardElement(text) {
  if (!text) return null;

  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  // Текст карточки
  const textNode = document.createTextNode(text);
  cardElement.appendChild(textNode);

  // Кнопка удаления
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("card__btn-delete");

  const img = document.createElement("img");
  img.src = deleteIcon;
  img.alt = "Delete";

  deleteBtn.appendChild(img);
  cardElement.appendChild(deleteBtn);

  return cardElement;
}
