//script.js

// Load EmailJS dynamically
function loadEmailJS() {
    return new Promise((resolve, reject) => {
        if (window.emailjs) {
            resolve(window.emailjs);
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            emailjs.init("LUL1XEtV4j6A4FmHb");
            resolve(window.emailjs);
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('bg-white/95', 'backdrop-blur-sm', 'shadow-lg');
            } else {
                navbar.classList.remove('bg-white/95', 'backdrop-blur-sm', 'shadow-lg');
            }
        });
    }

    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.remove('hidden');
                backToTopBtn.classList.add('flex');
            } else {
                backToTopBtn.classList.add('hidden');
                backToTopBtn.classList.remove('flex');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.documentElement.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Customer support button functionality
    const supportButton = document.getElementById('support-button');
    if (supportButton) {
        supportButton.addEventListener('click', () => {
            document.querySelectorAll('.contact-icon').forEach(icon => {
                icon.classList.toggle('show');
            });
        });
    }

    // FAQ functionality
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const icon = button.querySelector('i');

            if (answer) {
                answer.classList.toggle('hidden');
            }
            if (icon) {
                icon.classList.toggle('rotate-180');
            }
        });
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
        });
    });

    // Add interactive effects for CTA buttons
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(event) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.classList.add('ripple');
            
            // Make button relative positioned for ripple
            if (getComputedStyle(this).position === 'static') {
                this.style.position = 'relative';
            }
            this.style.overflow = 'hidden';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });

    // Performance optimization with Intersection Observer
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.service-card, .stats-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Lazy load images
    const lazyImages = document.querySelectorAll('.lazy-load');
    lazyImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });

    // Initialize forms
    initializeContactForm();
    initializeEnrollmentForm();
});

// Contact Form Handler EmailJS with SweetAlert2
async function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) {
        // Contact form doesn't exist on this page
        return;
    }

    // Load EmailJS
    try {
        await loadEmailJS();
    } catch (error) {
        console.error('Failed to load EmailJS:', error);
        return;
    }
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Check if EmailJS is loaded
        if (!window.emailjs) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email service is not available. Please try again later.',
            });
            return;
        }
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const academicLevel = formData.get('academic_level');
        const message = formData.get('message');
        
        // Validate required fields
        if (!name || !phone || !email || !message) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Please fill in all required fields.',
            });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.',
            });
            return;
        }
        
        // Get current time
        const now = new Date();
        const time = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Prepare template parameters
        const templateParams = {
            name: name,
            phone: phone,
            email: email,
            academic_level: academicLevel || 'Not specified',
            message: message,
            time: time
        };
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i>Sending...';
        submitBtn.disabled = true;
        
        // Send email via EmailJS
        try {
            const response = await emailjs.send('service_gxgv9jl', 'template_dtqt67k', templateParams);
            Swal.fire({
                icon: 'success',
                title: 'Message Sent!',
                text: 'We\'ll get back to you within 24 hours.',
                timer: 3000,
                showConfirmButton: false
            });
            contactForm.reset();
        } catch (error) {
            console.log('FAILED...', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Send',
                text: 'Please try again or contact us directly via WhatsApp.',
            });
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Enrollment Form Handler
async function initializeEnrollmentForm() {
    const enrollmentForm = document.getElementById('enrollmentForm');
    
    if (!enrollmentForm) {
        // Enrollment form doesn't exist on this page
        return;
    }

    // Load EmailJS
    try {
        await loadEmailJS();
    } catch (error) {
        console.error('Failed to load EmailJS:', error);
        return;
    }

    // Form variables
    let currentStep = 1;
    const totalSteps = 4;
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.getElementById('progress-text');

    // Package selection functionality
    document.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            card.classList.add('selected');
            // Set the radio button value
            const radioInput = card.querySelector('input[type="radio"]');
            if (radioInput) {
                radioInput.checked = true;
            }
        });
    });

    // Form navigation functions
    function showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        // Show current step
        document.getElementById(`step${step}`).classList.add('active');
        
        // Update progress indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const stepNumber = index + 1;
            indicator.classList.remove('active', 'completed');
            
            if (stepNumber < step) {
                indicator.classList.add('completed');
            } else if (stepNumber === step) {
                indicator.classList.add('active');
            }
        });

        // Update progress bar
        const progressPercentage = (step / totalSteps) * 100;
        progressBar.style.width = progressPercentage + '%';
        
        // Update progress text
        const stepTitles = [
            'Personal Information',
            'Academic Background', 
            'Service Selection',
            'Additional Information'
        ];
        progressText.textContent = `Step ${step} of ${totalSteps}: ${stepTitles[step - 1]}`;

        // Show/hide navigation buttons
        prevBtn.style.display = step === 1 ? 'none' : 'inline-block';
        nextBtn.style.display = step === totalSteps ? 'none' : 'inline-block';
        submitBtn.style.display = step === totalSteps ? 'inline-block' : 'none';
    }

    function validateStep(step) {
        const currentStepElement = document.getElementById(`step${step}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            const errorMessage = field.parentElement.querySelector('.error-message');
            
            if (!field.value.trim()) {
                field.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'This field is required';
                    errorMessage.classList.remove('hidden');
                }
                isValid = false;
            } else {
                field.classList.remove('error');
                if (errorMessage) {
                    errorMessage.classList.add('hidden');
                }
            }

            // Email validation
            if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value.trim())) {
                    field.classList.add('error');
                    if (errorMessage) {
                        errorMessage.textContent = 'Please enter a valid email address';
                        errorMessage.classList.remove('hidden');
                    }
                    isValid = false;
                }
            }
        });

        // Special validation for step 3 (package selection)
        if (step === 3) {
            const packageSelected = document.querySelector('input[name="selectedPackage"]:checked');
            if (!packageSelected) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Package Required',
                    text: 'Please select a service package to continue.',
                });
                isValid = false;
            }
        }

        return isValid;
    }

    // Event listeners for navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    showStep(currentStep);
                }
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    }

    // Form submission
    enrollmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateStep(currentStep)) {
            return;
        }

        // Check if EmailJS is loaded
        if (!window.emailjs) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email service is not available. Please try again later.',
            });
            return;
        }

        // Show loading state
        const submitText = document.querySelector('.submit-text');
        const loadingSpinner = document.querySelector('.loading-spinner');
        const submitButton = document.getElementById('submitBtn');
        
        if (submitText) submitText.style.display = 'none';
        if (loadingSpinner) loadingSpinner.classList.remove('hidden');
        if (submitButton) submitButton.disabled = true;

        // Collect form data
        const formData = new FormData(enrollmentForm);
        const enrollmentData = {};
        
        // Convert FormData to regular object
        for (let [key, value] of formData.entries()) {
            if (enrollmentData[key]) {
                // Handle multiple values (like additional services)
                if (Array.isArray(enrollmentData[key])) {
                    enrollmentData[key].push(value);
                } else {
                    enrollmentData[key] = [enrollmentData[key], value];
                }
            } else {
                enrollmentData[key] = value;
            }
        }

        // Handle checkboxes that weren't checked
        const checkboxes = enrollmentForm.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked && !enrollmentData[checkbox.name]) {
                enrollmentData[checkbox.name] = 'No';
            }
        });

        // Get current time
        const now = new Date();
        const enrollmentDate = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        try {
            // Prepare template parameters for enrollment email
            const templateParams = {
                student_name: `${enrollmentData.firstName} ${enrollmentData.lastName}`,
                student_email: enrollmentData.email,
                student_phone: enrollmentData.phone,
                date_of_birth: enrollmentData.dateOfBirth,
                country: enrollmentData.country,
                address: enrollmentData.address || 'Not provided',
                grade_level: enrollmentData.gradeLevel,
                previous_school_type: enrollmentData.previousSchoolType,
                previous_school_name: enrollmentData.previousSchoolName || 'Not provided',
                graduation_year: enrollmentData.graduationYear,
                gpa: enrollmentData.gpa || 'Not provided',
                academic_needs: enrollmentData.academicNeeds || 'None specified',
                selected_package: enrollmentData.selectedPackage,
                additional_services: Array.isArray(enrollmentData.additionalServices) ? 
                    enrollmentData.additionalServices.join(', ') : enrollmentData.additionalServices || 'None',
                parent_name: enrollmentData.parentName,
                parent_email: enrollmentData.parentEmail,
                parent_phone: enrollmentData.parentPhone,
                referral_source: enrollmentData.referralSource || 'Not specified',
                goals: enrollmentData.goals || 'Not provided',
                challenges: enrollmentData.challenges || 'None specified',
                agreement_terms: enrollmentData.agreementTerms === 'true' ? 'Yes' : 'No',
                agreement_payment: enrollmentData.agreementPayment === 'true' ? 'Yes' : 'No',
                agreement_communication: enrollmentData.agreementCommunication === 'true' ? 'Yes' : 'No',
                agreement_marketing: enrollmentData.agreementMarketing === 'true' ? 'Yes' : 'No',
                enrollment_date: enrollmentDate
            };

            // Send enrollment email via EmailJS
            await emailjs.send('service_gxgv9jl', 'template_lzezx87', templateParams);

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Enrollment Submitted!',
                text: 'Thank you for choosing AceTiyo! We will contact you within 24 hours to complete your enrollment process.',
                timer: 5000,
                showConfirmButton: true,
                confirmButtonText: 'Continue'
            }).then(() => {
                // Reset form or redirect
                enrollmentForm.reset();
                currentStep = 1;
                showStep(1);
            });

        } catch (error) {
            console.error('Error sending enrollment:', error);
            Swal.fire({
                icon: 'error',
                title: 'Enrollment Failed',
                text: 'There was an error submitting your enrollment. Please try again or contact us directly via WhatsApp.',
                showConfirmButton: true
            });
        } finally {
            // Reset button state
            if (submitText) submitText.style.display = 'inline';
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            if (submitButton) submitButton.disabled = false;
        }
    });

    // Remove error styling on input
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorMessage = input.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }
        });
    });

    // Initialize first step
    showStep(1);
}

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full max-w-sm ${
        type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="ri-${type === 'success' ? 'check-line' : 'error-warning-line'}"></i>
            <span class="text-sm">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add CSS for ripple effect
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            .contact-icon.show {
                opacity: 1 !important;
                pointer-events: auto !important;
                transform: translateY(0) !important;
            }
            .pricing-toggle.active {
                background: linear-gradient(135deg, #333333 0%, #f20612 100%);
                color: white;
                transform: scale(1.05);
            }
            .pricing-toggle {
                background: transparent;
                color: #6b7280;
            }
        `;
        document.head.appendChild(style);
    }
});