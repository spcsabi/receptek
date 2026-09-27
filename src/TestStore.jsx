import useStore from "./store/store";

export function TestStore() {
  const projects = useStore((state) => state.projects);
  const { updateProjects } = useStore((state) => state.actions);

  return (
    <div className={"grid grid-cols-3 gap-2"}>
      {projects.map((project) => {
        return (
          <div key={project.id} className={"border rounded-lg bg-gray-200 p-2"}>
            <p className={"font-bold"}>
              Project name:<span> </span>
              <input
                className={"font-light"}
                type="text"
                value={project.name}
                onChange={(e) => {
                  updateProjects(project.id, "name", e.target.value);
                }}
              />
            </p>
            <p>
              Currency:<span> </span>
              <input
                className={"font-light"}
                type="text"
                value={project.currency}
                onChange={(e) => {
                  updateProjects(project.id, "currency", e.target.value);
                }}
              />
            </p>
          </div>
        );
      })}
    </div>
  );
}
