import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Floating animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`;

// Glow animation
const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(25, 118, 210, 0.3); }
  50% { box-shadow: 0 0 20px rgba(25, 118, 210, 0.6), 0 0 30px rgba(25, 118, 210, 0.4); }
  100% { box-shadow: 0 0 5px rgba(25, 118, 210, 0.3); }
`;

// Gradient shift animation
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const variantStyles = {
  primary: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    selectedColor: '#1976d2',
    panelBackground: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  secondary: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
    selectedColor: '#d32f2f',
    panelBackground: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
  },
  success: {
    background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
    selectedColor: '#2e7d32',
    panelBackground: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
  },
  dark: {
    background: 'linear-gradient(135deg, #2c3e50 0%, #4a5568 100%)',
    selectedColor: '#90caf9',
    panelBackground: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
  },
  medical: {
    background: 'linear-gradient(135deg, #4db6ac 0%, #26a69a 100%)',
    selectedColor: '#00695c',
    panelBackground: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
  },
};

const sizeStyles = {
  small: { minHeight: '40px', padding: '8px 16px', fontSize: '12px', iconSize: '16px' },
  medium: { minHeight: '56px', padding: '12px 24px', fontSize: '14px', iconSize: '20px' },
  large: { minHeight: '64px', padding: '16px 32px', fontSize: '16px', iconSize: '24px' },
};

const StyledTabs = styled(Tabs)(({ theme, variant = 'primary', fullWidth }) => ({
  background: variantStyles[variant].background,
  borderRadius: '16px',
  padding: '8px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  display: fullWidth ? 'flex' : 'inline-flex',
  width: fullWidth ? '100%' : 'auto',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
    backgroundSize: '200% 200%',
    animation: `${gradientShift} 3s ease infinite`,
    zIndex: 0,
  },

  '& .MuiTabs-flexContainer': {
    position: 'relative',
    zIndex: 1,
    ...(fullWidth && { justifyContent: 'space-between' }),
  },

  '& .MuiTabs-indicator': {
    height: '100%',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  '& .MuiTabs-scroller': {
    overflow: 'visible !important',
  },
}));

const StyledTab = styled(Tab)(({ theme, variant = 'primary', size = 'medium' }) => ({
  minHeight: sizeStyles[size].minHeight,
  padding: sizeStyles[size].padding,
  borderRadius: '12px',
  margin: '0 4px',
  fontWeight: 600,
  fontSize: sizeStyles[size].fontSize,
  textTransform: 'none',
  color: 'rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  zIndex: 2,
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: -1,
  },

  '&:hover': {
    color: 'white',
    transform: 'translateY(-2px)',
    animation: `${float} 2s ease-in-out infinite`,

    '&::before': {
      opacity: 1,
    },

    '& .MuiSvgIcon-root, & svg': {
      transform: 'scale(1.1) rotate(5deg)',
    },
  },

  '&.Mui-selected': {
    color: variantStyles[variant].selectedColor,
    fontWeight: 700,
    animation: `${glow} 2s ease-in-out infinite alternate`,

    '& .MuiSvgIcon-root, & svg': {
      color: variantStyles[variant].selectedColor,
      transform: 'scale(1.15)',
      filter: `drop-shadow(0 2px 4px ${variantStyles[variant].selectedColor}33)`,
    },
  },

  '& .MuiSvgIcon-root, & svg': {
    marginRight: '8px',
    fontSize: sizeStyles[size].iconSize,
    transition: 'all 0.3s cubic-bezier(0, 0, 0.2, 1)',
  },

  '& .MuiTab-iconWrapper': {
    marginBottom: '0px',
  },
}));

const AnimatedTabsContainer = styled(Box)({
  animation: `${float} 4s ease-in-out infinite`,
  transformOrigin: 'center',
  display: 'inline-block',
});

export default function EnhancedTabs({
  tabs,
  value,
  onChange,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
}) {
  return (
    <AnimatedTabsContainer>
      <StyledTabs
        value={value}
        onChange={onChange}
        scrollButtons="auto"
        allowScrollButtonsMobile
        variant={variant}
        size={size}
      >
        {tabs.map((tabmako, index) => (
          <StyledTab
            key={index}
            icon={tabmako.icon}
            label={tabmako.label}
            iconPosition="start"
            variant={variant}
            size={size}
          />
        ))}
      </StyledTabs>
    </AnimatedTabsContainer>
  );
}