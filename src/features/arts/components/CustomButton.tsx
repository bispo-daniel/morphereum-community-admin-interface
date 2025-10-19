type CustomButtonProps = {
  action: () => void;
  placeholder?: string;
  type?: "pink" | "success" | "error";
};

const typeStyles = {
  pink: `
    bg-white
    text-[var(--coin-pink)]
    [filter:drop-shadow(0px_0px_2px_var(--coin-pink))]
    hover:[filter:drop-shadow(0px_0px_4px_var(--coin-pink))]
  `,
  success: `
    bg-green-500
    text-white
    [filter:drop-shadow(0px_0px_2px_rgb(34,197,94))]
    hover:[filter:drop-shadow(0px_0px_4px_rgb(34,197,94))]
  `,
  error: `
    bg-red-500
    text-white
    [filter:drop-shadow(0px_0px_2px_rgb(239,68,68))]
    hover:[filter:drop-shadow(0px_0px_4px_rgb(239,68,68))]
  `,
};

const CustomButton = ({
  action,
  placeholder = "download",
  type = "pink",
}: CustomButtonProps) => {
  return (
    <button
      onClick={action}
      className={`mt-auto flex h-8 min-h-8 min-w-8 items-center justify-center rounded-full px-2 transition-all duration-300 ${typeStyles[type]} `}
    >
      <span className="select-none">{placeholder}</span>
    </button>
  );
};

export default CustomButton;
