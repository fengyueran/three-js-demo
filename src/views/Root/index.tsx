import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { Row } from 'src/components/FlexBox';
import Catalogue from '../Catalogue';
import Canvas from '../Canvas';

const Container = styled(Row)`
  width: 100vw;
  height: 100vh;
`;

const Root = () => {
  const history = useHistory();
  const onSelect = (selected: any) => {
    const value = selected && selected.value;
    if (value) {
      history.push(value);
    }
  };
  return (
    <Container>
      <Catalogue onSelect={onSelect} />
      <Canvas />
    </Container>
  );
};

export default Root;
