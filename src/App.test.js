import { cleanup, render, screen } from '@testing-library/react';
import App from './App';
import DnDFighters, { FighterSearchDisplay } from './components/DnDFighters';
import ReactDOM from 'react-dom';

import "@testing-library/jest-dom/extend-expect";

//after each render test, removes the dom element so there is no duplication and thus errors
afterEach(cleanup);
/*
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(< FighterSearchDisplay />, div)
})

it('renders correctly', () => {
  const searchFighter = {
    'race': 'Human',
    'class': 'Barbarian',
    'primaryAbility': '',
    'secondaryAbility': '',
    'bond': 0,
    'STR': 1,
    'DEX': 0,
    'CON': 1,
    'INT': 0,
    'WIS': 0,
    'CHR': 0
  }
  const {getByTestId} = render(< FighterSearchDisplay searchFighter={searchFighter} />);
  expect(getByTestId('fightersearchtest')).toHaveTextContent('Human');
})