import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
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
import { getFaCssStyleRules } from './get-fa-css-style-rules';
import { createStyleRules } from './create-style-rules';

library.add(fas, far, fab);

const GET_ICONS_QUERY = gql`
  query ($searchQuery: String!) {
    search(version: "6.0.0", query: $searchQuery, first: 100) {
      id
      label
      unicode
      familyStylesByLicense {
        free {
          family
          style
        }
        pro {
          family
          style
        }
      }
    }
  }
`;

type Icon = {
  id: string;
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
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('a');
  const { loading, error, data } = useQuery(GET_ICONS_QUERY, {
    variables: { searchQuery },
  });
  const [cssStyleRules] = useState(() => getFaCssStyleRules());

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const searchResults = (data?.search || []).filter((result: Icon) => {
    return result.familyStylesByLicense.free.length > 0;
  });

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

    const allClasses = await insertIcon(i, element);
    console.log({ cssStyleRules, allClasses });
    await createStyleRules(allClasses);
  };
  console.log('searchResults', searchResults);
  return (
    <main className="bg-wf-bg text-wf-text-2">
      <h1>icon finder</h1>
      <div>
        <input
          type="text"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        <button type="button" onClick={() => setSearchQuery(searchValue)}>
          Search
        </button>
      </div>

      <ul>
        {searchResults.map((icon: Icon) => {
          return (
            <li key={icon.id}>
              {icon.id}
              <i
                className={`fa-${icon.familyStylesByLicense.free[0].style} fa-${icon.id}`}
              />
              <button type="button" onClick={() => addToCanvas(icon)}>
                Add
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
