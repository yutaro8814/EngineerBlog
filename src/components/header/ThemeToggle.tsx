interface Props {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
  }
  
  const ThemeToggle: React.FC<Props> = ({ theme, toggleTheme }) => (
    <button
      onClick={toggleTheme}
      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
    >
      {theme === 'dark' ? <i className="fas fa-sun" /> : <i className="fas fa-moon" />}
    </button>
  );
  
  export default ThemeToggle;
  