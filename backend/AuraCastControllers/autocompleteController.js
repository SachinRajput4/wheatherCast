// backend/controllers/autocompleteController.js
import autocompleteService from "../services/autocompleteService.js";

const getLocationSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json([]);
    }

    console.log('🎯 Autocomplete request:', query);
    
    let suggestions = await autocompleteService.getLocationSuggestions(query);
    
    // If no results from API, use fallback
    if (suggestions.length === 0) {
      suggestions = autocompleteService.getFallbackSuggestions(query);
    }

    res.json(suggestions);
    
  } catch (error) {
    console.error('💥 Autocomplete controller error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch location suggestions',
      suggestions: []
    });
  }
};

export { getLocationSuggestions };