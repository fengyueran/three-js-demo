import React from 'react';
import styled from 'styled-components';

import TreeSelect, { Node } from 'src/components/TreeSelect';
import { treeData } from 'src/utils/mock-data';

const Container = styled.div`
  width: 300px;
  height: 100%;
  border-right: 1px solid #e8e8e8;
`;

interface Props {
  onSelect: (slected: any) => void;
}

const Catalogue: React.FC<Props> = ({ onSelect }) => (
  <Container>
    <TreeSelect treeData={treeData as Node[]} onSelect={onSelect} />
  </Container>
);

export default Catalogue;
