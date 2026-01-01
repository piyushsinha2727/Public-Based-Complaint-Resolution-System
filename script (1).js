/* =====================================================
   1. COMPLAINT REGISTRATION (index.html)
===================================================== */
const complaintForm = document.getElementById("complaintForm");

if (complaintForm) {
    complaintForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const statusMessage = document.getElementById("statusMessage");
        showLoader();

        const description = document.getElementById("description").value;
        const location = document.getElementById("location").value;
        const imageFile = document.getElementById("beforeImage").files[0];

        if (!imageFile) {
            hideLoader();
            statusMessage.innerText = "Please upload image proof.";
            return;
        }

        const formData = new FormData();
        formData.append("description", description);
        formData.append("location", location);
        formData.append("beforeImage", imageFile);

        // Backend call (demo ready)
        fetch("http://localhost:8080/api/complaints", {
            method: "POST",
            body: formData
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed");
            return res.text();
        })
        .then(() => {
            hideLoader();
            showToast("Complaint submitted successfully");
            complaintForm.reset();
            statusMessage.innerText = "";
        })
        .catch(() => {
            hideLoader();
            showToast("Error submitting complaint");
        });
    });
}
/*home page*/
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // 1. Animated Stats Counter
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            onEnter: () => {
                let count = 0;
                const updateCount = () => {
                    const speed = target / 80;
                    if (count < target) {
                        count += speed;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 25);
                    } else { counter.innerText = target; }
                };
                updateCount();
            }
        });
    });

    // 2. Monthly Resolution Chart
    const resCtx = document.getElementById('resolutionChart').getContext('2d');
    new Chart(resCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Resolved Issues',
                data: [100, 250, 400, 550, 700, 800],
                borderColor: '#34d399',
                backgroundColor: 'rgba(52, 211, 153, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } } }
    });

    // 3. Departmental Performance Chart
    const deptCtx = document.getElementById('deptChart').getContext('2d');
    new Chart(deptCtx, {
        type: 'bar',
        data: {
            labels: ['Water', 'Elect.', 'Roads', 'Waste'],
            datasets: [{
                label: 'Resolution Rate %',
                data: [88, 75, 92, 68],
                backgroundColor: ['#38bdf8', '#facc15', '#fb923c', '#f87171']
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });

    // 4. Scroll Reveal Animations
    gsap.from(".role-card", {
        scrollTrigger: ".role-grid",
        y: 50, opacity: 0, duration: 1, stagger: 0.2
    });

    gsap.from(".chart-box", {
        scrollTrigger: ".analytics-grid",
        scale: 0.9, opacity: 0, duration: 1, stagger: 0.3
    });
});
/* =====================================================
   2. ADMIN DASHBOARD TOGGLE (home.html)
===================================================== */
/**
 * ADMIN DASHBOARD LOGIC
 * Manages complaint selection and departmental resolver assignment
 */

// Data mapping for different departments and their specific resolvers
// Mapping resolvers to their specific departments
const departmentalStaff = {
    water: ["Piyush", "Alok", "Ravi"],
    electricity: ["Shivam", "Yash", "Pratyush"],
    road: ["Aman", "Karan", "Suman"],
    waste: ["Riya", "Mohit", "Vikash"]
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Real-time Clock and Greeting
    const updateTime = () => {
        const now = new Date();
        const hrs = now.getHours();
        let greeting = "Good Evening";
        if (hrs < 12) greeting = "Good Morning";
        else if (hrs < 17) greeting = "Good Afternoon";
        
        const dayGreetingElement = document.getElementById("dayGreeting");
        const timeDisplayElement = document.getElementById("dateTimeDisplay");
        
        if(dayGreetingElement) dayGreetingElement.innerText = greeting;
        if(timeDisplayElement) timeDisplayElement.innerText = now.toLocaleString();
    };
    updateTime();
    setInterval(updateTime, 1000);

    const deptSelect = document.getElementById("departmentSelect");
    const resolverSelect = document.getElementById("resolverSelect");
    const idSelect = document.getElementById("selectedId");
    const assignmentForm = document.getElementById("assignmentForm");

    // 2. Select Complaint from Table Logic
    window.selectComplaint = function(id) {
        if (idSelect) {
            idSelect.value = id;
            showToast(`Editing Complaint #${id}`);
        }
    };

    // 3. Dynamic Resolver Filtering Logic
    if (deptSelect && resolverSelect) {
        deptSelect.addEventListener("change", () => {
            const selectedDept = deptSelect.value;
            resolverSelect.innerHTML = '<option value="">Assign Staff</option>';
            
            if (selectedDept && departmentalStaff[selectedDept]) {
                departmentalStaff[selectedDept].forEach(name => {
                    const opt = document.createElement("option");
                    opt.value = name;
                    opt.textContent = name;
                    resolverSelect.appendChild(opt);
                });
            }
        });
    }

    // 4. Assignment Confirmation Logic
    if (assignmentForm) {
        assignmentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            if(!idSelect.value || !resolverSelect.value) {
                return alert("Please select a Complaint ID and a Resolver Name!");
            }
            
            // Show Loader Simulation
            const loader = document.getElementById("loader");
            if(loader) loader.style.display = "flex";

            setTimeout(() => {
                if(loader) loader.style.display = "none";
                // Final Success Message as requested
                alert(`Complaint #${idSelect.value} successfully assigned to respective department staff: ${resolverSelect.value}`);
                assignmentForm.reset();
            }, 1000);
        });
    }
});

// Helper for UI Toasts
function showToast(message) {
    const toast = document.getElementById("toast");
    if(!toast) return;
    toast.innerText = message;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 3000);
}
/* =====================================================
   3. BEFORE–AFTER IMAGE SLIDER (approval.html)
===================================================== */
const slider = document.getElementById("slider");
const overlay = document.querySelector(".slider-overlay");

if (slider && overlay) {
    slider.addEventListener("input", () => {
        overlay.style.width = slider.value + "%";
    });
}

/* =====================================================
   4. TOAST NOTIFICATION (ALL PAGES)
===================================================== */
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

/* =====================================================
   5. LOADER (OPTIONAL API DEMO)
===================================================== */
function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "flex";
}

function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
}
/* =====================================================
   RESOLVER: SUBMIT RESOLUTION PROOF (resolve.html)
===================================================== */
const submitBtn = document.getElementById("submitProofBtn");

if (submitBtn) {
    submitBtn.addEventListener("click", function () {

        const id = document.getElementById("complaintId").value;
        const file = document.getElementById("afterImage").files[0];
        const status = document.getElementById("resolveStatus");

        if (!id || !file) {
            showToast("Please enter Complaint ID and upload proof");
            return;
        }

        showLoader();
        status.innerText = "Uploading resolution proof...";

        const formData = new FormData();
        formData.append("complaintId", id);
        formData.append("afterImage", file);

        fetch("http://localhost:8080/api/complaints/resolve", {
            method: "POST",
            body: formData
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(() => {
            hideLoader();
            showToast("Proof uploaded. Waiting for user verification");
            status.innerText = "";
        })
        .catch(() => {
            hideLoader();
            showToast("Upload failed. Try again");
            status.innerText = "";
        });
    });
}
/* =====================================================
   LOGIN REDIRECT LOGIC (login.html)
===================================================== */
/**
 * LOGIN REDIRECTION LOGIC
 * Redirects the prototype based on user selection
 */

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const roleSelect = document.getElementById("roleSelect");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const role = roleSelect.value;
            console.log("Selected Role:", role); // Check your console (F12) to see this

            if (!role || role === "") {
                alert("Please select a role first!");
                return;
            }

            // Redirect Logic
            setTimeout(() => {
                // FIXED: Changed "user/" to "user"
                if (role === "user") {
                    window.location.href = "index.html"; 
                } else if (role === "admin") {
                    window.location.href = "admin.html"; 
                } else if (role === "resolver") {
                    window.location.href = "resolve.html"; 
                } else {
                    alert("Error: Invalid Role Selection");
                }
            }, 500);
        });
    }
});

/**
 * UTILITY: Show Toast Notification
 */
function showToast(message) {
    const toast = document.getElementById("toast");
    if (toast) {
        toast.textContent = message;
        toast.style.display = "block";
        setTimeout(() => { toast.style.display = "none"; }, 3000);
    }
}

/**
 * Utility to show status toast
 */
function showToast(message) {
    const toast = document.getElementById("toast");
    if (toast) {
        toast.textContent = message;
        toast.style.display = "block";
        setTimeout(() => { toast.style.display = "none"; }, 3000);
    }
}

/* =====================================================
   ADMIN: IMAGE UPLOAD + PREVIEW + SUBMIT
===================================================== */

// Preview image
const adminImageInput = document.getElementById("adminImage");
const adminPreview = document.getElementById("adminPreview");

if (adminImageInput && adminPreview) {
    adminImageInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            adminPreview.src = URL.createObjectURL(file);
        }
    });
}

// Submit admin proof
const adminSubmitBtn = document.getElementById("adminSubmitBtn");

if (adminSubmitBtn) {
    adminSubmitBtn.addEventListener("click", function () {

        const id = document.getElementById("adminComplaintId").value;
        const file = document.getElementById("adminImage").files[0];
        const status = document.getElementById("adminStatus");

        if (!id || !file) {
            showToast("Enter Complaint ID and upload image");
            return;
        }

        showLoader();
        status.innerText = "Uploading admin inspection proof...";

        const formData = new FormData();
        formData.append("complaintId", id);
        formData.append("adminImage", file);

        fetch("http://localhost:8080/api/complaints/admin-proof", {
            method: "POST",
            body: formData
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(() => {
            hideLoader();
            showToast("Admin proof submitted successfully");
            status.innerText = "";
        })
        .catch(() => {
            hideLoader();
            showToast("Upload failed");
            status.innerText = "";
        });
    });
}
document.addEventListener("DOMContentLoaded", () => {
    // Clock Initialization
    const updateTime = () => {
        const now = new Date();
        const display = document.getElementById("dateTimeDisplay");
        if(display) display.textContent = now.toLocaleString();
    };
    updateTime();
    setInterval(updateTime, 1000);

    const activeIdInput = document.getElementById("activeTaskId");
    const remarksTextarea = document.getElementById("adminRemarks");
    const submitBtn = document.getElementById("submitProofBtn");

    /**
     * LOGIC: Populate the Resolution Pane
     * @param {string} id - The Complaint ID
     * @param {string} title - The title of the issue
     * @param {string} remarks - The instructions from the admin
     */
    window.openResolution = (id, title, remarks) => {
        if (activeIdInput) {
            activeIdInput.value = id;
            remarksTextarea.value = `Issue: ${title}\nInstruction: ${remarks}`;
            
            // Animation: Pulse the portal to show it's updated
            const portal = document.querySelector(".assignment-section");
            portal.style.transform = "scale(1.02)";
            setTimeout(() => portal.style.transform = "scale(1)", 200);
            
            showToast(`Task ${id} Selected`);
        }
    };

    // Submission Logic
  document.addEventListener("DOMContentLoaded", () => {
    // 1. Live Clock & Greeting
    const updateTime = () => {
        const now = new Date();
        const display = document.getElementById("dateTimeDisplay");
        if(display) display.textContent = now.toLocaleString();
    };
    setInterval(updateTime, 1000);
    updateTime();

    // 2. Inter-Phase Task Selection
    const activeIdInput = document.getElementById("activeTaskId");
    const remarksTextarea = document.getElementById("adminRemarks");

    window.openResolution = (id, title, remarks) => {
        if (activeIdInput) {
            activeIdInput.value = id;
            remarksTextarea.value = `Issue: ${title}\nInstruction: ${remarks}`;
            
            // Visual feedback on selection
            const portal = document.querySelector(".portal-section");
            portal.style.borderColor = "#34d399";
            setTimeout(() => portal.style.borderColor = "rgba(255,255,255,0.1)", 1000);
            
            showToast(`Task ${id} Ready for Resolution`);
        }
    };

    // 3. Final Submission Simulation
    const submitBtn = document.getElementById("submitProofBtn");
    if(submitBtn) {
        submitBtn.addEventListener("click", () => {
            const id = activeIdInput.value;
            if(!id) return alert("Select a task first!");
            
            showToast("Verifying Proof...");
            setTimeout(() => {
                alert(`SUCCESS: Work proof for ${id} submitted. AI Verification: 94% Match.`);
                location.reload(); // Refresh to update task list
            }, 1500);
        });
    }
});

function showToast(m) {
    const t = document.getElementById("toast");
    if(t) { t.textContent = m; t.style.display = "block"; setTimeout(() => t.style.display = "none", 3000); }
}
// Image Slider Logic for approval.html
const slider = document.getElementById('slider');
const overlay = document.querySelector('.slider-overlay');

if(slider && overlay) {
    slider.addEventListener('input', (e) => {
        const sliderPos = e.target.value;
        overlay.style.width = `${sliderPos}%`;
    });
}

// Form Submission Simulation
const complaintForm = document.getElementById('complaintForm');
if(complaintForm) {
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast("Submitting Complaint... Please wait.");
        // Animation delay
        setTimeout(() => {
            alert("Complaint #109 Submitted Successfully!");
            window.location.href = "approval.html";
        }, 2000);
    });
}


    // 2. Departmental Efficiency (Doughnut Chart)
    const ctxDept = document.getElementById('deptChart').getContext('2d');
    new Chart(ctxDept, {
        type: 'doughnut',
        data: {
            labels: ['Roads', 'Medical', 'Water', 'Power'],
            datasets: [{
                data: [300, 150, 200, 150],
                backgroundColor: ['#38bdf8', '#34d399', '#facc15', '#f87171'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2500
            },
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff' } }
            }
        }
    });
});
