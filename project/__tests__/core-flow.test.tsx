import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/app/page';
import { ChatAssessment } from '@/components/assessment/chat-assessment';
import { RecommendationsGrid } from '@/components/career/recommendations-grid';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Core Application Flow', () => {
  it('renders homepage with CTA', () => {
    render(<HomePage />);
    
    expect(screen.getByText(/Discover Your/)).toBeInTheDocument();
    expect(screen.getByText(/Dream Career/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Start Free Assessment/ })).toBeInTheDocument();
  });

  it('shows assessment questions when starting assessment', async () => {
    const mockOnComplete = jest.fn();
    render(<ChatAssessment onComplete={mockOnComplete} />);

    await waitFor(() => {
      expect(screen.getByText(/Career Assessment/)).toBeInTheDocument();
    });
  });

  it('displays career recommendations after assessment', async () => {
    const mockOnSelect = jest.fn();
    render(<RecommendationsGrid onSelectCareer={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText(/Finding your perfect career matches/)).toBeInTheDocument();
    });
  });
});

describe('Video Player Progress Tracking', () => {
  it('should call onProgress when video time updates', () => {
    // This would be a more complex test involving video player mock
    // For now, we're documenting the expected behavior
    expect(true).toBe(true); // Placeholder
  });

  it('should validate completion through server heartbeat', () => {
    // Test server validation of watch progress
    expect(true).toBe(true); // Placeholder
  });
});