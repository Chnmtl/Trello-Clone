import { Tag } from '../types';

// Predefined color palette for tags
export const TAG_COLORS = [
    '#1976d2', // blue
    '#388e3c', // green
    '#d32f2f', // red
    '#fbc02d', // yellow
    '#7b1fa2', // purple
    '#f57c00', // orange
    '#455a64', // gray
    '#c2185b', // pink
    '#0097a7', // teal
    '#5d4037', // brown
] as const;

export type TagColor = typeof TAG_COLORS[number];

/**
 * Get a random color from the predefined palette
 */
export const getRandomTagColor = (): TagColor => {
    return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
};

/**
 * Get color by name or fallback to a default
 */
export const getTagColorByName = (colorName: string): TagColor => {
    const color = TAG_COLORS.find(c => c === colorName);
    return color || TAG_COLORS[0];
};

/**
 * Validate if a color is in our predefined palette
 */
export const isValidTagColor = (color: string): color is TagColor => {
    return TAG_COLORS.includes(color as TagColor);
};

/**
 * Get all unique tags from a collection of items
 */
export const extractUniqueTags = (items: { tags?: Tag[] }[]): Tag[] => {
    const tagMap = new Map<string, Tag>();
    
    items.forEach(item => {
        item.tags?.forEach(tag => {
            const key = `${tag.name}|${tag.color}`;
            if (!tagMap.has(key)) {
                tagMap.set(key, tag);
            }
        });
    });
    
    return Array.from(tagMap.values());
};
