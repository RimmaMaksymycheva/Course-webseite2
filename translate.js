// Function to fetch language data from a JSON file
function fetchLanguageData(lang) {
    return fetch(`languages/${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not fetch ${lang}.json: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching language data:', error);
            return {};
        });
}

// Function to fetch student data from a JSON file
function fetchStudentData() {
    return fetch("data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not fetch data.json: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error loading student data:', error);
            return { students: [] };
        });
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

    // Build rows in-memory and then insert them into the DOM in one go
    const fragment = document.createDocumentFragment();

    students.forEach(student => {
        const row = document.createElement('tr');
        for (const key in student) {
            const cell = document.createElement('td');
            cell.textContent = student[key];
            row.appendChild(cell);
        }
        fragment.appendChild(row);
    });

    studentTableBody.appendChild(fragment); // Add new rows in one operation
}

// Function that runs when the page is loaded
window.onload = function () {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "de"; // Default to German

    // Fetch language data and update the UI when ready
    fetchLanguageData(savedLanguage)
        .then(langData => {
            updateLanguage(langData); // Update the language as soon as data is fetched
        })
        .catch(error => {
            console.error('Error updating language:', error);
        });

    // Fetch student data and update the table when ready
    fetchStudentData()
        .then(studentData => {
            populateStudentTable(studentData.students); // Update the student table as soon as data is fetched
        })
        .catch(error => {
            console.error('Error populating student table:', error);
        });
};

// Function to change the language
function changeLanguage(lang) {
    localStorage.setItem("selectedLanguage", lang); // Store the selected language
    fetchLanguageData(lang)
        .then(langData => {
            updateLanguage(langData); // Update the language as soon as data is fetched
        })
        .catch(error => {
            console.error('Error changing language:', error);
        });
}
