import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { IoSparkles } from 'react-icons/io5'; 

const AISearchBar = ({ onSearchResults }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            // Updated directly to point to your live Render environment link
            const backendUrl = 'https://nesanora-backend.onrender.com';
            const response = await axios.post(`${backendUrl}/api/ai-search`, { query });
            onSearchResults(response.data.results);
        } catch (error) {
            console.error("AI Search Error:", error);
            alert("Something went wrong with the AI search connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '0 20px' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="✨ Ask Gemini AI... (e.g., 'vintage clothes or open cafes')"
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            paddingLeft: '45px',
                            borderRadius: '30px',
                            border: '1px solid #ccc',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                    <IoSparkles style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#1A73E8' }} />
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '12px 25px',
                        borderRadius: '30px',
                        backgroundColor: '#1A73E8',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Analyzing...' : 'AI Search'}
                </motion.button>
            </form>
        </div>
    );
};

export default AISearchBar;