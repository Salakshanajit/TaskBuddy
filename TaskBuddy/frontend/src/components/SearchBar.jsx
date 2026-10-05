export default function SearchBar({ value, onChange }) {
  return (
    <div className="field search-field">
      <label htmlFor="task-search">Search</label>
      <input
        id="task-search"
        type="search"
        placeholder="Search tasks by title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
