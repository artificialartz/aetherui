import React, { useState, useEffect, useCallback, useMemo, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glass } from './Glass';
import type { HTMLMotionProps } from 'framer-motion';

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  keywords?: string[];
  action: () => void | Promise<void>;
  shortcut?: string;
  disabled?: boolean;
}

export interface CommandGroup {
  id: string;
  label?: string;
  commands: Command[];
}

export interface CommandPaletteProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /**
   * Commands to display in the palette
   */
  commands: Command[] | CommandGroup[];
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
  /**
   * Whether the palette is open
   */
  isOpen?: boolean;
  /**
   * Callback when the palette closes
   */
  onClose?: () => void;
  /**
   * Hotkey to toggle the palette
   */
  hotkey?: string;
  /**
   * Whether to show the keyboard shortcut hint
   */
  showShortcutHint?: boolean;
  /**
   * Optional custom trigger element
   */
  trigger?: React.ReactNode;
  /**
   * Maximum number of results to show
   */
  maxResults?: number;
  /**
   * Custom empty state message
   */
  emptyMessage?: string;
  /**
   * Custom filter function
   */
  filterFn?: (command: Command, query: string) => boolean;
  /**
   * Whether to close after selection
   */
  closeOnSelect?: boolean;
}

/**
 * CommandPalette - An animated command palette for quick actions
 * Features keyboard navigation, fuzzy search, and smooth animations
 */
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      commands = [],
      placeholder = 'Type a command or search...',
      isOpen: controlledIsOpen,
      onClose,
      hotkey = 'cmd+k',
      showShortcutHint = true,
      trigger,
      maxResults = 8,
      emptyMessage = 'No commands found',
      filterFn,
      closeOnSelect = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Determine if we're in controlled or uncontrolled mode
    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

    const handleOpen = useCallback(() => {
      if (isControlled) {
        // In controlled mode, parent manages state
      } else {
        setInternalIsOpen(true);
      }
      // Focus input after a small delay to ensure animation has started
      setTimeout(() => inputRef.current?.focus(), 50);
    }, [isControlled]);

    const handleClose = useCallback(() => {
      if (isControlled) {
        onClose?.();
      } else {
        setInternalIsOpen(false);
      }
      setQuery('');
      setSelectedIndex(0);
      onClose?.();
    }, [isControlled, onClose]);

    // Flatten commands into groups for easier processing
    const commandGroups = useMemo(() => {
      const groups: CommandGroup[] = [];
      const firstItem = commands[0];

      if (firstItem && 'commands' in firstItem) {
        groups.push(...(commands as CommandGroup[]));
      } else {
        groups.push({
          id: 'default',
          commands: commands as Command[],
        });
      }

      return groups;
    }, [commands]);

    // Filter commands based on query
    const filteredGroups = useMemo(() => {
      if (!query.trim()) return commandGroups;

      const lowerQuery = query.toLowerCase();
      const defaultFilter = (command: Command, q: string): boolean => {
        const searchTerms = [
          command.label,
          command.description,
          ...(command.keywords || []),
        ]
          .filter(Boolean)
          .map((term) => (term ?? '').toLowerCase());

        return searchTerms.some((term) => term.includes(q));
      };

      const filter = filterFn || defaultFilter;

      return commandGroups
        .map((group) => ({
          ...group,
          commands: group.commands.filter((cmd) => !cmd.disabled && filter(cmd, lowerQuery)),
        }))
        .filter((group) => group.commands.length > 0);
    }, [commandGroups, query, filterFn]);

    // Flatten filtered commands for navigation
    const filteredCommands = useMemo(
      () => filteredGroups.flatMap((group) => group.commands),
      [filteredGroups]
    );

    // Limit results
    const limitedGroups = useMemo(() => {
      const result: CommandGroup[] = [];
      let count = 0;

      for (const group of filteredGroups) {
        const remaining = maxResults - count;
        if (remaining <= 0) break;

        result.push({
          ...group,
          commands: group.commands.slice(0, remaining),
        });
        count += group.commands.length;
      }

      return result;
    }, [filteredGroups, maxResults]);

    // Reset selected index when filtered results change
    useEffect(() => {
      setSelectedIndex(0);
    }, [query]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            break;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            break;
          case 'Enter':
            e.preventDefault();
            const selectedCommand = filteredCommands[selectedIndex];
            if (selectedCommand && !selectedCommand.disabled) {
              selectedCommand.action();
              if (closeOnSelect) handleClose();
            }
            break;
          case 'Escape':
            e.preventDefault();
            handleClose();
            break;
        }
      },
      [filteredCommands, selectedIndex, handleClose, closeOnSelect]
    );

    // Handle hotkey press
    useEffect(() => {
      if (!hotkey) return;

      const handleKeyPress = (e: KeyboardEvent) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modKey = isMac ? e.metaKey : e.ctrlKey;
        const key = hotkey.toLowerCase().split('+')[1];

        if (modKey && e.key.toLowerCase() === key) {
          e.preventDefault();
          if (isOpen) {
            handleClose();
          } else {
            handleOpen();
          }
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [hotkey, isOpen, handleOpen, handleClose]);

    // Handle command selection
    const handleSelectCommand = useCallback(
      async (command: Command) => {
        if (command.disabled) return;
        await command.action();
        if (closeOnSelect) handleClose();
      },
      [closeOnSelect, handleClose]
    );

    // Format hotkey for display
    const formatHotkey = (hotkey: string) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const [, key] = hotkey.toLowerCase().split('+');
      return isMac ? `⌘${key.toUpperCase()}` : `Ctrl+${key.toUpperCase()}`;
    };

    return (
      <>
        {/* Trigger Button */}
        {trigger && (
          <div onClick={handleOpen} className="cursor-pointer">
            {trigger}
          </div>
        )}

        {/* Shortcut Hint */}
        {showShortcutHint && (
          <motion.div
            className="hidden md:flex items-center gap-2 text-white/40 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleOpen}
            style={{ cursor: 'pointer' }}
          >
            <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">
              {formatHotkey(hotkey)}
            </kbd>
            <span>to open</span>
          </motion.div>
        )}

        {/* Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleClose}
              />

              {/* Palette */}
              <motion.div
                ref={ref}
                className={[
                  'fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl z-50',
                  className,
                ]
                  .filter(Boolean)
                  .join(' ')}
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                {...props}
              >
                <Glass
                  rounded="2xl"
                  shadow={true}
                  className="overflow-hidden"
                  variant="frosted"
                >
                  {/* Search Input */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                    <svg
                      className="w-5 h-5 text-white/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={placeholder}
                      className="flex-1 bg-transparent outline-none text-white/90 placeholder:text-white/30"
                    />
                    {query && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => setQuery('')}
                        className="text-white/40 hover:text-white/70 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    )}
                    <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs text-white/40">
                      ESC
                    </kbd>
                  </div>

                  {/* Commands List */}
                  <div className="max-h-80 overflow-y-auto py-2 custom-scrollbar">
                    {limitedGroups.length === 0 ? (
                      <motion.div
                        className="px-4 py-8 text-center text-white/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {emptyMessage}
                      </motion.div>
                    ) : (
                      limitedGroups.map((group, groupIndex) => (
                        <div key={group.id}>
                          {group.label && (
                            <div className="px-4 py-1.5 text-xs font-medium text-white/40 uppercase tracking-wider">
                              {group.label}
                            </div>
                          )}
                          {group.commands.map((command, cmdIndex) => {
                            const globalIndex = filteredCommands.indexOf(command);
                            const isSelected = globalIndex === selectedIndex;

                            return (
                              <motion.button
                                key={command.id}
                                className={[
                                  'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all',
                                  'hover:bg-white/5',
                                  isSelected ? 'bg-white/10' : '',
                                  command.disabled ? 'opacity-50 cursor-not-allowed' : '',
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                                onClick={() => handleSelectCommand(command)}
                                disabled={command.disabled}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (groupIndex * 0.05) + (cmdIndex * 0.02) }}
                              >
                                {command.icon && (
                                  <span className="flex-shrink-0 text-white/60">
                                    {command.icon}
                                  </span>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-white/90 truncate">
                                    {command.label}
                                  </div>
                                  {command.description && (
                                    <div className="text-xs text-white/50 truncate">
                                      {command.description}
                                    </div>
                                  )}
                                </div>
                                {command.shortcut && (
                                  <kbd className="flex-shrink-0 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-xs text-white/40">
                                    {command.shortcut}
                                  </kbd>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-xs text-white/30">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <kbd>↑</kbd> <kbd>↓</kbd> navigate
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd>↵</kbd> select
                      </span>
                    </div>
                    <span>{filteredCommands.length} results</span>
                  </div>
                </Glass>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }
);

CommandPalette.displayName = 'CommandPalette';
