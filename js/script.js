const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const backTop = document.querySelector(".back-top");

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const onScroll = () => {
  const scrolled = window.scrollY > 20;
  header?.classList.toggle("scrolled", scrolled);
  backTop?.classList.toggle("visible", window.scrollY > 500);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(anchor => {
      anchor.classList.toggle("active", anchor.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(section => activeObserver.observe(section));

document.getElementById("year").textContent = new Date().getFullYear();

// const enquiryForm = document.getElementById("enquiryForm");
// const feedback = document.getElementById("formFeedback");
// enquiryForm?.addEventListener("submit", event => {
//   event.preventDefault();
//   if (!enquiryForm.reportValidity()) return;
//   feedback.textContent = "Your details have been validated in this demo. No information has been sent. Connect an approved form endpoint to receive enquiries.";
//   feedback.classList.add("form-feedback-success");
// });

document.getElementById('enquiryForm').addEventListener('submit', async function(e) {
  e.preventDefault(); // 1. Stops the default HTML page redirect
  
  const form = e.target;
  const feedback = document.getElementById('formFeedback');
  const submitBtn = form.querySelector('.form-submit');
  
  // Change button text to show it's processing
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = "Sending... <span>⏳</span>";
  submitBtn.disabled = true;

  // 2. Gather all the form input data dynamically
  const formData = new FormData(form);

  try {
    // send the data to Formspree in the background (AJAX)
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // 4. Update the text on your page to show it was successful
      feedback.textContent = "Thank you! Your enquiry has been delivered successfully.";
      feedback.style.color = "#2e7d32"; // Clean green color
      feedback.style.display = "block";
      form.reset(); // Clears the input fields for the user
    } else {
      throw new Error("Form submission failed");
    }
  } catch (error) {
    // Handle error state gracefully
    feedback.textContent = "Oops! Something went wrong. Please try again.";
    feedback.style.color = "#d32f2f"; // Error red color
    feedback.style.display = "block";
  } finally {
    // Reset button back to normal
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
  }
});



///// NEWSLETTER JS
document.getElementById('newsletterForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const emailInput = document.getElementById('newsletterEmail');
  const feedback = document.getElementById('newsletterFeedback');
  const submitBtn = document.getElementById('newsletterSubmitBtn');
  
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = "Joining... <span>⏳</span>";
  submitBtn.disabled = true;

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    feedback.className = "newsletter-feedback"; 
    feedback.style.display = "block";

    if (response.ok) {
      feedback.textContent = "Awesome! You've successfully subscribed to our list.";
      feedback.classList.add('success');
      form.reset();
    } else {
      throw new Error();
    }
  } catch (error) {
    feedback.textContent = "Could not complete registration. Please try again.";
    feedback.classList.add('error');
  } finally {
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
  }
});
