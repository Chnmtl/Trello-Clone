import { Tag } from '../types';

// Simple Material-UI compatible colors - 8 distinct options  
export const TAG_COLORS = [
    'primary',
    'secondary', 
    'success',
    'error',
    'warning',
    'info',
    'default',
    'action'
] as const;

export type TagColor = typeof TAG_COLORS[number];

/**
 * Get a random color from Material-UI palette
 */
export const getRandomTagColor = (): TagColor => {
    return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
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
