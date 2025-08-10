import { Box, Divider, useTheme } from "@mui/material";
import { useStatBlock } from "../context/StatBlockContext";
import StatBlockViewActionSection from "./statBlockView/StatBlockViewActionSection";
import StatBlockViewLowerSection from "./statBlockView/StatBlockViewLowerSection";
import StatBlockViewSpellcastingSection from "./statBlockView/StatBlockViewSpellcastingSection";
import StatBlockViewStatSection from "./statBlockView/StatBlockViewStatSection";
import StatBlockViewTraitSection from "./statBlockView/StatBlockViewTraitSection";
import StatBlockViewUpperSection from "./statBlockView/StatBlockViewUpperSection";

function StatBlockView() {
    const { statBlock } = useStatBlock();

    const theme = useTheme();

	return (
		<Box
			sx={{
				flex: 1,
                backgroundColor: theme.palette.background.default,
                backgroundImage: `
                    url(
						"data:image/svg+xml,%3Csvg
						width='200'
						height='200'
						xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter
						id='paper-texture'%3E%3CfeTurbulence
						type='fractalNoise'
						baseFrequency='0.02'
						numOctaves='3'
						seed='1'
						stitchTiles='stitch'/%3E%3CfeColorMatrix
						values='0 0 0 0 0.2 0 0 0 0 0.18 0 0 0 0 0.12 0 0 0 0.06 0'/%3E%3C/filter%3E%3C/defs%3E%3Crect
						width='100%25'
						height='100%25'
						filter='url(%23paper-texture)'/%3E%3C/svg%3E"
					),
                    linear-gradient(135deg, 
                        rgba(70, 62, 45, 0.3) 0%,
                        rgba(58, 53, 40, 0) 25%,
                        rgba(48, 43, 32, 0.2) 50%,
                        rgba(58, 53, 40, 0) 75%,
                        rgba(65, 58, 42, 0.15) 100%
                    ),
                    linear-gradient(45deg, 
                        rgba(45, 40, 30, 0.4) 0%,
                        transparent 50%,
                        rgba(40, 35, 26, 0.2) 100%
                    )
                `,
                backgroundSize: '150px 150px, 100% 100%, 100% 100%',
                boxShadow: `
                    inset 0 0 25px rgba(70, 62, 45, 0.4),
                    inset 0 0 50px rgba(45, 40, 30, 0.2),
                    0 4px 12px rgba(0, 0, 0, 0.6),
                    0 0 0 1px rgba(80, 70, 50, 0.3)
                `,
                border: '1px solid ' + theme.palette.secondary.main,
                padding: 3,
				mb: '1rem',
                borderRadius: 1,
                color: theme.palette.primary.main,
                position: 'relative',
                
                // Subtle edge highlighting for contrast against dark background
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        linear-gradient(to right, rgba(80, 70, 50, 0.15) 0%, transparent 8%, transparent 92%, rgba(80, 70, 50, 0.15) 100%),
                        linear-gradient(to bottom, rgba(80, 70, 50, 0.15) 0%, transparent 8%, transparent 92%, rgba(80, 70, 50, 0.15) 100%)
                    `,
                    pointerEvents: 'none',
                    borderRadius: 'inherit',
                },
                
                // Center highlight to simulate aged parchment
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '15%',
                    left: '15%',
                    right: '15%',
                    bottom: '15%',
                    background: 'radial-gradient(ellipse at center, rgba(70, 62, 45, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    borderRadius: 'inherit',
                }
			}}
		>
			<StatBlockViewUpperSection />
			<Divider sx={{ borderBottomWidth: 4 }} />
			<StatBlockViewStatSection />
			<Divider sx={{ borderBottomWidth: 4 }} />
            <StatBlockViewLowerSection />
            <StatBlockViewTraitSection />
            <StatBlockViewActionSection label="Actions" actions={statBlock.actions}>
                {statBlock.spells && <StatBlockViewSpellcastingSection />}
            </StatBlockViewActionSection>
            {statBlock.bonus_actions.length !== 0 && <StatBlockViewActionSection label="Bonus Actions" actions={statBlock.bonus_actions} />}
            {statBlock.reactions.length !== 0 && <StatBlockViewActionSection label="Reactions" actions={statBlock.reactions} />}
            {statBlock.legendary_actions.length !== 0 && <StatBlockViewActionSection label="Legendary Actions" actions={statBlock.legendary_actions} />}
		</Box>
	)
}

export default StatBlockView;