import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

/* Passar propriedade de foco para o Container */
interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
    background: #fff;
    border-radius: 10px;
    border: 2px solid #5636d3;
    padding: 16px;
    width: 100%;
    color: #000;


    display: flex;
    align-items: center;


    & + div{
        margin-top: 8px;
    }

    ${props =>
      props.isErrored &&
      css`
        border-color: #c53030;
      `}

    /* Colocar foco no input e no icone */
    ${props =>
      props.isFocused &&
      css`
        color: #ff872c;
        border-color: #ff872c;
      `}

    ${props =>
      props.isFilled &&
      css`
        color: #ff9000;
      `}

    input{
        flex: 1;
        border: 0;
        background: transparent;

        color: #666360;

        &::placeholder{
            color: #666360;
        }
    }

    svg{
        margin-right: 16px;
    }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }
  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
