import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';

import { Routes } from 'src/utils/routes';

const Container = styled.div`
  flex-grow: 1;
  height: 100%;
`;

const Canvas = () => (
  <Container>
    {Routes.map(({ path, component }) => (
      <Route key={path} path={path} component={component} />
    ))}
  </Container>
);

export default Canvas;
