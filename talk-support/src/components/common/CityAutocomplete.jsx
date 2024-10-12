// CityAutocomplete.jsx
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { cities } from '../../constants/cities'; // Adjust the path as necessary

const CityAutocomplete = ({ value, onChange }) => {
  return (
    <Autocomplete
      id="city"
      options={cities}
      getOptionLabel={(option) => option}
      value={value}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      isOptionEqualToValue={(option, value) => option === value || value === null}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          fullWidth
          required
          placeholder="בחר עיר"
          sx={{
            '& .MuiInputBase-root': {
              width: '100%',
              borderRadius: '0.375rem',
              border: '0',
              py: '0.001rem',
              color: '#1f2937',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              backgroundColor: '#ffffff',
              '&:hover': {
                backgroundColor: '#ffffff',
              },
              '&.Mui-focused': {
                backgroundColor: '#ffffff',
                boxShadow: '0 0 0 2px rgba(67, 56, 202, 0.3)',
                outline: 'none',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: '1px',
              borderColor: '#d1d5db',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#d1d5db',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#d1d5db',
              borderWidth: '1px',
            },
            '& .MuiInputBase-input': {
              outline: 'none',
            },
            '.MuiInputBase-input::placeholder': {
              color: 'black', // Placeholder color
              opacity: 1, // Ensure the color is not transparent
              fontSize: '1rem', // Placeholder font size
              fontWeight: 400, // Placeholder font weight
            },
          }}
        />
      )}
    />
  );
};

export default CityAutocomplete;
