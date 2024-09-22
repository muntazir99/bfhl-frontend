import React, { useState, useEffect } from 'react';
import './styles.css';  

const App = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]); 
    const [inputError, setInputError] = useState('');
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        if (response && response.roll_number) {
            document.title = response.roll_number;  
        }
    }, [response]);

    const handleJsonChange = (e) => {
        const value = e.target.value;
        setJsonInput(value);

       
        try {
            JSON.parse(value);
            setInputError(''); 
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
            const parsedInput = JSON.parse(jsonInput);  
            const result = await fetch('https://bfhl-backend-gamma.vercel.app/bfhl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedInput),  
            });
            const data = await result.json();
            setResponse(data); 
        } catch (error) {
            alert('Invalid JSON');
        } finally {
            setLoading(false);
        }
    };

    
    const handleCheckboxChange = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

   
    const renderResponse = () => {
        if (!response) return null;

        const showAll = selectedOptions.length === 0;  

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

            
            {renderResponse()}
        </div>
    );
};

export default App;
