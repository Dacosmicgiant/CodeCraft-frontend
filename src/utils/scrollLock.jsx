/**
 * ScrollLock utility
 * A cross-browser solution to prevent scrolling on the body when a modal is open
 */

class ScrollLock {
  constructor() {
    this.scrollPosition = 0;
    this.bodyElement = document.body;
    this.htmlElement = document.documentElement;
    this.scrollbarWidth = this.getScrollbarWidth();
  }

  // Get scrollbar width to prevent content shift
  getScrollbarWidth() {
    // Create a temporary div
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for Windows Edge
    document.body.appendChild(outer);
    
    // Create another div inside the first one
    const inner = document.createElement('div');
    outer.appendChild(inner);
    
    // Calculate the scrollbar width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
    
    // Remove the divs
    outer.parentNode.removeChild(outer);
    
    return scrollbarWidth;
  }

  // Lock scrolling
  enable() {
    // Save current scroll position
    this.scrollPosition = window.pageYOffset;
    
    // Add no-scroll class to body
    this.bodyElement.classList.add('no-scroll');
    this.htmlElement.classList.add('no-scroll');
    
    // Adjust for missing scrollbar to prevent content shift
    if (this.scrollbarWidth > 0) {
      this.bodyElement.style.paddingRight = `${this.scrollbarWidth}px`;
      this.bodyElement.classList.add('compensate-for-scrollbar');
    }
    
    // Fix position to current scroll position
    this.bodyElement.style.top = `-${this.scrollPosition}px`;
    this.bodyElement.style.position = 'fixed';
    this.bodyElement.style.width = '100%';
    this.bodyElement.style.overflow = 'hidden';
  }

  // Unlock scrolling
  disable() {
    // Remove no-scroll class from body
    this.bodyElement.classList.remove('no-scroll');
    this.htmlElement.classList.remove('no-scroll');
    
    // Reset styles
    this.bodyElement.style.position = '';
    this.bodyElement.style.top = '';
    this.bodyElement.style.width = '';
    this.bodyElement.style.overflow = '';
    this.bodyElement.style.paddingRight = '';
    this.bodyElement.classList.remove('compensate-for-scrollbar');
    
    // Restore scroll position
    window.scrollTo(0, this.scrollPosition);
  }
}

// Create singleton instance
const scrollLock = new ScrollLock();

export default scrollLock;