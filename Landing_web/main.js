// Loading Screen
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
});

// Mobile Menu Functionality
const mobileMenuToggle = document.querySelector('.md\\:hidden');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenu = document.getElementById('close-mobile-menu');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
        mobileMenu.classList.add('show');
    }, 10);
});

closeMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('show');
    setTimeout(() => {
        mobileMenu.classList.add('hidden');
    }, 300);
});

// Close mobile menu when clicking outside
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        closeMobileMenu.click();
    }
});

// Filter Panel Toggle
const filterToggle = document.getElementById('filter-toggle');
const filterPanel = document.getElementById('filter-panel');

filterToggle.addEventListener('click', () => {
    filterPanel.classList.toggle('hidden');
    if (!filterPanel.classList.contains('hidden')) {
        filterPanel.classList.add('show');
    } else {
        filterPanel.classList.remove('show');
    }
});

// Clear Filters
const clearFilters = document.getElementById('clear-filters');
const filterSelects = document.querySelectorAll('#filter-panel select');

clearFilters.addEventListener('click', () => {
    filterSelects.forEach(select => {
        select.value = '';
    });
    // Trigger filter update
    updateProducts();
});

// Search Functionality
const searchInput = document.getElementById('search-input');
let searchTimeout;

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        updateProducts();
    }, 300);
});

// Filter Change Handlers
filterSelects.forEach(select => {
    select.addEventListener('change', updateProducts);
});

// Product Data (simulated)
const products = [
    {
        id: 1,
        name: 'Midnight Elegance Gown',
        category: 'dresses',
        type: 'evening',
        price: 24999,
        colors: ['black', 'pink', 'mocha'],
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 2,
        name: 'Floral Breeze Dress',
        category: 'dresses',
        type: 'casual',
        price: 16499,
        colors: ['yellow', 'pink', 'white'],
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    // Add more products as needed
];

function updateProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const priceFilter = document.getElementById('price-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;
    const colorFilter = document.getElementById('color-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;

    // Filter products based on search and filters
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesColor = !colorFilter || product.colors.includes(colorFilter);
        
        let matchesPrice = true;
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(Number);
            if (max) {
                matchesPrice = product.price >= min && product.price <= max;
            } else {
                matchesPrice = product.price >= min;
            }
        }

        return matchesSearch && matchesCategory && matchesColor && matchesPrice;
    });

    // Sort products
    switch(sortFilter) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
    }

    // Update product display (you can implement this based on your needs)
    console.log('Filtered products:', filteredProducts);
}

// Newsletter Popup
let newsletterShown = false;

function showNewsletterPopup() {
    if (!newsletterShown && !localStorage.getItem('newsletter-subscribed')) {
        setTimeout(() => {
            const newsletterPopup = document.getElementById('newsletter-popup');
            newsletterPopup.classList.remove('hidden');
            setTimeout(() => {
                newsletterPopup.classList.add('show');
            }, 10);
        }, 5000); // Show after 5 seconds
    }
}

// Close newsletter popup
const closeNewsletter = document.getElementById('close-newsletter');
const newsletterPopup = document.getElementById('newsletter-popup');

closeNewsletter.addEventListener('click', () => {
    newsletterPopup.classList.remove('show');
    setTimeout(() => {
        newsletterPopup.classList.add('hidden');
    }, 300);
});

// Subscribe to newsletter
const subscribeNewsletter = document.getElementById('subscribe-newsletter');
const newsletterEmail = document.getElementById('newsletter-email');

subscribeNewsletter.addEventListener('click', () => {
    const email = newsletterEmail.value;
    if (email && email.includes('@')) {
        // Simulate subscription
        localStorage.setItem('newsletter-subscribed', 'true');
        alert('Thank you for subscribing to LORA!');
        closeNewsletter.click();
    } else {
        alert('Please enter a valid email address.');
    }
});

// Add to Cart Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Simulate adding to cart
        const cartCount = document.querySelector('.relative span');
        const currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + 1;
        
        // Show success message
        showNotification(`${productName} added to cart!`);
    }
});

// Wishlist Functionality
document.addEventListener('click', (e) => {
    if (e.target.closest('.wishlist-btn')) {
        const wishlistBtn = e.target.closest('.wishlist-btn');
        const productCard = wishlistBtn.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Toggle wishlist state
        wishlistBtn.classList.toggle('wishlisted');
        if (wishlistBtn.classList.contains('wishlisted')) {
            wishlistBtn.style.background = 'var(--muted-pink)';
            showNotification(`${productName} added to wishlist!`);
        } else {
            wishlistBtn.style.background = 'var(--ivory)';
            showNotification(`${productName} removed from wishlist!`);
        }
    }
});

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gold text-ivory px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all product cards and category cards
document.querySelectorAll('.product-card, .category-card').forEach(card => {
    observer.observe(card);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu if open
        if (!mobileMenu.classList.contains('hidden')) {
            closeMobileMenu.click();
        }
    });
});

// Show newsletter popup after page load
document.addEventListener('DOMContentLoaded', showNewsletterPopup);

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!mobileMenu.classList.contains('hidden')) {
            closeMobileMenu.click();
        }
        if (!newsletterPopup.classList.contains('hidden')) {
            closeNewsletter.click();
        }
    }
}); 