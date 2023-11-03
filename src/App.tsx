import { useState, SyntheticEvent } from 'react';
import { useQuery } from '@apollo/client';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  library,
  icon as faIcon,
  findIconDefinition,
  IconName,
} from '@fortawesome/fontawesome-svg-core';

import { insertIcon } from './insert-icon';
import { transformIconPrefix } from './transform-icon-prefix';
import { GET_ICONS_QUERY } from './query';

library.add(fas, far, fab);

type Icon = {
  id: string;
  label: string;
  familyStylesByLicense: {
    free: Array<{
      family: string;
      style: string;
    }>;
    pro: Array<{
      family: string;
      style: string;
    }>;
  };
};

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('a');
  const [color, setColor] = useState('#ffffff');

  const { loading, error, data } = useQuery(GET_ICONS_QUERY, {
    variables: { searchQuery },
  });

  if (error) return <p>Error : {error.message}</p>;

  const searchResults = (data?.search || []).filter((result: Icon) => {
    return result.familyStylesByLicense.free.length > 0;
  });

  const handleFormSearch = (event: SyntheticEvent) => {
    event.preventDefault();
    setSearchQuery(inputValue);
  };

  const handleClearInput = () => {
    setInputValue('');
  };

  const addToCanvas = async (icon: Icon) => {
    const element = await webflow.getSelectedElement();
    if (!element) {
      await webflow.notify({
        type: 'Error',
        message: 'Please select an element first and try again.',
      });
      return;
    }

    const iconName = icon.id as IconName;
    const prefix = transformIconPrefix(
      icon.familyStylesByLicense.free[0].style
    );

    const iconDef = findIconDefinition({ prefix, iconName });
    const i = faIcon(iconDef);
    if (!i?.abstract?.length) {
      await webflow.notify({
        type: 'Error',
        message: 'Unable to complete request. Please select a different icon.',
      });
      return;
    }

    await insertIcon(i, element, color);
  };

  return (
    <main className="bg-wf-almostBlack text-wf-text p-2 pt-0 font-body flex gap-y-2 flex-col">
      <div className="flex gap-y-2 flex-col sticky top-0 py-2 bg-wf-almostBlack z-10">
        <div className="flex gap-2 flex-col">
          <form className="flex gap-x-2" onSubmit={handleFormSearch}>
            <div className="relative grow">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="w-full border-wf-border-color border border-solid text-base bg-wf-input-color rounded px-2 py-1 focus:shadow-wf-input focus:outline-none"
                placeholder="Enter an icon name..."
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleClearInput}
                className="text-white absolute right-1 h-full"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <button
              type="submit"
              className="bg-wf-grey rounded px-3 text-xs text-wf-text-secondary"
              disabled={loading}
            >
              Search
            </button>
          </form>

          <div className="flex gap-x-2 items-center">
            <label htmlFor="colorPicker" className="text-xs">
              Set color
            </label>
            <input
              type="color"
              value={color}
              id="colorPicker"
              onChange={e => setColor(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div>
          Loading... <i className="animate-spin fa-solid fa-spinner"></i>
        </div>
      ) : (
        <ul className="grid grid-cols-3 gap-2">
          {searchResults.map((icon: Icon) => {
            return (
              <li className="flex rounded-sm p-2 bg-wf-grey" key={icon.id}>
                <button
                  type="button"
                  onClick={() => addToCanvas(icon)}
                  className="flex flex-col gap-y-2 grow justify-center items-center hover:opacity-80"
                >
                  <i
                    className={`block fa-2x fa-${icon.familyStylesByLicense.free[0].style} fa-${icon.id}`}
                    style={{ color }}
                  />
                  <span className="line-clamp-2 text-xs text-white">
                    {icon.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
