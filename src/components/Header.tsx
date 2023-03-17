import React from "react";
import styled from "styled-components";

const Header = ({ setOpenedSidebar, openedSidebar }: HeaderProps) => {
  return (
    <HeaderStyles>
      <label className={`hamburguer-menu ${openedSidebar ? "active" : ""}`}>
        <input
          onClick={(e: any) => setOpenedSidebar(e.target.checked)}
          type="checkbox"
        />
      </label>
    </HeaderStyles>
  );
};

type HeaderProps = {
  setOpenedSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  openedSidebar: boolean;
};

const HeaderStyles = styled.div`
  --bar-width: 35px;
  --bar-height: 4px;
  --hamburguer-gap: 6px;
  --foreground: white;
  --background: white;
  --animation-timing: 100ms ease-in-out;
  --hamburguer-height: calc(var(--bar-height) * 3 + var(--hamburguer-gap) * 2);
  .hamburguer-menu {
    --x-width: calc(var(--hamburguer-height) * 1.41421);
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    gap: var(--hamburguer-gap);
    height: 2rem;
    left: 8px;
    justify-content: center;
    align-items: center;
    margin: 0;
    position: absolute;
    z-index: 4;
    transition: left 100ms ease-in-out;
    &.active{
      left: 11.5rem
    }
  }

  .hamburguer-menu::before,
  .hamburguer-menu input,
  .hamburguer-menu::after {
    content: "";
    width: var(--bar-width);
    height: var(--bar-height);
    background-color: var(--foreground);
    transform-origin: left center;
    transition: opacity var(--animation-timing), width var(--animation-timing),
      rotate var(--animation-timing);
  }

  .hamburguer-menu input {
    appearance: none;
    padding: 0;
    margin: 0;
    outline: none;
    pointer-events: none;
  }

  .hamburguer-menu:has(input:checked)::before {
    rotate: 45deg;
    translate: 0 calc(var(--bar-height) / -1.8);
    border-radius: 9999px;
  }

  .hamburguer-menu:has(input:checked)::after {
    rotate: -45deg;
    translate: 0 calc(var(--bar-height) / 1.8);
    border-radius: 9999px;
  }
  .hamburguer-menu input:checked {
    opacity: 0;
    width: 0;
  }

  display: flex;
  flex: 1;
  align-items: center;
  width: 100%;
  height: 3rem;
  background-color: blue;
`;

export default Header;
