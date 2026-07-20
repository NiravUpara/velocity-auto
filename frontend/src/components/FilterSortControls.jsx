import React from 'react';

function FilterSortControls({ makes, selectedMakes, onMakeChange, categories, selectedCategories, onCategoryChange, sortOrder, onSortChange }) {
  const handleMakeToggle = (make) => {
    if (selectedMakes.includes(make)) {
      onMakeChange(selectedMakes.filter((m) => m !== make));
    } else {
      onMakeChange([...selectedMakes, make]);
    }
  };

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="bg-velocity-surface/50 border border-white/10 rounded-xl p-6 mb-10 flex flex-col lg:flex-row gap-6 lg:gap-8 backdrop-blur-sm">
      
      {/* Make Filter */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-400 mb-3 font-orbitron tracking-wide">
          Filter by Make
        </label>
        <div className="flex flex-wrap gap-3">
          {makes.map((make) => {
            const isSelected = selectedMakes.includes(make);
            return (
              <button
                key={make}
                onClick={() => handleMakeToggle(make)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer ${
                  isSelected 
                    ? 'bg-velocity-red/20 text-velocity-red border-velocity-red/50 shadow-[0_0_10px_rgba(225,6,0,0.2)]' 
                    : 'bg-velocity-card text-gray-400 border-white/10 hover:bg-velocity-card/80 hover:border-velocity-text-muted'
                }`}
              >
                {make}
              </button>
            );
          })}
          {makes.length === 0 && (
            <span className="text-sm text-gray-400">No makes available</span>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-400 mb-3 font-orbitron tracking-wide">
          Filter by Type
        </label>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer ${
                  isSelected 
                    ? 'bg-velocity-blue/20 text-velocity-blue border-velocity-blue/50 shadow-[0_0_10px_rgba(0,217,255,0.2)]' 
                    : 'bg-velocity-card text-gray-400 border-white/10 hover:bg-velocity-card/80 hover:border-velocity-text-muted'
                }`}
              >
                {category}
              </button>
            );
          })}
          {categories.length === 0 && (
            <span className="text-sm text-gray-400">No types available</span>
          )}
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="lg:w-64">
        <label className="block text-sm font-medium text-gray-400 mb-3 font-orbitron tracking-wide">
          Sort by Price
        </label>
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-velocity-card border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-3 outline-none cursor-pointer transition-all"
        >
          <option value="none">Default Order</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

    </div>
  );
}

export default FilterSortControls;
