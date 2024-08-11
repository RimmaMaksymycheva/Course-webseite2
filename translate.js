// Function to fetch language data from a JSON file
async function fetchLanguageData(lang) {
    try {
        const response = await fetch(`languages/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Could not fetch ${lang}.json: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching language data:', error);
        return {};
    }
}

// Function to fetch student data from a JSON file
async function fetchStudentData(lang) {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error(`Could not fetch data for ${lang}: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error loading student data:', error);
        return { students: [] };
    }
}

// Function to change the language
async function changeLanguage(lang) {
    localStorage.setItem("selectedLanguage", lang); // Store the selected language
    
    // Fetch language data and student data in parallel
    const [langData, studentData] = await Promise.all([
        fetchLanguageData(lang),
        fetchStudentData(lang)
    ]);

    updateLanguage(langData); // Update the text on the page with the fetched language data
    populateStudentTable(studentData.students); // Populate the table with student data
}

// Function to update the language on the page
function updateLanguage(langData) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n'); // Get the data-i18n key
        if (langData[key]) {
            element.textContent = langData[key]; // Update the content with the corresponding translation
        }
    });
}

// Function to populate the student table with data
function populateStudentTable(students) {
    const studentTableBody = document.getElementById('studentTableBody');
    
    // Clear the table body before adding new rows
    studentTableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        for (const key in student) {
            const cell = document.createElement('td');
            cell.textContent = student[key];
            row.appendChild(cell);
        }
        studentTableBody.appendChild(row);
    });
}

// Function that runs when the page is loaded
window.onload = async function () {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "de"; // Default to German
    
    // Fetch language data and student data in parallel
    const [langData, studentData] = await Promise.all([
        fetchLanguageData(savedLanguage),
        fetchStudentData(savedLanguage)
    ]);

    updateLanguage(langData); // Update the text on the page with the fetched language data
    populateStudentTable(studentData.students); // Populate the table with student data
}


// Function to load student data from JSON and populate the table
async function loadStudentData(lang) {
    try {
        const response = await fetch(`data/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Could not fetch data for ${lang}: ${response.statusText}`);
        }
        const data = await response.json();
        const studentTableBody = document.getElementById('studentTableBody');

        // Clear the table body before adding new rows
        studentTableBody.innerHTML = '';

        data.students.forEach(student => {
            const row = document.createElement('tr');
            for (const key in student) {
                const cell = document.createElement('td');
                cell.textContent = student[key];
                row.appendChild(cell);
            }
            studentTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading student data:', error);
    }
}

// Function that runs when the page is loaded
window.onload = async function () {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "de"; // Default to German
    const langData = await fetchLanguageData(savedLanguage); // Fetch the language data
    updateLanguage(langData); // Update the text on the page with the fetched data
    loadStudentData(savedLanguage); // Load student data for the saved language
}
