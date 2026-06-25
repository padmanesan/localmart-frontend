import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { IoSparkles } from 'react-icons/io5'; 

const AISearchBar = ({ onSearchResults }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState(''); // Stores rate limit/error alerts

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setFeedbackMessage(''); // Clear any previous warning messages
        
        try {
            const backendUrl = 'https://nesanora-backend.onrender.com';
            const response = await axios.post(`${backendUrl}/api/ai-search`, { query });
            
            // 1. Check if backend intercepted a Gemini rate limit object
            if (response.data && response.data.isRateLimited) {
                setFeedbackMessage(response.data.message);
                onSearchResults([]); // Clear grid if rate limited
            } 
            // 2. Process the straight shop list array directly from your updated controller
            else if (response.data) {
                const dataList = Array.isArray(response.data) ? response.data : response.data.results || [];
                onSearchResults(dataList);
                
                if (dataList.length === 0) {
                    setFeedbackMessage("No shops match that description. Try searching something else!");
                }
            }
        } catch (error) {
            console.error("AI Search Error:", error);
            setFeedbackMessage("Something went wrong with the AI search connection.");
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
                        placeholder="✨ Search with AI... (e.g., 'places that sell hot biriyani')"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            paddingLeft: '45px',
                            borderRadius: '30px',
                            border: '2px solid #1E3A8A', 
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            backgroundColor: loading ? '#f3f4f6' : '#fff'
                        }}
                    />
                    <IoSparkles style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#1A73E8' }} />
                </div>
                <motion.button
                    whileHover={!loading ? { scale: 1.05 } : {}}
                    whileTap={!loading ? { scale: 0.95 } : {}}
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '12px 25px',
                        borderRadius: '30px',
                        backgroundColor: loading ? '#6B7280' : '#1E3A8A',
                        color: '#fff',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    {loading ? 'Analyzing...' : 'AI Search'}
                </motion.button>
            </form>

            {/* SMOOTH ANIMATED LOADING SPINNER */}
            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        style={{
                            width: '30px',
                            height: '30px',
                            border: '4px solid rgba(30, 58, 138, 0.1)',
                            borderTop: '4px solid #1E3A8A',
                            borderRadius: '50%'
                        }}
                    />
                    <p style={{ marginTop: '10px', color: '#1E3A8A', fontSize: '14px', fontWeight: '500' }}>
                        Searching matching catalog items...
                    </p>
                </div>
            )}

            {/* DISPLAY ERROR OR RATE-LIMIT MESSAGES */}
            {feedbackMessage && !loading && (
                <div style={{ textAlign: 'center', marginTop: '15px', color: '#DC2626', fontSize: '14px', fontWeight: '500' }}>
                    {feedbackMessage}
                </div>
            )}
        </div>
    );
};

export default AISearchBar;