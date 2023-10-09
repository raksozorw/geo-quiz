import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
}

const TextButton: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        margin: "0",
        padding: "0",
        border: "none",
        color: "#646cffaa",
      }}
    >
      {children}
    </button>
  );
};

export default TextButton;
