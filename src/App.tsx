import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

import { buildAndAppendIcon } from './icon-builder';
import {
  library,
  icon as faIcon,
  findIconDefinition,
  IconPrefix,
  IconName,
} from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
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
    const style = icon.familyStylesByLicense.free[0].style;

    let prefix = '' as IconPrefix;
    switch (style) {
      case 'solid':
        prefix = 'fas';
        break;
      case 'regular':
        prefix = 'far';
        break;
      case 'light':
        prefix = 'fal';
        break;
      case 'thin':
        prefix = 'fat';
        break;
      case 'duotone':
        prefix = 'fad';
        break;
      case 'brands':
        prefix = 'fab';
        break;
      case 'knockout':
        prefix = 'fak';
        break;
      case 'solid-style':
        prefix = 'fass';
        break;
      case 'regular-style':
        prefix = 'fasr';
        break;
      case 'light-style':
        prefix = 'fasl';
        break;
      default:
        prefix = 'fas';
        break;
    }

    const iconDef = findIconDefinition({ prefix, iconName });
    const i = faIcon(iconDef);
    if (!i || !i.abstract.length) {
      return;
    }

    await buildAndAppendIcon(i, element);

    // i.abstract.forEach(async node => {
    //   const nodeElement = webflow.createDOM(node.tag);
    //   const attributes = node.attributes;
    //   Object.keys(attributes).forEach(attrKey => {
    //     nodeElement.setAttribute(attrKey, attributes[attrKey]);
    //   });

    //   const children = node.children;
    //   if (children?.length) {
    //     children.forEach(child => {
    //       const childElement = webflow.createDOM(child.tag);
    //       const childAttributes = child.attributes;
    //       Object.keys(childAttributes).forEach(attrKey => {
    //         childElement.setAttribute(attrKey, childAttributes[attrKey]);
    //       });
    //       nodeElement.setChildren([childElement]);
    //     });
    //   }

    //   if (element.configurable && element.children) {
    //     element.setChildren([nodeElement]);
    //     await element.save();
    //   }
    // });

    // Loop through each node and appending it to the DOM body
    // Array.from(i.node).map(n => document.body.appendChild(n));

    // iconElement.setAttribute('class', `fa-${style} fa-${icon.id}`);
    // if (element.configurable && element.children) {
    //   element.setChildren([iconElement]);
    //   await element.save();
    // }
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
