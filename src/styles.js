import styled from 'styled-components';

/**
 * Custom styles for the user's selected color.
 */
export const ColoredDiv = styled.div`
  background-color: ${props => props.rgba};
  height: 20px;
  width: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 3px;
`

/**
 * Custom styles for the displayed text.
 */
export const StyledText = styled.div`
  font-size: 15px;
  font-family: Arial, Helvetica, sans-serif;
`

/**
 * Custom styles for the overall container with vertically stacked elements and margins.
 */
export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;


  & > * {
    margin: 10px;
  }
`

/**
 * Custom styles for the hidden image.
 */
export const HiddenImage = styled.img`
  display: none;
`
