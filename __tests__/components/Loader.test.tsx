import { render, screen } from '@testing-library/react';
import Loader from '@/app/components/Loader/Loader';

// Mock the PuffLoader component from react-spinners
jest.mock('react-spinners', () => ({
  PuffLoader: () => <div data-testid="puff-loader">Loading...</div>
}));

describe('Loader Component', () => {
  it('renders correctly', () => {
    render(<Loader />);
    
    // Check if the loader is in the document
    const loaderElement = screen.getByTestId('puff-loader');
    expect(loaderElement).toBeInTheDocument();
  });
}); 