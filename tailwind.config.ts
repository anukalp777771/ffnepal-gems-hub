import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					glow: 'hsl(var(--secondary-glow))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-gaming': 'var(--gradient-gaming)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-cyber': 'var(--gradient-cyber)',
				'gradient-neon': 'var(--gradient-neon)',
				'gradient-hologram': 'var(--gradient-hologram)'
			},
			boxShadow: {
				'gaming': 'var(--shadow-gaming)',
				'secondary': 'var(--shadow-secondary)',
				'neon': 'var(--shadow-neon)',
				'cyber': 'var(--shadow-cyber)',
				'holographic': 'var(--shadow-holographic)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'glow-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(var(--primary) / 0.5)'
					},
					'50%': {
						boxShadow: '0 0 30px hsl(var(--primary) / 0.8)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'cyber-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(var(--primary) / 0.6), 0 0 40px hsl(var(--accent) / 0.4)'
					},
					'50%': {
						boxShadow: '0 0 30px hsl(var(--primary) / 0.8), 0 0 60px hsl(var(--accent) / 0.6)'
					}
				},
				'hologram': {
					'0%': {
						background: 'linear-gradient(45deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--secondary)) 100%)'
					},
					'33%': {
						background: 'linear-gradient(45deg, hsl(var(--accent)) 0%, hsl(var(--secondary)) 50%, hsl(var(--primary)) 100%)'
					},
					'66%': {
						background: 'linear-gradient(45deg, hsl(var(--secondary)) 0%, hsl(var(--primary)) 50%, hsl(var(--accent)) 100%)'
					},
					'100%': {
						background: 'linear-gradient(45deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--secondary)) 100%)'
					}
				},
				'data-flow': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(100%)'
					}
				},
				'scan-line': {
					'0%': {
						transform: 'translateY(-100%)'
					},
					'100%': {
						transform: 'translateY(100vh)'
					}
				},
				'matrix-rain': {
					'0%': {
						transform: 'translateY(-100%)',
						opacity: '0'
					},
					'10%': {
						opacity: '1'
					},
					'100%': {
						transform: 'translateY(100vh)',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'cyber-glow': 'cyber-glow 3s ease-in-out infinite',
				'hologram': 'hologram 4s ease-in-out infinite',
				'data-flow': 'data-flow 2s linear infinite',
				'scan-line': 'scan-line 3s linear infinite',
				'matrix-rain': 'matrix-rain 4s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
