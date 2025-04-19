document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("search-btn");
    const userNameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-level");
    const mediumLabel = document.getElementById("medium-level");
    const hardLabel = document.getElementById("hard-level");
    const cardStatsContainer = document.querySelector(".stats-card");
    
    function validateUserName(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData);
            displayUserData(parsedData);
        } catch (error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        label.textContent = `${solved}/${total}`;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    }

    function displayUserData(parsedData) {
        // Ensure totalQuestions and solvedQuestions exist before accessing properties
        const totalEasyQues = parsedData.totalQuestions?.easy ?? 0;
        const totalMediumQues = parsedData.totalQuestions?.medium ?? 0;
        const totalHardQues = parsedData.totalQuestions?.hard ?? 0;
    
        const solvedTotalEasyQues = parsedData.solvedQuestions?.easy ?? 0;
        const solvedTotalMedQues = parsedData.solvedQuestions?.medium ?? 0;
        const solvedTotalHardQues = parsedData.solvedQuestions?.hard ?? 0;
    
        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMedQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);
    
        const cardData = [
            
            { label: "Easy Submissions", value: parsedData.submissions?.easy ?? 0 },
            { label: "Medium Submissions", value: parsedData.submissions?.medium ?? 0 },
            { label: "Hard Submissions", value: parsedData.submissions?.hard ?? 0 }
        ];
    
        console.log("Card data", cardData);
        cardStatsContainer.innerHTML = cardData.map(data => `
            <div class="card">
                <h4>${data.label}</h4>
<p>${typeof data.value === "object" ? JSON.stringify(data.value) : data.value}</p>
            </div>
        `).join("");
    }
    

    searchButton.addEventListener("click", function () {
        const username = userNameInput.value;
        console.log("Logging username: ", username);
        if (validateUserName(username)) {
            fetchUserDetails(username);
        }
    });
});
