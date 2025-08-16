import React from 'react';

interface CategoryBarProps {
  categories: Array<{
    main: string;
    subcategories: string[];
  }>;
  selectedCategory: string;
  selectedSubcategory: string;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
}

function CategoryBar({
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange
}: CategoryBarProps) {
  const currentCategory = categories.find(cat => cat.main === selectedCategory);

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-md z-20 transition-transform duration-300 `} style={{ borderTop: '2px solid red' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-2 py-2">
          <div className="flex space-x-4 overflow-x-auto pb-0 pt-0">
            {categories.map(({ main }) => (
              <button
                key={main}
                onClick={() => {
                  onCategoryChange(main);
                  onSubcategoryChange('all');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === main
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {main === 'all' ? 'All Items' : main}
              </button>
            ))}
          </div>
          
          {currentCategory?.subcategories.length > 0 && (
            <div className="flex space-x-4 overflow-x-auto">
              <button
                onClick={() => onSubcategoryChange('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedSubcategory === 'all'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                All {selectedCategory}
              </button>
              {currentCategory.subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => onSubcategoryChange(sub)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedSubcategory === sub
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryBar;