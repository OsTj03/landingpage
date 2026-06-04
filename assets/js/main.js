/**
 * Lógica de UI para NicaMuscle Landing Page
 */

// Inicializar cliente de Supabase
const supabaseUrl = 'https://nsoxrbbptimfuxhprowv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zb3hyYmJwdGltaWZ1eGhwcm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTkwNTksImV4cCI6MjA5NjE3NTA1OX0.IzFbjN0qEHEhjmaSb6xg_2YnsZyS96GakKUOXHvlQeE'; // <-- Reemplaza esto con tu anon public key de Supabase
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 12, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            navbar.style.padding = '1rem 0';
        } else {
            navbar.style.background = 'rgba(10, 10, 12, 0.8)';
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1.5rem 0';
        }
    });

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'visible' class to trigger CSS animation
                entry.target.classList.add('visible');

                // Optional: Unobserve after animating once to improve performance
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements with the 'animate' class
    const animatedElements = document.querySelectorAll('.animate');
    animatedElements.forEach(el => observer.observe(el));

    // 3. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Supabase Form Integration
    const leadForm = document.getElementById('gym-lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Capturar campos del formulario
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const edad = parseInt(document.getElementById('edad').value, 10);
            const intereses = document.getElementById('intereses').value;
            const intencion_compra = document.getElementById('intencion_compra').value;

            // Deshabilitar botón durante el envío
            const submitButton = leadForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            try {
                const { data, error } = await supabaseClient
                    .from('leads')
                    .insert([
                        {
                            nombre,
                            email,
                            edad,
                            intereses,
                            intencion_compra
                        }
                    ]);

                if (error) throw error;

                // Éxito: notificar al usuario y limpiar formulario
                alert('¡Registro exitoso! Tu cupón de descuento ha sido reservado.');
                leadForm.reset();
            } catch (error) {
                console.error('Error al guardar en Supabase:', error.message);
                alert('Hubo un problema al registrar tus datos. Por favor, intenta de nuevo.');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
});
