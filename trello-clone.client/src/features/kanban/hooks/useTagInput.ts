import { useState } from 'react';
import { Tag } from '../types';

/**
 * Helper for duplicate tag name detection (case-insensitive, ignores empty)
 */
export const hasDuplicateTagNames = (tags: { name: string }[]): boolean => {
    const seen = new Set<string>();
    for (const t of tags) {
        if (!t.name.trim()) continue;
        const lower = t.name.trim().toLowerCase();
        if (seen.has(lower)) return true;
        seen.add(lower);
    }
    return false;
};

/**
 * Custom hook for managing tag input state in forms
 */
export const useTagInput = (initialTags: Tag[] = []) => {
    const [tags, setTags] = useState<Tag[]>(initialTags);

    const addTag = (name: string, color: string) => {
        const trimmedName = name.trim();
        if (!trimmedName || trimmedName.length > 12) return;
        setTags(prev => [...prev, { name: trimmedName, color }]);
    };

    const updateTag = (index: number, updates: Partial<Tag>) => {
        setTags(prev => prev.map((tag, i) => 
            i === index ? { ...tag, ...updates } : tag
        ));
    };

    const removeTag = (index: number) => {
        setTags(prev => prev.filter((_, i) => i !== index));
    };

    const clearTags = () => {
        setTags([]);
    };

    const setTagsDirectly = (newTags: Tag[]) => {
        setTags(newTags);
    };

    const isValid = !hasDuplicateTagNames(tags) && !tags.some(t => !t.name.trim() || t.name.length > 12);

    return {
        tags,
        addTag,
        updateTag,
        removeTag,
        clearTags,
        setTags: setTagsDirectly,
        isValid,
        hasDuplicates: hasDuplicateTagNames(tags),
    };
};
