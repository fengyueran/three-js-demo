import React, { useState } from 'react';
import styled from 'styled-components';
import TreeNode, { Node } from './TreeNode';

const Container = styled.div`
  width: 100%;
  padding: 10px;
`;

const Ul = styled.ul`
  font-size: 14px;
  line-height: 1.5;
  list-style: none;
  margin: 0;
  margin-top: -4px;
  padding-left: 4px;
  padding-right: 20px;
`;

interface TreeNodesStatus {
  [key: string]: boolean;
}

interface Props {
  treeData: Array<Node>;
  onSelect?: Function;
  isExpanded?: boolean;
  nodeKey?: keyof Node;
  renderNode?: Function;
}

const TreeSelect: React.FC<Props> = ({ nodeKey, treeData = [], onSelect, isExpanded }) => {
  const [treeNodesStatus, setTreeNodesStatus] = useState<TreeNodesStatus>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const handleNodeSelected = (selected: { id: string; isExpanded: boolean }) => {
    treeNodesStatus[selected.id] = selected.isExpanded;
    setTreeNodesStatus({ ...treeNodesStatus });
    setSelectedNodeId(selected.id);
    if (onSelect) {
      onSelect(selected);
    }
  };

  const renderNode = (data: Array<Node>, position?: string) => (
    <Ul>
      {data.map((node, index) => {
        const { children, ...res } = node;
        const pos = position ? `${position}-${index}` : `${index}`;
        const id = (nodeKey && node[nodeKey]) || pos;
        let expanded = treeNodesStatus[id as string];
        if (typeof expanded === 'undefined') expanded = Boolean(isExpanded);
        const isSelected = id === selectedNodeId;

        return (
          <TreeNode
            id={id as string}
            subData={children}
            isExpanded={expanded}
            onSelect={handleNodeSelected}
            isSelected={isSelected}
            {...res}
          >
            {children && renderNode(children, pos)}
          </TreeNode>
        );
      })}
    </Ul>
  );

  return <Container>{renderNode(treeData)}</Container>;
};

export default TreeSelect;
