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
        return {};  // Return an empty object in case of error
    }
}

// Function to fetch student data from a JSON file
async function fetchStudentData() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error(`Could not fetch data.json: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error loading student data:', error);
        return { students: [] };  // Return an empty array in case of error
    }
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
window.onload = async function () {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "de"; // Default to German

    // Start fetching both language data and student data simultaneously
    try {
        const [langData, studentData] = await Promise.all([
            fetchLanguageData(savedLanguage),
            fetchStudentData()
        ]);

        // Update the UI with the fetched data
        updateLanguage(langData);
        populateStudentTable(studentData.students);
    } catch (error) {
        console.error('Error during data fetching or UI update:', error);
    }
};

// Function to change the language
async function changeLanguage(lang) {
    localStorage.setItem("selectedLanguage", lang); // Store the selected language
    try {
        // Fetch new language data and update the UI
        const langData = await fetchLanguageData(lang);
        updateLanguage(langData);
    } catch (error) {
        console.error('Error changing language:', error);
    }
}
