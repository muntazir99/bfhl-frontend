import React, { useState, useEffect } from 'react';
import './styles.css';  // Your styles

const App = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);  // Selected filters
    const [inputError, setInputError] = useState('');
    const [loading, setLoading] = useState(false);

    // Update document title when roll number is received
    useEffect(() => {
        if (response && response.roll_number) {
            document.title = response.roll_number;  // Set the roll number as the title
        }
    }, [response]);

    const handleJsonChange = (e) => {
        const value = e.target.value;
        setJsonInput(value);

        // Check if the input is valid JSON
        try {
            JSON.parse(value);
            setInputError('');  // Clear the error if the input is valid
        } catch (error) {
            setInputError('Invalid JSON format');
        }
    };

    const handleSubmit = async () => {
        if (inputError) {
            alert("Please fix the JSON format before submitting.");
            return;
        }

        setLoading(true);
        try {
            const parsedInput = JSON.parse(jsonInput);  // Validates JSON input
            const result = await fetch('http://localhost:3000/bfhl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedInput),  // Send parsed JSON to backend
            });
            const data = await result.json();
            setResponse(data);  // Set the response state
        } catch (error) {
            alert('Invalid JSON');
        } finally {
            setLoading(false);
        }
    };

    // Handle checkbox selection
    const handleCheckboxChange = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    // Render response based on selected filters or show all if no filter is selected
    const renderResponse = () => {
        if (!response) return null;

        const showAll = selectedOptions.length === 0;  // Check if no filters are applied

        return (
            <div className="response-container">
                {(showAll || selectedOptions.includes('numbers')) && response.numbers.length > 0 && (
                    <p>Numbers: {response.numbers.join(', ')}</p>
                )}
                {(showAll || selectedOptions.includes('alphabets')) && response.alphabets.length > 0 && (
                    <p>Alphabets: {response.alphabets.join(', ')}</p>
                )}
                {(showAll || selectedOptions.includes('highest')) && response.highest_lowercase_alphabet.length > 0 && (
                    <p>Highest Lowercase Alphabet: {response.highest_lowercase_alphabet.join(', ')}</p>
                )}
            </div>
        );
    };

    return (
        <div className="container">
            <h1>{response ? response.roll_number : 'Enter Data'}</h1>
            <textarea
                value={jsonInput}
                onChange={handleJsonChange}
                placeholder="Enter JSON here..."
            ></textarea>
            {inputError && <p style={{ color: 'red' }}>{inputError}</p>}
            <button onClick={handleSubmit} disabled={loading || inputError}>
                {loading ? "Loading..." : "Submit"}
            </button>

            {/* Replace the dropdown with checkboxes for easy multiple selection */}
            <div className="checkboxes">
                <label>
                    <input
                        type="checkbox"
                        value="numbers"
                        onChange={() => handleCheckboxChange('numbers')}
                    />
                    Numbers
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="alphabets"
                        onChange={() => handleCheckboxChange('alphabets')}
                    />
                    Alphabets
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="highest"
                        onChange={() => handleCheckboxChange('highest')}
                    />
                    Highest Lowercase Alphabet
                </label>
            </div>

            {/* Render the filtered response or all data if no filter is selected */}
            {renderResponse()}
        </div>
    );
};

export default App;
