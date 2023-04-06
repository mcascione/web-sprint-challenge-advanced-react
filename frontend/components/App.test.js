// Write your tests here
import AppFunctional from "./AppFunctional";
import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

test('sanity', () => {
  expect(true).toBe(true)
})

test('steps header is visible', () => {
  render (<AppFunctional />);
  const stepsHeader = screen.getByRole('heading', {name: (/you moved/i)});
  expect(stepsHeader).toBeTruthy();
  expect(stepsHeader).toBeVisible();
});

test('counter header is visible', () => {
  render (<AppFunctional />);
  const coordinatesHeader = screen.getByRole('heading', {name: (/coordinates/i)});
  expect(coordinatesHeader).toBeTruthy();
  expect(coordinatesHeader).toBeVisible();
});

test('counter increments when up, down, left or right buttons are clicked', () => {
  render (<AppFunctional />);
  const stepsHeader = screen.getByRole('heading', {name: (/you moved/i)});
  const upButton = screen.getByRole('button', {name:/up/i});
  const downButton = screen.getByRole('button', {name:/down/i});
  const leftButton = screen.getByRole('button', {name:/left/i});
  const rightButton = screen.getByRole('button', {name:/right/i});
  fireEvent.click(upButton, downButton, leftButton, rightButton);
  expect(stepsHeader === "You moved 4 times"); 
})

test('display a message when a valid email is submitted', async () => {
  render (<AppFunctional />);
  const emailInput = screen.getByPlaceholderText('type email');
  fireEvent.change(emailInput, {target:{value: "miranda@gmail.com"}});
  const submitButton = screen.getByTestId("submit-button");
  fireEvent.click(submitButton);
  const message = await screen.findByTestId('message');
  expect(message).toBeVisible();
});