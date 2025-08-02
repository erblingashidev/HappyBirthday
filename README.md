# The Museum of Us - A Birthday Gift & Apology Website

A beautiful, interactive 3D museum website created as a birthday gift and apology for your girlfriend. This website features multiple rooms showcasing memories, quotes, photos, and special messages.

## 🌟 Features

### Welcome Screen
- Beautiful animated welcome page with glowing hearts
- Smooth transition to the museum
- Elegant typography with Dancing Script font

### Museum Rooms
1. **Entrance** - Welcome to the museum
2. **Memories** - Timeline of your relationship milestones
3. **Quotes** - Romantic quotes that define your love
4. **Photos** - Interactive photo gallery (placeholders for your photos)
5. **Apology** - Heartfelt apology with floating hearts
6. **Birthday** - Special birthday celebration with animated cake and confetti

### Interactive Elements
- 3D tilt effects on hover
- Smooth room transitions
- Animated confetti in birthday room
- Photo modal popups
- Sparkle effects
- Responsive design for all devices

## 🚀 How to Use

1. **Open the website**: Simply open `index.html` in any modern web browser
2. **Navigate**: Click "Enter the Gallery" to start the experience
3. **Explore rooms**: Use the navigation buttons to move between different rooms
4. **Interact**: Hover over items for 3D effects, click on photos for modals

## 🎨 Customization Guide

### Personalizing Content

#### 1. Memories Room
Edit the memory items in `index.html` around lines 60-85:
```html
<div class="memory-item">
    <div class="memory-date">Your Special Date</div>
    <div class="memory-content">
        <h3>Your Memory Title</h3>
        <p>Your personal memory description...</p>
    </div>
</div>
```

#### 2. Quotes Room
Replace the quotes in `index.html` around lines 95-125 with your favorite love quotes or personal messages.

#### 3. Photos Room
To add real photos:
1. Place your photos in a folder (e.g., `photos/`)
2. Replace the emoji placeholders in `index.html` around lines 135-165:
```html
<div class="photo-placeholder">
    <img src="photos/your-photo.jpg" alt="Your photo description">
    <p>Your photo caption</p>
</div>
```

#### 4. Apology Room
Customize the apology message in `index.html` around lines 175-185 with your personal apology.

#### 5. Birthday Room
Modify the birthday message in `index.html` around lines 200-210 with your personal birthday wishes.

### Styling Customization

#### Colors
The main color scheme uses:
- Primary gradient: `#667eea` to `#764ba2`
- Accent colors: `#ff6b6b`, `#ffd93d`, `#a8e6cf`

To change colors, edit the CSS variables in `styles.css`:
```css
body {
    background: linear-gradient(135deg, YOUR_COLOR1 0%, YOUR_COLOR2 100%);
}
```

#### Fonts
The website uses:
- Headers: 'Dancing Script' (romantic cursive)
- Body text: 'Poppins' (clean sans-serif)

To change fonts, update the Google Fonts link in `index.html` and the font-family properties in `styles.css`.

### Adding More Rooms
To add a new room:
1. Add a navigation button in the nav section
2. Create a new room div with the same structure as existing rooms
3. Add corresponding CSS styles
4. Update the JavaScript navigation logic

## 📱 Responsive Design
The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎯 Technical Details

### Technologies Used
- HTML5
- CSS3 (with advanced animations and 3D transforms)
- Vanilla JavaScript (no frameworks)
- Google Fonts
- Three.js (for potential 3D enhancements)

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 💡 Tips for Personalization

1. **Add Real Photos**: Replace the emoji placeholders with actual photos of you two
2. **Personal Memories**: Add specific dates and memories that are meaningful to your relationship
3. **Custom Quotes**: Include quotes that have special meaning to your relationship
4. **Personal Messages**: Write heartfelt messages in the apology and birthday rooms
5. **Background Music**: Consider adding background music by embedding an audio player

## 🎁 Making it Special

### Before Giving the Gift
1. Customize all the content with your personal memories
2. Add real photos of your relationship
3. Write personal messages in the apology and birthday rooms
4. Test the website on different devices
5. Consider hosting it online for easy access

### Presentation Ideas
- Send the link as a surprise
- Present it on a tablet or laptop
- Create a QR code for easy mobile access
- Add it to a USB drive as a physical gift

## 🔧 Troubleshooting

### Common Issues
1. **Photos not loading**: Check file paths and ensure images are in the correct folder
2. **Animations not working**: Ensure JavaScript is enabled in your browser
3. **Fonts not loading**: Check internet connection for Google Fonts

### Performance
- Optimize images before adding them
- Keep the website under 10MB for fast loading
- Test on slower connections

## 📄 License
This project is created as a personal gift. Feel free to modify and use for your own romantic gestures!

---

**Made with ❤️ for your special someone** 