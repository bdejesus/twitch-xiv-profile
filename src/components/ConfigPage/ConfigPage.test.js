import { shallow } from 'enzyme';
import React from 'react';
import ConfigPage from './ConfigPage';

test('renders without failing', () => {
  const wrapper = shallow(<ConfigPage />);

  expect(wrapper).toBeDefined();
});
