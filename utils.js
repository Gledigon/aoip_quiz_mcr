// Utility functions for the quiz application
const UTILS = {
    // Storage utilities
    storage: {
        set: function(key, value) {
            try {
                const serialized = JSON.stringify(value);
                localStorage.setItem(key, serialized);
                return true;
            } catch (error) {
                console.error(`Storage set error for key ${key}:`, error);
                return false;
            }
        },

        get: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error(`Storage get error for key ${key}:`, error);
                return defaultValue;
            }
        },

        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error(`Storage remove error for key ${key}:`, error);
                return false;
            }
        },

        clear: function() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Storage clear error:', error);
                return false;
            }
        }
    },

    // DOM utilities
    dom: {
        create: function(tag, attributes = {}, children = []) {
            try {
                const element = document.createElement(tag);
                
                // Set attributes
                Object.entries(attributes).forEach(([key, value]) => {
                    if (key === 'className') {
                        element.className = value;
                    } else if (key === 'style' && typeof value === 'object') {
                        Object.assign(element.style, value);
                    } else {
                        element.setAttribute(key, value);
                    }
                });

                // Add children
                children.forEach(child => {
                    if (typeof child === 'string') {
                        element.appendChild(document.createTextNode(child));
                    } else if (child instanceof Node) {
                        element.appendChild(child);
                    }
                });

                return element;
            } catch (error) {
                console.error('Element creation error:', error);
                return null;
            }
        },

        getById: function(id) {
            const element = document.getElementById(id);
            if (!element) {
                console.warn(`Element with id "${id}" not found`);
            }
            return element;
        }
    },

    // Image utilities
    image: {
        compress: async function(file, quality = CONFIG.imageCompressionQuality) {
            try {
                const img = await this.createImage(file);
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Calculate new dimensions
                if (width > CONFIG.maxImageDimensions.width) {
                    height *= CONFIG.maxImageDimensions.width / width;
                    width = CONFIG.maxImageDimensions.width;
                }
                if (height > CONFIG.maxImageDimensions.height) {
                    width *= CONFIG.maxImageDimensions.height / height;
                    height = CONFIG.maxImageDimensions.height;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                return new Promise((resolve) => {
                    canvas.toBlob(
                        (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
                        'image/jpeg',
                        quality
                    );
                });
            } catch (error) {
                console.error('Image compression error:', error);
                throw error;
            }
        },

        createImage: function(file) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                const reader = new FileReader();

                reader.onload = function(e) {
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error('Image loading failed'));
                    img.src = e.target.result;
                };
                reader.onerror = () => reject(new Error('File reading failed'));
                reader.readAsDataURL(file);
            });
        }
    },

    // Date utilities
    date: {
        format: function(date) {
            try {
                return new Date(date).toLocaleDateString('no-NO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (error) {
                console.error('Date formatting error:', error);
                return date;
            }
        },

        isValid: function(date) {
            const d = new Date(date);
            return d instanceof Date && !isNaN(d);
        }
    },

    // String utilities
    string: {
        sanitize: function(str) {
            return str.replace(/[<>]/g, '');
        },

        truncate: function(str, length = 100) {
            return str.length > length ? str.substring(0, length) + '...' : str;
        },

        generateId: function() {
            return Math.random().toString(36).substring(2) + Date.now().toString(36);
        }
    },

    // Notification system
    notification: {
        show: function(message, type = 'info') {
            const notification = UTILS.dom.create('div', {
                className: `notification ${type}`
            }, [message]);

            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), CONFIG.fadeOutDuration);
            }, CONFIG.notificationDuration);
        }
    }
};

// Export utilities if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UTILS;
}
