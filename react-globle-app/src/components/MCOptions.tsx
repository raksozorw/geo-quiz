interface ComponentProps {
  options: string[];
  submitAnswer: (param: string) => void;
  loading: boolean;
}

const MCOptions: React.FC<ComponentProps> = ({
  options,
  submitAnswer,
  loading,
}) => {
  if (loading) {
    return <div>loading</div>;
  }
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        margin: "40px auto",
        justifyContent: "center",
      }}
    >
      {options.map((item) => {
        return <button onClick={() => submitAnswer(item)}>{item}</button>;
      })}
    </div>
  );
};

export default MCOptions;
