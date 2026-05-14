import React from 'react';

const FilterBar = ({ categories, ageRanges, selectedCategory, setSelectedCategory, selectedAge, setSelectedAge }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <i className="fas fa-filter text-gray-500"></i>
        <span className="font-medium">Filter:</span>
      </div>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border rounded-lg px-3 py-2 bg-gray-50"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
        ))}
      </select>

      <select
        value={selectedAge}
        onChange={(e) => setSelectedAge(e.target.value)}
        className="border rounded-lg px-3 py-2 bg-gray-50"
      >
        {ageRanges.map(age => (
          <option key={age} value={age}>{age === 'all' ? 'All Ages' : `${age} years`}</option>
        ))}
      </select>

      <button
        onClick={() => { setSelectedCategory('all'); setSelectedAge('all'); }}
        className="text-sm text-yellow-600 hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
};

export default FilterBar;