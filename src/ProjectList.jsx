import { useState } from "react";
import { DropDown } from "./DropDown";
import { AddNewProjectButton } from "./AddNewProjectButton";

export const ProjectList = ({
  currencies,
  setCurrencies,
  currentList,
  setCurrentList,
}) => {
  function modifyCurrentList(list, id, key, value) {
    const newList = list.map((element) => {
      if (element.id === id) {
        const newElement = element;
        newElement[key] = value;
        return newElement;
      } else {
        return element;
      }
    });
    setCurrentList(newList);
  }

  // function addNewElementToList(elementName, currency) {
  //   const newElement = {
  //     id: currentList.length + 1,
  //     name: elementName,
  //     currency: currency,
  //   };
  //   setCurrentList([...currentList, newElement]);
  // }

  function deleteProject(list, elementId) {
    const updatedList = list.filter((element) => element.id !== elementId);
    setCurrentList(updatedList);
  }

  const cardElements = currentList.map((element) => {
    return (
      <div key={element.id} className={"border rounded-lg bg-gray-200 p-2"}>
        <h2>Project name: {element.name}</h2>
        <div className={"flex items-center gap-3"}>
          Currency:{" "}
          <DropDown
            currencies={currencies}
            setCurrencies={setCurrencies}
            selectedCurrency={element.currency}
            setSelectedCurrency={(value) => {
              modifyCurrentList(currentList, element.id, "currency", value);
            }}
          />
        </div>
        <button
          className={
            "bg-red-300 hover:bg-red-500 hover:text-white border border-red-500 hover:border-transparent rounded"
          }
          onClick={() => {
            deleteProject(currentList, element.id);
          }}
        >
          Delete Project
        </button>
      </div>
    );
  });
  return (
    <>
      <div className={"grid grid-cols-3 gap-2"}>{cardElements}</div>
    </>
  );
};
