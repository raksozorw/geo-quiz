import { ReactNode, useState } from "react";

interface ComponentProps {
  children: ReactNode;
}

const ListItem: React.FC<ComponentProps> = ({ children }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  if (clicked) {
    return (
      <ul onClick={handleClick}>
        <s>{children}</s>
      </ul>
    );
  } else {
    return <ul onClick={handleClick}>{children}</ul>;
  }
};

export default ListItem;
