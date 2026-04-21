document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     LuciShop - script.js
     Features:
     - Page loader
     - Dynamic product rendering
     - Product filtering
     - Product detail modal
     - Front-end shopping cart
     - Cart drawer interactions
     - Sticky header
     - Mobile navigation
     - Smooth scrolling
     - Scroll reveal animations
     - Newsletter validation
     - Contact form validation
     - Back to top button
     - Toast notifications
     ========================================================= */

  /* =========================
     1. DOM ELEMENTS
     ========================= */
  const body = document.body;

  const pageLoader = document.getElementById("pageLoader");
  const siteHeader = document.getElementById("siteHeader");
  const siteBackdrop = document.getElementById("siteBackdrop");

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  const cartToggle = document.getElementById("cartToggle");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartClose = document.getElementById("cartClose");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const productsGrid = document.getElementById("productsGrid");
  const productCount = document.getElementById("productCount");
  const filterButtons = document.querySelectorAll(".filter-pill");

  const productModal = document.getElementById("productModal");
  const modalClose = document.getElementById("modalClose");
  const modalAddToCart = document.getElementById("modalAddToCart");
  const modalContinueBrowsing = document.getElementById("modalContinueBrowsing");

  const modalProductImage = document.getElementById("modalProductImage");
  const modalProductBadge = document.getElementById("modalProductBadge");
  const modalProductCategory = document.getElementById("modalProductCategory");
  const modalProductTitle = document.getElementById("modalProductTitle");
  const modalProductPrice = document.getElementById("modalProductPrice");
  const modalProductDescription = document.getElementById("modalProductDescription");
  const modalProductMovement = document.getElementById("modalProductMovement");
  const modalProductMaterial = document.getElementById("modalProductMaterial");
  const modalProductStyle = document.getElementById("modalProductStyle");
  const modalProductFeatures = document.getElementById("modalProductFeatures");

  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterFeedback = document.getElementById("newsletterFeedback");

  const contactForm = document.getElementById("contactForm");
  const contactFeedback = document.getElementById("contactFeedback");

  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toastTitle");
  const toastMessage = document.getElementById("toastMessage");

  const backToTop = document.getElementById("backToTop");
  const backTopLink = document.getElementById("backTopLink");
  const currentYear = document.getElementById("currentYear");

  const navLinks = document.querySelectorAll('.nav-link[href^="#"], .mobile-nav-link[href^="#"], .back-top-link[href^="#"], .brand[href^="#"], .btn[href^="#"]');

  /* =========================
     2. APP STATE
     ========================= */
  const state = {
    filteredCategory: "all",
    cart: [],
    activeProduct: null,
    lastFocusedElement: null,
    toastTimeout: null
  };

  /* =========================
     3. UTILITIES
     ========================= */
  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  };

  const sanitizeText = (value) => {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  const getProductById = (id) => {
    return products.find((product) => product.id === Number(id)) || null;
  };

  const getFilteredProducts = () => {
    if (state.filteredCategory === "all") return products;

    return products.filter((product) => {
      if (state.filteredCategory === "limited") {
        return product.category === "limited";
      }

      return product.category === state.filteredCategory;
    });
  };

  const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());
  };

  const setFeedback = (element, message, type = "") => {
    if (!element) return;
    element.textContent = message;
    element.classList.remove("is-error", "is-success");

    if (type === "error") {
      element.classList.add("is-error");
    }

    if (type === "success") {
      element.classList.add("is-success");
    }
  };

  const clearInputError = (field) => {
    field.classList.remove("input-error");
  };

  const setInputError = (field) => {
    field.classList.add("input-error");
  };

  const showToast = (title, message) => {
    if (!toast || !toastTitle || !toastMessage) return;

    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.classList.add("is-visible");

    if (state.toastTimeout) {
      clearTimeout(state.toastTimeout);
    }

    state.toastTimeout = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3200);
  };

  const updateBackdrop = () => {
    const anyPanelOpen =
      mobileMenu.classList.contains("is-open") ||
      cartDrawer.classList.contains("is-open") ||
      productModal.classList.contains("is-open");

    if (anyPanelOpen) {
      siteBackdrop.hidden = false;
      requestAnimationFrame(() => {
        siteBackdrop.classList.add("is-visible");
      });
    } else {
      siteBackdrop.classList.remove("is-visible");
      setTimeout(() => {
        const stillOpen =
          mobileMenu.classList.contains("is-open") ||
          cartDrawer.classList.contains("is-open") ||
          productModal.classList.contains("is-open");

        if (!stillOpen) {
          siteBackdrop.hidden = true;
        }
      }, 280);
    }
  };

  /* =========================
     4. PAGE LOADER / YEAR
     ========================= */
  const initLoader = () => {
    window.addEventListener("load", () => {
      if (pageLoader) {
        setTimeout(() => {
          pageLoader.classList.add("is-hidden");
        }, 500);
      }
    });
  };

  const initYear = () => {
    if (currentYear) {
      currentYear.textContent = new Date().getFullYear();
    }
  };

  /* =========================
     5. STICKY HEADER / BACK TO TOP
     ========================= */
  const handleScrollEffects = () => {
    const scrollY = window.scrollY;

    if (siteHeader) {
      siteHeader.classList.toggle("is-scrolled", scrollY > 20);
    }

    if (backToTop) {
      backToTop.classList.toggle("is-visible", scrollY > 500);
    }
  };

  const initScrollEffects = () => {
    handleScrollEffects();
    window.addEventListener("scroll", handleScrollEffects, { passive: true });
  };

  /* =========================
     6. MOBILE MENU
     ========================= */
  const openMobileMenu = () => {
    mobileMenu.classList.add("is-open");
    menuToggle.classList.add("is-active");
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    body.classList.add("menu-open");
    updateBackdrop();
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove("is-open");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    body.classList.remove("menu-open");
    updateBackdrop();
  };

  const initMobileMenu = () => {
    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.contains("is-open");
        if (isOpen) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    }

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", closeMobileMenu);
    }

    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  };

  /* =========================
     7. SMOOTH SCROLLING
     ========================= */
  const smoothScrollToTarget = (hash) => {
    const target = document.querySelector(hash);
    if (!target) return;

    const headerOffset = siteHeader ? siteHeader.offsetHeight - 4 : 70;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({
      top,
      behavior: "smooth"
    });
  };

  const initSmoothScrolling = () => {
    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || !href.startsWith("#")) return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        smoothScrollToTarget(href);
      });
    });

    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }

    if (backTopLink) {
      backTopLink.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }
  };

  /* =========================
     8. PRODUCT RENDERING
     ========================= */
  const createProductCardMarkup = (product) => {
    const featurePreview = product.features.slice(0, 2);

    return `
      <article class="product-card reveal" data-category="${sanitizeText(product.category)}">
        <div class="product-media">
          <div class="product-badge-wrap">
            <span class="product-badge">${sanitizeText(product.badge || "Exclusive")}</span>
          </div>
          <img
            src="${sanitizeText(product.image)}"
            alt="${sanitizeText(product.name)} luxury watch"
            loading="lazy"
          />
        </div>

        <div class="product-content">
          <span class="product-category">${sanitizeText(product.categoryLabel)}</span>

          <div class="product-title-row">
            <h3 class="product-title">${sanitizeText(product.name)}</h3>
            <span class="product-price">${formatPrice(product.price)}</span>
          </div>

          <p class="product-description">${sanitizeText(product.shortDescription)}</p>

          <ul class="product-features-inline">
            ${featurePreview
              .map((feature) => `<li>${sanitizeText(feature)}</li>`)
              .join("")}
          </ul>

          <div class="product-actions">
            <button
              class="btn btn-outline view-details-btn"
              type="button"
              data-product-id="${product.id}"
            >
              View Details
            </button>
            <button
              class="btn btn-gold add-to-cart-btn"
              type="button"
              data-product-id="${product.id}"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    `;
  };

  const renderProducts = () => {
    if (!productsGrid) return;

    const filteredProducts = getFilteredProducts();

    if (productCount) {
      const label = filteredProducts.length === 1 ? "Model" : "Models";
      productCount.textContent = `${filteredProducts.length} ${label}`;
    }

    if (!filteredProducts.length) {
      productsGrid.innerHTML = `
        <div class="products-empty">
          <h3>No timepieces found</h3>
          <p>This luxury selection is currently being refined. Please explore another category.</p>
        </div>
      `;
      revealNewElements();
      return;
    }

    productsGrid.innerHTML = filteredProducts
      .map((product) => createProductCardMarkup(product))
      .join("");

    bindProductCardActions();
    revealNewElements();
  };

  const bindProductCardActions = () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    const viewDetailsButtons = document.querySelectorAll(".view-details-btn");

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number(button.dataset.productId);
        addToCart(productId);
      });
    });

    viewDetailsButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number(button.dataset.productId);
        openProductModal(productId, button);
      });
    });
  };

  /* =========================
     9. PRODUCT FILTERS
     ========================= */
  const initProductFilters = () => {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter || "all";
        state.filteredCategory = filter;

        filterButtons.forEach((btn) => btn.classList.remove("is-active"));
        button.classList.add("is-active");

        renderProducts();
      });
    });
  };

  /* =========================
     10. PRODUCT MODAL
     ========================= */
  const populateProductModal = (product) => {
    if (!product) return;

    modalProductImage.src = product.image;
    modalProductImage.alt = `${product.name} luxury watch detail image`;
    modalProductBadge.textContent = product.badge || "Exclusive";
    modalProductCategory.textContent = product.categoryLabel || "Luxury Watch";
    modalProductTitle.textContent = product.name;
    modalProductPrice.textContent = formatPrice(product.price);
    modalProductDescription.textContent = product.fullDescription;
    modalProductMovement.textContent = product.movement || "Automatic";
    modalProductMaterial.textContent = product.material || "Luxury Materials";
    modalProductStyle.textContent = product.style || "Refined";
    modalAddToCart.dataset.productId = String(product.id);

    modalProductFeatures.innerHTML = product.features
      .map((feature) => `<li>${sanitizeText(feature)}</li>`)
      .join("");
  };

  const openProductModal = (productId, triggerElement = null) => {
    const product = getProductById(productId);
    if (!product) return;

    state.activeProduct = product;
    state.lastFocusedElement = triggerElement || document.activeElement;

    populateProductModal(product);

    productModal.classList.add("is-open");
    productModal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    updateBackdrop();

    setTimeout(() => {
      modalClose?.focus();
    }, 40);
  };

  const closeProductModal = () => {
    productModal.classList.remove("is-open");
    productModal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    updateBackdrop();

    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === "function") {
      state.lastFocusedElement.focus();
    }
  };

  const initProductModal = () => {
    if (modalClose) {
      modalClose.addEventListener("click", closeProductModal);
    }

    if (modalContinueBrowsing) {
      modalContinueBrowsing.addEventListener("click", closeProductModal);
    }

    if (modalAddToCart) {
      modalAddToCart.addEventListener("click", () => {
        const productId = Number(modalAddToCart.dataset.productId);
        addToCart(productId);
      });
    }

    if (productModal) {
      productModal.addEventListener("click", (event) => {
        if (event.target === productModal) {
          closeProductModal();
        }
      });
    }
  };

  /* =========================
     11. CART LOGIC
     ========================= */
  const getCartItemCount = () => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const addToCart = (productId) => {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = state.cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        categoryLabel: product.categoryLabel,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    renderCart();
    showToast("Added to cart", `${product.name} has been added to your luxury selection.`);
  };

  const removeFromCart = (productId) => {
    const product = getProductById(productId);
    state.cart = state.cart.filter((item) => item.id !== productId);
    renderCart();

    if (product) {
      showToast("Item removed", `${product.name} has been removed from your cart.`);
    }
  };

  const updateCartQuantity = (productId, change) => {
    const item = state.cart.find((cartItem) => cartItem.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    renderCart();
  };

  const createCartMarkup = () => {
    if (!state.cart.length) {
      return `
        <div class="cart-empty">
          <h3>Your cart is empty</h3>
          <p>
            Explore LuciShop’s curated collection and add a distinguished timepiece
            to your private selection.
          </p>
        </div>
      `;
    }

    return state.cart
      .map(
        (item) => `
          <article class="cart-item">
            <div class="cart-item-image">
              <img
                src="${sanitizeText(item.image)}"
                alt="${sanitizeText(item.name)} in shopping cart"
              />
            </div>

            <div class="cart-item-content">
              <div class="cart-item-top">
                <div>
                  <span class="cart-item-category">${sanitizeText(item.categoryLabel)}</span>
                  <h3 class="cart-item-title">${sanitizeText(item.name)}</h3>
                </div>
                <span class="cart-item-price">${formatPrice(item.price)}</span>
              </div>

              <div class="cart-item-actions">
                <div class="quantity-controls">
                  <button
                    class="qty-btn decrease-qty-btn"
                    type="button"
                    aria-label="Decrease quantity"
                    data-product-id="${item.id}"
                  >
                    −
                  </button>
                  <span class="qty-value">${item.quantity}</span>
                  <button
                    class="qty-btn increase-qty-btn"
                    type="button"
                    aria-label="Increase quantity"
                    data-product-id="${item.id}"
                  >
                    +
                  </button>
                </div>

                <button
                  class="remove-item-btn"
                  type="button"
                  data-product-id="${item.id}"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        `
      )
      .join("");
  };

  const bindCartActions = () => {
    const increaseButtons = cartItemsContainer.querySelectorAll(".increase-qty-btn");
    const decreaseButtons = cartItemsContainer.querySelectorAll(".decrease-qty-btn");
    const removeButtons = cartItemsContainer.querySelectorAll(".remove-item-btn");

    increaseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        updateCartQuantity(Number(button.dataset.productId), 1);
      });
    });

    decreaseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        updateCartQuantity(Number(button.dataset.productId), -1);
      });
    });

    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        removeFromCart(Number(button.dataset.productId));
      });
    });
  };

  const renderCart = () => {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = createCartMarkup();
    bindCartActions();

    const itemCount = getCartItemCount();
    const total = getCartTotal();

    if (cartCount) {
      cartCount.textContent = String(itemCount);
    }

    if (cartSubtotal) {
      cartSubtotal.textContent = formatPrice(total);
    }

    if (cartTotal) {
      cartTotal.textContent = formatPrice(total);
    }
  };

  const openCartDrawer = () => {
    cartDrawer.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", "false");
    cartToggle.setAttribute("aria-expanded", "true");
    body.classList.add("cart-open");
    updateBackdrop();
  };

  const closeCartDrawer = () => {
    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
    cartToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("cart-open");
    updateBackdrop();
  };

  const initCartDrawer = () => {
    if (cartToggle) {
      cartToggle.addEventListener("click", () => {
        const isOpen = cartDrawer.classList.contains("is-open");
        if (isOpen) {
          closeCartDrawer();
        } else {
          openCartDrawer();
        }
      });
    }

    if (cartClose) {
      cartClose.addEventListener("click", closeCartDrawer);
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (!state.cart.length) {
          showToast("Cart is empty", "Please add a luxury timepiece before proceeding.");
          return;
        }

        showToast(
          "Front-end checkout only",
          "LuciShop is a premium front-end showcase. No real payment is processed."
        );
      });
    }
  };

  /* =========================
     12. NEWSLETTER VALIDATION
     ========================= */
  const initNewsletterForm = () => {
    if (!newsletterForm || !newsletterEmail) return;

    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = newsletterEmail.value.trim();

      if (!email) {
        setFeedback(
          newsletterFeedback,
          "Please enter your email address to join the LuciShop private journal.",
          "error"
        );
        newsletterEmail.focus();
        return;
      }

      if (!emailIsValid(email)) {
        setFeedback(
          newsletterFeedback,
          "Please enter a valid email address in the correct format.",
          "error"
        );
        newsletterEmail.focus();
        return;
      }

      setFeedback(
        newsletterFeedback,
        "Welcome to LuciShop. Your subscription has been recorded successfully.",
        "success"
      );

      newsletterForm.reset();
      showToast("Subscription confirmed", "You have joined the LuciShop private journal.");
    });

    newsletterEmail.addEventListener("input", () => {
      setFeedback(newsletterFeedback, "");
    });
  };

  /* =========================
     13. CONTACT FORM VALIDATION
     ========================= */
  const validateContactForm = () => {
    if (!contactForm) return false;

    const fields = {
      fullName: contactForm.querySelector("#fullName"),
      email: contactForm.querySelector("#email"),
      subject: contactForm.querySelector("#subject"),
      interest: contactForm.querySelector("#interest"),
      message: contactForm.querySelector("#message")
    };

    Object.values(fields).forEach((field) => clearInputError(field));
    setFeedback(contactFeedback, "");

    if (!fields.fullName.value.trim()) {
      setInputError(fields.fullName);
      setFeedback(contactFeedback, "Please enter your full name.", "error");
      fields.fullName.focus();
      return false;
    }

    if (fields.fullName.value.trim().length < 2) {
      setInputError(fields.fullName);
      setFeedback(contactFeedback, "Your full name should contain at least 2 characters.", "error");
      fields.fullName.focus();
      return false;
    }

    if (!fields.email.value.trim()) {
      setInputError(fields.email);
      setFeedback(contactFeedback, "Please enter your email address.", "error");
      fields.email.focus();
      return false;
    }

    if (!emailIsValid(fields.email.value)) {
      setInputError(fields.email);
      setFeedback(contactFeedback, "Please enter a valid email address.", "error");
      fields.email.focus();
      return false;
    }

    if (!fields.subject.value.trim()) {
      setInputError(fields.subject);
      setFeedback(contactFeedback, "Please enter a subject for your inquiry.", "error");
      fields.subject.focus();
      return false;
    }

    if (fields.subject.value.trim().length < 3) {
      setInputError(fields.subject);
      setFeedback(contactFeedback, "The subject should contain at least 3 characters.", "error");
      fields.subject.focus();
      return false;
    }

    if (!fields.interest.value.trim()) {
      setInputError(fields.interest);
      setFeedback(contactFeedback, "Please select your area of interest.", "error");
      fields.interest.focus();
      return false;
    }

    if (!fields.message.value.trim()) {
      setInputError(fields.message);
      setFeedback(contactFeedback, "Please enter your message.", "error");
      fields.message.focus();
      return false;
    }

    if (fields.message.value.trim().length < 12) {
      setInputError(fields.message);
      setFeedback(
        contactFeedback,
        "Please provide a more detailed message of at least 12 characters.",
        "error"
      );
      fields.message.focus();
      return false;
    }

    return true;
  };

  const initContactForm = () => {
    if (!contactForm) return;

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const isValid = validateContactForm();

      if (!isValid) return;

      setFeedback(
        contactFeedback,
        "Your inquiry has been received successfully. Our client services team will be in touch soon.",
        "success"
      );

      contactForm.reset();
      showToast("Inquiry sent", "Your LuciShop message has been submitted successfully.");
    });

    const fields = contactForm.querySelectorAll("input, textarea, select");
    fields.forEach((field) => {
      field.addEventListener("input", () => {
        clearInputError(field);
        setFeedback(contactFeedback, "");
      });

      field.addEventListener("change", () => {
        clearInputError(field);
        setFeedback(contactFeedback, "");
      });
    });
  };

  /* =========================
     14. REVEAL ANIMATIONS
     ========================= */
  let revealObserver = null;

  const initRevealObserver = () => {
    const revealElements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  };

  const revealNewElements = () => {
    if (!revealObserver) return;
    const newRevealElements = document.querySelectorAll(".reveal:not(.is-visible)");

    newRevealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  };

  /* =========================
     15. GLOBAL CLOSE / ESCAPE
     ========================= */
  const closeAllPanels = () => {
    closeMobileMenu();
    closeCartDrawer();
    closeProductModal();
  };

  const initGlobalInteractions = () => {
    if (siteBackdrop) {
      siteBackdrop.addEventListener("click", () => {
        if (mobileMenu.classList.contains("is-open")) closeMobileMenu();
        if (cartDrawer.classList.contains("is-open")) closeCartDrawer();
        if (productModal.classList.contains("is-open")) closeProductModal();
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (productModal.classList.contains("is-open")) {
          closeProductModal();
          return;
        }

        if (cartDrawer.classList.contains("is-open")) {
          closeCartDrawer();
          return;
        }

        if (mobileMenu.classList.contains("is-open")) {
          closeMobileMenu();
        }
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 992 && mobileMenu.classList.contains("is-open")) {
        closeMobileMenu();
      }
    });
  };

  /* =========================
     16. OPTIONAL SEARCH BUTTON
     ========================= */
  const initSearchButton = () => {
    const searchButton = document.querySelector(".search-btn");
    if (!searchButton) return;

    searchButton.addEventListener("click", () => {
      smoothScrollToTarget("#collection");
      showToast("Collection ready", "Explore LuciShop’s curated luxury watch portfolio.");
    });
  };

  /* =========================
     17. INITIALIZE
     ========================= */
  const init = () => {
    initLoader();
    initYear();

    renderProducts();
    renderCart();

    initScrollEffects();
    initMobileMenu();
    initSmoothScrolling();
    initProductFilters();
    initProductModal();
    initCartDrawer();
    initNewsletterForm();
    initContactForm();
    initRevealObserver();
    initGlobalInteractions();
    initSearchButton();

    showToast("Welcome to LuciShop", "Discover a refined collection of luxury watches.");
  };

  init();
});
