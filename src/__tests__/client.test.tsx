// import '@testing-library/jest-dom'
import { describe, it, expect, afterEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import {cleanup, render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from '../components/Header';
import App from '../App';
import { initReactI18next } from 'react-i18next';
import i18n, { resources } from '../pv-react/i18n';
import { useState } from 'react';
import React from 'react';


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });
  
  describe('Header', () => {
  it('should change the language', () => {
    afterEach(() => {
      cleanup(); // Clean up rendered components
      // Perform additional cleanup tasks if needed
    });

    render(<Header />, {wrapper: BrowserRouter});

    const languageSelect = screen.getByTestId('language-select');

    fireEvent.change(languageSelect, { target: { value: 'ptBr' } });

    expect(languageSelect.value).toBe('ptBr');
  });

  it('should toggle the sidebar', () => {
    
    const setOpenedSidebar = vi.fn()
    const useStateSpy = vi.spyOn(React, "useState");
    
    
    useStateSpy.mockImplementation((initialState) => {     
      console.log({initialState}, initialState.location.state)
      return [initialState, setOpenedSidebar]
    });

    render(
      <Header setOpenedSidebar={setOpenedSidebar} openedSidebar={false} />, {wrapper: BrowserRouter}
    );
    
    expect(screen.getByTestId('toggle-input').checked).toBe(false);

    screen.getByTestId('toggle-input').click();

    expect(setOpenedSidebar).toHaveBeenCalledWith(true);  
  });

  it('should navigate to home', () => {
    const { getByTestId } = render(
      <Header />, {wrapper: BrowserRouter}
    );

    const logo = screen.getByTestId('header-logo');

    fireEvent.click(logo);

    expect(window.location.pathname).toBe('/');
  });
});
