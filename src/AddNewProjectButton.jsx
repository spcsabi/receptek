import { useState } from "react";
import { DropDown } from "./DropDown";

export const AddNewProjectButton = ({
  currencies,
  setCurrencies,
  addNewElementToList,
}) => {
  const [hide, setHide] = useState(true);
  const [projectName, setProjectName] = useState("");
  let defaultProjectCurrencyText = "-select currency-";
  const [projectCurrency, setProjectCurrency] = useState(
    defaultProjectCurrencyText,
  );
  const [isProjectNameEmptyAlert, setIsProjectNameEmptyAlert] = useState(false);
  const [isProjectCurrencyEmptyAlert, setIsProjectCurrencyEmptyAlert] =
    useState(false);

  const handleSave = () => {
    setIsProjectNameEmptyAlert(false);
    setIsProjectCurrencyEmptyAlert(false);
    if (projectName === "") {
      setIsProjectNameEmptyAlert(true);
    }
    if (projectCurrency === defaultProjectCurrencyText) {
      setIsProjectCurrencyEmptyAlert(true);
    }
    if (projectName != "" && projectCurrency != defaultProjectCurrencyText) {
      addNewElementToList(projectName, projectCurrency);
      setProjectName("");
      setProjectCurrency(defaultProjectCurrencyText);
      setHide(!hide);
      setIsProjectNameEmptyAlert(false);
      setIsProjectCurrencyEmptyAlert(false);
    }
    console.log(
      "projectName:",
      projectName,
      "projectCurrency: ",
      projectCurrency,
    );
  };

  return (
    <div className={"border rounded-lg"}>
      <button
        className={hide ? "flex flex-col" : "hidden"}
        onClick={() => {
          setHide(!hide);
        }}
      >
        + Add New Project
      </button>
      <div id="2" className={hide ? "hidden" : "grid"}>
        <div>
          <label>Project Name: </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="new item"
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value);
            }}
          ></input>
          <div>
            {isProjectNameEmptyAlert ? "*Project name is required" : ""}
          </div>
        </div>

        <div>
          <label>Currency: </label>
          <DropDown
            currencies={currencies}
            setCurrencies={setCurrencies}
            selectedCurrency={projectCurrency}
            setSelectedCurrency={setProjectCurrency}
          ></DropDown>
          <div>
            {isProjectCurrencyEmptyAlert ? "*Currency is required" : ""}
          </div>
        </div>

        <button onClick={handleSave}>Save Project</button>

        <button
          type="reset"
          onClick={(e) => {
            setProjectName("");
            setProjectCurrency(defaultProjectCurrencyText);
            setIsProjectNameEmptyAlert(false);
            setIsProjectCurrencyEmptyAlert(false);
          }}
        >
          Reset
        </button>

        <button
          onClick={() => {
            setHide(!hide);
            setProjectName("");
            setProjectCurrency(defaultProjectCurrencyText);
            setIsProjectNameEmptyAlert(false);
            setIsProjectCurrencyEmptyAlert(false);
          }}
        >
          Delete Project
        </button>
      </div>
    </div>
  );
};
