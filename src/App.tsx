import './App.css'
import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_ICONS_QUERY = gql`
  query ($searchQuery: String!) {
    search(version: "6.0.0", query: $searchQuery, first: 100) {
      id
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

export default function App() {
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('a');
  const { loading, error, data } = useQuery(GET_ICONS_QUERY, {
    variables: { searchQuery },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const searchResults = (data?.search || []).filter((result: any) => {
    return result.familyStylesByLicense.free.length > 0;
  });

  const addToCanvas = async (icon: any) => {
    const element = await webflow.getSelectedElement();
    if (!element) {
      await webflow.notify({
        type: 'Error',
        message: 'Please select an element first and try again.',
      });
      return;
    }

    let iconElement = webflow.createDOM('i');
    iconElement.setAttribute(
      'class',
      `fa-${icon.familyStylesByLicense.free[0].style} fa-${icon.id}`
    );
    if (element.configurable && element.children) {
      element.setChildren([iconElement]);
      await element.save();
    }
  };

  return (
    <main>
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
        {searchResults.map((icon: any) => {
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
