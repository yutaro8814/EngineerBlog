interface Props {
  onClick: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const MobileMenuButton: React.FC<Props> = ({ onClick, buttonRef }) => (
  <button
    ref={buttonRef}
    onClick={onClick}
    className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
  >
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
);

export default MobileMenuButton;
