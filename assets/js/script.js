((window, document) => {
    // sidebar
    const toggleElements = document.querySelectorAll('.sidebar, .site, .site-overlay, .menu-toggle');
    document.querySelectorAll('.menu-toggle, .site-overlay').forEach(element => {
        element.addEventListener('click', evt => {
            toggleElements.forEach(el => {
                if (el.classList.contains('toggled-on')) {
                    el.classList.remove('toggled-on');
                }
                else {
                    el.classList.add('toggled-on');
                }
            });
        });
    });

    // loader
    document.addEventListener('DOMContentLoaded', evt => {
        document.getElementById('loader').classList.add('hidden');
    });

    // responsive images
    const cachedWidths = [300, 600, 800, 1000, 1200, 1500, 2000, 3000, 5000];
    const getResponsiveImageUrl = (url, width) => {
        for (const value of cachedWidths) {
            if (value >= width) {
                width = value;
                break;
            }
        }
        return url ? `${url}?vw=${window.innerWidth}&dpr=${window.devicePixelRatio}&w=${width}` : '';
    };
    document.querySelectorAll('.delayed-image-load').forEach(placeholderEl => {
        const imageSrc = placeholderEl.getAttribute('data-src');
        const imageEl = document.createElement('img');
        imageEl.src = getResponsiveImageUrl(imageSrc, Math.ceil(placeholderEl.offsetWidth));
        imageEl.alt = placeholderEl.getAttribute('data-alt');
        imageEl.loading = 'lazy';
        imageEl.setAttribute('data-src', imageSrc);
        placeholderEl.replaceWith(imageEl);
    });
    document.querySelectorAll('.delayed-bgimage-load').forEach(element => {
        element.style.backgroundImage = `url(${getResponsiveImageUrl(element.getAttribute('data-bgsrc'), Math.ceil(element.offsetWidth))})`;
    });

    // gallery
    const popup = document.getElementById('popup');
    if (popup) {
        const popupPrev = popup.querySelector('.popup-prev');
        const popupNext = popup.querySelector('.popup-next');
        const popupTitle = popup.querySelector('.popup-title');
        const popupImage = popup.querySelector('img');

        // close popup
        popup.addEventListener('click', evt => {
            popup.style.display = 'none';
            document.documentElement.classList.remove('popup-open');
        });

        // find all gallery images
        let currentImage;
        const images = [];
        const findImages = () => {
            const imageElements = document.body.querySelectorAll('figure.gallery-item img');
            for (let i = 0; i <= imageElements.length; i++) {
                const one = imageElements.item(i);
                const src = one?.getAttribute('data-src');
                if (src) {
                    images.push({
                        src: src,
                        caption: one?.getAttribute('alt') || ''
                    });
                }
            }
        };

        const showPrev = evt => {
            if (evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }
            if (images.length > 1) {
                const idx = images.findIndex(image => image.src === currentImage);
                if (idx >= 0) {
                    let prevIdx = idx - 1;
                    if (prevIdx < 0) {
                        prevIdx = images.length - 1;
                    }
                    const prevImage = images[prevIdx];
                    if (currentImage !== prevImage.src) {
                        showImage(prevImage.src, prevImage.caption);
                    }
                }
            }
        };

        const showNext = evt => {
            if (evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }
            if (images.length > 1) {
                const idx = images.findIndex(image => image.src === currentImage);
                if (idx >= 0) {
                    let nextIdx = idx + 1;
                    if (nextIdx >= images.length) {
                        nextIdx = 0;
                    }
                    const nextImage = images[nextIdx];
                    if (currentImage !== nextImage.src) {
                        showImage(nextImage.src, nextImage.caption);
                    }
                }
            }
        };

        const showImage = (src, caption) => {
            popupImage.setAttribute('src', getResponsiveImageUrl(src, window.innerWidth));
            popupTitle.innerText = caption;
            currentImage = src;
        };

        popupNext.addEventListener('click', showNext);
        popupPrev.addEventListener('click', showPrev);
        document.addEventListener('keydown', evt => {
            switch (evt.key) {
                case 'ArrowLeft':
                    showPrev(evt);
                    break;
                case 'ArrowRight':
                    showNext(evt);
                    break;
            }
        });

        // attach click handler on all gallery images
        document.querySelectorAll('figure.gallery-item a').forEach(element => {
            element.addEventListener('click', evt => {
                evt.preventDefault();

                if (!images.length) {
                    findImages();
                }

                const img = evt.currentTarget.getElementsByTagName('img')[0];
                const image = img.getAttribute('data-src');
                const caption = img.getAttribute('alt');

                // set the content
                showImage(image, caption);

                // display
                popupImage.style.maxHeight = `${window.innerHeight - 100}px`;
                popup.style.display = '';
                document.documentElement.classList.add('popup-open');
            });
        });

        // attach resize handler
        window.addEventListener('resize', evt => {
            popupImage.style.maxHeight = `${window.innerHeight - 100}px`;
        });
    }

    // search
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-field');
    const searchResults = document.createElement('ul');
    let searchInitialized = false;
    let searchIndex = {};
    let lunrInstance = null;
    const initializeSearch = () => {
        const lunrScript = document.createElement('script');
        lunrScript.src = '/assets/js/lunr.min.js';
        lunrScript.onload = () => {
            window.fetch('/search.json')
                .then(response => response.json())
                .then(data => {
                    data.forEach(one => searchIndex[one.url] = one);
                    lunrInstance = lunr(function () {
                        this.field('title');
                        this.field('description');
                        this.ref('url');
                        data.forEach(doc => this.add(doc));
                    });
                })
                .then(search)
                .catch(error => console.error('Error loading search index: ', error));
        };
        document.body.appendChild(lunrScript);
        searchInitialized = true;
    };
    const search = () => {
        searchResults.remove();
        const query = searchInput.value;
        const results = lunrInstance.search(query);
        let html = '';
        results.forEach(result => {
            const one = searchIndex[result.ref];
            html += `<li><a href="${one.url}">${one.title}</a>`;
            if (one.date) {
                html += `<span class="post-date">${one.date}</span>`;
            }
            html += '</li>';
        });
        searchResults.innerHTML = html || 'Geen resultaten.';
        searchForm.parentElement.appendChild(searchResults);
    }
    searchForm.addEventListener('submit', evt => {
        evt.preventDefault();
        if (!searchInitialized) {
            initializeSearch();
        }
        else {
            search();
        }
    });

    // contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const leadMessage = document.querySelector('.contact-page .lead');
        const successMessage = document.querySelector('.contact-page .success');
        const errorMessage = document.querySelector('.contact-page .error');
        contactForm.addEventListener('submit', evt => {
            evt.preventDefault();
            const formData = new FormData(contactForm);
            const apiData = {
                module: 'contact',
                action: 'sendemail',
                params: {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                    fields: { telephone: formData.get('telephone') },
                    captcha: formData.get('captcha')
                }
            };
            const disableForm = (disable) => {
                Array.from(contactForm.elements).forEach(formElement => formElement.disabled = disable);
            };
            disableForm(true);
            errorMessage.innerHTML = '';
            window.fetch('/system/json/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiData)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errData => {
                            throw new Error(errData.displayerror || 'An unknown error occurred');
                        });
                    }
                    return response.json();
                })
                .then(success => {
                    if (success) {
                        contactForm.remove();
                        leadMessage.remove();
                        successMessage.classList.remove('hidden');
                    }
                    else {
                        errorMessage.innerText = 'An unknown error occurred';
                    }
                })
                .catch(error => {
                    errorMessage.innerText = error.message;
                })
                .finally(() => disableForm(false));
        });
    }

})(window, window.document);
