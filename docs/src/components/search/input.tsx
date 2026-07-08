import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

import styled from '@emotion/styled';
import { Search } from 'react-feather';

const SearchIcon = styled(Search)`
  width: 1em;
  pointer-events: none;
  margin-right: 10px;
  position: absolute;
  left: 15px;
  color: #2fd2c5;
`;

const Input = styled.input<{ collapse?: boolean; focus?: boolean }>`
  outline: none;
  border: none;
  font-size: 1em;
  background: white;
  transition: ${(props) => props.theme.shortTrans};
  border-radius: ${(props) => props.theme.smallBorderRadius};
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  @media only screen and (max-width: 767px) {
    width: 100%;
    margin-left: 15px;
  }
`;

const SearchBox = connectSearchBox(({ refine, ...rest }) => {
  const preventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Form className={'formElement'} onSubmit={preventSubmit}>
      <SearchIcon />
      <Input
        className={'searchInput '}
        type="text"
        placeholder="Search"
        aria-label="Search"
        onChange={(e) => refine(e.target.value)}
        {...rest}
      />
    </Form>
  );
});

// The connected component passes arbitrary extra props (onFocus, collapse,
// focus) through to the search box, which the react-instantsearch typings
// don't model.
export default SearchBox as React.ComponentType<any>;
