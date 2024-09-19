import CopyButton from "../buttons/CopyButton";

const NavBar = (copyButton) => {
  console.log("Hello");
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div
        id="content"
        className="max-w-4xl flex flex-col justify-center items-center my-8 mx-2"
      >
        <CopyButton
          copied={copyButton.copied}
          onClick={copyButton.handleCopyGameCode}
          text={copyButton.gameCode}
        ></CopyButton>
      </div>
    </div>
  );
};

export default NavBar;
