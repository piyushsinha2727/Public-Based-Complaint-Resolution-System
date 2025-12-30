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

/* =====================================================
   2. ADMIN DASHBOARD TOGGLE (home.html)
===================================================== */
function toggleAdminPanel() {
    const panel = document.getElementById("adminPanel");
    if (!panel) return;

    panel.style.display =
        panel.style.display === "block" ? "none" : "block";
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
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const role = params.get("role");

        showToast("Login successful");

        setTimeout(() => {
            if (role === "citizen") {
                window.location.href = "index.html";
            } 
            else if (role === "resolver") {
                window.location.href = "resolve.html";
            } 
            else if (role === "admin") {
                window.location.href = "home.html";
            }
        }, 1200);
    });
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
