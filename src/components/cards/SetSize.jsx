const SetSize = ({ setSize }) => {
  return (
    <div className="justify-between w-20 h-28 border-2 rounded-lg m-1">
      {/* Center Size */}
      <div className="flex justify-center items-center h-full">
        <span className="text-4xl">{setSize}</span>
      </div>
    </div>
  );
};

export default SetSize;
