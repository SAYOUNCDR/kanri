const Button = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-zinc-900 text-white px-4 py-1.5 rounded-md font-medium hover:bg-zinc-800 transition-all border border-zinc-900 border-t-zinc-600 shadow-md active:translate-y-[1px] cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
