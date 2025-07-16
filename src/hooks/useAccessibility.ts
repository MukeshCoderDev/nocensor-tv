import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook for managing focus and keyboard navigation
 */
export function useFocusManagement() {
  const focusableElementsSelector = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(focusableElementsSelector);
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    // Focus first element
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusableElementsSelector]);

  const moveFocusToNext = useCallback(() => {
    const focusableElements = document.querySelectorAll(focusableElementsSelector);
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    (focusableElements[nextIndex] as HTMLElement)?.focus();
  }, [focusableElementsSelector]);

  const moveFocusToPrevious = useCallback(() => {
    const focusableElements = document.querySelectorAll(focusableElementsSelector);
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement);
    const prevIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
    (focusableElements[prevIndex] as HTMLElement)?.focus();
  }, [focusableElementsSelector]);

  return {
    trapFocus,
    moveFocusToNext,
    moveFocusToPrevious
  };
}

/**
 * Hook for screen reader announcements
 */
export function useScreenReader() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const announcementRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message]);
    
    // Create temporary announcement element
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
      setAnnouncements(prev => prev.filter(a => a !== message));
    }, 1000);
  }, []);

  const announceUploadProgress = useCallback((percentage: number, status: string) => {
    const message = `Upload ${status}: ${percentage}% complete`;
    announce(message, 'polite');
  }, [announce]);

  const announceError = useCallback((error: string) => {
    announce(`Error: ${error}`, 'assertive');
  }, [announce]);

  const announceSuccess = useCallback((message: string) => {
    announce(`Success: ${message}`, 'polite');
  }, [announce]);

  const announceStepChange = useCallback((step: number, stepName: string) => {
    announce(`Step ${step}: ${stepName}`, 'polite');
  }, [announce]);

  return {
    announce,
    announceUploadProgress,
    announceError,
    announceSuccess,
    announceStepChange,
    announcements
  };
}

/**
 * Hook for keyboard navigation
 */
export function useKeyboardNavigation() {
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);
  const elementsRef = useRef<HTMLElement[]>([]);

  const registerElement = useCallback((element: HTMLElement | null) => {
    if (element && !elementsRef.current.includes(element)) {
      elementsRef.current.push(element);
    }
  }, []);

  const unregisterElement = useCallback((element: HTMLElement) => {
    elementsRef.current = elementsRef.current.filter(el => el !== element);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, metaKey } = event;
    
    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        setCurrentFocusIndex(prev => {
          const nextIndex = (prev + 1) % elementsRef.current.length;
          elementsRef.current[nextIndex]?.focus();
          return nextIndex;
        });
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        setCurrentFocusIndex(prev => {
          const prevIndex = prev === 0 ? elementsRef.current.length - 1 : prev - 1;
          elementsRef.current[prevIndex]?.focus();
          return prevIndex;
        });
        break;
        
      case 'Home':
        if (ctrlKey || metaKey) {
          event.preventDefault();
          setCurrentFocusIndex(0);
          elementsRef.current[0]?.focus();
        }
        break;
        
      case 'End':
        if (ctrlKey || metaKey) {
          event.preventDefault();
          const lastIndex = elementsRef.current.length - 1;
          setCurrentFocusIndex(lastIndex);
          elementsRef.current[lastIndex]?.focus();
        }
        break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    registerElement,
    unregisterElement,
    currentFocusIndex
  };
}

/**
 * Hook for managing ARIA attributes
 */
export function useAriaAttributes() {
  const setAriaLabel = useCallback((element: HTMLElement | null, label: string) => {
    if (element) {
      element.setAttribute('aria-label', label);
    }
  }, []);

  const setAriaDescribedBy = useCallback((element: HTMLElement | null, describedById: string) => {
    if (element) {
      element.setAttribute('aria-describedby', describedById);
    }
  }, []);

  const setAriaExpanded = useCallback((element: HTMLElement | null, expanded: boolean) => {
    if (element) {
      element.setAttribute('aria-expanded', expanded.toString());
    }
  }, []);

  const setAriaPressed = useCallback((element: HTMLElement | null, pressed: boolean) => {
    if (element) {
      element.setAttribute('aria-pressed', pressed.toString());
    }
  }, []);

  const setAriaDisabled = useCallback((element: HTMLElement | null, disabled: boolean) => {
    if (element) {
      element.setAttribute('aria-disabled', disabled.toString());
    }
  }, []);

  const setAriaLive = useCallback((element: HTMLElement | null, live: 'off' | 'polite' | 'assertive') => {
    if (element) {
      element.setAttribute('aria-live', live);
    }
  }, []);

  const setRole = useCallback((element: HTMLElement | null, role: string) => {
    if (element) {
      element.setAttribute('role', role);
    }
  }, []);

  return {
    setAriaLabel,
    setAriaDescribedBy,
    setAriaExpanded,
    setAriaPressed,
    setAriaDisabled,
    setAriaLive,
    setRole
  };
}

/**
 * Hook for detecting reduced motion preference
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for high contrast mode detection
 */
export function useHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
}

/**
 * Hook for managing skip links
 */
export function useSkipLinks() {
  const skipLinksRef = useRef<HTMLElement[]>([]);

  const addSkipLink = useCallback((target: string, label: string) => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${target}`;
    skipLink.textContent = label;
    skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    skipLinksRef.current.push(skipLink);
    
    return () => {
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink);
      }
      skipLinksRef.current = skipLinksRef.current.filter(link => link !== skipLink);
    };
  }, []);

  const removeAllSkipLinks = useCallback(() => {
    skipLinksRef.current.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
    skipLinksRef.current = [];
  }, []);

  return {
    addSkipLink,
    removeAllSkipLinks
  };
}

/**
 * Comprehensive accessibility hook that combines all accessibility features
 */
export function useAccessibility() {
  const focusManagement = useFocusManagement();
  const screenReader = useScreenReader();
  const keyboardNavigation = useKeyboardNavigation();
  const ariaAttributes = useAriaAttributes();
  const prefersReducedMotion = useReducedMotion();
  const prefersHighContrast = useHighContrast();
  const skipLinks = useSkipLinks();

  return {
    ...focusManagement,
    ...screenReader,
    ...keyboardNavigation,
    ...ariaAttributes,
    ...skipLinks,
    prefersReducedMotion,
    prefersHighContrast
  };
}