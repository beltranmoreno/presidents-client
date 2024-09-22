import CopyButton from "../buttons/CopyButton";
import ServerStatus from "./ServerStatus";

const NavBar = ({copyButton, connectionStatus}) => {

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div
        id="content"
        className="max-w-4xl flex justify-between items-center my-8 mx-2 w-full"
      >
        <div className="my-4">
          <img src="./Presidents.svg" alt="Presidents Logo"></img>
        </div>
        <div className="flex justify-center space-x-4 items-center">
          <ServerStatus connectionStatus={connectionStatus}></ServerStatus>

          <CopyButton
            copied={copyButton.copied}
            onClick={copyButton.handleCopyGameCode}
            text={copyButton.text}
          ></CopyButton>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
