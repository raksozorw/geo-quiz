interface ComponentProps {}

const Section: React.FC<ComponentProps> = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        margin: "40px auto",
        justifyContent: "center",
      }}
    ></div>
  );
};

export default Section;
