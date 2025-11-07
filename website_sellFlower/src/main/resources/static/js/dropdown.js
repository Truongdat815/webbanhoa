// Dropdown menu toggle function
function toggleDropdown(element) {
    const dropdown = element.closest('.user-dropdown');
    const isActive = dropdown.classList.contains('active');
    
    // Close all other dropdowns
    document.querySelectorAll('.user-dropdown').forEach(d => {
        d.classList.remove('active');
    });
    
    // Toggle current dropdown
    if (!isActive) {
        dropdown.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = event.target.closest('.user-dropdown');
    if (!dropdown) {
        document.querySelectorAll('.user-dropdown').forEach(d => {
            d.classList.remove('active');
        });
    }
});

