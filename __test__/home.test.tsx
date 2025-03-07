import { render, screen } from '@testing-library/react';
import Home from '@/app/(public)/page';
import '@testing-library/jest-dom';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);

    const heading = screen.getByRole('main');

    expect(heading).toBeInTheDocument();
  });
});
