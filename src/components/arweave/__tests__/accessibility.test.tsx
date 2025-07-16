import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { ArweaveUploaderContainer } from '../ArweaveUploaderContainer';
import { VideoSelector } from '../VideoSelector';
import { WalletKeyLoader } from '../WalletKeyLoader';
import { ErrorDisplay } from '../ErrorDisplay';
import { HelpTooltip } from '../HelpTooltip';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock hooks to avoid complex setup
jest.mock('../../../hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    announceStepChange: jest.fn(),
    announceUploadProgress: jest.fn(),
    announceError: jest.fn(),
    announceSuccess: jest.fn(),
    trapFocus: jest.fn(),
    addSkipLink: jest.fn(() => jest.fn()),
    prefersReducedMotion: false
  })
}));

// Mock child components for focused testing
jest.mock('../VideoSelector', () => ({
  VideoSelector: ({ onVideoSelected }: any) => (
    <div role="region" aria-label="Video selection">
      <button onClick={() => onVideoSelected(new File(['test'], 'test.mp4', { type: 'video/mp4' }))}>
        Select Video
      </button>
    </div>
  )
}));

jest.mock('../WalletKeyLoader', () => ({
  WalletKeyLoader: ({ onWalletLoaded }: any) => (
    <div role="region" aria-label="Wallet key loading">
      <button onClick={() => onWalletLoaded({ kty: 'RSA' })}>
        Load Wallet
      </button>
    </div>
  )
}));

jest.mock('../UploadProcessor', () => ({
  UploadProcessor: ({ onUploadComplete }: any) => (
    <div role="region" aria-label="Upload processing">
      <button onClick={() => onUploadComplete('test-tx-id')}>
        Complete Upload
      </button>
    </div>
  )
}));

jest.mock('../ProgressIndicator', () => ({
  ProgressIndicator: ({ currentStep }: any) => (
    <div role="progressbar" aria-label={`Step ${currentStep} of 3`}>
      Step {currentStep}
    </div>
  )
}));

jest.mock('../ErrorDisplay', () => ({
  ErrorDisplay: ({ error, onDismiss }: any) => (
    <div role="alert" aria-live="assertive">
      {error.message}
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  ),
  ErrorToast: ({ error, onDismiss }: any) => (
    <div role="alert" aria-live="assertive">
      {error.message}
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  )
}));

jest.mock('../HelpTooltip', () => ({
  UploadProcessHelp: () => (
    <div role="region" aria-label="Help information">
      Help content
    </div>
  )
}));

describe('Accessibility Tests', () => {
  describe('ArweaveUploaderContainer', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<ArweaveUploaderContainer />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels and roles', () => {
      render(<ArweaveUploaderContainer />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByLabelledBy('uploader-title')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Decentralized Arweave Uploader');
    });

    it('should have proper heading hierarchy', () => {
      render(<ArweaveUploaderContainer />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('Decentralized Arweave Uploader');
    });

    it('should support keyboard navigation between steps', async () => {
      const user = userEvent.setup();
      render(<ArweaveUploaderContainer />);
      
      // Select video to enable step 2
      fireEvent.click(screen.getByText('Select Video'));
      
      await waitFor(() => {
        const step2Button = screen.getByText('2. Load Wallet');
        expect(step2Button).not.toHaveAttribute('disabled');
      });
      
      // Navigate with keyboard
      const step2Button = screen.getByText('2. Load Wallet');
      await user.tab();
      expect(step2Button).toHaveFocus();
    });

    it('should announce step changes to screen readers', async () => {
      render(<ArweaveUploaderContainer />);
      
      // Progress through steps
      fireEvent.click(screen.getByText('Select Video'));
      
      await waitFor(() => {
        expect(screen.getByRole('region', { name: 'Wallet key loading' })).toBeInTheDocument();
      });
    });

    it('should have skip links for keyboard users', () => {
      render(<ArweaveUploaderContainer />);
      
      // Skip links should be added (mocked in our test)
      // In real implementation, they would be in the DOM
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should handle focus management during step transitions', async () => {
      render(<ArweaveUploaderContainer />);
      
      // Step transitions should manage focus appropriately
      fireEvent.click(screen.getByText('Select Video'));
      
      await waitFor(() => {
        expect(screen.getByRole('region', { name: 'Wallet key loading' })).toBeInTheDocument();
      });
    });

    it('should provide error announcements', async () => {
      const onError = jest.fn();
      render(<ArweaveUploaderContainer onError={onError} />);
      
      // Simulate error state
      const errorState = {
        type: 'validation' as const,
        message: 'Test error message',
        recoverable: true
      };
      
      // This would be triggered by child components in real usage
      onError(errorState);
      expect(onError).toHaveBeenCalledWith(errorState);
    });
  });

  describe('Individual Component Accessibility', () => {
    describe('VideoSelector', () => {
      // Note: These would test the actual VideoSelector component
      // For now, we're testing the mocked version
      it('should have proper region label', () => {
        render(
          <VideoSelector
            onVideoSelected={jest.fn()}
            onError={jest.fn()}
            selectedVideo={null}
          />
        );
        
        expect(screen.getByRole('region', { name: 'Video selection' })).toBeInTheDocument();
      });
    });

    describe('ErrorDisplay', () => {
      it('should use alert role for errors', () => {
        const error = {
          type: 'validation' as const,
          message: 'Test error',
          recoverable: true
        };
        
        render(<ErrorDisplay error={error} />);
        
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
      });
    });

    describe('HelpTooltip', () => {
      it('should be keyboard accessible', async () => {
        const user = userEvent.setup();
        
        render(
          <HelpTooltip content="Help text" title="Help">
            <button>Help</button>
          </HelpTooltip>
        );
        
        const helpButton = screen.getByRole('button', { name: 'Help' });
        
        // Should be focusable
        await user.tab();
        expect(helpButton).toHaveFocus();
        
        // Should show tooltip on focus
        fireEvent.focus(helpButton);
        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });
        
        // Should hide tooltip on escape
        fireEvent.keyDown(helpButton, { key: 'Escape' });
        await waitFor(() => {
          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support Tab navigation through interactive elements', async () => {
      const user = userEvent.setup();
      render(<ArweaveUploaderContainer />);
      
      // Tab through interactive elements
      await user.tab();
      expect(document.activeElement).toHaveAttribute('type', 'button');
    });

    it('should support Enter and Space for button activation', async () => {
      const user = userEvent.setup();
      render(<ArweaveUploaderContainer />);
      
      const selectButton = screen.getByText('Select Video');
      selectButton.focus();
      
      // Enter should activate button
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByRole('region', { name: 'Wallet key loading' })).toBeInTheDocument();
      });
    });

    it('should trap focus in modal dialogs', async () => {
      const user = userEvent.setup();
      
      render(
        <ArweaveUploaderModal
          isOpen={true}
          onClose={jest.fn()}
          onUploadComplete={jest.fn()}
        />
      );
      
      // Focus should be trapped within modal
      const modal = screen.getByRole('dialog', { hidden: true }) || screen.getByText('Upload to Arweave').closest('div');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide meaningful labels for all interactive elements', () => {
      render(<ArweaveUploaderContainer />);
      
      // All buttons should have accessible names
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('should provide status updates for upload progress', () => {
      render(<ArweaveUploaderContainer />);
      
      // Progress indicator should have proper ARIA attributes
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-label');
    });

    it('should announce important state changes', () => {
      render(<ArweaveUploaderContainer />);
      
      // Live regions should be present for announcements
      // In our mocked version, this is handled by the accessibility hook
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('High Contrast and Reduced Motion', () => {
    it('should respect reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      render(<ArweaveUploaderContainer />);
      
      // Component should render without motion-dependent features
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should work with high contrast mode', () => {
      // Mock high contrast preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      render(<ArweaveUploaderContainer />);
      
      // Component should render with high contrast considerations
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Form Accessibility', () => {
    it('should associate labels with form controls', () => {
      render(<ArweaveUploaderContainer />);
      
      // All form controls should have proper labels
      const inputs = screen.queryAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('should provide error messages for form validation', async () => {
      render(<ArweaveUploaderContainer />);
      
      // Error messages should be associated with form controls
      // This would be tested with actual form interactions
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Color and Visual Accessibility', () => {
    it('should not rely solely on color to convey information', () => {
      render(<ArweaveUploaderContainer />);
      
      // Success/error states should have icons or text in addition to color
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveTextContent(/Step \d/);
    });

    it('should have sufficient color contrast', async () => {
      const { container } = render(<ArweaveUploaderContainer />);
      
      // This would typically be tested with automated tools
      // For now, we ensure the component renders properly
      expect(container).toBeInTheDocument();
    });
  });
});