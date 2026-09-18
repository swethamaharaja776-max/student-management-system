let students = JSON.parse(localStorage.getItem("students")) || [];

const form = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const emptyState = document.getElementById("emptyState");

const studentName = document.getElementById("studentName");
const registerNumber = document.getElementById("registerNumber");
const email = document.getElementById("email");
const department = document.getElementById("department");
const year = document.getElementById("year");
const cgpa = document.getElementById("cgpa");
const placement = document.getElementById("placement");
const editIndex = document.getElementById("editIndex");

const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");
const yearFilter = document.getElementById("yearFilter");
const placementFilter = document.getElementById("placementFilter");
const sortFilter = document.getElementById("sortFilter");

const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");

/* SAMPLE DATA */

function addSampleData() {

    if (students.length > 0) return;

    students = [
        {
            name: "Swetha M",
            register: "23AIDS001",
            email: "swetha@example.com",
            department: "AI & DS",
            year: "2nd Year",
            cgpa: 8.26,
            placement: "Not Placed"
        },
        {
            name: "Thanushree S",
            register: "23CSE002",
            email: "thanushree@example.com",
            department: "CSE",
            year: "2nd Year",
            cgpa: 8.65,
            placement: "Placed"
        },
        {
            name: "Sophia R",
            register: "23ECE003",
            email: "sophia@example.com",
            department: "ECE",
            year: "2nd Year",
            cgpa: 8.12,
            placement: "Not Placed"
        },
        {
            name: "Arun Kumar",
            register: "23EEE004",
            email: "arun@example.com",
            department: "EEE",
            year: "3rd Year",
            cgpa: 7.95,
            placement: "Placed"
        }
    ];

    saveStudents();
}

/* SAVE */

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

/* FORM VALIDATION */

function validateForm() {

    if (!studentName.value.trim()) {
        showToast("Please enter student name");
        return false;
    }

    if (!registerNumber.value.trim()) {
        showToast("Please enter register number");
        return false;
    }

    if (!email.value.trim() || !email.checkValidity()) {
        showToast("Please enter a valid email");
        return false;
    }

    if (!department.value) {
        showToast("Please select department");
        return false;
    }

    if (!year.value) {
        showToast("Please select year");
        return false;
    }

    if (
        cgpa.value === "" ||
        Number(cgpa.value) < 0 ||
        Number(cgpa.value) > 10
    ) {
        showToast("CGPA must be between 0 and 10");
        return false;
    }

    if (!placement.value) {
        showToast("Please select placement status");
        return false;
    }

    const duplicate = students.some((student, index) =>
        student.register.toLowerCase() === registerNumber.value.trim().toLowerCase()
        && index !== Number(editIndex.value)
    );

    if (duplicate) {
        showToast("Register number already exists");
        return false;
    }

    return true;
}

/* ADD / UPDATE */

form.addEventListener("submit", function (e) {

    e.preventDefault();

    if (!validateForm()) return;

    const student = {
        name: studentName.value.trim(),
        register: registerNumber.value.trim(),
        email: email.value.trim(),
        department: department.value,
        year: year.value,
        cgpa: Number(cgpa.value),
        placement: placement.value
    };

    if (editIndex.value === "") {

        students.push(student);
        showToast("Student added successfully!");

    } else {

        students[Number(editIndex.value)] = student;
        showToast("Student updated successfully!");

    }

    saveStudents();
    resetForm();
    renderStudents();
    updateDashboard();
});

/* EDIT */

function editStudent(index) {

    const student = students[index];

    studentName.value = student.name;
    registerNumber.value = student.register;
    email.value = student.email;
    department.value = student.department;
    year.value = student.year;
    cgpa.value = student.cgpa;
    placement.value = student.placement;

    editIndex.value = index;

    submitBtn.innerHTML = "💾 Update Student";

    document.getElementById("formTitle").textContent = "Edit Student";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* DELETE */

function deleteStudent(index) {

    const student = students[index];

    const confirmDelete = confirm(
        `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmDelete) return;

    students.splice(index, 1);

    saveStudents();
    renderStudents();
    updateDashboard();

    showToast("Student deleted successfully!");
}

/* RESET FORM */

function resetForm() {

    form.reset();
    editIndex.value = "";

    submitBtn.innerHTML = "➕ Add Student";

    document.getElementById("formTitle").textContent = "Add Student";
}

clearBtn.addEventListener("click", resetForm);

/* RENDER STUDENTS */

function renderStudents() {

    let filteredStudents = [...students];

    const search = searchInput.value.toLowerCase().trim();

    if (search) {

        filteredStudents = filteredStudents.filter(student =>
            student.name.toLowerCase().includes(search) ||
            student.register.toLowerCase().includes(search) ||
            student.email.toLowerCase().includes(search) ||
            student.department.toLowerCase().includes(search)
        );
    }

    if (departmentFilter.value) {
        filteredStudents = filteredStudents.filter(
            student => student.department === departmentFilter.value
        );
    }

    if (yearFilter.value) {
        filteredStudents = filteredStudents.filter(
            student => student.year === yearFilter.value
        );
    }

    if (placementFilter.value) {
        filteredStudents = filteredStudents.filter(
            student => student.placement === placementFilter.value
        );
    }

    if (sortFilter.value === "name") {

        filteredStudents.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    } else if (sortFilter.value === "register") {

        filteredStudents.sort((a, b) =>
            a.register.localeCompare(b.register)
        );

    } else if (sortFilter.value === "cgpa") {

        filteredStudents.sort((a, b) =>
            b.cgpa - a.cgpa
        );
    }

    studentTable.innerHTML = "";

    if (filteredStudents.length === 0) {

        emptyState.style.display = "block";
        return;

    } else {

        emptyState.style.display = "none";
    }

    filteredStudents.forEach((student) => {

        const originalIndex = students.indexOf(student);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${originalIndex + 1}</td>

            <td><strong>${student.name}</strong></td>

            <td>${student.register}</td>

            <td>${student.email}</td>

            <td>${student.department}</td>

            <td>${student.year}</td>

            <td><strong>${student.cgpa.toFixed(2)}</strong></td>

            <td>
                <span class="badge ${
                    student.placement === "Placed"
                    ? "placed"
                    : "not-placed"
                }">
                    ${student.placement}
                </span>
            </td>

            <td>
                <button
                    class="action-btn edit-btn"
                    onclick="editStudent(${originalIndex})">
                    ✏️ Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteStudent(${originalIndex})">
                    🗑️ Delete
                </button>
            </td>
        `;

        studentTable.appendChild(row);
    });
}

/* DASHBOARD */

function updateDashboard() {

    document.getElementById("totalStudents").textContent =
        students.length;

    const aiCount = students.filter(
        student => student.department === "AI & DS"
    ).length;

    document.getElementById("aiStudents").textContent = aiCount;

    const totalCgpa = students.reduce(
        (sum, student) => sum + Number(student.cgpa),
        0
    );

    const average =
        students.length > 0
            ? totalCgpa / students.length
            : 0;

    document.getElementById("averageCgpa").textContent =
        average.toFixed(2);

    const placedCount = students.filter(
        student => student.placement === "Placed"
    ).length;

    document.getElementById("placedStudents").textContent =
        placedCount;

    updateReports();
}

/* REPORTS */

function updateReports() {

    const reportContent = document.getElementById("reportContent");

    const departments = [
        "AI & DS",
        "CSE",
        "ECE",
        "EEE",
        "Mechanical",
        "Civil"
    ];

    let html = "";

    departments.forEach(dept => {

        const count = students.filter(
            student => student.department === dept
        ).length;

        const percentage =
            students.length > 0
                ? (count / students.length) * 100
                : 0;

        html += `
            <div class="report-box">
                <h3>${dept}</h3>
                <p>${count} student(s)</p>

                <div class="report-bar">
                    <div
                        class="report-fill"
                        style="width:${percentage}%">
                    </div>
                </div>
            </div>
        `;
    });

    const placed = students.filter(
        student => student.placement === "Placed"
    ).length;

    const notPlaced = students.length - placed;

    html += `
        <div class="report-box">
            <h3>💼 Placement Summary</h3>
            <p>Placed: ${placed}</p>
            <p>Not Placed: ${notPlaced}</p>
        </div>
    `;

    reportContent.innerHTML = html;
}

/* SEARCH & FILTER */

searchInput.addEventListener("input", renderStudents);

departmentFilter.addEventListener("change", renderStudents);

yearFilter.addEventListener("change", renderStudents);

placementFilter.addEventListener("change", renderStudents);

sortFilter.addEventListener("change", renderStudents);

/* TOAST */

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* DARK MODE */

function loadTheme() {

    const darkMode = localStorage.getItem("darkMode");

    if (darkMode === "true") {
        document.body.classList.add("dark");
        themeBtn.innerHTML = "☀️ Light Mode";
    }
}

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem("darkMode", isDark);

    themeBtn.innerHTML =
        isDark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
});

/* START APPLICATION */

addSampleData();
loadTheme();
renderStudents();
updateDashboard();
