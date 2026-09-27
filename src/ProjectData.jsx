import { useState } from "react";
import { ProjectList } from "./ProjectList";
import { AddNewProjectButton } from "./AddNewProjectButton";

export const ProjectData = () => {
  const [currencies, setCurrencies] = useState(["HUF", "AUD", "IDR", "NZD"]);

  const cardList = [
    { id: 1, name: "Bali", currency: "IDR" },
    { id: 2, name: "Australia", currency: "AUD" },
    { id: 3, name: "New Zealand", currency: "NZD" },
  ];

  const [currentList, setCurrentList] = useState([...cardList]);

  function addNewProjectToList(projectName, currency) {
    const newProject = {
      id: currentList.length + 1,
      name: projectName,
      currency: currency,
    };
    setCurrentList([...currentList, newProject]);
  }
  return (
    <div>
      <ProjectList
        currencies={currencies}
        setCurrencies={setCurrencies}
        currentList={currentList}
        setCurrentList={setCurrentList}
      />
      <AddNewProjectButton
        currencies={currencies}
        setCurrencies={setCurrencies}
        addNewElementToList={addNewProjectToList}
      ></AddNewProjectButton>
    </div>
  );
};
