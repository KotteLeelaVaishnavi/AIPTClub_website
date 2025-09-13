// Global variables
let students = [];
let currentUser = null;
let isAdmin = false;

// Initialize particles
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        container.appendChild(particle);
    }
}

// Dropdown functionality
function toggleDropdown() {
    const dropdown = document.getElementById('signInDropdown');
    dropdown.classList.toggle('active');
}

// Modal functionality
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    toggleDropdown();
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Tab functionality
function showTab(tab) {
    if (tab === 'register') {
        document.getElementById('registerForm').style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';
    } else {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    }
}

// Student registration
function registerStudent(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const branch = document.getElementById('branch').value;
    const year = document.getElementById('year').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Check if email already exists
    if (students.find(student => student.email === email)) {
        alert('Email already registered!');
        return;
    }

    // Create student object
    const student = {
        fullName,
        email,
        phone,
        branch,
        year,
        password,
        registrationDate: new Date().toLocaleDateString()
    };

    // Add to students array
    students.push(student);

    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(students));

    alert('Registration successful!');
    hideModal('studentModal');
    document.getElementById('registerForm').reset();
}

// Student login
function loginStudent(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const student = students.find(s => s.email === email && s.password === password);
    
    if (student) {
        currentUser = student;
        alert(`Welcome, ${student.fullName}!`);
        hideModal('studentModal');
        document.getElementById('loginForm').reset();
    } else {
        alert('Invalid credentials!');
    }
}

// Admin login
function loginAdmin(event) {
    event.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    if (email === 'aipt2025@gmail.com' && password === 'association@2025') {
        isAdmin = true;
        alert('Admin login successful!');
        hideModal('adminModal');
        showAdminPanel();
        document.getElementById('adminModal').querySelector('form').reset();
    } else {
        alert('Invalid admin credentials!');
    }
}

// Show admin panel
function showAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.style.display = 'block';
    updateStudentTable();
    
    // Scroll to admin panel
    adminPanel.scrollIntoView({ behavior: 'smooth' });
}

// Update student table
function updateStudentTable() {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';

    students.forEach(student => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = student.fullName;
        row.insertCell(1).textContent = student.email;
        row.insertCell(2).textContent = student.phone;
        row.insertCell(3).textContent = student.branch;
        row.insertCell(4).textContent = student.year;
        row.insertCell(5).textContent = student.registrationDate;
    });
}

// Download student data as CSV
function downloadStudentData() {
    if (students.length === 0) {
        alert('No student data available to download!');
        return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Branch', 'Year', 'Registration Date'];
    const csvContent = [
        headers.join(','),
        ...students.map(student => [
            student.fullName,
            student.email,
            student.phone,
            student.branch,
            student.year,
            student.registrationDate
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AIPTClub_Students_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Show member modal
function showMemberModal(name, description) {
    document.getElementById('memberName').textContent = name;
    document.getElementById('memberDescription').textContent = description;
    showModal('memberModal');
}

// Smooth scrolling
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

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const signInContainer = document.querySelector('.sign-in-container');
    if (!signInContainer.contains(event.target)) {
        document.getElementById('signInDropdown').classList.remove('active');
    }
});

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    // Load students from localStorage if available
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
        students = JSON.parse(storedStudents);
    }

    // Optional: Uncomment to pre-load demo students if localStorage is empty
    /*
    if (!storedStudents) {
        students.push(
            {
                fullName: 'Demo Student 1',
                email: 'demo1@example.com',
                phone: '9876543210',
                branch: 'CSE',
                year: '3rd',
                password: 'demo123',
                registrationDate: '2024-01-15'
            },
            {
                fullName: 'Demo Student 2',
                email: 'demo2@example.com',
                phone: '9876543211',
                branch: 'IT',
                year: '2nd',
                password: 'demo123',
                registrationDate: '2024-01-20'
            }
        );
        localStorage.setItem('students', JSON.stringify(students));
    }
    */
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.9)';
    }
});

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace('+', ''));
        let count = 0;
        const increment = target / 100;
        
        const updateCounter = () => {
            if (count < target) {
                count += increment;
                counter.textContent = Math.ceil(count) + '+';
                setTimeout(updateCounter, 50);
            } else {
                counter.textContent = target + '+';
            }
        };
        updateCounter();
    });
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('stats-container')) {
                animateCounters();
            }
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
});
