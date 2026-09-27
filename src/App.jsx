import EmailLogin from "./firebase/components/EmailLogin";
import GuestOnly from "./firebase/components/GuestOnly";
import AuthOnly from "./firebase/components/AuthOnly";
import { useContext } from "react";
import { UserContext } from "./firebase/components/UserProvider";
import Test from "./Test";
import { ProjectList } from "./ProjectList";
import { ProjectData } from "./ProjectData";
import { TestStore } from "./TestStore";

function App() {
  const user = useContext(UserContext);
  const firstName = user?.displayName.split(" ")[0];
  return (
    <div>
      <AuthOnly>
        <ProjectData />
        <br></br>
        <h1>Tás</h1>
        <p>{`Szia ${firstName}`}</p>
        <Test />
        <TestStore/>
      </AuthOnly>
      <GuestOnly>
        <EmailLogin />
      </GuestOnly>
    </div>
  );
}

export default App;
