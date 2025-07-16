# 🚀 NoCensor TV - Arweave Integration Guide

## Quick Integration

### Option 1: Full Showcase Page (Recommended for Demo)
```tsx
import { ArweaveShowcase } from './src/components/arweave';

// Add to your routing or main page
<ArweaveShowcase />
```

### Option 2: Demo Uploader Component
```tsx
import { DemoArweaveUploader } from './src/components/arweave';

<DemoArweaveUploader 
  onUploadComplete={(txId) => {
    console.log('Upload completed:', txId);
    // Show success notification
  }}
  onError={(error) => {
    console.error('Upload error:', error);
    // Show error notification
  }}
/>
```

### Option 3: Production Ready (when you have AR tokens)
```tsx
import { ArweaveUploaderContainer } from './src/components/arweave';

<ArweaveUploaderContainer 
  onUploadComplete={(txId) => {
    // Handle real upload success
    console.log('Real Arweave TX:', txId);
  }}
  onError={(error) => {
    // Handle real errors
    console.error('Real error:', error);
  }}
/>
```

## 🎯 Demo Features

### What the Demo Includes:
- ✅ **Complete 3-step workflow** (Video → Wallet → Upload)
- ✅ **Realistic progress tracking** with percentages and time estimates
- ✅ **Mock cost estimation** (shows ~0.001 AR cost)
- ✅ **Simulated wallet validation** (works with demo wallet)
- ✅ **Generated transaction IDs** (look real but are demo)
- ✅ **Error handling showcase** (try invalid files to see error states)
- ✅ **Accessibility features** (keyboard navigation, screen readers)
- ✅ **Mobile responsive** design

### Demo Wallet
- Download link: `/demo-wallet.json`
- Pre-configured with demo balance (5.0 AR)
- Works perfectly with the demo uploader

## 🔧 Integration Steps

### 1. Add to Your Upload Page
Replace or enhance your current upload section:

```tsx
// In your StudioUploadPage.tsx or similar
import { ArweaveShowcase } from '../components/arweave';

export function StudioUploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Your existing upload options */}
      
      {/* Add Arweave section */}
      <div className="mt-12">
        <ArweaveShowcase />
      </div>
    </div>
  );
}
```

### 2. Add Navigation Link
In your sidebar or navigation:

```tsx
<Link to="/studio/arweave" className="nav-link">
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  </svg>
  Arweave Storage
</Link>
```

### 3. Add Route (if using React Router)
```tsx
import { ArweaveShowcase } from '../components/arweave';

// In your router configuration
<Route path="/studio/arweave" element={<ArweaveShowcase />} />
```

## 🎨 Customization

### Styling
The components use Tailwind CSS classes. You can:
- Override colors by changing the gradient classes
- Adjust spacing and sizing
- Add your brand colors

### Custom Success Handler
```tsx
<DemoArweaveUploader 
  onUploadComplete={(txId) => {
    // Custom success logic
    showNotification('Video uploaded to Arweave!', 'success');
    
    // Save to your database
    saveUploadRecord({
      transactionId: txId,
      platform: 'arweave',
      timestamp: new Date()
    });
    
    // Redirect or update UI
    navigate('/studio/uploads');
  }}
/>
```

## 🚀 Production Deployment

### When Ready for Real Arweave:
1. Set `window.ARWEAVE_DEMO_MODE = false`
2. Users need real AR tokens in their wallets
3. Real transactions will be created on Arweave network
4. Costs will be deducted from user wallets

### Environment Variables
```env
# .env
VITE_ARWEAVE_HOST=arweave.net
VITE_ARWEAVE_PORT=443
VITE_ARWEAVE_PROTOCOL=https
VITE_DEMO_MODE=true  # Set to false for production
```

## 📱 Mobile Support

The uploader is fully responsive and works great on:
- ✅ Desktop browsers
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)
- ✅ Touch interactions
- ✅ File picker integration

## 🎯 Perfect for Your Platform

This integration is perfect for NoCensor TV because:

1. **Censorship Resistant** - Videos stored on Arweave can't be taken down
2. **Permanent Storage** - Content lives forever on the blockchain
3. **Creator Ownership** - Creators truly own their content
4. **Decentralized** - No single point of failure
5. **Professional UX** - Smooth, intuitive upload process

## 🔥 Demo Script for Presentations

1. **"Let me show you our decentralized storage feature"**
2. **Click "Try Demo Upload"** - Shows the beautiful 3-step interface
3. **Select any video file** - Drag & drop or file picker works
4. **Download and load demo wallet** - One-click download, easy loading
5. **Watch the upload progress** - Realistic progress with time estimates
6. **See the success screen** - Transaction ID and Arweave link
7. **"This is how creators store content permanently"**

## 💡 Tips for Best Demo Experience

- Use a small video file (under 10MB) for faster demo
- Have the demo wallet downloaded beforehand
- Show the error handling by trying an invalid file first
- Demonstrate the accessibility features (keyboard navigation)
- Highlight the cost estimation and balance checking

---

**Your Arweave integration is now ready to showcase the future of decentralized content storage! 🎉**