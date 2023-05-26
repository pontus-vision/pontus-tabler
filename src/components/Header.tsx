import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = ({ setOpenedSidebar, openedSidebar }: HeaderProps) => {
  const navigate = useNavigate()

    const { i18n } = useTranslation();
  
    const handleLanguageChange = (event) => {
      const selectedLanguage = event.target.value;
      i18n.changeLanguage(selectedLanguage);
    };
  

  return (
    <HeaderStyles>
      <select className="language-selector" onChange={handleLanguageChange}>
        <option value="en">English</option>
        <option value="ptBr">Português</option>
        {/* Add more language options */}
      </select>
      <label className={`hamburguer-menu ${openedSidebar ? "active" : ""}`}>
        <input
          onClick={(e: any) => setOpenedSidebar(e.target.checked)}
          type="checkbox"
        />
      </label>
      <img className={`logo ${openedSidebar ? "active" : ""}`} onClick={()=>navigate("/")} src="data:image/png;base64,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"></img>
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

  .logo{
    position: relative;
    left: 5rem;
    cursor: pointer;
    transition: left 100ms ease-in-out;
    &.active{
      left: 15rem;
    }
  }

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
  .language-selector{
    right: 2rem;
    position: absolute;
  }

  display: flex;
  flex: 1;
  align-items: center;
  width: 100%;
  height: 3rem;
  background-color: blue;
`;

export default Header;
