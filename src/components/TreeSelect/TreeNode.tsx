/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CaretDown = () => (
  <svg
    viewBox="0 0 1024 1024"
    data-icon="caret-down"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" />
  </svg>
);

const Switcher = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  margin: 0;
  line-height: 22px;
  text-align: center;
  vertical-align: middle;
  border: 0 none;
  outline: none;
  cursor: pointer;
`;

const IconWrapper = styled.i<{ isExpanded: boolean }>`
  transform: scale(0.83) rotate(0deg);
  display: inline-block;
  font-weight: bold;
  vertical-align: -0.125em;
  pointer-events: none;
  svg {
    transition: transform 0.3s;
    transform: ${(props) => (props.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)')};
  }
`;

const Li = styled.li`
  margin: 8px 0;
  padding: 0;
  white-space: nowrap;
  list-style: none;
  outline: 0;
  ul {
    padding-left: 18px;
  }
`;

const TextWrapper = styled.div`
  display: flex;
`;
const Content = styled.span<{ isSelected: boolean }>`
  display: inline-block;
  width: calc(100% - 24px);
  margin: 0;
  padding: 3px 5px;
  color: rgba(0, 0, 0, 0.65);
  text-decoration: none;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: ${(props) => (props.isSelected ? '#bae7ff' : 'none')};
  :hover {
    background: ${(props) => (props.isSelected ? '#bae7ff' : 'aliceblue')};
  }
`;

export interface Node {
  title: string;
  value: string;
  key?: string;
  children?: Array<Node> | undefined;
}

interface Props {
  id: string;
  title: string;
  subData: Array<Node> | undefined;
  isExpanded: boolean;
  isSelected: boolean;
  onSelect: Function;
}

const TreeNode: React.FC<Props> = ({
  onSelect,
  children,
  subData,
  isSelected,
  isExpanded = true,
  ...res
}) => {
  const { title } = res;
  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect({ ...res, children: subData, isExpanded: !isExpanded });
    }
  };
  return (
    <Li onClick={handleNodeClick}>
      <TextWrapper>
        <Switcher>
          {children && (
            <IconWrapper isExpanded={isExpanded}>
              <CaretDown />
            </IconWrapper>
          )}
        </Switcher>
        <Content isSelected={!children && isSelected}>{title}</Content>
      </TextWrapper>
      {isExpanded && children}
    </Li>
  );
};

export default TreeNode;
